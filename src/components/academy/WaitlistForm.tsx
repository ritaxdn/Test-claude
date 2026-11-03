"use client";

import { readAttribution } from "@/lib/attribution";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Loader2, CheckCircle2, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { emailPattern, isValidPhone } from "@/lib/contact-rules";
import type { WaitlistFormText } from "@/content/academy-waitlist";

type Field = "firstName" | "lastName" | "email" | "phone" | "specialty" | "client";

/**
 * Inscription à l'avant-première de la CELLULIFT Academy en ligne.
 * Même circuit que la newsletter : e-mail [AVANT-PREMIÈRE] à l'équipe, fiche CRM, contact Brevo.
 * Contrairement au guide, on n'affiche « inscrit » que si le serveur a bien enregistré l'inscription.
 */
export function WaitlistForm({
  text,
  specialtyOptions,
  machines,
  backHref,
}: {
  text: WaitlistFormText;
  specialtyOptions: readonly string[];
  machines: readonly string[];
  backHref: string;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [client, setClient] = useState<"" | "oui" | "non">("");
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const v = (k: string) => String(data.get(k) ?? "").trim();
    const next: typeof errors = {};
    for (const k of ["firstName", "lastName", "specialty"] as const) if (!v(k)) next[k] = text.requiredError;
    if (!v("email")) next.email = text.requiredError;
    else if (!emailPattern.test(v("email"))) next.email = text.emailError;
    if (v("phone") && !isValidPhone(v("phone"))) next.phone = text.phoneError;
    if (!client) next.client = text.requiredError;
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(`wl-${Object.keys(next)[0]}`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcours: "avant-premiere",
          firstName: v("firstName"),
          lastName: v("lastName"),
          email: v("email"),
          phone: v("phone"),
          specialty: v("specialty"),
          client,
          machine: client === "oui" ? v("machine") : "",
          origin: window.location.pathname,
          lang: document.documentElement.lang,
          attribution: readAttribution(),
          website: v("website"),
          elapsed: Date.now() - startedAt.current,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      track("generate_lead", { source: "academy_avant_premiere" });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  const inputClasses =
    "glass-soft mt-2 w-full rounded-2xl px-4 py-3 font-sans text-base text-deep placeholder:text-deep-soft/70 transition-colors focus:bg-white focus:outline-none sm:text-sm";
  const label = "font-sans text-sm text-deep-soft";
  const req = <span className="text-rainbow-3">*</span>;
  const err = (f: Field) =>
    errors[f] && (
      <p role="alert" id={`wl-${f}-error`} className="mt-1.5 font-sans text-xs text-rainbow-3">
        {errors[f]}
      </p>
    );

  if (status === "done") {
    return (
      <div className="flex flex-col items-start gap-4" role="status">
        <CheckCircle2 className="text-[var(--rainbow-2)]" size={28} />
        <p className="display text-2xl text-deep">{text.successTitle}</p>
        <p className="font-sans text-sm leading-relaxed text-deep-soft">{text.successText}</p>
        <a href={backHref} className="py-2 font-sans text-sm text-deep underline underline-offset-4 hover:text-deep-soft">
          {text.back}
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
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="wl-firstName" className={label}>{text.firstName} {req}</label>
          <input id="wl-firstName" name="firstName" autoComplete="given-name" maxLength={100} className={inputClasses} aria-invalid={!!errors.firstName} />
          {err("firstName")}
        </div>
        <div>
          <label htmlFor="wl-lastName" className={label}>{text.lastName} {req}</label>
          <input id="wl-lastName" name="lastName" autoComplete="family-name" maxLength={100} className={inputClasses} aria-invalid={!!errors.lastName} />
          {err("lastName")}
        </div>
      </div>
      <div>
        <label htmlFor="wl-email" className={label}>{text.email} {req}</label>
        <input id="wl-email" name="email" type="email" autoComplete="email" inputMode="email" maxLength={200} className={inputClasses} aria-invalid={!!errors.email} />
        {err("email")}
      </div>
      <div>
        <label htmlFor="wl-phone" className={label}>{text.phone}</label>
        <input id="wl-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} className={inputClasses} aria-invalid={!!errors.phone} aria-describedby="wl-phone-hint" />
        <p id="wl-phone-hint" className="mt-1.5 font-sans text-xs text-deep-soft">{text.phoneHint}</p>
        {err("phone")}
      </div>
      <div>
        <label htmlFor="wl-specialty" className={label}>{text.specialty} {req}</label>
        <div className="relative">
          <select id="wl-specialty" name="specialty" defaultValue="" className={cn(inputClasses, "appearance-none pr-10")} aria-invalid={!!errors.specialty}>
            <option value="" disabled>{text.specialtyPlaceholder}</option>
            {specialtyOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-deep-soft" />
        </div>
        {err("specialty")}
      </div>
      <fieldset>
        <legend className={label}>{text.client} {req}</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {([["oui", text.clientYes], ["non", text.clientNo]] as const).map(([value, l], i) => (
            <label
              key={value}
              className={cn(
                "glass-soft flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 font-sans text-sm text-deep transition-colors",
                client === value && "bg-white ring-1 ring-deep/30",
              )}
            >
              <input
                type="radio"
                name="client"
                value={value}
                id={i === 0 ? "wl-client" : undefined}
                checked={client === value}
                onChange={() => setClient(value)}
                className="accent-[var(--deep)]"
              />
              {l}
            </label>
          ))}
        </div>
        {err("client")}
      </fieldset>
      {client === "oui" && (
        <div>
          <label htmlFor="wl-machine" className={label}>{text.machine}</label>
          <div className="relative">
            <select id="wl-machine" name="machine" defaultValue="" className={cn(inputClasses, "appearance-none pr-10")}>
              <option value="">{text.machinePlaceholder}</option>
              {machines.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-deep-soft" />
          </div>
        </div>
      )}
      {status === "error" && (
        <p role="alert" className="rounded-2xl bg-rainbow-3/10 px-4 py-3 font-sans text-sm text-deep">{text.sendError}</p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-deep px-6 py-3.5 font-sans text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "submitting" ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        {status === "submitting" ? text.submitting : text.submit}
      </button>
      <p className="font-sans text-xs leading-relaxed text-deep-soft">{text.privacy}</p>
    </form>
  );
}
