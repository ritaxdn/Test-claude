"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { Marquee } from "@/components/ui/Marquee";
import { SplitReveal } from "@/components/ui/SplitReveal";
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
    <section className="relative overflow-hidden border-b border-hairline">
      {/* Oversized outlined wordmark bleeding off the top edge */}
      <div
        className="pointer-events-none absolute -top-[6vw] left-1/2 -z-10 w-[160vw] -translate-x-1/2 text-center text-outline select-none"
        style={
          {
            fontFamily: "var(--font-heading)",
            fontSize: "26vw",
            letterSpacing: "-0.03em",
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

        <div className="md:col-span-8 md:col-start-2">
          <SplitReveal
            lines={titleLines}
            className="text-display-1 text-ink"
          />
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

      <div className="relative border-t border-hairline py-5">
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
