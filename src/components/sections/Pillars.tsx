import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Heading } from "@/components/system/Heading";
import { Pill } from "@/components/system/Cta";

type Item = { title: string; description: string };

export function Pillars({ eyebrow, title, mission, vision, values }: { eyebrow: string; title: string; mission: Item; vision: Item; values: Item }) {
  const items = [mission, vision, values];
  return (
    <section className="px-3 pb-12 md:px-5 md:pb-16">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Heading eyebrow={eyebrow} title={title} />
        <RevealGroup className="m-rail mt-8 sm:grid-cols-3">
          {items.map((it, i) => (
            <RevealItem key={it.title} className="glass flex flex-col rounded-[1.75rem] p-6 sm:p-7">
              <Pill className="self-start bg-white/70">0{i + 1}</Pill>
              <h3 className="display mt-6 text-[1.3rem] text-deep">{it.title}</h3>
              <p className="mt-3 font-sans text-[0.95rem] leading-relaxed text-deep-soft">{it.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
