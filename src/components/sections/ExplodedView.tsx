"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

type Part = { src: string; code: string; title: string; text: string; x: number; y: number };

/**
 * Vue éclatée (SAV) : la machine au centre, ses pièces s'en détachent au défilement,
 * reliées par un tracé irisé — l'atelier Cellulift connaît chaque composant.
 * Positions des pièces en % de la scène (centre = 50 / 50).
 */
export function ExplodedView({
  eyebrow,
  title,
  intro,
  machine,
  machineAlt,
  parts,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  machine: string;
  machineAlt: string;
  parts: Part[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.4 });
  // 0 → 0.15 : machine seule ; 0.15 → 0.75 : les pièces s'écartent ; puis tout reste ouvert.
  const open = useTransform(smooth, [0.12, 0.72], [0, 1], { clamp: true });
  const progress = reduce ? undefined : open;

  return (
    <section className="px-3 md:px-5">
      {/* Grand écran : scène collante, pilotée par le défilement */}
      <div ref={ref} className="relative mx-auto hidden h-[260vh] max-w-7xl md:block">
        <div className="sticky top-0 flex h-screen flex-col justify-center px-3 pt-24 md:px-7">
          <Header eyebrow={eyebrow} title={title} intro={intro} />
          <div className="relative mt-6 h-[58vh] min-h-[420px] w-full">
            {/* Tracés du centre vers chaque pièce */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              <defs>
                <linearGradient id="exploded-grad" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="var(--rainbow-1)" />
                  <stop offset="0.5" stopColor="var(--rainbow-2)" />
                  <stop offset="1" stopColor="var(--rainbow-3)" />
                </linearGradient>
              </defs>
              {parts.map((p) => (
                <Leader key={p.code} x={p.x} y={p.y} open={progress} />
              ))}
            </svg>

            {/* Machine */}
            <div className="absolute left-1/2 top-1/2 aspect-square h-[82%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.75rem] bg-[#0b0d14] shadow-[0_30px_80px_-40px_rgba(29,27,38,0.6)]">
              <Image src={machine} alt={machineAlt} fill sizes="34vw" className="object-cover" />
            </div>

            {/* Pièces */}
            {parts.map((p, i) => (
              <PartCard key={p.code} part={p} index={i} open={progress} />
            ))}
          </div>
        </div>
      </div>

      {/* Téléphone : machine puis pièces, sans scène collante */}
      <div className="mx-auto max-w-7xl px-3 py-12 md:hidden">
        <Header eyebrow={eyebrow} title={title} intro={intro} />
        <div className="relative mt-6 aspect-square w-full overflow-hidden rounded-[1.5rem] bg-[#0b0d14]">
          <Image src={machine} alt={machineAlt} fill sizes="100vw" className="object-cover" />
        </div>
        <ul className="mt-3 grid grid-cols-1 gap-3">
          {parts.map((p, i) => (
            <motion.li
              key={p.code}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="glass flex items-center gap-4 rounded-[1.25rem] p-3"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[0.9rem] bg-[#0b0d14]">
                <Image src={p.src} alt={p.title} fill sizes="80px" className="object-cover" />
              </div>
              <div>
                <p className="data-label text-deep-soft">{p.code}</p>
                <p className="mt-1 font-sans text-sm font-medium text-deep">{p.title}</p>
                <p className="mt-0.5 font-sans text-xs text-deep-soft">{p.text}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Header({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <div>
      <p className="data-label text-deep-soft">{eyebrow}</p>
      <h2 className="display mt-4 max-w-3xl text-[clamp(1.6rem,3vw,2.6rem)] leading-[1] text-deep">{title}</h2>
      <p className="mt-3 max-w-xl font-sans leading-relaxed text-deep-soft">{intro}</p>
    </div>
  );
}

function Leader({ x, y, open }: { x: number; y: number; open?: MotionValue<number> }) {
  const d = `M50 50 L${x} ${y}`;
  return (
    <>
      <path d={d} stroke="rgba(29,27,38,0.1)" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="3 4" fill="none" />
      <motion.path
        d={d}
        stroke="url(#exploded-grad)"
        strokeWidth="1.4"
        vectorEffect="non-scaling-stroke"
        fill="none"
        style={{ pathLength: open ?? 1, opacity: open ?? 1 }}
      />
    </>
  );
}

function PartCard({ part, index, open }: { part: Part; index: number; open?: MotionValue<number> }) {
  // Chaque pièce part du centre (cachée derrière la machine) vers sa position, avec un léger décalage.
  const fallback = useTransform(() => 1);
  const o = open ?? fallback;
  const start = index * 0.08;
  const t = useTransform(o, [start, Math.min(1, start + 0.7)], [0, 1], { clamp: true });
  const left = useTransform(t, (v) => `${50 + (part.x - 50) * v}%`);
  const top = useTransform(t, (v) => `${50 + (part.y - 50) * v}%`);
  const scale = useTransform(t, [0, 1], [0.55, 1]);
  const opacity = useTransform(t, [0, 0.25, 1], [0, 1, 1]);
  return (
    <motion.div
      style={{ left, top, scale, opacity }}
      className="glass absolute z-10 w-[18%] max-w-[15rem] -translate-x-1/2 -translate-y-1/2 rounded-[1.1rem] p-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[0.75rem] bg-[#0b0d14]">
        <Image src={part.src} alt={part.title} fill sizes="18vw" className="object-cover" />
      </div>
      <div className="px-1 pb-0.5 pt-2">
        <p className="data-label text-deep-soft">{part.code}</p>
        <p className="mt-0.5 font-sans text-sm font-medium text-deep">{part.title}</p>
        <p className="mt-0.5 font-sans text-[0.7rem] leading-snug text-deep-soft">{part.text}</p>
      </div>
    </motion.div>
  );
}
