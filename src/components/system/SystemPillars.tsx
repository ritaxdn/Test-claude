import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
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
              <div className="flex items-center">
                <Pill className="bg-white/70">0{i + 1}</Pill>
              </div>
              <h3 className="display mt-auto pt-6 text-[1.3rem] text-deep">{p.name}</h3>
              <p className="mt-1 font-sans text-sm text-deep-soft">{p.title}</p>
              <p className="mt-4 font-sans text-[0.95rem] leading-relaxed text-deep/80">{p.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>

      </div>
    </section>
  );
}
