import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ProgramCard } from "@/components/academy/ProgramCard";
import { academyPrograms } from "@/content/academy";
import type { Locale } from "@/lib/i18n/config";

export function ProgramsGrid({
  locale,
  eyebrow,
  title,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="bg-ivory-2 py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} />

        <RevealGroup className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {academyPrograms.map((program) => (
            <RevealItem key={program.slug}>
              <ProgramCard program={program} locale={locale} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
