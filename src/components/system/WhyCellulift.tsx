import { Fragment } from "react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Pill } from "./Cta";
import { SignalLine } from "./SignalPath";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";

/** Niveau 3 — preuves : chaque case dit pourquoi Cellulift est crédible (catégorie → preuve → portée). */
export function WhyCellulift({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].why;
  return (
    <section className="px-3 pb-6 md:px-5 md:pb-8">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Reveal>
          <Pill>{c.eyebrow}</Pill>
        </Reveal>
        <RevealGroup className="mt-6 grid grid-cols-2 border-t border-deep/15 lg:grid-cols-4">
          {c.items.map((it, i) => (
            <RevealItem
              key={it.label}
              className="relative border-b border-deep/15 py-5 pr-4 odd:border-r lg:border-b-0 lg:border-r lg:px-6 lg:py-8 lg:first:pl-0 lg:last:border-r-0 [&:nth-child(even)]:pl-4 lg:[&:nth-child(even)]:pl-6"
            >
              <SignalLine delay={i * 0.12} className="absolute inset-x-0 top-[-1px]" />
              <p className="data-label text-deep-soft">{it.label}</p>
              <p className="display mt-4 text-[clamp(1.05rem,1.7vw,1.6rem)] leading-[1.05] text-deep">
                {/* Coupures uniquement entre les éléments, jamais après un « · » */}
                {it.value.split(" · ").map((part, j, all) => (
                  <Fragment key={part}>
                    <span className="whitespace-nowrap">
                      {part}
                      {j < all.length - 1 && " ·"}
                    </span>
                    {j < all.length - 1 && " "}
                  </Fragment>
                ))}
              </p>
              <p className="mt-3 font-sans text-sm leading-snug text-deep-soft">{it.title}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
