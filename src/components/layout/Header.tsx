"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Cta } from "@/components/system/Cta";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState<string | null>(null);
  const pathname = usePathname();

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
    <header className="sticky top-0 z-40 w-full border-b border-deep/5 bg-pearl/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Logo locale={locale} size="sm" />

        <nav className="glass hidden items-center gap-1 rounded-full p-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 font-sans text-sm transition-colors",
                isActive(link.href)
                  ? "bg-deep text-white"
                  : "text-deep-soft hover:text-deep"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <LanguageSwitcher locale={locale} />
          <Cta href={`/${locale}/contact`} className="py-1.5 pl-4 pr-1.5 text-xs">
            {dict.nav.requestDemo}
          </Cta>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center text-deep lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-deep/10 bg-pearl/95 px-6 pb-8 pt-4 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "border-b border-deep/10 py-3.5 font-sans text-base",
                  isActive(link.href) ? "text-deep" : "text-deep-soft"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex items-center justify-between">
            <LanguageSwitcher locale={locale} />
            <Cta href={`/${locale}/contact`} className="py-1.5 pl-4 pr-1.5 text-xs">
              {dict.nav.requestDemo}
            </Cta>
          </div>
        </div>
      )}
    </header>
  );
}
