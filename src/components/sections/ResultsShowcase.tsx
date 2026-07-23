import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";

export function ResultsShowcase({
  eyebrow,
  title,
  description,
  beforeLabel,
  afterLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  beforeLabel: string;
  afterLabel: string;
}) {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <Reveal delay={0.12} className="mx-auto mt-14 max-w-3xl">
          <BeforeAfterSlider beforeLabel={beforeLabel} afterLabel={afterLabel} />
        </Reveal>
      </Container>
    </section>
  );
}
