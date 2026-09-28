"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

type Pole = { key: string; title: string; text: string };

/**
 * Le système Cellulift : cinq pôles autour de la marque, reliés par un signal qui circule.
 * Au défilement, chaque pôle s'active à son tour et révèle sa phrase.
 */
export function CelluliftSystem({
  eyebrow,
  title,
  intro,
  center,
  poles,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  center: string;
  poles: readonly Pole[];
}) {
  const [active, setActive] = useState(0);
  const reduce = useSafeReducedMotion();
  const n = poles.length;
  const R = 150;
  const C = 200;
  // Pôles répartis sur le cercle, le premier en haut.
  const pos = poles.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return { x: C + R * Math.cos(a), y: C + R * Math.sin(a) };
  });
  const circumference = 2 * Math.PI * R;
  // Le signal parcourt l'anneau jusqu'au pôle actif.
  const reached = (active + 1) / n;

  return (
    <section className="px-3 py-12 md:px-5 md:py-20">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <p className="data-label text-deep-soft">{eyebrow}</p>
        <h2 className="display mt-5 max-w-3xl text-[clamp(1.9rem,4vw,3.6rem)] leading-[0.98] text-deep">{title}</h2>
        <p className="mt-5 max-w-xl font-sans text-lg leading-relaxed text-deep">{intro}</p>

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[1fr_1fr] lg:gap-16">
          {/* Le schéma : reste visible pendant qu'on fait défiler les pôles */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <svg viewBox="0 0 400 400" className="mx-auto w-full max-w-[22rem] md:max-w-[26rem]" role="img" aria-label={`${center} : ${poles.map((p) => p.title).join(", ")}`}>
              <defs>
                <linearGradient id="system-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="var(--rainbow-1)" />
                  <stop offset="0.35" stopColor="var(--rainbow-2)" />
                  <stop offset="0.7" stopColor="var(--rainbow-3)" />
                  <stop offset="1" stopColor="var(--rainbow-5)" />
                </linearGradient>
                <radialGradient id="system-core" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0.35" />
                </radialGradient>
              </defs>
              {/* Liaisons du centre vers chaque pôle */}
              {pos.map((p, i) => (
                <line
                  key={poles[i].key}
                  x1={C}
                  y1={C}
                  x2={p.x}
                  y2={p.y}
                  stroke={i <= active ? "url(#system-grad)" : "currentColor"}
                  strokeWidth={i === active ? 1.4 : 0.8}
                  className="text-deep/15 transition-all duration-700"
                  strokeDasharray="3 4"
                />
              ))}
              {/* Anneau de base + signal qui progresse vers le pôle actif */}
              <circle cx={C} cy={C} r={R} fill="none" stroke="currentColor" strokeWidth="1" className="text-deep/12" />
              <motion.circle
                cx={C}
                cy={C}
                r={R}
                fill="none"
                stroke="url(#system-grad)"
                strokeWidth="2"
                strokeLinecap="round"
                transform={`rotate(-90 ${C} ${C})`}
                strokeDasharray={circumference}
                initial={false}
                animate={{ strokeDashoffset: circumference * (1 - reached) }}
                transition={{ duration: reduce ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
              {/* Centre */}
              <circle cx={C} cy={C} r="58" fill="url(#system-core)" stroke="rgba(29,27,38,0.08)" />
              <text x={C} y={C + 5} textAnchor="middle" className="fill-deep font-[family-name:var(--font-display)] text-[15px] tracking-[0.18em]">
                {center.toUpperCase()}
              </text>
              {/* Pôles */}
              {pos.map((p, i) => {
                const on = i === active;
                const lit = i <= active;
                return (
                  <g key={poles[i].key} className="cursor-pointer" onClick={() => setActive(i)}>
                    {on && !reduce && (
                      <circle cx={p.x} cy={p.y} r="14" fill="none" stroke="url(#system-grad)" strokeWidth="1">
                        <animate attributeName="r" values="14;26" dur="1.8s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.9;0" dur="1.8s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={on ? 9 : 6}
                      fill={lit ? "url(#system-grad)" : "#fff"}
                      stroke="rgba(29,27,38,0.25)"
                      strokeWidth={lit ? 0 : 1}
                      className="transition-all duration-500"
                    />
                    <text
                      x={p.x}
                      y={p.y + (p.y < C - 10 ? -20 : 28)}
                      textAnchor="middle"
                      className={`font-[family-name:var(--font-label)] text-[11px] uppercase tracking-[0.14em] transition-colors duration-500 ${on ? "fill-deep" : "fill-deep/45"}`}
                    >
                      {poles[i].title}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Les pôles, un par un : chacun active le schéma en entrant à l'écran */}
          <ol className="border-t border-deep/15">
            {poles.map((p, i) => (
              <motion.li
                key={p.key}
                onViewportEnter={() => setActive(i)}
                viewport={{ margin: "-45% 0px -45% 0px" }}
                onClick={() => setActive(i)}
                className="grid cursor-pointer grid-cols-[2.5rem_1fr] gap-x-4 border-b border-deep/15 py-6 md:py-8"
              >
                <span className={`data-label pt-1 transition-colors duration-500 ${i === active ? "text-deep" : "text-deep-soft"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className={`display text-[clamp(1.2rem,2vw,1.7rem)] transition-colors duration-500 ${i === active ? "text-deep" : "text-deep/40"}`}>
                    {p.title}
                  </h3>
                  <p
                    className={`mt-2 max-w-md font-sans text-[0.95rem] leading-relaxed transition-all duration-500 ${
                      i === active ? "text-deep-soft opacity-100" : "text-deep-soft opacity-45"
                    }`}
                  >
                    {p.text}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
