import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Heading } from "./Heading";
import { Pill } from "./Cta";
import { Orb } from "./Orb";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";

export function SystemPillars({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].system;
  return (
    <section id="systeme" className="scroll-mt-24 px-3 py-24 md:px-5 md:py-32">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Heading eyebrow={c.eyebrow} title={c.title} intro={c.intro} />

        <RevealGroup className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {c.pillars.map((p, i) => (
            <RevealItem key={p.code} className="glass relative flex min-h-[17rem] flex-col rounded-[1.75rem] p-7">
              <div className="flex items-center justify-between">
                <Pill className="bg-white/70">0{i + 1}</Pill>
                {i < c.pillars.length - 1 && (
                  <span className="hidden font-display text-xl text-deep/30 lg:block" aria-hidden="true">×</span>
                )}
              </div>
              <h3 className="display mt-auto pt-10 text-[1.6rem] text-deep">{p.name}</h3>
              <p className="mt-1 font-sans text-sm text-deep-soft">{p.title}</p>
              <p className="mt-4 font-sans text-[0.95rem] leading-relaxed text-deep/80">{p.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-3">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-deep px-7 py-10 text-white md:px-12 md:py-12">
            <Orb size={240} className="pointer-events-none absolute -right-20 -top-24 opacity-80 md:right-8 md:top-1/2 md:-translate-y-1/2" />
            <div className="relative max-w-2xl">
              <p className="data-label text-white/60">= {c.result.label}</p>
              <p className="display mt-4 text-[clamp(1.8rem,3.6vw,3rem)]">{c.result.title}</p>
              <p className="mt-4 max-w-md font-sans leading-relaxed text-white/75">{c.result.text}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
