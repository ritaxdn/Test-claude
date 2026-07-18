import { Container } from "@/components/ui/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function Story({
  eyebrow,
  title,
  paragraphs,
}: {
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
}) {
  return (
    <section className="py-20 md:py-28">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Reveal>
            <span
              className="font-label text-muted"
              style={{ fontSize: "11px", letterSpacing: "0.2em" }}
            >
              {eyebrow.toUpperCase()}
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-heading mt-4 text-3xl font-light leading-tight text-ink md:text-4xl">
              {title}
            </h2>
          </Reveal>
        </div>

        <RevealGroup className="flex flex-col gap-6">
          {paragraphs.map((p, i) => (
            <RevealItem key={i}>
              <p className="font-body text-base font-light leading-relaxed text-ink-soft md:text-lg">
                {p}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
