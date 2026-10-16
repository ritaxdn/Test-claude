"use client";

import { readAttribution } from "@/lib/attribution";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Loader2, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { machineFromLocation } from "@/lib/machine";
import { company } from "@/content/company";
import {
  citySuggestions,
  contactRules,
  emailPattern,
  isParcours,
  isValidPhone,
  normalizeCity,
  type ContactField,
  type Parcours,
} from "@/lib/contact-rules";

type FieldErrors = Partial<Record<ContactField, string>>;
type Status = "idle" | "submitting" | "success" | "error";

interface ContactFormText {
  name: string;
  namePlaceholder: string;
  organization: string;
  organizationPlaceholder: string;
  email: string;
  emailPlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  city: string;
  cityPartner: string;
  cityPlaceholder: string;
  specialty: string;
  specialtyPlaceholder: string;
  specialtyOptions: readonly string[];
  subject: string;
  subjectOptions: readonly { key: string; label: string }[];
  machine: string;
  machinePlaceholder: string;
  machineSupport: string;
  serial: string;
  session: string;
  sessionNext: string;
  machineMessageDemo: string;
  machineMessageDevis: string;
  machineMessage: string;
  message: string;
  messagePlaceholder: string;
  messageCommercialPlaceholder: string;
  messageSupportPlaceholder: string;
  messagePartnerPlaceholder: string;
  supportNotice: string;
  optional: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
  requiredError: string;
  emailError: string;
  phoneError: string;
}

/**
 * Formulaire de contact V2 : les champs affichés et obligatoires dépendent de l'objet choisi
 * (règles partagées avec l'API dans lib/contact-rules). Objet présélectionné par ?sujet=…, machine par ?machine=….
 */
