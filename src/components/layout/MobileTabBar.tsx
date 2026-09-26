"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, House, Layers, MessageCircle, Wrench } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

/** Barre d'onglets en bas d'écran, façon application (téléphone uniquement). */
export function MobileTabBar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const tabs = [
    { href: `/${locale}`, label: dict.nav.home, Icon: House },
    { href: `/${locale}/technologies`, label: dict.nav.technologies, Icon: Layers },
    { href: `/${locale}/academy`, label: dict.nav.academy, Icon: GraduationCap },
    { href: `/${locale}/support`, label: dict.nav.support, Icon: Wrench },
    { href: `/${locale}/contact`, label: dict.nav.contact, Icon: MessageCircle },
  ];
  const isActive = (href: string) => (href === `/${locale}` ? pathname === href : pathname.startsWith(href));
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 sm:hidden" aria-label="Navigation">
      <ul className="glass-strong grid grid-cols-5 rounded-[1.4rem] px-1 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {tabs.map(({ href, label, Icon }) => {
          const on = isActive(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-2xl py-1.5 font-sans text-[10px] transition-colors",
                  on ? "bg-white text-deep shadow-[0_4px_12px_-6px_rgba(29,27,38,0.3)]" : "text-deep-soft"
                )}
              >
                <Icon size={18} strokeWidth={on ? 2 : 1.6} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
