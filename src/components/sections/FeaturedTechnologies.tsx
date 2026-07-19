import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { TechnologyCard } from "@/components/technologies/TechnologyCard";
import { technologies } from "@/content/technologies";
import type { Locale } from "@/lib/i18n/config";

export function FeaturedTechnologies({
  locale,
  eyebrow,
  title,
  description,
  viewAllLabel,
  readMoreLabel,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  description: string;
  viewAllLabel: string;
  readMoreLabel: string;
}) {
  const featured = technologies.slice(0, 3);

  return (
    <section className="py-28 md:py-40">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          <Button href={`/${locale}/technologies`} variant="ghost" className="shrink-0">
            {viewAllLabel}
          </Button>
        </div>

        <RevealGroup className="mt-16 border-t border-hairline">
          {featured.map((tech, i) => (
            <RevealItem key={tech.slug}>
              <TechnologyCard
                technology={tech}
                locale={locale}
                readMoreLabel={readMoreLabel}
                index={i + 1}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
