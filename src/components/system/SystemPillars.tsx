import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";

export function SystemPillars({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].system;
  return (
    <section id="systeme" className="scroll-mt-20 bg-void py-24 text-platinum md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <p className="data-label text-silver">{c.eyebrow}</p>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <h2 className="display text-[clamp(2.2rem,5.2vw,4.6rem)]">{c.title}</h2>
            <p className="max-w-md font-sans leading-relaxed text-silver">{c.intro}</p>
          </div>
        </Reveal>

        {/* L'équation : Technology × Expertise × Academy × Support */}
        <RevealGroup className="mt-20 grid grid-cols-1 border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {c.pillars.map((p, i) => (
            <RevealItem
              key={p.code}
              className="relative border-b border-white/10 py-10 sm:px-8 sm:[&:nth-child(odd)]:pl-0 lg:border-b-0 lg:border-r lg:first:pl-0 lg:last:border-r-0"
            >
              <div className="flex h-8 items-center justify-between">
                <span className="data-label text-silver">0{i + 1} · {p.code}</span>
                {i < c.pillars.length - 1 && (
                  <span className="hidden font-display text-2xl text-silver/50 lg:block" aria-hidden="true">×</span>
                )}
              </div>
              <h3 className="mt-10 font-display text-2xl font-medium uppercase tracking-tight [font-stretch:118%]">{p.name}</h3>
              <p className="mt-1 font-sans text-sm text-silver">{p.title}</p>
              <p className="mt-6 max-w-xs font-sans text-[0.95rem] leading-relaxed text-platinum/80">{p.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Le résultat, transversal aux quatre piliers */}
        <Reveal className="mt-3">
          <div className="relative overflow-hidden border border-white/10 bg-white/[0.025] px-6 py-8 md:px-10">
            <div className="signal-line absolute inset-x-0 top-0" />
            <div className="grid gap-4 md:grid-cols-[auto_1fr_1.2fr] md:items-center md:gap-10">
              <span className="data-label text-silver">= {c.result.label}</span>
              <p className="font-display text-2xl font-medium uppercase tracking-tight [font-stretch:118%] md:text-3xl">{c.result.title}</p>
              <p className="font-sans text-[0.95rem] leading-relaxed text-silver">{c.result.text}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
