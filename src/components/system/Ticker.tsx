import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";

/** Bandeau défilant en continu (se met en pause au survol, immobile si l'animation est réduite). */
export function Ticker({ locale }: { locale: Locale }) {
  const items = homeSystem[locale].ticker;
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((it) => (
        <li key={it} className="flex items-center whitespace-nowrap">
          <span className="px-6 font-sans text-sm text-deep md:px-8 md:text-[0.95rem]">{it}</span>
          <svg width="28" height="12" viewBox="0 0 28 12" aria-hidden="true" className="shrink-0">
            <path d="M0 6h8l2-4 3 8 2-5 2 1h11" fill="none" stroke="url(#ticker-grad)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label={items.join(" · ")} className="px-3 py-3 md:px-5">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <linearGradient id="ticker-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#00bcd4" />
            <stop offset=".5" stopColor="#7b61ff" />
            <stop offset="1" stopColor="#e91e8c" />
          </linearGradient>
        </defs>
      </svg>
      <div className="glass group relative overflow-hidden rounded-full py-3.5 [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
        <div className="ticker-track flex w-max group-hover:[animation-play-state:paused]">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
