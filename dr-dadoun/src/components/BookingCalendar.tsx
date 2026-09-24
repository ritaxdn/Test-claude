"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { booking, practice } from "@/content/site";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const pad = (n: number) => String(n).padStart(2, "0");
const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const fromMinutes = (min: number) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Créneaux d'une journée, en excluant ceux déjà passés si c'est aujourd'hui. */
function slotsFor(date: Date, now: Date): string[] {
  const ranges = booking.openings[date.getDay()] ?? [];
  const isToday = toKey(date) === toKey(now);
  // Un délai de 2 h laisse au cabinet le temps de confirmer.
  const earliest = now.getHours() * 60 + now.getMinutes() + 120;
  const slots: string[] = [];
  for (const [start, end] of ranges) {
    for (let t = toMinutes(start); t + booking.slotMinutes <= toMinutes(end); t += booking.slotMinutes) {
      if (!isToday || t >= earliest) slots.push(fromMinutes(t));
    }
  }
  return slots;
}

type Status = "idle" | "sending" | "sent" | "error";

const subscribe = () => () => {};

/** Le calendrier dépend de la date et du fuseau du visiteur : rendu côté client uniquement. */
export function BookingCalendar() {
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  if (!isClient) {
    return <div className="h-[36rem] animate-pulse rounded-3xl bg-porcelain/70" aria-hidden="true" />;
  }
  return <Calendar />;
}

