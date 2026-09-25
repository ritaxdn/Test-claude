import { Check } from "lucide-react";

const points = ["Consultation médicale préalable", "Sans obligation de soin", "Confirmation par téléphone"];

/** Rappels courts placés sous les boutons de rendez-vous. */
export function Reassurance({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <ul className={`mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-xs ${dark ? "text-white/65" : "text-ink-soft"}`}>
      {points.map((p) => (
        <li key={p} className="flex items-center gap-1.5">
          <Check size={12} strokeWidth={2.5} className={dark ? "text-white/80" : "text-accent-deep"} /> {p}
        </li>
      ))}
    </ul>
  );
}
