"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, GraduationCap, Menu, X } from "lucide-react";
import { doctor, nav, practice, spaces } from "@/content/site";
import { navPro, proCta } from "@/content/formations";

/**
 * En-tête flottant. Deux espaces séparés :
 * - « patients » (par défaut) : soins et rendez-vous ;
 * - « pro » : pages Formations, réservées aux médecins.
 */
export function Header({ variant = "patients" }: { variant?: "patients" | "pro" }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pro = variant === "pro";
  const links = pro ? navPro : nav;
  const cta = pro ? { href: proCta.href, label: proCta.label } : { href: practice.bookingUrl, label: "Prendre rendez-vous" };
  const CtaIcon = pro ? ArrowUpRight : CalendarDays;
  const other = pro ? spaces.patients : spaces.pro;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-5">
      <div
        className={`mx-auto max-w-6xl rounded-[1.75rem] border backdrop-blur-xl transition-all duration-300 ${
          scrolled || open
            ? "border-line bg-white/85 shadow-[0_12px_40px_-20px_rgba(10,27,33,0.35)]"
            : "border-white/60 bg-white/70"
        }`}
      >
        <div className="flex h-14 items-center justify-between pl-5 pr-2">
          <Link
            href={pro ? "/formations" : "/"}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 font-display text-lg font-semibold uppercase tracking-tight"
          >
            {doctor.name}
            {pro && (
              <span className="rounded-full bg-ink px-2 py-0.5 font-sans text-[0.6rem] font-medium tracking-wide text-white">
                Formations
              </span>
            )}
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center gap-6 lg:flex">
            {links.map((item) => (
              <a key={item.href} href={item.href} className="text-[0.8rem] text-ink transition-colors hover:text-accent-deep">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href={other.href}
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-[0.75rem] text-muted transition-colors hover:text-ink xl:inline-flex"
            >
              {!pro && <GraduationCap size={14} />}
              {other.label}
            </Link>
            <a
              href={cta.href}
              className="hidden items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-medium uppercase tracking-wide text-white transition-colors hover:bg-accent-deep sm:inline-flex"
            >
              <CtaIcon size={14} /> {cta.label}
            </a>
            <button
              type="button"
              className="rounded-full p-2.5 lg:hidden"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <nav aria-label="Navigation mobile" className="border-t border-line px-5 pb-5 pt-2 lg:hidden">
            <ul>
              {links.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-line/70 py-3.5 font-display text-lg font-medium"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={cta.href}
              onClick={() => setOpen(false)}
              className="mt-5 flex items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-xs font-medium uppercase tracking-wide text-white"
            >
              <CtaIcon size={14} /> {cta.label}
            </a>
            <Link
              href={other.href}
              onClick={() => setOpen(false)}
              className="mt-3 flex items-center justify-center gap-1.5 py-2 text-sm text-muted"
            >
              {!pro && <GraduationCap size={14} />}
              {other.label}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
