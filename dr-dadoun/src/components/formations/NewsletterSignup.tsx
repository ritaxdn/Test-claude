"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

type Props = { name: string; consent: string; specialties: string[] };
type Status = "idle" | "sending" | "sent" | "error";

/** Inscription à la newsletter Cellulift Academy (dates des prochaines sessions). */
export function NewsletterSignup({ name, consent, specialties }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
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
      <p className="flex items-center gap-3 rounded-2xl bg-accent-soft/40 px-5 py-4 text-sm font-medium">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-deep text-white">
          <Check size={15} />
        </span>
        Merci ! Vous êtes inscrit à la newsletter {name}.
      </p>
    );
  }

  const input =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-accent";

  return (
    <form onSubmit={submit}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.4fr_1.2fr]">
        <input name="firstName" placeholder="Prénom" autoComplete="given-name" maxLength={60} className={input} aria-label="Prénom" />
        <input name="lastName" placeholder="Nom" autoComplete="family-name" maxLength={60} className={input} aria-label="Nom" />
        <input name="email" type="email" required placeholder="E-mail professionnel" autoComplete="email" maxLength={120} className={input} aria-label="E-mail" />
        <select name="specialty" defaultValue="" className={input} aria-label="Spécialité">
          <option value="">Spécialité (facultatif)</option>
          {specialties.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-start gap-3 text-xs leading-relaxed text-muted sm:max-w-xl">
          <input type="checkbox" name="consent" required className="mt-0.5 accent-[var(--accent-deep)]" />
          {consent}
        </label>
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-xs font-medium uppercase tracking-wide text-white transition-colors hover:bg-accent-deep disabled:opacity-60"
        >
          {status === "sending" && <Loader2 size={15} className="animate-spin" />}
          Je m&apos;inscris
        </button>
      </div>
      {status === "error" && (
        <p className="mt-3 text-sm text-accent-deep" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
