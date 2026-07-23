"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { timeline } from "@/content/timeline";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

export function Timeline({
  locale,
  eyebrow,
  title,
  description,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  description: string;
}) {
  const [activeYear, setActiveYear] = useState(timeline[timeline.length - 1].year);
  const active = timeline.find((m) => m.year === activeYear) ?? timeline[0];
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <section className="bg-ivory-2 py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        <div className="mt-16">
          <div className="relative">
            <div className="absolute top-[13px] right-0 left-0 hidden h-[1.5px] bg-gradient-rainbow opacity-40 md:block" />
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 md:flex md:items-start md:justify-between md:gap-2">
              {timeline.map((milestone) => {
                const isActive = milestone.year === activeYear;
                return (
                  <button
                    key={milestone.year}
                    type="button"
                    onClick={() => setActiveYear(milestone.year)}
                    className="group relative flex flex-col items-start gap-3 text-left md:items-center md:text-center"
                  >
                    <span
                      className={cn(
                        "relative z-10 h-[7px] w-[7px] rounded-full border transition-all duration-300 md:mx-auto",
                        isActive
                          ? "scale-150 border-transparent bg-gradient-rainbow"
                          : "border-light bg-ivory-2 group-hover:border-ink"
                      )}
                    />
                    <span
                      className={cn(
                        "font-label transition-colors",
                        isActive ? "text-ink" : "text-muted group-hover:text-ink-soft"
                      )}
                      style={{ fontSize: "12px", letterSpacing: "0.1em" }}
                    >
                      {milestone.year}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-10 min-h-[9rem] border-t border-hairline pt-8 md:mt-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.year}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -14 }}
                transition={{ duration: shouldReduceMotion ? 0.01 : 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl"
              >
                <h3 className="font-heading text-2xl font-light text-ink md:text-3xl">
                  <span className="text-gradient-rainbow">{active.year}</span>{" "}
                  <span className="italic">{active.title[locale]}</span>
                </h3>
                <p className="font-body mt-4 text-base font-light leading-relaxed text-ink-soft">
                  {active.description[locale]}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
