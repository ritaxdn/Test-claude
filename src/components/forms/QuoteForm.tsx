"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { leadSchema, budgetRanges, professions, type LeadPayload, type LeadIntent } from "@/lib/validation/lead";
import { establishmentTypes, targetCountries } from "@/lib/data/certifications";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type QuoteFormProps = {
  intent: LeadIntent;
  title?: string;
  description?: string;
  submitLabel?: string;
  defaultInterestedProduct?: string;
  compact?: boolean;
  successMessage?: string;
};

const inputClasses =
  "mt-1.5 w-full rounded-sm border border-border bg-paper px-3.5 py-2.5 text-sm text-ink transition-colors duration-fast placeholder:text-graphite-soft focus:border-bronze focus:outline-none";

const labelClasses = "text-sm font-medium text-ink-soft";

export function QuoteForm({
  intent,
  title = "Demander un devis",
  description = "Un conseiller Cellulift vous recontacte sous 24h ouvrées.",
  submitLabel = "Envoyer ma demande",
  defaultInterestedProduct,
  compact = false,
  successMessage = "Un conseiller Cellulift vous recontacte très prochainement pour échanger sur votre projet.",
}: QuoteFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    setFocus,
  } = useForm<LeadPayload>({
    resolver: zodResolver(leadSchema),
    mode: "onBlur",
    defaultValues: {
      intent,
      interestedProduct: defaultInterestedProduct ?? "",
      sourcePage: typeof window !== "undefined" ? window.location.pathname : "",
    },
  });

  async function goToStepTwo() {
    const valid = await trigger(["fullName", "phone", "email", "country"]);
    if (valid) {
      setStep(2);
    } else {
      const firstError = (["fullName", "phone", "email", "country"] as const).find((f) => errors[f]);
      if (firstError) setFocus(firstError);
    }
  }

  async function onSubmit(data: LeadPayload) {
    setStatus("submitting");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Request failed");

      setStatus("success");
      trackEvent("form_submit", { intent: data.intent, establishment: data.establishmentType });

      const intentEventMap = {
        devis: "quote_request",
        demo: "demo_request",
        brochure: "brochure_download",
      } as const;
      const specificEvent = intentEventMap[data.intent as keyof typeof intentEventMap] ?? "form_submit";
      trackEvent(specificEvent, { establishment: data.establishmentType, country: data.country });
    } catch {
      setStatus("error");
    }
  }

  const hasErrors = Object.keys(errors).length > 0;

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-md border border-border bg-paper-alt p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-success" aria-hidden />
        <p className="font-display text-xl text-ink">Merci, votre demande a bien été envoyée.</p>
        <p className="text-sm text-graphite">{successMessage}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={cn("rounded-md border border-border bg-paper p-6 md:p-8", compact && "p-5 md:p-6")}
    >
      {!compact && (
        <div className="mb-6">
          <p className="font-display text-2xl text-ink">{title}</p>
          <p className="mt-1.5 text-sm text-graphite">{description}</p>
        </div>
      )}

      <div className="mb-6 flex items-center gap-3 text-xs font-medium tracking-wide text-graphite-soft" aria-hidden="true">
        <span className={cn("flex h-6 w-6 items-center justify-center rounded-full border", step === 1 ? "border-bronze text-bronze-dark" : "border-success text-success")}>
          1
        </span>
        <span className={step === 1 ? "text-ink" : ""}>Vos coordonnées</span>
        <span className="h-px flex-1 bg-border" />
        <span className={cn("flex h-6 w-6 items-center justify-center rounded-full border", step === 2 ? "border-bronze text-bronze-dark" : "border-border")}>
          2
        </span>
        <span className={step === 2 ? "text-ink" : ""}>Votre projet</span>
      </div>

      {hasErrors && (
        <div
          ref={errorSummaryRef}
          role="alert"
          aria-live="assertive"
          className="mb-5 rounded-sm border border-error/30 bg-error/5 p-3.5 text-sm text-error"
        >
          Merci de corriger les champs suivants avant de continuer.
        </div>
      )}

      <input type="hidden" {...register("intent")} value={intent} />
      <input type="hidden" {...register("sourcePage")} />

      <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", step === 2 && "hidden")}>
        <label className="block sm:col-span-1">
          <span className={labelClasses}>Nom complet *</span>
          <input
            {...register("fullName")}
            type="text"
            autoComplete="name"
            className={inputClasses}
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
          />
          {errors.fullName && (
            <span id="fullName-error" className="mt-1 block text-xs text-error">
              {errors.fullName.message}
            </span>
          )}
        </label>

        <label className="block">
          <span className={labelClasses}>Téléphone (avec WhatsApp si possible) *</span>
          <input
            {...register("phone")}
            type="tel"
            autoComplete="tel"
            className={inputClasses}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && <span className="mt-1 block text-xs text-error">{errors.phone.message}</span>}
        </label>

        <label className="block">
          <span className={labelClasses}>Email professionnel *</span>
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            className={inputClasses}
            aria-invalid={!!errors.email}
          />
          {errors.email && <span className="mt-1 block text-xs text-error">{errors.email.message}</span>}
        </label>

        <label className="block">
          <span className={labelClasses}>Pays *</span>
          <select {...register("country")} className={inputClasses} defaultValue="" aria-invalid={!!errors.country}>
            <option value="" disabled>
              Sélectionnez votre pays
            </option>
            {targetCountries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {errors.country && <span className="mt-1 block text-xs text-error">{errors.country.message}</span>}
        </label>

        <button
          type="button"
          onClick={goToStepTwo}
          className="mt-2 rounded-sm bg-ink px-5 py-3 text-sm font-medium tracking-wide text-paper transition-transform duration-fast hover:scale-[1.01] hover:bg-ink-soft sm:col-span-2"
        >
          Continuer →
        </button>
      </div>

      <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", step === 1 && "hidden")}>
        <label className="block">
          <span className={labelClasses}>Profession *</span>
          <select {...register("profession")} className={inputClasses} defaultValue="" aria-invalid={!!errors.profession}>
            <option value="" disabled>
              Sélectionnez votre profession
            </option>
            {professions.map((profession) => (
              <option key={profession} value={profession}>
                {profession}
              </option>
            ))}
          </select>
          {errors.profession && <span className="mt-1 block text-xs text-error">{errors.profession.message}</span>}
        </label>

        <label className="block">
          <span className={labelClasses}>Type d&apos;établissement *</span>
          <select {...register("establishmentType")} className={inputClasses} defaultValue="" aria-invalid={!!errors.establishmentType}>
            <option value="" disabled>
              Sélectionnez votre établissement
            </option>
            {establishmentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.establishmentType && (
            <span className="mt-1 block text-xs text-error">{errors.establishmentType.message}</span>
          )}
        </label>

        <label className="block">
          <span className={labelClasses}>Société / enseigne</span>
          <input {...register("company")} type="text" autoComplete="organization" className={inputClasses} />
        </label>

        <label className="block">
          <span className={labelClasses}>Machine(s) qui vous intéresse(nt)</span>
          <input
            {...register("interestedProduct")}
            type="text"
            placeholder="Ex : HIFU, cryolipolyse, épilation laser..."
            className={inputClasses}
          />
        </label>

        <label className="block sm:col-span-2">
          <span className={labelClasses}>Budget estimatif</span>
          <select {...register("budget")} className={inputClasses} defaultValue="">
            <option value="" disabled>
              Sélectionnez une fourchette (optionnel)
            </option>
            {budgetRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className={labelClasses}>Votre message</span>
          <textarea
            {...register("message")}
            rows={4}
            placeholder="Décrivez votre projet, votre activité, vos objectifs..."
            className={cn(inputClasses, "resize-none")}
          />
        </label>

        <label className="flex items-start gap-2.5 sm:col-span-2">
          <input type="checkbox" {...register("consent")} className="mt-1 h-4 w-4 shrink-0 accent-[--color-bronze]" />
          <span className="text-xs text-graphite">
            J&apos;accepte d&apos;être recontacté(e) par Cellulift au sujet de ma demande. *
          </span>
        </label>
        {errors.consent && <span className="text-xs text-error sm:col-span-2">{errors.consent.message}</span>}

        <div className="flex gap-3 sm:col-span-2">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="rounded-sm border border-border px-5 py-3 text-sm font-medium text-ink-soft transition-colors duration-fast hover:bg-paper-alt"
          >
            ← Retour
          </button>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-bronze-dark px-5 py-3 text-sm font-medium tracking-wide text-paper transition-transform duration-fast hover:scale-[1.01] disabled:opacity-60"
          >
            {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {submitLabel}
          </button>
        </div>

        {status === "error" && (
          <p role="alert" className="text-sm text-error sm:col-span-2">
            Une erreur est survenue lors de l&apos;envoi. Merci de réessayer ou de nous contacter directement par
            WhatsApp.
          </p>
        )}
      </div>
    </form>
  );
}
