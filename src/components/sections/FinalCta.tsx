import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import type { Locale } from "@/lib/i18n/config";

export function FinalCta({
  locale,
  title,
  description,
  ctaPrimary,
  ctaSecondary,
}: {
  locale: Locale;
  title: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
}) {
  return (
    <section className="py-24 md:py-32">
      <Container className="text-center">
        <Reveal>
          <h2 className="font-heading mx-auto max-w-2xl text-3xl font-light leading-tight text-ink md:text-5xl">
            {title}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="font-body mx-auto mt-6 max-w-lg text-base font-light leading-relaxed text-ink-soft">
            {description}
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button href={`/${locale}/contact`} size="lg">
              {ctaPrimary}
            </Button>
            <Button href={`/${locale}/contact`} variant="ghost" size="lg">
              {ctaSecondary}
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.3}>
          <SectionSeparator className="mx-auto mt-16 max-w-xs" />
        </Reveal>
      </Container>
    </section>
  );
}
