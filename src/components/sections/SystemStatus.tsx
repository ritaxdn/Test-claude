"use client";

import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

type Row = { label: string; value: string; state: string; href?: string };

/**
 * SAV présenté comme un tableau de bord système : chaque ligne s'initialise à son tour,
 * un signal ECG continu indique que le service est « en ligne ».
 */
export function SystemStatus({ eyebrow, title, live, rows }: { eyebrow: string; title: string; live: string; rows: Row[] }) {
  const reduce = useSafeReducedMotion();
  return (
    <section className="px-3 pb-12 md:px-5 md:pb-16">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <p className="data-label text-deep-soft">{eyebrow}</p>
        <h2 className="display mt-4 max-w-3xl text-[clamp(1.6rem,3vw,2.6rem)] leading-[1] text-deep">{title}</h2>

        <div className="glass relative mt-8 overflow-hidden rounded-[1.75rem]">
          {/* En-tête du moniteur */}
          <div className="flex items-center justify-between border-b border-deep/10 px-5 py-4 md:px-8">
            <span className="data-label text-deep-soft">CELLULIFT · SAV</span>
            <span className="data-label flex items-center gap-2 text-deep">
              <span className="relative flex h-2 w-2">
                {!reduce && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />}
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {live}
            </span>
          </div>

          {/* Signal ECG continu */}
          <svg viewBox="0 0 600 40" preserveAspectRatio="none" className="h-8 w-full md:h-10" aria-hidden>
            <defs>
              <linearGradient id="status-grad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="var(--rainbow-1)" stopOpacity="0" />
                <stop offset="0.3" stopColor="var(--rainbow-2)" />
                <stop offset="0.7" stopColor="var(--rainbow-3)" />
                <stop offset="1" stopColor="var(--rainbow-5)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 20 H120 l8 -12 l8 26 l8 -18 l6 4 H300 l8 -12 l8 26 l8 -18 l6 4 H480 l8 -12 l8 26 l8 -18 l6 4 H600"
              fill="none"
              stroke="url(#status-grad)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              className={reduce ? undefined : "status-ecg"}
            />
          </svg>

          {/* Lignes du diagnostic : s'initialisent l'une après l'autre */}
          <ul className="border-t border-deep/10">
            {rows.map((r, i) => (
              <motion.li
                key={r.label}
                initial={reduce ? false : { opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-deep/10 px-5 py-4 last:border-b-0 sm:grid-cols-[12rem_1fr_auto] md:px-8"
              >
                <span className="data-label text-deep-soft">{r.label}</span>
                {r.href ? (
                  <a href={r.href} className="col-start-1 row-start-2 font-sans text-sm text-deep hover:underline sm:col-start-2 sm:row-start-1 sm:text-base">
                    {r.value}
                  </a>
                ) : (
                  <span className="col-start-1 row-start-2 font-sans text-sm text-deep sm:col-start-2 sm:row-start-1 sm:text-base">{r.value}</span>
                )}
                <span className="data-label row-span-2 flex items-center gap-2 justify-self-end text-emerald-700 sm:row-span-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {r.state}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
