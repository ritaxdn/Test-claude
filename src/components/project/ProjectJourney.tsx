"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity, ArrowLeft, ArrowRight, Building2, Check, Droplets, Ellipsis, GraduationCap, Handshake, Hourglass,
  MessageCircle, PackagePlus, Presentation, ScanFace, ShieldCheck, Sparkles, Stethoscope, TrendingUp, Waves, Zap,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { readAttribution } from "@/lib/attribution";
import { citySuggestions, emailPattern, isValidPhone, normalizeCity } from "@/lib/contact-rules";
import {
  isJourneyChoice, journeyChoices, journeyLabel, journeyMode, journeyResponseDelay, type JourneyStepKey,
} from "@/lib/project-journey";

const icons: Record<string, LucideIcon> = {
  Stethoscope, ScanFace, Activity, Sparkles, Building2, Ellipsis, PackagePlus, TrendingUp, Handshake, Presentation,
  GraduationCap, MessageCircle, Zap, Droplets, Waves, Hourglass,
};

const t = {
  fr: {
    kicker: "Développons votre projet ensemble",
    stepOf: (i: number) => `Étape ${i} sur 4`,
    steps: {
      profil: { title: "Vous êtes…", text: "Votre activité nous aide à préparer le bon interlocuteur." },
      besoin: { title: "Votre besoin", text: "Ce que vous souhaitez construire avec CELLULIFT." },
      domaine: { title: "Votre domaine d'intérêt", text: "Le type de soins que vous proposez ou souhaitez proposer." },
      contact: { title: "Vos coordonnées", text: "Un expert CELLULIFT prépare un échange adapté à votre projet." },
    },
    back: "Retour",
    next: "Continuer",
    edit: "Modifier",
    fields: {
      name: "Nom et prénom",
      phone: "Téléphone / WhatsApp",
      email: "E-mail",
      city: "Ville",
      organization: "Établissement",
      optional: "facultatif",
    },
    placeholders: { name: "Dr Amina Benali", phone: "06 12 34 56 78", email: "vous@cabinet.ma", city: "Casablanca", organization: "Cabinet, clinique ou centre" },
    errors: {
      name: "Indiquez votre nom.",
      phone: "Indiquez un numéro valide (ex. 06 12 34 56 78).",
      email: "Indiquez une adresse e-mail valide.",
      city: "Indiquez votre ville.",
      consent: "Votre accord est nécessaire pour être recontacté.",
      send: "La demande n'a pas pu être envoyée. Réessayez ou écrivez-nous sur WhatsApp.",
    },
    consent: "J'accepte que CELLULIFT utilise ces informations pour me recontacter au sujet de mon projet.",
    privacy: "Confidentialité",
    submit: "Envoyer ma demande",
    sending: "Envoi…",
    reassurance: "Vos informations restent confidentielles et ne sont jamais revendues.",
    doneTitle: "Votre demande a bien été envoyée.",
    doneText: (delay: string | null) =>
      delay ? `Notre équipe CELLULIFT vous contactera sous ${delay}.` : "Notre équipe CELLULIFT vous contactera prochainement.",
    doneRecap: "Votre projet",
    doneHome: "Retour à l'accueil",
    doneTech: "Découvrir nos technologies",
    prototype: "Prototype : aucune demande n'a été envoyée.",
    preview: "Aperçu de la notification préparée pour CELLULIFT",
  },
  en: {
    kicker: "Let's build your project together",
    stepOf: (i: number) => `Step ${i} of 4`,
    steps: {
      profil: { title: "You are…", text: "Your practice helps us prepare the right contact." },
      besoin: { title: "Your need", text: "What you want to build with CELLULIFT." },
      domaine: { title: "Your area of interest", text: "The treatments you offer or plan to offer." },
      contact: { title: "Your details", text: "A CELLULIFT expert prepares a conversation suited to your project." },
    },
    back: "Back",
    next: "Continue",
    edit: "Edit",
    fields: {
      name: "Full name",
      phone: "Phone / WhatsApp",
      email: "Email",
      city: "City",
      organization: "Practice",
      optional: "optional",
    },
    placeholders: { name: "Dr Amina Benali", phone: "+212 6 12 34 56 78", email: "you@practice.com", city: "Casablanca", organization: "Practice, clinic or centre" },
    errors: {
      name: "Enter your name.",
      phone: "Enter a valid number (e.g. +212 6 12 34 56 78).",
      email: "Enter a valid email address.",
      city: "Enter your city.",
      consent: "Your consent is needed for us to contact you.",
      send: "Your request could not be sent. Please try again or message us on WhatsApp.",
    },
    consent: "I agree that CELLULIFT may use this information to contact me about my project.",
    privacy: "Privacy",
    submit: "Send my request",
    sending: "Sending…",
    reassurance: "Your information stays confidential and is never sold.",
    doneTitle: "Your request has been sent.",
    doneText: (delay: string | null) =>
      delay ? `The CELLULIFT team will contact you within ${delay}.` : "The CELLULIFT team will contact you shortly.",
    doneRecap: "Your project",
    doneHome: "Back to home",
    doneTech: "Explore our technology",
    prototype: "Prototype: no request has been sent.",
    preview: "Preview of the notification prepared for CELLULIFT",
  },
} as const;

