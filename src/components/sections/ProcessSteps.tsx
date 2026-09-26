import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Heading } from "@/components/system/Heading";

export function ProcessSteps({ eyebrow, title, steps }: { eyebrow: string; title: string; steps: readonly { title: string; description: string }[] }) {
  return (
    <section className="px-3 pb-12 md:px-5 md:pb-16">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Heading eyebrow={eyebrow} title={title} />
        <div className="signal-line mt-8 opacity-70" />
        <RevealGroup className="m-rail mt-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <RevealItem key={s.title} className="glass flex flex-col rounded-[1.5rem] p-6">
              <span className="data-label text-deep-soft">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-5 font-sans text-base font-medium text-deep">{s.title}</h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-deep-soft">{s.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
