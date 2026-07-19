"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { testimonials } from "@/content/stats";
import type { Locale } from "@/lib/i18n/config";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import { cn } from "@/lib/utils";

export function Testimonials({
  locale,
  eyebrow,
  title,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useSafeReducedMotion();
  const current = testimonials[index];

  useEffect(() => {
    if (shouldReduceMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(id);
  }, [shouldReduceMotion]);

  return (
    <section className="py-28 md:py-40">
      <Container className="grid grid-cols-1 gap-12 md:grid-cols-12">
        <div className="md:col-span-3">
          <span
            className="font-label text-muted"
            style={{ fontSize: "11px", letterSpacing: "0.2em" }}
          >
            {eyebrow.toUpperCase()}
          </span>
          <h2 className="font-heading mt-4 text-2xl font-light leading-tight text-ink md:text-3xl">
            {title}
          </h2>

          <div className="mt-10 hidden gap-3 md:flex">
            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
              className="flex h-11 w-11 items-center justify-center border border-hairline text-ink transition-colors hover:border-ink"
              aria-label="Previous testimonial"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
              className="flex h-11 w-11 items-center justify-center border border-hairline text-ink transition-colors hover:border-ink"
              aria-label="Next testimonial"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="relative md:col-span-8 md:col-start-5">
          <span
            className="font-heading text-outline -mb-6 block md:-mb-10"
            style={
              {
                fontSize: "clamp(6rem, 5rem + 6vw, 13rem)",
                lineHeight: 1,
                "--outline-color": "rgba(26, 24, 20, 0.35)",
              } as React.CSSProperties
            }
            aria-hidden="true"
          >
            &ldquo;
          </span>

          <div className="relative min-h-[220px] md:min-h-[180px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.author}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -16 }}
                transition={{ duration: shouldReduceMotion ? 0.01 : 0.6, ease: [0.19, 1, 0.22, 1] }}
                className="absolute inset-0"
              >
                <p className="font-heading -mt-6 text-2xl leading-snug font-light text-ink sm:text-3xl md:text-4xl">
                  {current.quote[locale]}
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <span className="h-px w-10 bg-ink" />
                  <div>
                    <p className="font-body text-sm text-ink">{current.author}</p>
                    <p
                      className="font-label text-muted"
                      style={{ fontSize: "10px", letterSpacing: "0.1em" }}
                    >
                      {current.role[locale].toUpperCase()}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.author}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${t.author}`}
                aria-current={i === index}
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  i === index ? "w-8 bg-ink" : "w-4 bg-light"
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
