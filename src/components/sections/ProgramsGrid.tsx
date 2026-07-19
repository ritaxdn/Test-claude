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
    <section className="py-28 md:py-40">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} />

        <RevealGroup className="mt-14 border-t border-hairline">
          {academyPrograms.map((program, i) => (
            <RevealItem key={program.slug}>
              <ProgramCard program={program} locale={locale} index={i + 1} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
