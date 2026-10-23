"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { readAttribution } from "@/lib/attribution";
import { emailPattern } from "@/lib/contact-rules";
import { contactPageContent } from "@/content/contact-page";

// Fenêtre « Newsletter » de la Cellulift Academy (page Academy uniquement).
// S'ouvre une seule fois après un temps de lecture, jamais par-dessus le bandeau cookies,
// et ne revient pas avant 30 jours après fermeture (jamais après inscription).

const KEY = "cellulift-academy-newsletter"; // "inscrit" | date de fermeture (ms)
const DELAY_MS = 12000;
const SNOOZE_MS = 30 * 24 * 60 * 60 * 1000;

const t = {
  fr: {
    eyebrow: "Cellulift Academy",
    title: "Newsletter",
    text: "Prochaines masterclasses, nouveaux protocoles et dates de formation : recevez-les en avant-première.",
    firstName: "Prénom",
    lastName: "Nom",
    email: "Adresse e-mail",
    specialty: "Votre activité",
    submit: "S'inscrire",
    sending: "Inscription…",
    legal: "En vous inscrivant, vous acceptez de recevoir les informations de la Cellulift Academy. Désinscription possible à tout moment.",
    privacy: "Confidentialité",
    close: "Fermer",
    required: "Indiquez votre prénom, votre nom, une adresse e-mail valide et votre activité.",
    error: "L'inscription n'a pas pu aboutir. Réessayez dans un instant.",
    doneTitle: "Merci, vous êtes inscrit.",
    doneText: "Vous recevrez les prochaines dates de la Cellulift Academy par e-mail.",
    doneClose: "Continuer la visite",
  },
  en: {
    eyebrow: "Cellulift Academy",
    title: "Newsletter",
    text: "Upcoming masterclasses, new protocols and training dates: be the first to know.",
    firstName: "First name",
    lastName: "Last name",
    email: "Email address",
    specialty: "Your activity",
    submit: "Subscribe",
    sending: "Subscribing…",
    legal: "By subscribing, you agree to receive news from the Cellulift Academy. You can unsubscribe at any time.",
    privacy: "Privacy",
    close: "Close",
    required: "Enter your first name, last name, a valid email address and your activity.",
    error: "Subscription failed. Please try again in a moment.",
    doneTitle: "Thank you, you're subscribed.",
    doneText: "You'll receive the next Cellulift Academy dates by email.",
    doneClose: "Continue browsing",
  },
} as const;

// Activités du formulaire de contact. Le CRM reçoit toujours le libellé français,
// pour que la segmentation de la newsletter reste la même quelle que soit la langue.
const specialtiesFr = contactPageContent.fr.form.specialtyOptions;

function readState() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
function writeState(v: string) {
  try {
    localStorage.setItem(KEY, v);
  } catch {}
}

