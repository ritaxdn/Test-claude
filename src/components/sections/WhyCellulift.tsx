import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Heading } from "@/components/system/Heading";
import { Pill } from "@/components/system/Cta";

export function WhyCellulift({ eyebrow, title, items }: { eyebrow: string; title: string; items: readonly { title: string; description: string }[] }) {
  return (
    <section className="px-3 pb-12 md:px-5 md:pb-16">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Heading eyebrow={eyebrow} title={title} />
        <RevealGroup className="m-rail mt-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <RevealItem key={it.title} className="glass flex min-h-[10rem] flex-col rounded-[1.5rem] p-6">
              <Pill className="self-start bg-white/70">0{i + 1}</Pill>
              <h3 className="mt-auto pt-5 font-sans text-base font-medium text-deep">{it.title}</h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-deep-soft">{it.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
