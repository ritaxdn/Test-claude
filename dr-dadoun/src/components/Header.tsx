"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { doctor, nav, practice } from "@/content/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-porcelain/90 shadow-[0_1px_0_var(--line)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 md:px-8">
        <a href="#top" className="flex flex-col leading-none" onClick={() => setOpen(false)}>
          <span className="font-display text-2xl italic tracking-tight">{doctor.name}</span>
          <span className="mt-1 text-[0.62rem] uppercase tracking-[0.3em] text-muted">
            {doctor.title}
          </span>
        </a>

        <nav aria-label="Navigation principale" className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-ink-soft transition-colors hover:text-rose-deep"
            >
              {item.label}
            </a>
          ))}
          <a
            href={practice.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-porcelain transition-colors hover:bg-rose-deep"
          >
            Prendre rendez-vous
          </a>
        </nav>

        <button
          type="button"
          className="-mr-2 p-2 lg:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav
          aria-label="Navigation mobile"
          className="border-t border-line bg-porcelain px-5 pb-8 pt-4 lg:hidden"
        >
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line/70 py-4 font-display text-xl"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={practice.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block rounded-full bg-ink py-3.5 text-center text-sm font-medium text-porcelain"
          >
            Prendre rendez-vous
          </a>
        </nav>
      )}
    </header>
  );
}
