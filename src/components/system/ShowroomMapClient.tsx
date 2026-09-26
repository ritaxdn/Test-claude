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
  arc: string; // grand cercle depuis le siège (vide pour le siège)
  coords: string;
  morocco: boolean;
};

// Étiquettes : villes hors Maroc toujours nommées ; au Maroc (villes très proches), seule la ville active l'est.
const LABEL: Record<string, [number, number]> = { paris: [14, -6], dakar: [-14, 5], jeddah: [14, 5] };

/** Globe des implantations : sphère de verre, trame de points, grands cercles depuis le siège, fiche au clic. */
export function ShowroomMapClient({
  width,
  height,
  dots,
  highlight,
  graticule,
  sphere,
  points,
  labels,
  contactHref,
}: {
  width: number;
  height: number;
  dots: string;
  highlight: string;
  graticule: string;
  sphere: { cx: number; cy: number; r: number };
  points: MapPoint[];
  labels: { hq: string; onRequest: string; cta: string; list: string };
  contactHref: string;
}) {
  const uid = useId().replace(/:/g, "");
  const hq = points.find((p) => p.hq) ?? points[0];
  const [active, setActive] = useState(hq.id);
  const current = points.find((p) => p.id === active) ?? hq;

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
            <radialGradient id={`s-${uid}`} cx=".35" cy=".25" r=".85">
              <stop offset="0" stopColor="#ffffff" stopOpacity=".95" />
              <stop offset=".55" stopColor="#eef0f6" stopOpacity=".55" />
              <stop offset="1" stopColor="#c9cbe0" stopOpacity=".35" />
            </radialGradient>
            <linearGradient id={`rim-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset=".5" stopColor="#a797ff" stopOpacity=".5" />
              <stop offset="1" stopColor="#7fe3f0" stopOpacity=".7" />
            </linearGradient>
            <radialGradient id={`p-${uid}`}>
              <stop offset="0" stopColor="#ffffff" />
              <stop offset=".35" stopColor="#e91e8c" />
              <stop offset=".7" stopColor="#7b61ff" stopOpacity=".5" />
              <stop offset="1" stopColor="#7b61ff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Sphère de verre */}
          <circle cx={sphere.cx} cy={sphere.cy} r={sphere.r} fill={`url(#s-${uid})`} />
          <path d={graticule} fill="none" stroke="#1d1b26" strokeOpacity=".07" strokeWidth=".8" />
          <path d={dots} stroke="#1d1b26" strokeOpacity=".2" strokeWidth="2.6" strokeLinecap="round" />
          <path d={highlight} stroke={`url(#g-${uid})`} strokeOpacity=".9" strokeWidth="3" strokeLinecap="round" />
          <circle cx={sphere.cx} cy={sphere.cy} r={sphere.r} fill="none" stroke={`url(#rim-${uid})`} strokeWidth="1.5" />

          {points
            .filter((p) => p.id !== hq.id)
            .map((p) => (
              <path
                key={`arc-${p.id}`}
                d={p.arc}
                fill="none"
                stroke={`url(#g-${uid})`}
                strokeWidth={p.id === active ? 1.8 : 1}
                strokeOpacity={p.id === active ? 0.95 : 0.65}
                strokeDasharray="3 5"
                className="map-flow"
              />
            ))}

          {/* Maroc : un seul libellé pour le groupe de villes */}
          {(() => {
            const ma = points.filter((p) => p.morocco);
            if (!ma.length || ma.some((p) => p.id === active)) return null;
            const x = Math.min(...ma.map((p) => p.x)) - 14;
            const y = ma.reduce((t, p) => t + p.y, 0) / ma.length + 5;
            return (
              <text x={x} y={y} textAnchor="end" className="select-none fill-deep-soft font-sans" style={{ fontSize: 17 }}>
                {ma[0].country}
              </text>
            );
          })()}

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
                <circle cx={p.x} cy={p.y} r="16" fill="transparent" />
                {on && <circle cx={p.x} cy={p.y} r="8" fill="none" stroke={`url(#g-${uid})`} strokeWidth="1.2" className="map-ping" />}
                <circle cx={p.x} cy={p.y} r={on ? 9 : 6} fill={`url(#p-${uid})`} />
                <circle cx={p.x} cy={p.y} r={on ? 3.6 : 2.6} fill="#ffffff" stroke="#1d1b26" strokeOpacity=".3" />
                {(on || !p.morocco) && (
                  <text
                    x={p.x + (on && p.morocco ? 16 : (LABEL[p.id]?.[0] ?? 14))}
                    y={p.y + (on && p.morocco ? 5 : (LABEL[p.id]?.[1] ?? 5))}
                    textAnchor={!on || !p.morocco ? ((LABEL[p.id]?.[0] ?? 14) < 0 ? "end" : "start") : "start"}
                    className={cn("select-none font-sans", on ? "fill-deep" : "fill-deep-soft")}
                    style={{ fontSize: on ? 22 : 17, fontWeight: on ? 600 : 400 }}
                  >
                    {p.city}
                  </text>
                )}
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
          <p className="data-label mt-2 text-deep-soft">{current.coords}</p>
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
