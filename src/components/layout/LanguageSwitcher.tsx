"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <div className="flex items-center gap-1 font-label" style={{ fontSize: "11px" }}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          <Link
            href={`/${l}${rest ? `/${rest}` : ""}`}
            className={cn(
              "px-1.5 py-1 tracking-wider transition-colors",
              l === locale ? "text-ink" : "text-muted hover:text-ink"
            )}
            aria-current={l === locale ? "true" : undefined}
          >
            {l.toUpperCase()}
          </Link>
          {i < locales.length - 1 && <span className="text-light">/</span>}
        </span>
      ))}
    </div>
  );
}
