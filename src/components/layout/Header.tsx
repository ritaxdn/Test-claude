"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState<string | null>(null);
  const pathname = usePathname();
  const shouldReduceMotion = useSafeReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (lastPathname !== null) setOpen(false);
  }

  const links = [
    { href: `/${locale}#machines`, label: dict.nav.machines },
    { href: `/${locale}/technologies`, label: dict.nav.technologies },
    { href: `/${locale}#metiers`, label: dict.nav.metiers },
    { href: `/${locale}/academy`, label: dict.nav.academy },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled || open
          ? "bg-ivory/90 backdrop-blur-md border-b border-hairline"
          : "bg-transparent"
      )}
    >
      <div className="relative z-50 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Logo locale={locale} size="sm" />

        <div className="flex items-center gap-5">
          <div className="hidden items-center gap-5 lg:flex">
            <LanguageSwitcher locale={locale} />
            <Button href={`/${locale}/contact`} size="sm">
              {dict.nav.requestDemo}
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="group flex items-center gap-3 text-ink"
            aria-label={open ? dict.nav.close : dict.nav.menu}
            aria-expanded={open}
          >
            <span className="font-label" style={{ fontSize: "11px", letterSpacing: "0.16em" }}>
              {open ? dict.nav.close : dict.nav.menu}
            </span>
            <span className="relative flex h-4 w-6 flex-col items-end justify-between">
              <span
                className={cn(
                  "block h-[1.5px] bg-ink transition-all duration-300",
                  open ? "w-6 translate-y-[7px] rotate-45" : "w-6"
                )}
              />
              <span
                className={cn(
                  "block h-[1.5px] bg-ink transition-all duration-300",
                  open ? "w-6 -translate-y-[7px] -rotate-45" : "w-4 group-hover:w-6"
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.3 }}
            className="fixed inset-0 top-0 z-40 h-dvh w-full bg-ivory"
          >
            <div className="mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-6 pt-28 pb-10 md:px-10">
              <nav className="flex flex-col">
                {links.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: shouldReduceMotion ? 0.01 : 0.6,
                      delay: shouldReduceMotion ? 0 : 0.05 + i * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="border-b border-hairline"
                  >
                    <Link
                      href={link.href}
                      className="font-heading group flex items-center justify-between gap-6 py-4 text-4xl font-light text-ink transition-colors hover:text-ink-soft sm:py-5 sm:text-5xl md:text-6xl"
                    >
                      <span className="flex items-baseline gap-5">
                        <span
                          className="font-label text-muted"
                          style={{ fontSize: "11px", letterSpacing: "0.14em" }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {link.label}
                      </span>
                      <ArrowUpRight
                        size={28}
                        strokeWidth={1}
                        className="shrink-0 text-muted opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-ink group-hover:opacity-100"
                      />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: shouldReduceMotion ? 0.01 : 0.6, delay: 0.4 }}
                className="flex flex-col items-start gap-6 pt-10 sm:flex-row sm:items-center sm:justify-between"
              >
                <LanguageSwitcher locale={locale} />
                <Button href={`/${locale}/contact`} size="md">
                  {dict.nav.requestDemo}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
