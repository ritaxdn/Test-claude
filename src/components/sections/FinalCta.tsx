import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { Reveal } from "@/components/ui/Reveal";
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
    <section className="relative overflow-hidden bg-ink py-28 text-warm-white md:py-40">
      <div
        className="pointer-events-none absolute -right-[10vw] -bottom-[8vw] -z-0 text-outline select-none"
        style={
          {
            fontFamily: "var(--font-heading)",
            fontSize: "22vw",
            letterSpacing: "-0.03em",
            "--outline-color": "rgba(250, 248, 244, 0.06)",
          } as React.CSSProperties
        }
        aria-hidden="true"
      >
        C
      </div>

      <Container className="relative grid grid-cols-1 gap-12 md:grid-cols-12 md:items-end">
        <div className="md:col-span-9">
          <SplitReveal
            lines={title.split(" — ").length > 1 ? title.split(" — ") : [title]}
            className="text-display-2 text-warm-white"
          />
          <Reveal delay={0.3}>
            <p className="font-body mt-8 max-w-md text-base font-light leading-relaxed text-light">
              {description}
            </p>
          </Reveal>
        </div>

        <div className="flex flex-col items-start gap-4 md:col-span-3 md:items-end">
          <Reveal delay={0.4}>
            <Magnetic>
              <Button href={`/${locale}/contact`} size="lg" variant="inverse">
                {ctaPrimary}
              </Button>
            </Magnetic>
          </Reveal>
          <Reveal delay={0.48}>
            <Link
              href={`/${locale}/contact`}
              className="font-body text-sm text-light underline-offset-4 transition-colors hover:text-warm-white hover:underline"
            >
              {ctaSecondary} →
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
