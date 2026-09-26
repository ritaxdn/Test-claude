import { Reveal } from "@/components/ui/Reveal";
import { Pill } from "@/components/system/Cta";
import { Signal } from "@/components/system/Signal";

/** En-tête des pages intérieures, dans la direction « nacre & verre ». */
export function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden px-3 pb-10 pt-12 md:px-5 md:pb-14 md:pt-16">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Reveal className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <div>
            <Pill className="bg-white/60">{eyebrow}</Pill>
            <h1 className="display mt-5 text-[clamp(2.2rem,5.2vw,4.6rem)] text-deep">{title}</h1>
          </div>
          {subtitle && <p className="max-w-md font-sans leading-relaxed text-deep-soft">{subtitle}</p>}
        </Reveal>
      </div>
      <Signal className="mt-8 h-10 w-full opacity-80" />
    </section>
  );
}
