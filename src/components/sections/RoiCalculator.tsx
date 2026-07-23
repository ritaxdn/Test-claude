"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

interface SliderCopy {
  label: string;
  unit: string;
}

export function RoiCalculator({
  eyebrow,
  title,
  description,
  sessionsCopy,
  occupancyCopy,
  resultLabel,
  disclaimer,
}: {
  eyebrow: string;
  title: string;
  description: string;
  sessionsCopy: SliderCopy;
  occupancyCopy: SliderCopy;
  resultLabel: string;
  disclaimer: string;
}) {
  const [sessions, setSessions] = useState(15);
  const [occupancy, setOccupancy] = useState(55);
  const shouldReduceMotion = useSafeReducedMotion();

  const potential = useMemo(() => {
    const headroom = 100 - occupancy;
    const value = headroom * 0.65 + sessions * 0.9;
    return Math.max(4, Math.min(96, Math.round(value)));
  }, [sessions, occupancy]);

  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        <div className="mt-14 grid grid-cols-1 gap-12 border border-hairline bg-warm-white p-8 md:p-12 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
          <div className="flex flex-col gap-10">
            <div>
              <div className="flex items-baseline justify-between">
                <label
                  htmlFor="sessions-range"
                  className="font-body text-sm font-light text-ink-soft"
                >
                  {sessionsCopy.label}
                </label>
                <span className="font-label text-ink" style={{ fontSize: "13px" }}>
                  {sessions} {sessionsCopy.unit}
                </span>
              </div>
              <input
                id="sessions-range"
                type="range"
                min={0}
                max={40}
                value={sessions}
                onChange={(e) => setSessions(Number(e.target.value))}
                className="roi-range mt-4 w-full"
              />
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <label
                  htmlFor="occupancy-range"
                  className="font-body text-sm font-light text-ink-soft"
                >
                  {occupancyCopy.label}
                </label>
                <span className="font-label text-ink" style={{ fontSize: "13px" }}>
                  {occupancy}{occupancyCopy.unit}
                </span>
              </div>
              <input
                id="occupancy-range"
                type="range"
                min={0}
                max={100}
                value={occupancy}
                onChange={(e) => setOccupancy(Number(e.target.value))}
                className="roi-range mt-4 w-full"
              />
            </div>

            <p className="font-label text-muted" style={{ fontSize: "10px", letterSpacing: "0.06em" }}>
              {disclaimer}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center border-t border-hairline pt-10 text-center lg:border-t-0 lg:border-l lg:pt-0 lg:pl-16">
            <span
              className="font-label text-muted"
              style={{ fontSize: "10px", letterSpacing: "0.2em" }}
            >
              {resultLabel.toUpperCase()}
            </span>
            <motion.span
              key={potential}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.4 }}
              className="font-heading text-gradient-rainbow mt-3 text-6xl font-light md:text-7xl"
            >
              +{potential}%
            </motion.span>
          </div>
        </div>
      </Container>
    </section>
  );
}
