import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function Positioning({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="py-28 md:py-40">
      <Container className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="md:col-span-3">
          <Reveal>
            <span
              className="font-label text-muted"
              style={{ fontSize: "11px", letterSpacing: "0.2em" }}
            >
              {eyebrow.toUpperCase()}
            </span>
          </Reveal>
        </div>

        <div className="md:col-span-8 md:col-start-4">
          <Reveal delay={0.08}>
            <p className="font-heading text-3xl leading-[1.15] font-light text-ink sm:text-4xl md:text-5xl lg:text-[3.25rem]">
              <span className="text-gradient-rainbow font-normal">&ldquo;</span>
              {title}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="font-body mt-10 max-w-md text-base font-light leading-relaxed text-ink-soft md:ml-auto md:text-right md:text-lg">
              {description}
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
