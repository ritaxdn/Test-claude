"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

export function FloatingCta({ locale, label }: { locale: Locale; label: string }) {
  const [visible, setVisible] = useState(false);
  const shouldReduceMotion = useSafeReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={`/${locale}/contact`}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-body fixed right-5 bottom-5 z-30 inline-flex items-center gap-2 rounded-full border border-light bg-ivory/90 px-5 py-3 text-sm text-ink shadow-[0_12px_32px_-12px_rgba(26,24,20,0.25)] backdrop-blur-md transition-all duration-300 hover:border-ink hover:-translate-y-0.5 md:right-8 md:bottom-8"
        >
          <CalendarDays size={16} strokeWidth={1.5} />
          {label}
        </motion.a>
      )}
    </AnimatePresence>
  );
}
