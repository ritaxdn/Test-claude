import { Reveal } from "@/components/ui/Reveal";
import { Pill } from "@/components/system/Cta";

export function Story({ eyebrow, title, paragraphs }: { eyebrow: string; title: string; paragraphs: readonly string[] }) {
  return (
    <section className="px-3 pb-12 md:px-5 md:pb-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-3 md:px-7 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <Pill className="bg-white/60">{eyebrow}</Pill>
          <h2 className="display mt-4 text-[clamp(1.7rem,3.3vw,2.9rem)] text-deep">{title}</h2>
        </Reveal>
        <Reveal className="glass space-y-4 rounded-[1.75rem] p-7 md:p-9">
          {paragraphs.map((p, i) => (
            <p key={i} className="font-sans leading-relaxed text-deep-soft">{p}</p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
