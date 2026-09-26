import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Heading } from "./Heading";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";

/** « Voici exactement ce qui se passe » : le parcours partenaire, étape par étape. */
export function PartnerJourney({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].journey;
  return (
    <section className="px-3 pb-12 md:px-5 md:pb-16">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Heading eyebrow={c.eyebrow} title={c.title} intro={c.intro} />
        <div className="signal-line mt-8 opacity-70" />
        <RevealGroup className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {c.steps.map((s, i) => (
            <RevealItem key={s.title} className="glass flex flex-col rounded-[1.5rem] p-5">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: `var(--rainbow-${Math.min(5, Math.floor((i * 5) / c.steps.length) + 1)})` }}
                />
                <span className="data-label text-deep-soft">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-5 font-sans text-base font-medium leading-snug text-deep">{s.title}</h3>
              <p className="mt-2 flex-1 font-sans text-sm leading-relaxed text-deep-soft">{s.text}</p>
              <p className="data-label mt-6 border-t border-deep/10 pt-3 text-deep">→ {s.output}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
