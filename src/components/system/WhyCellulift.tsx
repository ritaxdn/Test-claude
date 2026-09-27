import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Pill } from "./Cta";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";

/** Niveau 3 — preuves : la donnée domine, sans cartes ; lignes fines façon éditorial. */
export function WhyCellulift({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].why;
  return (
    <section className="px-3 pb-14 md:px-5 md:pb-20">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Reveal>
          <Pill>{c.eyebrow}</Pill>
        </Reveal>
        <RevealGroup className="mt-6 grid grid-cols-2 border-t border-deep/15 lg:grid-cols-4">
          {c.items.map((it, i) => (
            <RevealItem
              key={it.value}
              className="border-b border-deep/15 py-5 pr-4 odd:border-r lg:border-b-0 lg:border-r lg:px-6 lg:py-8 lg:first:pl-0 lg:last:border-r-0 [&:nth-child(even)]:pl-4 lg:[&:nth-child(even)]:pl-6"
            >
              <p className={`display text-[clamp(1.35rem,2.6vw,2.4rem)] leading-none ${i === 0 ? "iridescent-text" : "text-deep"}`}>
                {it.value}
              </p>
              <p className="data-label mt-3 leading-relaxed text-deep-soft">{it.title}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
