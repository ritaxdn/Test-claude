"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

export function AnimatedCounter({
  value,
  suffix = "",
  duration = 1.6,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const shouldReduceMotion = useSafeReducedMotion();
  const count = useMotionValue(0);

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion) {
      if (ref.current) ref.current.textContent = `${value}${suffix}`;
      return;
    }
    const controls = animate(count, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = `${Math.round(latest)}${suffix}`;
        }
      },
    });
    return () => controls.stop();
  }, [isInView, value, suffix, duration, shouldReduceMotion, count]);

  return (
    <motion.span ref={ref} aria-label={`${value}${suffix}`}>
      0{suffix}
    </motion.span>
  );
}
