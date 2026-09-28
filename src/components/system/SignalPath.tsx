"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

/**
 * Le dégradé Cellulift comme signal, jamais comme décor :
 * une ligne qui s'active quand son contenu entre à l'écran.
 */
export function SignalLine({ delay = 0, className = "" }: { delay?: number; className?: string }) {
  const reduce = useSafeReducedMotion();
  return (
    <motion.span
      aria-hidden
      className={`block h-px origin-left bg-[image:var(--gradient-rainbow)] ${className}`}
      initial={{ scaleX: reduce ? 1 : 0, opacity: reduce ? 1 : 0.4 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

/**
 * Parcours en étapes (Installation → Formation → Protocoles → Maîtrise) :
 * un tracé ECG qui progresse au défilement et active chaque étape au passage.
 */
export function ProtocolPath({ steps }: { steps: readonly string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const drawn = useTransform(progress, (v) => (reduce ? 1 : v));

  // Tracé : ligne de base avec une impulsion ECG à chaque étape.
  const n = steps.length;
  const w = 1000;
  const seg = w / n;
  let d = "M0 30";
  for (let i = 0; i < n; i++) {
    const x = seg * i + seg / 2;
    d += ` L${x - 26} 30 L${x - 16} 30 L${x - 10} 12 L${x - 2} 48 L${x + 6} 4 L${x + 13} 30 L${x + 26} 30`;
  }
  d += ` L${w} 30`;

  return (
    <div ref={ref}>
      <svg viewBox={`0 0 ${w} 52`} preserveAspectRatio="none" className="h-10 w-full overflow-visible md:h-12" aria-hidden>
        <defs>
          <linearGradient id="protocol-grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="var(--rainbow-1)" />
            <stop offset="0.35" stopColor="var(--rainbow-2)" />
            <stop offset="0.65" stopColor="var(--rainbow-3)" />
            <stop offset="1" stopColor="var(--rainbow-5)" />
          </linearGradient>
        </defs>
        <path d={d} fill="none" stroke="currentColor" strokeWidth="1" className="text-deep/15" vectorEffect="non-scaling-stroke" />
        <motion.path
          d={d}
          fill="none"
          stroke="url(#protocol-grad)"
          strokeWidth="1.6"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: drawn }}
        />
      </svg>
      <ol className="mt-3 grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {steps.map((s, i) => (
          <Step key={s} index={i} total={n} label={s} progress={drawn} />
        ))}
      </ol>
    </div>
  );
}

function Step({
  index,
  total,
  label,
  progress,
}: {
  index: number;
  total: number;
  label: string;
  progress: ReturnType<typeof useTransform<number, number>>;
}) {
  // L'étape s'allume quand le tracé atteint son impulsion.
  const at = (index + 0.5) / total;
  const opacity = useTransform(progress, [at - 0.08, at], [0.35, 1]);
  return (
    <motion.li style={{ opacity }} className="text-center">
      <span className="data-label block text-deep-soft">{String(index + 1).padStart(2, "0")}</span>
      <span className="mt-1 block font-sans text-sm font-medium text-deep sm:text-base">{label}</span>
    </motion.li>
  );
}

/** Petite impulsion ECG qui se trace sous un chiffre clé, à son apparition. */
export function PulseMark({ delay = 0, className = "" }: { delay?: number; className?: string }) {
  const reduce = useSafeReducedMotion();
  return (
    <svg viewBox="0 0 120 20" className={`h-4 w-24 overflow-visible ${className}`} aria-hidden>
      <defs>
        <linearGradient id="pulse-grad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--rainbow-1)" />
          <stop offset="0.5" stopColor="var(--rainbow-2)" />
          <stop offset="1" stopColor="var(--rainbow-3)" />
        </linearGradient>
      </defs>
      <motion.path
        d="M0 12 H46 L52 4 L58 19 L64 1 L70 12 H120"
        fill="none"
        stroke="url(#pulse-grad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0.3 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.2, delay, ease: [0.45, 0, 0.2, 1] }}
      />
    </svg>
  );
}
