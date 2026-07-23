"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Stethoscope, Building2, Flower2, Activity, Gem, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { metiers, type MetierKey } from "@/content/metiers";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

const icons: Record<MetierKey, typeof Stethoscope> = {
  medecin: Stethoscope,
  clinique: Building2,
  spa: Flower2,
  kine: Activity,
  institut: Gem,
};

export function MetierSelector({
  locale,
  eyebrow,
  title,
  description,
  cta,
  contactHref,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  contactHref: string;
}) {
  const [active, setActive] = useState<MetierKey>("medecin");
  const profile = metiers.find((m) => m.key === active) ?? metiers[0];
  const Icon = icons[active];
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        <div className="mt-12 flex flex-wrap gap-3">
          {metiers.map((m) => {
            const ItemIcon = icons[m.key];
            const isActive = m.key === active;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setActive(m.key)}
                className={cn(
                  "font-body inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition-colors",
                  isActive
                    ? "border-ink bg-ink text-warm-white"
                    : "border-light text-ink-soft hover:border-ink hover:text-ink"
                )}
              >
                <ItemIcon size={15} strokeWidth={1.5} />
                {m.label[locale]}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -16 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 grid grid-cols-1 gap-10 border border-hairline bg-warm-white p-8 md:p-12 lg:grid-cols-[auto_1fr]"
          >
            <div className="flex lg:items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-hairline">
                <Icon size={24} strokeWidth={1.5} className="text-rainbow-2" />
              </div>
            </div>

            <div>
              <h3 className="font-heading text-2xl font-light text-ink md:text-3xl">
                {profile.title[locale]}
              </h3>
              <p className="font-body mt-4 max-w-xl text-base font-light leading-relaxed text-ink-soft">
                {profile.description[locale]}
              </p>

              <ul className="mt-7 flex flex-wrap gap-3">
                {profile.focus.map((f) => (
                  <li
                    key={f[locale]}
                    className="font-label border border-light px-3 py-1.5 text-muted"
                    style={{ fontSize: "10px", letterSpacing: "0.1em" }}
                  >
                    {f[locale].toUpperCase()}
                  </li>
                ))}
              </ul>

              <a
                href={contactHref}
                className="mt-8 inline-flex items-center gap-2 font-body text-sm text-ink transition-transform duration-300 hover:translate-x-1"
              >
                {cta}
                <ArrowUpRight size={16} />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}
