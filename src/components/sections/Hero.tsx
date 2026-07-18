"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

interface HeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  locale: string;
}

export function Hero({ eyebrow, title, subtitle, ctaPrimary, ctaSecondary, locale }: HeroProps) {
  const shouldReduceMotion = useSafeReducedMotion();
  const gradientId = useId();

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: shouldReduceMotion ? 0.01 : 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(26,24,20,1) 1px, transparent 1px), linear-gradient(90deg, rgba(26,24,20,1) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <Container className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.div {...fadeUp(0)}>
            <Badge>{eyebrow}</Badge>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="font-heading mt-7 text-4xl font-light leading-[1.08] text-ink sm:text-5xl md:text-6xl lg:text-[3.75rem]"
          >
            {title}
          </motion.h1>

          <motion.p
            {...fadeUp(0.22)}
            className="font-body mt-7 max-w-lg text-base font-light leading-relaxed text-ink-soft md:text-lg"
          >
            {subtitle}
          </motion.p>

          <motion.div {...fadeUp(0.34)} className="mt-10 flex flex-wrap items-center gap-4">
            <Button href={`/${locale}/contact`} size="lg">
              {ctaPrimary}
            </Button>
            <Button href={`/${locale}/technologies`} variant="ghost" size="lg">
              {ctaSecondary}
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/5] w-full max-w-md justify-self-center rounded-[2rem] border border-hairline bg-warm-white lg:justify-self-end"
        >
          <div className="absolute -top-16 -right-10 h-56 w-56 rounded-full bg-rainbow-2/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-rainbow-4/20 blur-3xl" />

          <div className="relative flex h-full flex-col items-center justify-center gap-8 p-10">
            <svg
              width="220"
              height="60"
              viewBox="0 0 220 60"
              fill="none"
              className="overflow-visible"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="var(--rainbow-1)" />
                  <stop offset="25%" stopColor="var(--rainbow-2)" />
                  <stop offset="50%" stopColor="var(--rainbow-3)" />
                  <stop offset="75%" stopColor="var(--rainbow-4)" />
                  <stop offset="100%" stopColor="var(--rainbow-5)" />
                </linearGradient>
              </defs>
              <path
                className="ecg-path"
                style={{ animationDuration: "2.4s" }}
                d="M0 30 H60 L70 30 L80 8 L92 52 L104 16 L114 30 H140 L148 30 L156 12 L166 48 L176 30 H220"
                stroke={`url(#${gradientId})`}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Badge>CE Medical</Badge>
              <Badge>FDA</Badge>
              <Badge>ISO 13485</Badge>
            </div>

            <p
              className="font-label text-center text-muted"
              style={{ fontSize: "10px", letterSpacing: "0.18em" }}
            >
              {locale === "fr"
                ? "TECHNOLOGIE · SCIENCE · CONFIANCE"
                : "TECHNOLOGY · SCIENCE · TRUST"}
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
