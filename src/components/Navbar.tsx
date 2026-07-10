"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { CONTACT } from "@/lib/data/contact";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/a-propos", label: "À propos" },
  { href: "/certifications", label: "Certifications" },
  { href: "/ressources", label: "Ressources" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catalogueOpen, setCatalogueOpen] = useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
    setCatalogueOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-paper/90 backdrop-blur-md">
      <div className="container-cl flex h-18 items-center justify-between py-4">
        <Link
          href="/"
          className="font-display text-xl tracking-[0.08em] text-ink"
          onClick={() => trackEvent("cta_click", { cta: "logo_home" })}
        >
          CELLULIFT
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navigation principale">
          <div
            className="relative"
            onMouseEnter={() => setCatalogueOpen(true)}
            onMouseLeave={() => setCatalogueOpen(false)}
          >
            <button
              className="flex items-center gap-1 text-sm font-medium tracking-wide text-ink-soft transition-colors duration-fast hover:text-bronze"
              aria-expanded={catalogueOpen}
              aria-haspopup="true"
              onClick={() => setCatalogueOpen((v) => !v)}
            >
              Catalogue
              <ChevronDown className="h-4 w-4" aria-hidden />
            </button>

            {catalogueOpen && (
              <div className="absolute left-1/2 top-full z-50 w-[640px] -translate-x-1/2 pt-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 rounded-lg border border-border bg-paper p-6 shadow-xl shadow-black/5">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/catalogue/${category.slug}`}
                      className="rounded-md px-3 py-2.5 text-sm text-ink-soft transition-colors duration-fast hover:bg-paper-alt hover:text-bronze-dark"
                    >
                      <span className="block font-medium text-ink">{category.name}</span>
                      <span className="mt-0.5 block text-xs text-graphite-soft">
                        {category.shortDescription}
                      </span>
                    </Link>
                  ))}
                  <Link
                    href="/catalogue"
                    className="col-span-2 mt-2 rounded-md border border-border px-3 py-2.5 text-center text-sm font-medium text-bronze-dark transition-colors duration-fast hover:bg-paper-alt"
                  >
                    Voir tout le catalogue →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium tracking-wide text-ink-soft transition-colors duration-fast hover:text-bronze",
                pathname === link.href && "text-bronze-dark"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={CONTACT.phoneHref}
            className="flex items-center gap-2 text-sm text-ink-soft transition-colors duration-fast hover:text-bronze"
            onClick={() => trackEvent("phone_click", { source: "navbar" })}
          >
            <Phone className="h-4 w-4" aria-hidden />
            {CONTACT.phoneDisplay}
          </a>
          <Link
            href="/devis"
            className="rounded-sm bg-ink px-5 py-2.5 text-sm font-medium tracking-wide text-paper transition-transform duration-fast hover:scale-[1.02] hover:bg-ink-soft"
            onClick={() => trackEvent("cta_click", { cta: "navbar_quote" })}
          >
            Demander un devis
          </Link>
        </div>

        <button
          className="p-2 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-paper lg:hidden">
          <nav className="container-cl flex flex-col gap-1 py-4" aria-label="Navigation mobile">
            <Link href="/catalogue" className="rounded-md px-3 py-3 text-base font-medium text-ink hover:bg-paper-alt">
              Catalogue complet
            </Link>
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.slug}
                href={`/catalogue/${category.slug}`}
                className="rounded-md px-3 py-2 pl-6 text-sm text-ink-soft hover:bg-paper-alt hover:text-bronze-dark"
              >
                {category.name}
              </Link>
            ))}
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-md px-3 py-3 text-base font-medium text-ink hover:bg-paper-alt">
                {link.label}
              </Link>
            ))}
            <Link
              href="/devis"
              className="mt-3 rounded-sm bg-ink px-5 py-3 text-center text-sm font-medium tracking-wide text-paper"
            >
              Demander un devis
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
