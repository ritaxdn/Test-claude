"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { NavOverlay } from "./NavOverlay";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (lastPathname !== null) setOpen(false);
  }

  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/technologies`, label: dict.nav.technologies },
    { href: `/${locale}/academy`, label: dict.nav.academy },
    { href: `/${locale}/support`, label: dict.nav.support },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  const isActive = (href: string) =>
    href === `/${locale}` ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          scrolled ? "bg-ivory/90 backdrop-blur-md border-b border-hairline" : "bg-transparent"
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <Logo locale={locale} size="sm" />

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group flex items-center gap-3"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <span
              className="font-label text-ink transition-colors"
              style={{ fontSize: "11px", letterSpacing: "0.2em" }}
            >
              {locale === "fr" ? "MENU" : "MENU"}
            </span>
            <span className="relative flex h-9 w-9 flex-col items-center justify-center gap-[5px] border border-hairline">
              <span className="h-px w-4 bg-ink transition-transform duration-300 group-hover:translate-x-0.5" />
              <span className="h-px w-4 bg-ink transition-transform duration-300 group-hover:-translate-x-0.5" />
            </span>
          </button>
        </div>
      </header>

      <NavOverlay
        open={open}
        onClose={() => setOpen(false)}
        links={links}
        isActive={isActive}
        locale={locale}
        dict={dict}
      />
    </>
  );
}
