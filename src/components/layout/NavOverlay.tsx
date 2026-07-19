"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface NavLink {
  href: string;
  label: string;
}

export function NavOverlay({
  open,
  onClose,
  links,
  isActive,
  locale,
  dict,
}: {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  isActive: (href: string) => boolean;
  locale: Locale;
  dict: Dictionary;
}) {
  useEffect(() => {
    if (open) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="fixed inset-0 z-50 flex flex-col bg-ink text-warm-white"
        >
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-10">
            <span
              className="font-label text-light"
              style={{ fontSize: "11px", letterSpacing: "0.2em" }}
            >
              CELLULIFT — {locale === "fr" ? "INDEX" : "INDEX"}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center text-warm-white transition-transform hover:rotate-90"
              style={{ transitionDuration: "300ms" }}
            >
              <X size={24} />
            </button>
          </div>

          <nav className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 md:px-10">
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.15 + i * 0.06,
                  ease: [0.19, 1, 0.22, 1],
                }}
                className="border-b border-white/10"
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="group flex items-baseline gap-5 py-4 md:py-5"
                >
                  <span
                    className={cn(
                      "font-label shrink-0 transition-colors",
                      isActive(link.href) ? "text-gradient-rainbow" : "text-light"
                    )}
                    style={{ fontSize: "12px", letterSpacing: "0.1em" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "font-heading text-4xl font-light transition-all duration-300 group-hover:translate-x-3 sm:text-5xl md:text-6xl",
                      isActive(link.href) ? "text-warm-white" : "text-light group-hover:text-warm-white"
                    )}
                  >
                    {link.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
            <div className="[&_a]:text-light [&_a[aria-current]]:text-warm-white">
              <LanguageSwitcher locale={locale} />
            </div>
            <Button href={`/${locale}/contact`} onClick={onClose} variant="inverse">
              {dict.nav.requestDemo}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
