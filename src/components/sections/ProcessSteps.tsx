import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function ProcessSteps({
  eyebrow,
  title,
  steps,
}: {
  eyebrow: string;
  title: string;
  steps: readonly { title: string; description: string }[];
}) {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} />

        <RevealGroup className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <RevealItem key={step.title} className="relative pl-0">
              <div className="flex items-center gap-4">
                <span className="font-heading text-3xl font-light text-gradient-rainbow">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {i < steps.length - 1 && (
                  <span className="hidden h-px flex-1 bg-gradient-rainbow opacity-40 lg:block" />
                )}
              </div>
              <h3 className="font-heading mt-5 text-xl font-light text-ink">{step.title}</h3>
              <p className="font-body mt-3 text-sm font-light leading-relaxed text-ink-soft">
                {step.description}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
