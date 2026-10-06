"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import type { Center } from "@/content/centers";

/** Liste des centres avec filtre par ville (les centres sans ville confirmée sont regroupés à part). */
export function CentersDirectory({
  centers,
  labels,
}: {
  centers: Center[];
  labels: { all: string; other: string; unit: [string, string] };
}) {
  const cities = Array.from(new Set(centers.map((c) => c.city).filter(Boolean))).sort((a, b) => a.localeCompare(b, "fr"));
  const hasOther = centers.some((c) => !c.city);
  const [city, setCity] = useState<string | null>(null);
  const shown = city === null ? centers : centers.filter((c) => (city === "" ? !c.city : c.city === city));

  const chip = (value: string | null, label: string) => (
    <button
      key={label}
      type="button"
      onClick={() => setCity(value)}
      aria-pressed={city === value}
      className={`rounded-full border px-4 py-2 font-sans text-sm transition-colors ${
        city === value ? "border-deep bg-deep text-white" : "border-deep/15 bg-white/60 text-deep hover:border-deep/40"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {chip(null, labels.all)}
        {cities.map((c) => chip(c, c))}
        {hasOther && chip("", labels.other)}
      </div>
      <p className="data-label mt-6 text-deep-soft">{shown.length} {labels.unit[shown.length > 1 ? 1 : 0]}</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((c) => (
          <li key={c.name} className="glass rounded-[1.25rem] p-6">
            <p className="font-sans text-lg text-deep">{c.name}</p>
            {c.place && <p className="mt-0.5 font-sans text-sm text-deep-soft">{c.place}</p>}
            <p className="mt-4 flex items-center gap-1.5 font-sans text-sm text-deep-soft">
              <MapPin size={14} className="shrink-0" />
              {c.city ? `${c.city}, ${c.country}` : c.country}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