const choiceSteps: JourneyStepKey[] = ["profil", "besoin", "domaine"];
type Field = "name" | "phone" | "email" | "city" | "organization";
type Preview = { subject: string; fields: [string, string][] };

/** Suivi Analytics : seulement en mode « live » (le prototype ne pollue pas les statistiques). */
function journeyTrack(name: string, params?: Record<string, string | number>) {
  if (journeyMode === "live") track(name, params);
}

/**
 * Parcours de qualification « Développons votre projet ensemble » : profil → besoin → domaine → coordonnées.
 * Réutilisable sur toute page ; `defaultDomain` présélectionne le domaine (ex. depuis une fiche machine).
 */
export function ProjectJourney({ locale, defaultDomain, className }: { locale: Locale; defaultDomain?: string; className?: string }) {
  const c = t[locale];
  const [step, setStep] = useState(0); // 0-2 : choix, 3 : coordonnées, 4 : confirmation
  const [choices, setChoices] = useState<Record<JourneyStepKey, string | undefined>>({
    profil: undefined,
    besoin: undefined,
    domaine: isJourneyChoice("domaine", defaultDomain) ? defaultDomain : undefined,
  });
  const [values, setValues] = useState<Record<Field, string>>({ name: "", phone: "", email: "", city: "", organization: "" });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field | "consent" | "send", string>>>({});
  const [sending, setSending] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const startedAt = useRef<number>(0);
  const started = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const honeypot = useRef<HTMLInputElement>(null);

  // À chaque étape, le focus va au titre (lecteurs d'écran, clavier) — pas au premier affichage.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.closest("section")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [step]);

  const choose = (key: JourneyStepKey, id: string) => {
    if (!started.current) {
      started.current = true;
      startedAt.current = Date.now();
      journeyTrack("projet_debut");
    }
    setChoices((prev) => ({ ...prev, [key]: id }));
    journeyTrack("projet_etape", { etape: key, valeur: id });
    // Avance automatiquement : la sélection suffit, sans clic supplémentaire.
    window.setTimeout(() => setStep((s) => (choiceSteps[s] === key ? s + 1 : s)), 260);
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!values.name.trim()) e.name = c.errors.name;
    if (!isValidPhone(values.phone)) e.phone = c.errors.phone;
    if (!emailPattern.test(values.email.trim())) e.email = c.errors.email;
    if (!values.city.trim()) e.city = c.errors.city;
    if (!consent) e.consent = c.errors.consent;
    return e;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      const first = (["name", "phone", "email", "city"] as Field[]).find((f) => e[f]);
      document.getElementById(first ? `pj-${first}` : "pj-consent")?.focus();
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/projet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...choices,
          ...values,
          consent,
          origin: window.location.pathname,
          lang: locale,
          attribution: readAttribution(),
          website: honeypot.current?.value ?? "",
          elapsed: startedAt.current ? Date.now() - startedAt.current : 0,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "send_failed");
      if (data.preview) setPreview(data.preview);
      journeyTrack("generate_lead", {
        parcours: "projet",
        profil: choices.profil ?? "",
        besoin: choices.besoin ?? "",
        domaine: choices.domaine ?? "",
        ville: normalizeCity(values.city),
      });
      setStep(4);
    } catch {
      setErrors({ send: c.errors.send });
    } finally {
      setSending(false);
    }
  };

  const stepKey = step < 3 ? choiceSteps[step] : "contact";
  const progress = step >= 4 ? 4 : step + (step < 3 && choices[choiceSteps[step]] ? 0.5 : 0);

  const input = (f: Field, props: React.InputHTMLAttributes<HTMLInputElement>, optional = false) => (
    <div>
      <label htmlFor={`pj-${f}`} className="font-sans text-sm text-deep-soft">
        {c.fields[f]}
        {optional ? <span className="text-deep-soft/70"> ({c.fields.optional})</span> : <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={`pj-${f}`}
        value={values[f]}
        onChange={(e) => {
          setValues((v) => ({ ...v, [f]: e.target.value }));
          if (errors[f]) setErrors((x) => ({ ...x, [f]: undefined }));
        }}
        aria-invalid={!!errors[f]}
        aria-describedby={errors[f] ? `pj-${f}-err` : undefined}
        required={!optional}
        placeholder={c.placeholders[f]}
        className={cn(
          "glass-soft mt-2 min-h-[48px] w-full rounded-2xl px-4 py-3 font-sans text-sm text-deep placeholder:text-deep-soft/60 transition-colors focus:bg-white focus:outline-none",
          errors[f] && "ring-1 ring-[var(--rainbow-3)]/60"
        )}
        {...props}
      />
      {errors[f] && (
        <p id={`pj-${f}-err`} className="mt-1.5 font-sans text-xs text-[var(--rainbow-3)]">
          {errors[f]}
        </p>
      )}
    </div>
  );

  return (
    <section className={cn("glass relative overflow-hidden rounded-[2rem] p-5 sm:p-8 md:p-10", className)} aria-labelledby="pj-title">
      {/* En-tête : nom du parcours, étape, progression au dégradé signature */}
      <div className="flex items-center justify-between gap-4">
        <p className="data-label text-deep-soft">{c.kicker}</p>
        {step < 4 && <p className="data-label text-deep-soft">{c.stepOf(step + 1)}</p>}
      </div>
      <div className="mt-4 grid grid-cols-4 gap-1.5" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-[3px] overflow-hidden rounded-full bg-deep/10">
            <span
              className="block h-full rounded-full transition-[width] duration-500 ease-out [background:var(--gradient-rainbow)]"
              style={{ width: `${Math.max(0, Math.min(1, progress - i)) * 100}%` }}
            />
          </span>
        ))}
      </div>

      {/* Rappel des choix déjà faits (cliquables pour modifier) */}
      {step > 0 && step < 4 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {choiceSteps.slice(0, step).map((k, i) =>
            choices[k] ? (
              <li key={k}>
                <button
                  type="button"
                  onClick={() => setStep(i)}
                  className="glass-strong inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-sans text-xs text-deep transition-colors hover:bg-white"
                  aria-label={`${c.edit} : ${journeyLabel(k, choices[k]!, locale)}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[conic-gradient(#7fe3f0,#a797ff,#f29bd0,#ffc58f,#7fe3f0)]" />
                  {journeyLabel(k, choices[k]!, locale)}
                </button>
              </li>
            ) : null
          )}
        </ul>
      )}

      {step < 4 && (
        <div key={step} className="mt-6 animate-fade-rise opacity-0 [animation-duration:450ms]">
          <h2 id="pj-title" ref={headingRef} tabIndex={-1} className="display text-[clamp(1.5rem,2.6vw,2.2rem)] leading-[1.02] text-deep outline-none">
            {c.steps[stepKey].title}
          </h2>
          <p className="mt-2 font-sans text-sm text-deep-soft">{c.steps[stepKey].text}</p>

          {step < 3 ? (
            <>
              <div role="radiogroup" aria-labelledby="pj-title" className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3">
                {journeyChoices[choiceSteps[step]].map((o) => {
                  const Icon = icons[o.icon] ?? Ellipsis;
                  const selected = choices[choiceSteps[step]] === o.id;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => choose(choiceSteps[step], o.id)}
                      className={cn(
                        "group relative flex min-h-[7.5rem] flex-col items-start justify-between gap-3 rounded-[1.25rem] p-4 text-left transition-all duration-300 sm:p-5",
                        selected ? "glass-strong bg-white shadow-[0_18px_40px_-24px_rgba(29,27,38,0.45)]" : "glass-soft hover:-translate-y-0.5 hover:bg-white/70"
                      )}
                    >
                      {selected && <span aria-hidden="true" className="cta-ring rounded-[1.25rem]" />}
                      <span className="flex w-full items-start justify-between">
                        <span
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                            selected ? "bg-deep text-white" : "bg-white/80 text-deep shadow-[inset_0_0_0_1px_rgba(255,255,255,1)]"
                          )}
                        >
                          <Icon size={18} strokeWidth={1.6} />
                        </span>
                        <span
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-full border transition-all",
                            selected ? "border-transparent [background:var(--gradient-rainbow)] text-white" : "border-deep/20"
                          )}
                          aria-hidden="true"
                        >
                          {selected && <Check size={12} strokeWidth={2.5} />}
                        </span>
                      </span>
                      <span>
                        <span className="block font-sans text-sm font-medium text-deep sm:text-base">{o.label[locale]}</span>
                        {o.hint && <span className="mt-0.5 block font-sans text-xs text-deep-soft">{o.hint[locale]}</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex items-center justify-between gap-3">
                {step > 0 ? (
                  <button type="button" onClick={() => setStep(step - 1)} className="inline-flex items-center gap-2 rounded-full px-3 py-2 font-sans text-sm text-deep-soft transition-colors hover:text-deep">
                    <ArrowLeft size={15} /> {c.back}
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  disabled={!choices[choiceSteps[step]]}
                  onClick={() => setStep(step + 1)}
                  className="glass-strong inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 py-3 font-sans text-sm text-deep transition-all hover:bg-white disabled:opacity-40"
                >
                  {c.next} <ArrowRight size={15} />
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={submit} noValidate className="mt-6">
              {/* Champ piège pour les robots (invisible) */}
              <input ref={honeypot} name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />
              <div className="grid gap-4 sm:grid-cols-2">
                {input("name", { type: "text", autoComplete: "name" })}
                {input("phone", { type: "tel", inputMode: "tel", autoComplete: "tel" })}
                {input("email", { type: "email", inputMode: "email", autoComplete: "email" })}
                {input("city", { type: "text", list: "pj-cities", autoComplete: "address-level2" })}
                <datalist id="pj-cities">
                  {citySuggestions.map((v) => (
                    <option key={v} value={v} />
                  ))}
                </datalist>
                <div className="sm:col-span-2">{input("organization", { type: "text", autoComplete: "organization" }, true)}</div>
              </div>

              <label className="mt-5 flex cursor-pointer items-start gap-3 font-sans text-sm text-deep">
                <input
                  id="pj-consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    if (errors.consent) setErrors((x) => ({ ...x, consent: undefined }));
                  }}
                  aria-invalid={!!errors.consent}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--rainbow-2)]"
                />
                <span>
                  {c.consent}{" "}
                  <Link href={`/${locale}/privacy`} className="text-deep-soft underline underline-offset-2">
                    {c.privacy}
                  </Link>
                </span>
              </label>
              {errors.consent && <p className="mt-1.5 font-sans text-xs text-[var(--rainbow-3)]">{errors.consent}</p>}

              {errors.send && (
                <p role="alert" className="mt-4 rounded-2xl bg-white/70 px-4 py-3 font-sans text-sm text-deep">
                  {errors.send}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <button type="button" onClick={() => setStep(2)} className="inline-flex items-center gap-2 rounded-full px-3 py-2 font-sans text-sm text-deep-soft transition-colors hover:text-deep">
                  <ArrowLeft size={15} /> {c.back}
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="group relative inline-flex min-h-[48px] items-center gap-3 rounded-full bg-deep py-2 pl-6 pr-2 font-sans text-sm text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {sending ? c.sending : c.submit}
                  <span className="relative flex h-9 w-9 items-center justify-center rounded-full [background:var(--gradient-rainbow)]">
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              </div>
              <p className="mt-4 flex items-center gap-2 font-sans text-xs text-deep-soft">
                <ShieldCheck size={14} /> {c.reassurance}
              </p>
            </form>
          )}
        </div>
      )}

      {/* Confirmation immédiate */}
      {step === 4 && (
        <div className="mt-8 animate-fade-rise text-center opacity-0 [animation-duration:500ms]" role="status">
          <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_18px_40px_-20px_rgba(29,27,38,0.45)]">
            <span aria-hidden="true" className="absolute inset-0 rounded-full opacity-80 [background:conic-gradient(from_200deg,#7fe3f0,#a797ff,#f29bd0,#ffc58f,#7fe3f0)] [mask:radial-gradient(circle,transparent_64%,black_66%)]" />
            <Check size={26} strokeWidth={2} className="relative text-deep" />
          </span>
          <h2 ref={headingRef} tabIndex={-1} className="display mt-6 text-[clamp(1.5rem,2.6vw,2.2rem)] leading-[1.02] text-deep outline-none">
            {c.doneTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-md font-sans text-base text-deep-soft">{c.doneText(journeyResponseDelay ? journeyResponseDelay[locale] : null)}</p>

          <p className="data-label mt-8 text-deep-soft">{c.doneRecap}</p>
          <ul className="mt-3 flex flex-wrap justify-center gap-2">
            {choiceSteps.map((k) =>
              choices[k] ? (
                <li key={k} className="glass-strong rounded-full px-3 py-1.5 font-sans text-xs text-deep">
                  {journeyLabel(k, choices[k]!, locale)}
                </li>
              ) : null
            )}
          </ul>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={`/${locale}/technologies`} className="glass-strong inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 py-3 font-sans text-sm text-deep transition-colors hover:bg-white">
              {c.doneTech} <ArrowRight size={15} />
            </Link>
            <Link href={`/${locale}`} className="inline-flex min-h-[44px] items-center rounded-full px-5 py-3 font-sans text-sm text-deep-soft transition-colors hover:text-deep">
              {c.doneHome}
            </Link>
          </div>

          {journeyMode === "prototype" && (
            <div className="mx-auto mt-10 max-w-xl rounded-[1.25rem] border border-dashed border-deep/25 bg-white/50 p-5 text-left">
              <p className="data-label text-deep">{c.prototype}</p>
              {preview && (
                <>
                  <p className="mt-3 font-sans text-xs text-deep-soft">{c.preview}</p>
                  <p className="mt-2 font-sans text-sm font-medium text-deep">{preview.subject}</p>
                  <dl className="mt-3 grid grid-cols-[8.5rem_1fr] gap-x-3 gap-y-1 font-sans text-xs">
                    {preview.fields.map(([k, v]) => (
                      <div key={k} className="contents">
                        <dt className="text-deep-soft">{k}</dt>
                        <dd className="break-words text-deep">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
