"use client";

import { readAttribution } from "@/lib/attribution";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Loader2, CheckCircle2, Download, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

interface GuideFormText {
  title: string;
  text: string;
  name: string;
  email: string;
  phone: string;
  phonePlaceholder: string;
  phoneError: string;
  consent: string;
  consentError: string;
  privacyLink: string;
  specialty: string;
  specialtyPlaceholder: string;
  submit: string;
  submitting: string;
  requiredError: string;
  emailError: string;
  successTitle: string;
  successText: string;
  download: string;
  talk: string;
  privacy: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneOk = (v: string) => /^[\d\s+().-]+$/.test(v) && v.replace(/\D/g, "").length >= 9 && v.replace(/\D/g, "").length <= 15;

/**
 * Formulaire du guide gratuit : la demande arrive chez Cellulift (même circuit que le contact),
 * puis le PDF est proposé au téléchargement. Si l'envoi échoue, le visiteur obtient quand même le guide.
 */
export function GuideForm({
  text,
  specialtyOptions,
  pdf,
  contactHref,
  privacyHref,
}: {
  text: GuideFormText;
  specialtyOptions: readonly string[];
  pdf: string;
  contactHref: string;
  privacyHref: string;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; consent?: string }>({});
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const consent = data.get("consent") === "on";
    const next: typeof errors = {};
    if (!name) next.name = text.requiredError;
    if (!email) next.email = text.requiredError;
    else if (!emailPattern.test(email)) next.email = text.emailError;
    if (!phone) next.phone = text.requiredError;
    else if (!phoneOk(phone)) next.phone = text.phoneError;
    if (!consent) next.consent = text.consentError;
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("submitting");
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          consent,
          consentText: text.consent,
          specialty: String(data.get("specialty") ?? ""),
          parcours: "guide",
          subject: "Guide gratuit téléchargé",
          attribution: readAttribution(),
          lang: document.documentElement.lang,
          message: "Téléchargement du guide « Choisir sa technologie médico-esthétique — 7 questions à se poser avant d'investir ».",
          website: String(data.get("website") ?? ""),
          elapsed: Date.now() - startedAt.current,
        }),
      });
    } catch {
      // Le guide reste accessible même si l'envoi échoue.
    }
    track("generate_lead", { source: "guide" });
    setStatus("done");
  }

  const inputClasses =
    "glass-soft mt-2 w-full rounded-2xl px-4 py-3 font-sans text-base text-deep placeholder:text-deep-soft/70 transition-colors focus:bg-white focus:outline-none sm:text-sm";

  if (status === "done") {
    return (
      <div className="flex flex-col items-start gap-4" role="status">
        <CheckCircle2 className="text-[var(--rainbow-2)]" size={28} />
        <p className="display text-2xl text-deep">{text.successTitle}</p>
        <p className="font-sans text-sm leading-relaxed text-deep-soft">{text.successText}</p>
        <a
          href={pdf}
          target="_blank"
          rel="noopener"
          download
          onClick={() => track("guide_download")}
          className="inline-flex items-center gap-2 rounded-full bg-deep px-6 py-3.5 font-sans text-sm text-white transition-opacity hover:opacity-90"
        >
          <Download size={16} /> {text.download}
        </a>
        <a href={contactHref} className="py-2 font-sans text-sm text-deep underline underline-offset-4 hover:text-deep-soft">
          {text.talk}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div>
        <p className="display text-2xl text-deep">{text.title}</p>
        <p className="mt-2 font-sans text-sm text-deep-soft">{text.text}</p>
      </div>
      {/* Champ piège anti-robots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <label htmlFor="guide-name" className="font-sans text-sm text-deep-soft">
          {text.name} <span className="text-rainbow-3">*</span>
        </label>
        <input id="guide-name" name="name" autoComplete="name" className={inputClasses} aria-invalid={!!errors.name} />
        {errors.name && <p role="alert" className="mt-1.5 font-sans text-xs text-rainbow-3">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="guide-email" className="font-sans text-sm text-deep-soft">
          {text.email} <span className="text-rainbow-3">*</span>
        </label>
        <input id="guide-email" name="email" type="email" autoComplete="email" inputMode="email" className={inputClasses} aria-invalid={!!errors.email} />
        {errors.email && <p role="alert" className="mt-1.5 font-sans text-xs text-rainbow-3">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="guide-phone" className="font-sans text-sm text-deep-soft">
          {text.phone} <span className="text-rainbow-3">*</span>
        </label>
        <input id="guide-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder={text.phonePlaceholder} className={inputClasses} aria-invalid={!!errors.phone} />
        {errors.phone && <p role="alert" className="mt-1.5 font-sans text-xs text-rainbow-3">{errors.phone}</p>}
      </div>
      <div>
        <label htmlFor="guide-specialty" className="font-sans text-sm text-deep-soft">{text.specialty}</label>
        <div className="relative">
          <select id="guide-specialty" name="specialty" defaultValue="" className={cn(inputClasses, "appearance-none pr-10")}>
            <option value="">{text.specialtyPlaceholder}</option>
            {specialtyOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-deep-soft" />
        </div>
      </div>
      <div>
        <label htmlFor="guide-consent" className="flex items-start gap-3 font-sans text-sm leading-relaxed text-deep-soft">
          <input id="guide-consent" name="consent" type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-[var(--deep,#1b1d22)]" aria-invalid={!!errors.consent} />
          <span>
            {text.consent} <span className="text-rainbow-3">*</span>
          </span>
        </label>
        {errors.consent && <p role="alert" className="mt-1.5 font-sans text-xs text-rainbow-3">{errors.consent}</p>}
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-deep px-6 py-3.5 font-sans text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "submitting" ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        {status === "submitting" ? text.submitting : text.submit}
      </button>
      <p className="font-sans text-xs leading-relaxed text-deep-soft">
        {text.privacy}{" "}
        <a href={privacyHref} className="underline underline-offset-2 hover:text-deep">
          {text.privacyLink}
        </a>
      </p>
    </form>
  );
}
