"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

type Props = {
  courses: { slug: string; title: string }[];
  kinds: { id: string; label: string }[];
  professions: string[];
  phone: string;
};

type Status = "idle" | "sending" | "sent" | "error";

/** Recrée le formulaire quand le lien change la pré-sélection (?formation=…&demande=…). */
export function FormationRequestSection(props: Props) {
  const params = useSearchParams();
  return <FormationRequest key={params.toString()} {...props} />;
}

/** Demande d'information ou d'inscription aux formations (médecins). */
function FormationRequest({ courses, kinds, professions, phone }: Props) {
  // Pré-sélection depuis un lien : /formations?formation=<slug>&demande=<kind>#demande
  const params = useSearchParams();
  const initialCourse = params.get("formation");
  const initialKind = params.get("demande");

  const [kind, setKind] = useState(kinds.some((k) => k.id === initialKind) ? initialKind! : kinds[0].id);
  const [selected, setSelected] = useState<string[]>(
    initialCourse && courses.some((c) => c.slug === initialCourse) ? [initialCourse] : [],
  );
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const toggle = (slug: string) =>
    setSelected((cur) => (cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (selected.length === 0) {
      setStatus("error");
      setError("Merci de choisir au moins une formation.");
      return;
    }
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/formations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(form), kind, courses: selected }),
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
      <div className="rounded-2xl border border-line bg-white p-10 text-center md:p-14">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-deep text-white">
          <Check size={26} />
        </span>
        <h3 className="mt-6 font-display text-3xl font-medium">Demande envoyée</h3>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-soft">
          Merci. Le cabinet revient vers vous par e-mail avec les informations demandées.
        </p>
      </div>
    );
  }

  const chip = (on: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm transition-colors ${
      on ? "border-accent-deep bg-accent-soft/50 text-ink" : "border-line text-ink-soft hover:border-accent"
    }`;
  const label = "text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted";

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-white p-6 text-left md:p-10">
      {/* Champ piège anti-spam */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <fieldset>
        <legend className={label}>Votre demande</legend>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Votre demande">
          {kinds.map((k) => (
            <button key={k.id} type="button" role="radio" aria-checked={kind === k.id} onClick={() => setKind(k.id)} className={chip(kind === k.id)}>
              {kind === k.id && <Check size={14} className="text-accent-deep" />}
              {k.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className={label}>
          Formation(s) <span className="normal-case tracking-normal">— plusieurs choix possibles</span>
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {courses.map((c) => {
            const on = selected.includes(c.slug);
            return (
              <button key={c.slug} type="button" aria-pressed={on} onClick={() => toggle(c.slug)} className={chip(on)}>
                {on && <Check size={14} className="text-accent-deep" />}
                {c.title}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Field label="Prénom" name="firstName" autoComplete="given-name" required />
        <Field label="Nom" name="lastName" autoComplete="family-name" required />
        <label className="block text-sm">
          <span className="text-ink-soft">Profession</span>
          <select
            name="profession"
            required
            defaultValue=""
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-accent"
          >
            <option value="" disabled>
              Choisir…
            </option>
            {professions.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <Field label="Ville / pays" name="city" autoComplete="address-level2" />
        <Field label="E-mail" name="email" type="email" autoComplete="email" required />
        <Field label="Téléphone (facultatif)" name="phone" type="tel" autoComplete="tel" />
      </div>
      <label className="mt-4 block text-sm">
        <span className="text-ink-soft">Message (facultatif)</span>
        <textarea
          name="message"
          rows={3}
          maxLength={800}
          placeholder="Votre expérience, vos attentes, vos disponibilités…"
          className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-accent"
        />
      </label>
      <label className="mt-4 flex items-start gap-3 text-xs leading-relaxed text-muted">
        <input type="checkbox" name="consent" required className="mt-0.5 accent-[var(--accent-deep)]" />
        J&apos;accepte que mes coordonnées soient utilisées uniquement pour répondre à ma demande de formation.
      </label>

      {status === "error" && (
        <p className="mt-4 text-sm text-accent-deep" role="alert">
          {error} Vous pouvez aussi appeler le cabinet au {phone}.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-xs font-medium uppercase tracking-wide text-white transition-colors hover:bg-accent-deep disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {status === "sending" && <Loader2 size={16} className="animate-spin" />}
        Envoyer ma demande
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="text-ink-soft">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        maxLength={120}
        autoComplete={autoComplete}
        className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-accent"
      />
    </label>
  );
}
