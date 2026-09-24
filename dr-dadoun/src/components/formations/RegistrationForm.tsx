"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

/** Inscription en ligne à une session (médecins). */
export function RegistrationForm({
  eventId,
  professions,
  phone,
  full,
}: {
  eventId: string;
  professions: string[];
  phone: string;
  full: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(form), eventId }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? "");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error && err.message ? err.message : "Une erreur est survenue.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-3xl bg-sand p-8 text-center md:p-12">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-deep text-white">
          <Check size={26} />
        </span>
        <h2 className="mt-6 font-display text-3xl font-medium">Inscription enregistrée</h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-soft">
          Vous recevez une confirmation par e-mail. Le cabinet vous contactera pour les modalités pratiques.
        </p>
      </div>
    );
  }

  if (full) {
    return (
      <div className="rounded-3xl border border-line p-8 md:p-10">
        <h2 className="font-display text-2xl font-medium">Cette session est complète</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Inscrivez-vous à la newsletter pour être prévenu des prochaines dates, ou appelez le cabinet au {phone}.
        </p>
      </div>
    );
  }

  const control = "mt-1.5 w-full rounded-xl border border-line bg-white/60 px-4 py-3 outline-none focus:border-accent";
  const field = (label: string, name: string, type = "text", autoComplete?: string, optional = false) => (
    <label className="block text-sm">
      <span className="text-ink-soft">
        {label} {optional && <span className="text-muted">(facultatif)</span>}
      </span>
      <input name={name} type={type} required={!optional} maxLength={120} autoComplete={autoComplete} className={control} />
    </label>
  );

  return (
    <form onSubmit={submit} className="rounded-3xl border border-line p-6 md:p-8">
      <h2 className="font-display text-2xl font-medium">Vos informations</h2>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {field("Prénom", "firstName", "text", "given-name")}
        {field("Nom", "lastName", "text", "family-name")}
        {field("E-mail", "email", "email", "email")}
        {field("Téléphone", "phone", "tel", "tel")}
        <label className="block text-sm">
          <span className="text-ink-soft">Spécialité</span>
          <select name="profession" required defaultValue="" className={control}>
            <option value="" disabled>
              Choisir
            </option>
            {professions.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        {field("Ville", "city", "text", "address-level2", true)}
        {field("N° d'inscription à l'Ordre", "ordre", "text", undefined, true)}
      </div>
      <label className="mt-6 flex items-start gap-3 text-xs leading-relaxed text-muted">
        <input type="checkbox" name="consent" required className="mt-0.5 accent-[var(--accent-deep)]" />
        J&apos;accepte que ces informations soient utilisées pour gérer mon inscription.
      </label>
      {status === "error" && (
        <p className="mt-4 text-sm text-accent-deep" role="alert">
          {error} Vous pouvez aussi appeler le cabinet au {phone}.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent-deep disabled:opacity-60"
      >
        {status === "sending" && <Loader2 size={16} className="animate-spin" />}
        Confirmer mon inscription
      </button>
    </form>
  );
}
