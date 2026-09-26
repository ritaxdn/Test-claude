import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Heading } from "./Heading";
import { Pill } from "./Cta";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";

export function SystemPillars({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].system;
  return (
    <section id="systeme" className="scroll-mt-24 px-3 py-12 md:px-5 md:py-16">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Heading eyebrow={c.eyebrow} title={c.title} intro={c.intro} />

        <RevealGroup className="m-rail mt-8 sm:grid-cols-2 lg:grid-cols-4">
          {c.pillars.map((p, i) => (
            <RevealItem key={p.code} className="glass relative flex min-h-[11rem] flex-col rounded-[1.75rem] p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <Pill className="bg-white/70">0{i + 1}</Pill>
                {i < c.pillars.length - 1 && (
                  <span className="hidden font-display text-xl text-deep/30 lg:block" aria-hidden="true">×</span>
                )}
              </div>
              <h3 className="display mt-auto pt-6 text-[1.3rem] text-deep">{p.name}</h3>
              <p className="mt-1 font-sans text-sm text-deep-soft">{p.title}</p>
              <p className="mt-4 font-sans text-[0.95rem] leading-relaxed text-deep/80">{p.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-3">
          <div className="glass relative overflow-hidden rounded-[1.75rem] px-7 py-7 text-deep md:px-10 md:py-8">
            <div className="relative max-w-2xl">
              <p className="data-label text-deep-soft">= {c.result.label}</p>
              <p className="display iridescent-text mt-4 text-[clamp(1.5rem,2.6vw,2.2rem)]">{c.result.title}</p>
              <p className="mt-4 max-w-md font-sans leading-relaxed text-deep-soft">{c.result.text}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
