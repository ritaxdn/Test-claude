"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a numeric value from 0 to `end` once the returned ref enters the
 * viewport. Non-numeric characters in `end` (e.g. "40+", "24h") are kept as
 * a suffix/prefix around the animated digits.
 */
export function useCountUp(rawValue: string, durationMs = 1400) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(() => rawValue.replace(/\d+/, "0"));

  useEffect(() => {
    const match = rawValue.match(/\d+/);
    const el = ref.current;
    if (!match || !el) {
      queueMicrotask(() => setDisplay(rawValue));
      return;
    }

    const target = Number(match[0]);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      queueMicrotask(() => setDisplay(rawValue));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / durationMs, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * eased);
          setDisplay(rawValue.replace(/\d+/, String(current)));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rawValue, durationMs]);

  return { ref, display };
}
