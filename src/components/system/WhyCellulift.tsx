import { Check } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Heading } from "./Heading";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";

/** « Pourquoi Cellulift ? » : les engagements, en mosaïque de verre. */
export function WhyCellulift({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].why;
  return (
    <section className="px-3 pb-12 md:px-5 md:pb-16">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Heading eyebrow={c.eyebrow} title={c.title} intro={c.intro} />
        <RevealGroup className="mt-6 grid gap-2 sm:mt-8 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
          {c.items.map((it, i) => (
            <RevealItem key={it.title} className={`glass flex items-start gap-4 rounded-[1.25rem] p-4 sm:rounded-[1.5rem] sm:p-6 ${i === 0 ? "lg:col-span-2" : ""}`}>
              <span className="glass-strong flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-deep">
                <Check size={16} strokeWidth={2} />
              </span>
              <div>
                <h3 className={`display text-lg ${i === 0 ? "iridescent-text" : "text-deep"}`}>{it.title}</h3>
                <p className="mt-1 font-sans text-[0.8rem] leading-snug text-deep-soft sm:mt-1.5 sm:text-sm sm:leading-relaxed">{it.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
