"use client";

import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { machines } from "@/content/machines";
import { categories, type CategoryKey } from "@/content/technologies";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

const dotAccents = [1, 2, 3, 4, 5] as const;
const accentVar = (n: number) => `var(--rainbow-${n})`;

export function FlagshipMachines({
  locale,
  eyebrow,
  title,
  description,
  allLabel,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  description: string;
  allLabel: string;
}) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey | "all">("all");
  const gradientId = useId();
  const shouldReduceMotion = useSafeReducedMotion();

  const filtered = useMemo(
    () => (activeCategory === "all" ? machines : machines.filter((m) => m.category === activeCategory)),
    [activeCategory]
  );

  const [activeSlug, setActiveSlug] = useState(filtered[0]?.slug ?? machines[0].slug);
  const active = filtered.find((m) => m.slug === activeSlug) ?? filtered[0] ?? machines[0];
  const activeIndex = machines.findIndex((m) => m.slug === active.slug);
  const accent = dotAccents[activeIndex % dotAccents.length];

  const categoryKeys = Object.keys(categories) as CategoryKey[];

  function selectCategory(key: CategoryKey | "all") {
    setActiveCategory(key);
    const nextList = key === "all" ? machines : machines.filter((m) => m.category === key);
    if (nextList[0]) setActiveSlug(nextList[0].slug);
  }

  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        <div className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => selectCategory("all")}
            className={cn(
              "font-label rounded-full border px-4 py-2 transition-colors",
              activeCategory === "all"
                ? "border-ink bg-ink text-warm-white"
                : "border-light text-ink-soft hover:border-ink hover:text-ink"
            )}
            style={{ fontSize: "11px", letterSpacing: "0.08em" }}
          >
            {allLabel}
          </button>
          {categoryKeys.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => selectCategory(key)}
              className={cn(
                "font-label rounded-full border px-4 py-2 transition-colors",
                activeCategory === key
                  ? "border-ink bg-ink text-warm-white"
                  : "border-light text-ink-soft hover:border-ink hover:text-ink"
              )}
              style={{ fontSize: "11px", letterSpacing: "0.08em" }}
            >
              {categories[key][locale]}
            </button>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] border border-hairline bg-warm-white">
              <div
                className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full opacity-25 blur-3xl transition-colors duration-500"
                style={{ backgroundColor: accentVar(accent) }}
              />
              <div
                className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full opacity-20 blur-3xl transition-colors duration-500"
                style={{ backgroundColor: accentVar(accent) }}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.slug}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -16 }}
                  transition={{ duration: shouldReduceMotion ? 0.01 : 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex h-full flex-col items-center justify-center gap-6 p-10 text-center"
                >
                  <span
                    className="font-label text-muted"
                    style={{ fontSize: "10px", letterSpacing: "0.2em" }}
                  >
                    {String(activeIndex + 1).padStart(2, "0")} / {String(machines.length).padStart(2, "0")}
                  </span>
                  <h3 className="font-heading text-4xl font-light text-ink md:text-5xl">
                    {active.name}
                  </h3>

                  <svg width="180" height="40" viewBox="0 0 180 40" fill="none" className="overflow-visible" aria-hidden="true">
                    <defs>
                      <linearGradient id={gradientId} x1="0" y1="0" x2="180" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="var(--rainbow-1)" />
                        <stop offset="25%" stopColor="var(--rainbow-2)" />
                        <stop offset="50%" stopColor="var(--rainbow-3)" />
                        <stop offset="75%" stopColor="var(--rainbow-4)" />
                        <stop offset="100%" stopColor="var(--rainbow-5)" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 20 H36 L42 20 L48 6 L56 34 L64 12 L70 20 H110 L116 20 L122 8 L130 32 H180"
                      stroke={`url(#${gradientId})`}
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <p className="font-body max-w-xs text-sm font-light leading-relaxed text-ink-soft">
                    {active.tagline[locale]}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {active.certifications.map((cert) => (
                      <Badge key={cert}>{cert}</Badge>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.dl
                key={`${active.slug}-specs`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: shouldReduceMotion ? 0.01 : 0.4, delay: 0.1 }}
                className="mt-6 grid grid-cols-1 gap-px overflow-hidden border border-hairline bg-[rgba(26,24,20,0.08)] sm:grid-cols-3"
              >
                {active.specs.map((spec, i) => (
                  <div key={spec.label[locale]} className="bg-warm-white p-5">
                    <dt
                      className="font-label flex items-center gap-2 text-muted"
                      style={{ fontSize: "9px", letterSpacing: "0.14em" }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: accentVar(dotAccents[i % dotAccents.length]) }}
                      />
                      {spec.label[locale].toUpperCase()}
                    </dt>
                    <dd className="font-heading mt-2 text-base font-light text-ink">
                      {spec.value[locale]}
                    </dd>
                  </div>
                ))}
              </motion.dl>
            </AnimatePresence>
          </div>

          <ul className="flex flex-col divide-y divide-[rgba(26,24,20,0.08)] border-y border-hairline">
            {filtered.map((machine, i) => {
              const isActive = machine.slug === active.slug;
              return (
                <li key={machine.slug}>
                  <button
                    type="button"
                    onClick={() => setActiveSlug(machine.slug)}
                    className={cn(
                      "group flex w-full items-center justify-between gap-6 py-6 text-left transition-colors",
                      isActive ? "text-ink" : "text-ink-soft hover:text-ink"
                    )}
                  >
                    <span className="flex items-center gap-5">
                      <span
                        className="font-label text-muted"
                        style={{ fontSize: "10px", letterSpacing: "0.12em" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-heading text-2xl font-light md:text-3xl">
                        {machine.name}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "hidden max-w-[14rem] font-body text-sm font-light leading-snug text-ink-soft transition-opacity sm:block",
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                      )}
                    >
                      {machine.tagline[locale]}
                    </span>
                  </button>
                  {isActive && (
                    <motion.div
                      layoutId="flagship-underline"
                      className="h-[2px] w-full bg-gradient-rainbow opacity-60"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
