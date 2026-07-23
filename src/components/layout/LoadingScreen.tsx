"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const shouldReduceMotion = useSafeReducedMotion();
  const gradientId = useId();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), shouldReduceMotion ? 0 : 1300);
    return () => clearTimeout(timer);
  }, [shouldReduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ivory"
          aria-hidden="true"
        >
          <svg width="220" height="56" viewBox="0 0 220 56" fill="none" className="overflow-visible">
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
              style={{ animationDuration: "1.1s" }}
              d="M0 28 H64 L74 28 L84 6 L98 50 L112 12 L124 28 H150 L158 28 L168 8 L180 46 L190 28 H220"
              stroke={`url(#${gradientId})`}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
