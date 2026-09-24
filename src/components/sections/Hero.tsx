"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { Marquee } from "@/components/ui/Marquee";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { GridBackdrop } from "@/components/visuals/GridBackdrop";
import { CircuitLines } from "@/components/visuals/CircuitLines";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

interface HeroProps {
  eyebrow: string;
  titleLines: string[];
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  locale: string;
}

const certifications = ["CE MEDICAL", "FDA", "ISO 13485", "COFRAC"];

export function Hero({
  eyebrow,
  titleLines,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  locale,
}: HeroProps) {
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <section className="isolate relative overflow-hidden border-b border-hairline">
      <GridBackdrop className="pointer-events-none absolute inset-0 -z-20" />
      <CircuitLines className="pointer-events-none absolute top-0 right-0 -z-10 h-full w-1/2 text-ink opacity-[0.06]" />

      {/* Oversized outlined wordmark bleeding off the top edge */}
      <div
        className="pointer-events-none absolute -top-[6vw] left-1/2 -z-10 w-[160vw] -translate-x-1/2 text-center text-outline select-none"
        style={
          {
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "26vw",
            letterSpacing: "-0.04em",
            "--outline-color": "rgba(26, 24, 20, 0.07)",
          } as React.CSSProperties
        }
        aria-hidden="true"
      >
        CELLULIFT
      </div>

      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-y-10 px-6 pt-16 pb-20 md:grid-cols-12 md:px-10 md:pt-24 md:pb-28">
        <div className="md:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            className="flex items-center gap-3 md:flex-col md:items-start md:gap-4"
          >
            <span className="h-px w-8 bg-ink md:h-16 md:w-px" />
            <span
              className="font-label whitespace-nowrap text-muted md:[writing-mode:vertical-rl]"
              style={{ fontSize: "11px", letterSpacing: "0.2em" }}
            >
              {eyebrow.toUpperCase()}
            </span>
          </motion.div>
        </div>

        <div className="relative md:col-span-8 md:col-start-2">
          <SplitReveal lines={titleLines} className="text-display-1 text-ink" />

          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease: [0.19, 1, 0.22, 1] }}
            className="glass mt-8 inline-flex items-center gap-3 rounded-full px-5 py-3 md:absolute md:-right-6 md:bottom-0 md:mt-0 md:translate-y-1/2"
          >
            <Sparkles size={16} className="text-gradient-rainbow shrink-0" />
            <span className="font-label text-ink" style={{ fontSize: "11px", letterSpacing: "0.1em" }}>
              METAMORPHOSIS TECHNOLOGY
            </span>
          </motion.div>
        </div>

        <div className="flex flex-col gap-8 md:col-span-4 md:col-start-9 md:mt-[8vw] md:items-end md:text-right">
          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.19, 1, 0.22, 1] }}
            className="font-body max-w-sm text-base font-light leading-relaxed text-ink-soft md:text-lg"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="flex flex-wrap items-center gap-4 md:flex-col md:items-end md:gap-3"
          >
            <Magnetic>
              <Button href={`/${locale}/contact`} size="lg">
                {ctaPrimary}
              </Button>
            </Magnetic>
            <Button href={`/${locale}/technologies`} variant="text">
              {ctaSecondary} →
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="glass relative border-x-0 border-b-0 py-5">
        <Marquee>
          {certifications.map((cert) => (
            <span
              key={cert}
              className="font-label flex items-center gap-16 text-muted"
              style={{ fontSize: "11px", letterSpacing: "0.15em" }}
            >
              {cert}
              <span className="h-1 w-1 rounded-full bg-current" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