function Calendar() {
  const now = useMemo(() => new Date(), []);
  const today = startOfDay(now);
  const lastDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + booking.maxDaysAhead);

  const [typeId, setTypeId] = useState(booking.types[0].id);
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  // Qualification du patient : domaine puis préoccupation principale (facultatifs).
  const [domain, setDomain] = useState("");
  const [concern, setConcern] = useState("");

  const type = booking.types.find((t) => t.id === typeId)!;
  const domainGroup = booking.needs.find((g) => g.group === domain);

  const isBookable = (d: Date) =>
    d >= today &&
    d <= lastDay &&
    !booking.closedDates.includes(toKey(d)) &&
    slotsFor(d, now).length > 0;

  // Grille du mois, semaines commençant le lundi.
  const cells = useMemo(() => {
    const offset = (month.getDay() + 6) % 7;
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: days }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
    ];
  }, [month]);

  const canPrev = month > new Date(today.getFullYear(), today.getMonth(), 1);
  const canNext = new Date(month.getFullYear(), month.getMonth() + 1, 1) <= lastDay;
  const slots = date ? slotsFor(date, now) : [];

  const longDate = date?.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!date || !time) return;
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/rendez-vous", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(form),
          type: type.label,
          domain,
          needs: concern ? [concern] : [],
          date: toKey(date),
          time,
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? "");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error && err.message ? err.message : "Une erreur est survenue.");
    }
  }

  if (status === "sent" && time) {
    return (
      <div className="rounded-3xl bg-porcelain p-10 text-center shadow-[0_20px_60px_-40px_rgba(10,27,33,0.4)] md:p-14">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-deep text-porcelain">
          <Check size={26} />
        </span>
        <h3 className="mt-6 font-display text-3xl">Demande envoyée</h3>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-soft">
          Votre demande de <strong>{type.label.toLowerCase()}</strong> le <strong>{longDate}</strong> à{" "}
          <strong>{time.replace(":", "h")}</strong> a bien été transmise. Le cabinet vous confirme le
          rendez-vous par téléphone ou e-mail sous 24 h ouvrées.
        </p>
      </div>
    );
  }

  const stepTitle = "font-display text-xl font-medium flex items-center gap-3";
  const stepNum = "flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-sans text-porcelain";

  const ready = !!date && !!time;
  const label = "block text-sm";
  const control =
    "mt-1.5 w-full rounded-xl border border-line bg-white/60 px-4 py-3 outline-none focus:border-accent";

  return (
    <div className="overflow-hidden rounded-3xl bg-porcelain shadow-[0_20px_60px_-40px_rgba(10,27,33,0.4)]">
      <div className="grid lg:grid-cols-[1.1fr_1fr]">
        {/* 1. Date & heure */}
        <div className="border-b border-line p-6 md:p-8 lg:border-b-0 lg:border-r">
          <h3 className={stepTitle}>
            <span className={stepNum}>1</span> Date et heure
          </h3>
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
              disabled={!canPrev}
              aria-label="Mois précédent"
              className="rounded-full p-2 hover:bg-sand disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <p className="font-display text-lg capitalize">
              {month.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
            </p>
            <button
              type="button"
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
              disabled={!canNext}
              aria-label="Mois suivant"
              className="rounded-full p-2 hover:bg-sand disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((d) => (
              <span key={d} className="pb-2 text-[0.7rem] uppercase tracking-wider text-muted">
                {d}
              </span>
            ))}
            {cells.map((d, i) => {
              if (!d) return <span key={`e${i}`} />;
              const ok = isBookable(d);
              const selected = date && toKey(d) === toKey(date);
              return (
                <button
                  key={toKey(d)}
                  type="button"
                  disabled={!ok}
                  onClick={() => {
                    setDate(d);
                    setTime(null);
                  }}
                  aria-label={d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                  aria-pressed={!!selected}
                  className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full text-sm transition-colors ${
                    selected
                      ? "bg-ink text-porcelain"
                      : ok
                        ? "font-medium hover:bg-accent-soft"
                        : "cursor-not-allowed text-muted/35"
                  }`}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>

          {date ? (
            <div className="mt-6 border-t border-line pt-6">
              <p className="text-sm capitalize text-ink-soft">{longDate}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Horaire">
                {slots.map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={s === time}
                    onClick={() => setTime(s)}
                    className={`rounded-full border py-2 text-sm transition-colors ${
                      s === time ? "border-ink bg-ink text-porcelain" : "border-line hover:border-ink"
                    }`}
                  >
                    {s.replace(":", "h")}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted">Sélectionnez un jour pour voir les horaires proposés.</p>
          )}
        </div>

        {/* 2. Informations */}
        <form onSubmit={submit} className="p-6 md:p-8">
          <h3 className={stepTitle}>
            <span className={stepNum}>2</span> Vos informations
          </h3>

          {/* Champ piège anti-spam, invisible pour les humains */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Prénom" name="firstName" autoComplete="given-name" />
            <Field label="Nom" name="lastName" autoComplete="family-name" />
            <Field label="Téléphone" name="phone" type="tel" autoComplete="tel" />
            <Field label="E-mail" name="email" type="email" autoComplete="email" optional />
            <label className={label}>
              <span className="text-ink-soft">
                Tranche d&apos;âge <span className="text-muted">(facultatif)</span>
              </span>
              <select name="ageRange" defaultValue="" className={control}>
                <option value="">—</option>
                {booking.ageRanges.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </label>
            <label className={label}>
              <span className="text-ink-soft">Motif de la visite</span>
              <select
                value={typeId}
                onChange={(e) => {
                  setTypeId(e.target.value);
                  if (e.target.value === "gyneco" && !domain) setDomain("Gynécologie esthétique");
                }}
                className={control}
              >
                {booking.types.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={label}>
              <span className="text-ink-soft">
                Domaine <span className="text-muted">(facultatif)</span>
              </span>
              <select
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                  setConcern("");
                }}
                className={control}
              >
                <option value="">—</option>
                {booking.needs.map((g) => (
                  <option key={g.group}>{g.group}</option>
                ))}
              </select>
            </label>
            <label className={label}>
              <span className="text-ink-soft">
                Préoccupation <span className="text-muted">(facultatif)</span>
              </span>
              <select
                value={concern}
                onChange={(e) => setConcern(e.target.value)}
                disabled={!domainGroup}
                className={`${control} disabled:opacity-50`}
              >
                <option value="">{domainGroup ? "—" : "Choisir d'abord un domaine"}</option>
                {domainGroup?.options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
          </div>
          <p className="mt-2 text-xs text-muted">
            {type.label} : {type.text.charAt(0).toLowerCase() + type.text.slice(1)}
          </p>

          <div className={`mt-6 rounded-2xl px-5 py-4 text-sm ${ready ? "bg-sand" : "border border-dashed border-line text-muted"}`}>
            {ready ? (
              <>
                <span className="font-medium">{type.label}</span> · <span className="capitalize">{longDate}</span> à{" "}
                {time!.replace(":", "h")}
              </>
            ) : (
              "Choisissez un jour et un horaire dans le calendrier."
            )}
          </div>

          <label className="mt-4 flex items-start gap-3 text-xs leading-relaxed text-muted">
            <input type="checkbox" name="consent" required className="mt-0.5 accent-[var(--accent-deep)]" />
            J&apos;accepte que le cabinet utilise ces informations pour traiter ma demande.
          </label>

          {status === "error" && (
            <p className="mt-4 text-sm text-accent-deep" role="alert">
              {error} Vous pouvez aussi appeler le cabinet au {practice.phone}.
            </p>
          )}

          <button
            type="submit"
            disabled={!ready || status === "sending"}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-medium text-porcelain transition-colors hover:bg-accent-deep disabled:opacity-40"
          >
            {status === "sending" && <Loader2 size={16} className="animate-spin" />}
            Envoyer ma demande
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  optional,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  optional?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="text-ink-soft">
        {label} {optional && <span className="text-muted">(facultatif)</span>}
      </span>
      <input
        name={name}
        type={type}
        required={!optional}
        maxLength={120}
        autoComplete={autoComplete}
        className="mt-1.5 w-full rounded-xl border border-line bg-white/60 px-4 py-3 outline-none focus:border-accent"
      />
    </label>
  );
}