export function AcademyNewsletter({ locale }: { locale: Locale }) {
  const c = t[locale];
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({ firstName: "", lastName: "", email: "", specialty: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<Element | null>(null);
  const openedAt = useRef(0);

  // Ouverture différée : pas déjà inscrit, pas fermée récemment, bandeau cookies déjà réglé.
  useEffect(() => {
    const s = readState();
    if (s === "inscrit" || (s && Date.now() - Number(s) < SNOOZE_MS)) return;
    let timer = 0;
    const tryOpen = () => {
      // Le visiteur n'a pas encore répondu au bandeau cookies : on réessaie un peu plus tard.
      if (!document.documentElement.hasAttribute("data-consent") && document.querySelector(".cookie-banner")) {
        timer = window.setTimeout(tryOpen, 5000);
        return;
      }
      returnFocus.current = document.activeElement;
      openedAt.current = Date.now();
      setOpen(true);
      track("newsletter_academy_affichee");
    };
    timer = window.setTimeout(tryOpen, DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    if (status !== "done") writeState(String(Date.now()));
    (returnFocus.current as HTMLElement | null)?.focus?.();
  }, [status]);

  // Fenêtre modale : focus sur le premier champ, Échap pour fermer, Tab reste dans la fenêtre, page figée derrière.
  useEffect(() => {
    if (!open) return;
    firstFieldRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !dialogRef.current) return;
      const els = dialogRef.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),input:not([tabindex='-1'])");
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = `${values.firstName.trim()} ${values.lastName.trim()}`.trim();
    if (!values.firstName.trim() || !values.lastName.trim() || !emailPattern.test(values.email.trim()) || !values.specialty) {
      setError(c.required);
      return;
    }
    const honeypot = (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcours: "newsletter",
          name,
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          specialty: values.specialty,
          origin: window.location.pathname,
          lang: locale,
          attribution: readAttribution(),
          website: honeypot,
          elapsed: Date.now() - openedAt.current,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error("send_failed");
      writeState("inscrit");
      setStatus("done");
      track("newsletter_academy_inscription");
    } catch {
      setStatus("idle");
      setError(c.error);
    }
  };

  if (!open) return null;

  const field = (key: "firstName" | "lastName" | "email", label: string, props: React.InputHTMLAttributes<HTMLInputElement>, ref?: React.Ref<HTMLInputElement>) => (
    <div>
      <label htmlFor={`nl-${key}`} className="sr-only">
        {label}
      </label>
      <input
        ref={ref}
        id={`nl-${key}`}
        value={values[key]}
        onChange={(ev) => setValues((v) => ({ ...v, [key]: ev.target.value }))}
        placeholder={label}
        required
        className="min-h-[52px] w-full rounded-full border border-deep/10 bg-white/85 px-6 py-3 font-sans text-[0.95rem] text-deep placeholder:text-deep-soft/70 transition-colors focus:border-[var(--rainbow-2)]/40 focus:bg-white focus:outline-none"
        {...props}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6" role="presentation">
      {/* Voile : clic pour fermer */}
      <div className="absolute inset-0 bg-deep/35 backdrop-blur-[3px]" onClick={close} aria-hidden="true" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nl-title"
        className="relative grid max-h-[92svh] w-full max-w-4xl animate-fade-rise overflow-y-auto rounded-t-[2rem] bg-[#F7F8FB] opacity-0 shadow-[0_40px_120px_-40px_rgba(29,27,38,0.55)] [animation-duration:500ms] sm:rounded-[2rem] md:grid-cols-[1fr_1.05fr] md:overflow-hidden"
      >
        <button
          type="button"
          onClick={close}
          aria-label={c.close}
          className="glass-strong absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-deep transition-transform hover:rotate-90"
        >
          <X size={18} strokeWidth={1.75} />
        </button>

        {/* Visuel : grille en perspective nacrée, logo et signal ECG */}
        <div className="relative hidden min-h-[30rem] overflow-hidden bg-[#E9ECF3] md:block" aria-hidden="true">
          <div className="absolute inset-0 [perspective:700px]">
            <div
              className="absolute inset-x-[-40%] bottom-[-20%] top-[45%] origin-top [transform:rotateX(62deg)]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(123,97,255,0.32) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(0,188,212,0.32) 1.5px, transparent 1.5px)",
                backgroundSize: "56px 56px",
              }}
            />
            <div
              className="absolute inset-x-[-40%] bottom-[45%] top-[-20%] origin-bottom [transform:rotateX(-62deg)]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(233,30,140,0.22) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(123,97,255,0.26) 1.5px, transparent 1.5px)",
                backgroundSize: "56px 56px",
              }}
            />
          </div>
          {/* Halo nacré central qui adoucit la grille */}
          <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,#F7F8FB_0%,rgba(247,248,251,0.85)_28%,rgba(247,248,251,0)_62%)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="font-heading text-gradient-rainbow text-[2.1rem] font-light uppercase leading-none" style={{ letterSpacing: "0.22em" }}>
              Cellulift
            </span>
            <svg width="220" height="26" viewBox="0 0 160 20" fill="none" className="overflow-visible">
              <defs>
                <linearGradient id="nl-ecg" x1="0" y1="0" x2="160" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="var(--rainbow-1)" />
                  <stop offset="25%" stopColor="var(--rainbow-2)" />
                  <stop offset="50%" stopColor="var(--rainbow-3)" />
                  <stop offset="75%" stopColor="var(--rainbow-4)" />
                  <stop offset="100%" stopColor="var(--rainbow-5)" />
                </linearGradient>
              </defs>
              <path
                className="ecg-path"
                d="M0 10 H50 L58 10 L64 2 L72 18 L80 6 L86 10 H100 L106 10 L112 4 L118 16 L124 10 H160"
                stroke="url(#nl-ecg)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="data-label text-deep-soft" style={{ letterSpacing: "0.32em" }}>
              Academy
            </span>
          </div>
        </div>

        {/* Formulaire */}
        <div className="flex flex-col justify-center px-6 pb-8 pt-14 sm:px-10 md:px-12 md:py-14">
          {status === "done" ? (
            <div className="text-center" role="status">
              <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_18px_40px_-20px_rgba(29,27,38,0.45)]">
                <span aria-hidden="true" className="absolute inset-0 rounded-full opacity-80 [background:conic-gradient(from_200deg,#7fe3f0,#a797ff,#f29bd0,#ffc58f,#7fe3f0)] [mask:radial-gradient(circle,transparent_64%,black_66%)]" />
                <Check size={26} strokeWidth={2} className="relative text-deep" />
              </span>
              <h2 id="nl-title" className="display mt-6 text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.02] text-deep">
                {c.doneTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-xs font-sans text-sm text-deep-soft">{c.doneText}</p>
              <button type="button" onClick={close} className="glass-strong mt-8 inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 py-3 font-sans text-sm text-deep transition-colors hover:bg-white">
                {c.doneClose} <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <>
              <p className="data-label text-center text-deep-soft">{c.eyebrow}</p>
              <h2 id="nl-title" className="display mt-4 text-center text-[clamp(2.4rem,5vw,3.6rem)] leading-[0.92] text-deep">
                <span className="iridescent-text">{c.title}</span>
              </h2>
              <p className="mx-auto mt-5 max-w-sm text-center font-sans text-[0.95rem] leading-relaxed text-deep-soft">{c.text}</p>

              <form onSubmit={submit} noValidate className="mx-auto mt-8 grid w-full max-w-sm gap-3">
                {/* Champ piège pour les robots (invisible) */}
                <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />
                {field("firstName", c.firstName, { type: "text", autoComplete: "given-name" }, firstFieldRef)}
                {field("lastName", c.lastName, { type: "text", autoComplete: "family-name" })}
                {field("email", c.email, { type: "email", inputMode: "email", autoComplete: "email" })}
                <div className="relative">
                  <label htmlFor="nl-specialty" className="sr-only">
                    {c.specialty}
                  </label>
                  <select
                    id="nl-specialty"
                    value={values.specialty}
                    onChange={(ev) => setValues((v) => ({ ...v, specialty: ev.target.value }))}
                    required
                    className={cn(
                      "min-h-[52px] w-full appearance-none rounded-full border border-deep/10 bg-white/85 py-3 pl-6 pr-12 font-sans text-[0.95rem] transition-colors focus:border-[var(--rainbow-2)]/40 focus:bg-white focus:outline-none",
                      values.specialty ? "text-deep" : "text-deep-soft/70"
                    )}
                  >
                    <option value="" disabled>
                      {c.specialty}
                    </option>
                    {specialtiesFr.map((fr, i) => (
                      <option key={fr} value={fr} className="text-deep">
                        {contactPageContent[locale].form.specialtyOptions[i] ?? fr}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-deep-soft" />
                </div>
                {error && (
                  <p role="alert" className="px-2 font-sans text-xs text-[var(--rainbow-3)]">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className={cn(
                    "group mt-1 inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full bg-deep px-6 font-sans text-[0.95rem] text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
                  )}
                >
                  {status === "sending" ? c.sending : c.submit}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </button>
                <p className="mt-2 text-center font-sans text-[0.7rem] leading-relaxed text-deep-soft">
                  {c.legal}{" "}
                  <Link href={`/${locale}/privacy`} className="underline underline-offset-2">
                    {c.privacy}
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
