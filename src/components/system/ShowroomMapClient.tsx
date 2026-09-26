"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export type MapPoint = {
  id: string;
  x: number;
  y: number;
  city: string;
  country: string;
  address: string;
  hq: boolean;
};

// Décalage des étiquettes pour les villes proches (Maroc).
const LABEL: Record<string, [number, number]> = { tanger: [14, -8], marrakech: [14, 20], casablanca: [16, 6] };

/** Carte des showrooms : trame de points, liaisons depuis Casablanca, fiche au clic. */
export function ShowroomMapClient({
  width,
  height,
  dots,
  highlight,
  points,
  labels,
  contactHref,
}: {
  width: number;
  height: number;
  dots: string;
  highlight: string;
  points: MapPoint[];
  labels: { hq: string; onRequest: string; cta: string; list: string };
  contactHref: string;
}) {
  const uid = useId().replace(/:/g, "");
  const hq = points.find((p) => p.hq) ?? points[0];
  const [active, setActive] = useState(hq.id);
  const current = points.find((p) => p.id === active) ?? hq;

  // Arc entre le siège et un showroom (courbe vers le haut).
  const arc = (p: MapPoint) => {
    const mx = (hq.x + p.x) / 2;
    const my = (hq.y + p.y) / 2 - Math.hypot(p.x - hq.x, p.y - hq.y) * 0.28;
    return `M${hq.x} ${hq.y} Q${mx} ${my} ${p.x} ${p.y}`;
  };

  return (
    <div className="glass mt-8 grid overflow-hidden rounded-[1.75rem] lg:grid-cols-[1.7fr_1fr]">
      {/* Carte */}
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="block h-auto w-full" role="img" aria-label={labels.list}>
          <defs>
            <linearGradient id={`g-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#00bcd4" />
              <stop offset=".35" stopColor="#7b61ff" />
              <stop offset=".65" stopColor="#e91e8c" />
              <stop offset="1" stopColor="#ff5722" />
            </linearGradient>
            <radialGradient id={`p-${uid}`}>
              <stop offset="0" stopColor="#ffffff" />
              <stop offset=".35" stopColor="#e91e8c" />
              <stop offset=".7" stopColor="#7b61ff" stopOpacity=".5" />
              <stop offset="1" stopColor="#7b61ff" stopOpacity="0" />
            </radialGradient>
          </defs>

          <path d={dots} stroke="#1d1b26" strokeOpacity=".16" strokeWidth="3.4" strokeLinecap="round" />
          <path d={highlight} stroke={`url(#g-${uid})`} strokeOpacity=".75" strokeWidth="3.8" strokeLinecap="round" />

          {points
            .filter((p) => p.id !== hq.id)
            .map((p) => (
              <path
                key={`arc-${p.id}`}
                d={arc(p)}
                fill="none"
                stroke={`url(#g-${uid})`}
                strokeWidth={p.id === active ? 2 : 1.1}
                strokeOpacity={p.id === active ? 0.95 : 0.45}
                strokeDasharray="4 6"
                className="map-flow"
              />
            ))}

          {points.map((p) => {
            const on = p.id === active;
            return (
              <g
                key={p.id}
                role="button"
                tabIndex={0}
                aria-label={`${p.city}, ${p.country}`}
                aria-pressed={on}
                onClick={() => setActive(p.id)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActive(p.id)}
                className="cursor-pointer outline-none"
              >
                <circle cx={p.x} cy={p.y} r="22" fill="transparent" />
                {on && <circle cx={p.x} cy={p.y} r="10" fill="none" stroke={`url(#g-${uid})`} strokeWidth="1.5" className="map-ping" />}
                <circle cx={p.x} cy={p.y} r={on ? 11 : 8} fill={`url(#p-${uid})`} />
                <circle cx={p.x} cy={p.y} r={on ? 4.5 : 3.5} fill="#ffffff" stroke="#1d1b26" strokeOpacity=".25" />
                <text
                  x={p.x + (LABEL[p.id]?.[0] ?? 14)}
                  y={p.y + (LABEL[p.id]?.[1] ?? 5)}
                  className={cn("select-none font-sans", on ? "fill-deep" : "fill-deep-soft")}
                  style={{ fontSize: on ? 20 : 16, fontWeight: on ? 600 : 400 }}
                >
                  {p.city}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Fiche + liste */}
      <div className="flex flex-col border-t border-white/70 p-6 md:p-7 lg:border-l lg:border-t-0">
        <div className="glass-strong rounded-[1.5rem] p-6">
          <p className="data-label flex items-center gap-2 text-deep-soft">
            <MapPin size={13} /> {current.country}
            {current.hq && <span className="rounded-full border border-deep/15 px-2 py-0.5 text-[10px]">{labels.hq}</span>}
          </p>
          <p className="display mt-3 text-2xl text-deep">{current.city}</p>
          <p className="mt-3 font-sans text-sm leading-relaxed text-deep-soft">{current.address || labels.onRequest}</p>
          <Link
            href={contactHref}
            className="group mt-6 inline-flex items-center gap-2 font-sans text-sm text-deep hover:underline"
          >
            {labels.cta} <ArrowUpRight size={14} className="transition-transform group-hover:rotate-45" />
          </Link>
        </div>

        <p className="data-label mt-8 text-deep-soft">{labels.list}</p>
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {points.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setActive(p.id)}
                className={cn(
                  "w-full rounded-full px-4 py-2 text-left font-sans text-sm transition-colors",
                  p.id === active ? "glass-strong text-deep" : "glass-soft text-deep-soft hover:text-deep"
                )}
              >
                {p.city}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