export function ContactForm({
  text,
  machines,
  sessions,
}: {
  text: ContactFormText;
  machines: Record<string, string>;
  sessions: { value: string; label: string }[];
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [parcours, setParcours] = useState<Parcours>("demo");
  // Machine d'origine (bouton d'une fiche : ?machine=frac-cov-4)
  const [machine, setMachine] = useState<{ slug: string; name: string } | null>(null);
  // Anti-spam : heure d'affichage du formulaire (un humain met plus de quelques secondes à le remplir).
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    const params = new URLSearchParams(window.location.search);
    const sujet = params.get("sujet") ?? "";
    if (isParcours(sujet)) setParcours(sujet); // eslint-disable-line react-hooks/set-state-in-effect -- paramètres d'adresse lus après le rendu serveur
    const m = machineFromLocation(window.location.pathname, window.location.search, machines);
    if (m) {
      setMachine(m);
      const template = sujet === "demo" ? text.machineMessageDemo : sujet === "devis" ? text.machineMessageDevis : text.machineMessage;
      if (messageRef.current && !messageRef.current.value) messageRef.current.value = template.replace("{machine}", m.name);
    }
  }, [text, machines]);

  const rule = contactRules[parcours];
  const shows = (f: ContactField) => rule.fields.includes(f);
  const isRequired = (f: ContactField) => rule.required.includes(f);

  function validate(formData: FormData): FieldErrors {
    const next: FieldErrors = {};
    for (const f of rule.fields) {
      const value = String(formData.get(f) ?? "").trim();
      if (!value) {
        if (isRequired(f)) next[f] = text.requiredError;
      } else if (f === "email" && !emailPattern.test(value)) next.email = text.emailError;
      else if (f === "phone" && !isValidPhone(value)) next.phone = text.phoneError;
    }
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const fieldErrors = validate(formData);
    setErrors(fieldErrors);
    const firstError = rule.fields.find((f) => fieldErrors[f]);
    if (firstError) {
      form.querySelector<HTMLElement>(`#cf-${firstError}`)?.focus();
      return;
    }

    // Machine : celle de la fiche d'origine, ou un nom du catalogue saisi / choisi dans les suggestions.
    const machineValue = String(formData.get("machine") ?? "").trim();
    const machineSlug = machineValue
      ? Object.entries(machines).find(([, n]) => n.toLowerCase() === machineValue.toLowerCase())?.[0] ?? ""
      : "";
    // Page d'où vient le visiteur (même site uniquement) : entrée précédente de l'historique
    // (navigation interne du site, Chrome/Edge), sinon le référent du navigateur.
    let origin = "";
    try {
      const nav = (window as unknown as { navigation?: { currentEntry?: { index: number }; entries?: () => { url: string | null }[] } }).navigation;
      const index = nav?.currentEntry?.index ?? -1;
      const previous = index > 0 ? nav?.entries?.()[index - 1]?.url : null;
      const ref = new URL(previous || document.referrer);
      if (ref.origin === window.location.origin) origin = ref.pathname + ref.search;
    } catch {}

    setStatus("submitting");

    try {
      const payload: Record<string, unknown> = {};
      for (const f of rule.fields) payload[f] = String(formData.get(f) ?? "").trim();
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          parcours,
          subject: text.subjectOptions.find((o) => o.key === parcours)?.label ?? "",
          machineSlug,
          origin,
          lang: document.documentElement.lang,
          attribution: readAttribution(),
          website: String(formData.get("website") ?? ""),
          elapsed: Date.now() - startedAt.current,
        }),
      });

      if (!res.ok) throw new Error("request_failed");

      setStatus("success");
      // Analytics : jamais de nom, téléphone ni e-mail. Ville normalisée (liste fermée, « Autre » sinon).
      if (rule.event) {
        const specialty = String(formData.get("specialty") ?? "");
        const city = normalizeCity(String(formData.get("city") ?? ""));
        // Session : sa date (AAAA-MM-JJ), pour une valeur courte et stable dans Analytics
        const session = sessions.find((x) => x.label === String(formData.get("session") ?? ""))?.value ?? "";
        track(rule.event.name, {
          ...(rule.event.parcours ? { parcours: rule.event.parcours } : {}),
          ...(machineSlug ? { machine: machineSlug } : {}),
          ...(specialty ? { specialite: specialty } : {}),
          ...(city ? { ville: city } : {}),
          ...(session ? { session } : {}),
        });
      }
      form.reset();
      setErrors({});
    } catch {
      setStatus("error");
    }
  }

  const inputClasses =
    "glass-soft min-h-[44px] w-full rounded-2xl px-4 py-3 font-sans text-sm text-deep placeholder:text-deep-soft/70 transition-colors focus:bg-white focus:outline-none";

  /** Libellé + message d'erreur d'un champ ; « * » si obligatoire, « (facultatif) » sinon. */
  const field = (f: ContactField, label: string, control: ReactNode, className?: string) => (
    <div className={className}>
      <label htmlFor={`cf-${f}`} className="font-sans text-sm text-deep-soft">
        {label}{" "}
        {isRequired(f) ? (
          <span aria-hidden="true" className="text-rainbow-3">*</span>
        ) : (
          <span className="text-deep-soft/70">({text.optional})</span>
        )}
      </label>
      {control}
      {errors[f] && (
        <p id={`cf-${f}-error`} role="alert" className="mt-1.5 font-sans text-xs text-rainbow-3">
          {errors[f]}
        </p>
      )}
    </div>
  );
  // Attributs communs : identifiant, obligation et erreur annoncés aux lecteurs d'écran.
  const a11y = (f: ContactField) => ({
    id: `cf-${f}`,
    name: f,
    "aria-required": isRequired(f) || undefined,
    "aria-invalid": Boolean(errors[f]) || undefined,
    "aria-describedby": errors[f] ? `cf-${f}-error` : undefined,
  });

  const messagePlaceholder =
    parcours === "support"
      ? text.messageSupportPlaceholder
      : parcours === "partenariat"
        ? text.messagePartnerPlaceholder
        : ["demo", "devis", "expert"].includes(parcours)
          ? text.messageCommercialPlaceholder
          : text.messagePlaceholder;

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* Piège à robots : champ invisible pour les humains, rempli par les robots de spam */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Objet en premier : il détermine les champs demandés */}
      <div>
        <label htmlFor="cf-subject" className="font-sans text-sm text-deep-soft">
          {text.subject}
        </label>
        <div className="relative">
          <select
            id="cf-subject"
            name="parcours"
            value={parcours}
            onChange={(e) => {
              if (isParcours(e.target.value)) setParcours(e.target.value);
              setErrors({});
            }}
            className={cn(inputClasses, "mt-2 appearance-none pr-10")}
          >
            {text.subjectOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-deep-soft" />
        </div>
        {parcours === "support" && (
          <p className="mt-3 font-sans text-sm text-deep-soft">
            {text.supportNotice}{" "}
            <a href={`tel:${company.supportPhone.replace(/\s/g, "")}`} className="whitespace-nowrap text-deep underline underline-offset-2">
              {company.supportPhone}
            </a>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {field("name", text.name, <input {...a11y("name")} type="text" autoComplete="name" placeholder={text.namePlaceholder} className={cn(inputClasses, "mt-2")} />)}
        {shows("organization") &&
          field(
            "organization",
            text.organization,
            <input {...a11y("organization")} type="text" autoComplete="organization" placeholder={text.organizationPlaceholder} className={cn(inputClasses, "mt-2")} />
          )}
        {field(
          "phone",
          text.phone,
          <input {...a11y("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder={text.phonePlaceholder} className={cn(inputClasses, "mt-2")} />
        )}
        {field(
          "email",
          text.email,
          <input {...a11y("email")} type="email" inputMode="email" autoComplete="email" placeholder={text.emailPlaceholder} className={cn(inputClasses, "mt-2")} />
        )}
        {field(
          "city",
          parcours === "partenariat" ? text.cityPartner : text.city,
          <>
            <input {...a11y("city")} type="text" list="cf-city-list" autoComplete="address-level2" placeholder={text.cityPlaceholder} className={cn(inputClasses, "mt-2")} />
            <datalist id="cf-city-list">
              {citySuggestions.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </>
        )}
        {shows("specialty") &&
          field(
            "specialty",
            text.specialty,
            <div className="relative">
              <select {...a11y("specialty")} defaultValue="" className={cn(inputClasses, "mt-2 appearance-none pr-10")}>
                <option value="" disabled>
                  {text.specialtyPlaceholder}
                </option>
                {text.specialtyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-deep-soft" />
            </div>
          )}
      </div>

      {(shows("machine") || shows("serial") || shows("session")) && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Technologie : préremplie depuis la fiche machine, suggestions du catalogue sinon */}
          {shows("machine") &&
            field(
              "machine",
              parcours === "support" ? text.machineSupport : text.machine,
              <>
                <input
                  key={machine?.slug ?? "none"}
                  {...a11y("machine")}
                  type="text"
                  list="cf-machine-list"
                  defaultValue={machine?.name}
                  placeholder={text.machinePlaceholder}
                  className={cn(inputClasses, "mt-2")}
                />
                <datalist id="cf-machine-list">
                  {Object.values(machines).map((n) => (
                    <option key={n} value={n} />
                  ))}
                </datalist>
              </>,
              shows("serial") ? undefined : "sm:col-span-2"
            )}
          {shows("serial") && field("serial", text.serial, <input {...a11y("serial")} type="text" autoComplete="off" className={cn(inputClasses, "mt-2")} />)}
          {shows("session") &&
            field(
              "session",
              text.session,
              <div className="relative">
                <select {...a11y("session")} defaultValue="" className={cn(inputClasses, "mt-2 appearance-none pr-10")}>
                  <option value="">{text.sessionNext}</option>
                  {sessions.map((s) => (
                    <option key={s.value} value={s.label}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-deep-soft" />
              </div>,
              "sm:col-span-2"
            )}
        </div>
      )}

      {field(
        "message",
        text.message,
        <textarea {...a11y("message")} ref={messageRef} rows={5} placeholder={messagePlaceholder} className={cn(inputClasses, "mt-2 resize-none")} />
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="glass-strong inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-7 py-3.5 font-sans text-sm text-deep transition-colors hover:bg-white disabled:opacity-50"
        >
          {status === "submitting" && <Loader2 size={16} className="animate-spin" />}
          {status === "submitting" ? text.submitting : text.submit}
        </button>

        <div aria-live="polite" className="font-sans text-sm">
          {status === "success" && (
            <span className="flex items-center gap-2 text-deep">
              <CheckCircle2 size={16} className="text-rainbow-1" />
              {text.success}
            </span>
          )}
          {status === "error" && (
            <span className="flex items-center gap-2 text-deep">
              <AlertCircle size={16} className="text-rainbow-4" />
              {text.error}
            </span>
          )}
        </div>
      </div>
    </form>
  );
}
