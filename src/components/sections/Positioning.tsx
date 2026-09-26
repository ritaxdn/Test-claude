import { Reveal } from "@/components/ui/Reveal";
import { Pill } from "@/components/system/Cta";

export function Positioning({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="px-3 pb-12 md:px-5 md:pb-16">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Reveal className="glass grid gap-6 rounded-[1.75rem] p-7 md:grid-cols-[1fr_1.2fr] md:p-10">
          <div>
            <Pill className="bg-white/60">{eyebrow}</Pill>
            <h2 className="display mt-4 text-[clamp(1.6rem,3vw,2.6rem)] text-deep">{title}</h2>
          </div>
          <p className="self-end font-sans leading-relaxed text-deep-soft">{description}</p>
        </Reveal>
      </div>
    </section>
  );
}
