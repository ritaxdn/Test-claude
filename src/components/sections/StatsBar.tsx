import { Container } from "@/components/ui/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { stats } from "@/content/stats";
import type { Locale } from "@/lib/i18n/config";

export function StatsBar({
  locale,
  eyebrow,
  title,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="bg-ink py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span
              className="font-label text-light"
              style={{ fontSize: "11px", letterSpacing: "0.2em" }}
            >
              {eyebrow.toUpperCase()}
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-heading mt-4 text-3xl font-light leading-tight text-warm-white md:text-4xl">
              {title}
            </h2>
          </Reveal>
        </div>

        <RevealGroup className="mt-16 grid grid-cols-2 gap-10 md:grid-cols-4">
          {stats.map((stat) => (
            <RevealItem key={stat.label[locale]} className="text-center">
              <p className="font-heading text-4xl font-light text-gradient-rainbow md:text-5xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="font-body mt-3 text-sm font-light text-light">
                {stat.label[locale]}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
