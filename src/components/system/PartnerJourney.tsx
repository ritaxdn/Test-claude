import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";

/** « Voici exactement ce qui se passe » : le parcours partenaire, étape par étape. */
export function PartnerJourney({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].journey;
  return (
    <section className="bg-graphite py-24 text-platinum md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <p className="data-label text-silver">{c.eyebrow}</p>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <h2 className="display text-[clamp(2.2rem,5.2vw,4.6rem)]">{c.title}</h2>
            <p className="max-w-md font-sans leading-relaxed text-silver">{c.intro}</p>
          </div>
        </Reveal>

        <div className="signal-line mt-20" />
        <RevealGroup className="grid gap-px bg-white/10 md:grid-cols-7">
            {c.steps.map((s, i) => (
              <RevealItem key={s.title} className="bg-graphite">
                <div className="flex h-full flex-col py-8 md:px-5 md:py-10">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: `var(--rainbow-${Math.min(5, Math.floor((i * 5) / c.steps.length) + 1)})` }}
                    />
                    <span className="data-label text-silver">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-6 font-sans text-lg font-medium leading-snug">{s.title}</h3>
                  <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-silver">{s.text}</p>
                  <p className="data-label mt-6 border-t border-white/10 pt-3 text-platinum/70">→ {s.output}</p>
                </div>
              </RevealItem>
            ))}
        </RevealGroup>
      </div>
    </section>
  );
}
