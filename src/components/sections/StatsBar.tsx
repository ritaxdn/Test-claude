import { Container } from "@/components/ui/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { stats } from "@/content/stats";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

const spans = [
  "md:col-span-6",
  "md:col-span-5 md:col-start-8 md:mt-20",
  "md:col-span-5 md:mt-10",
  "md:col-span-4 md:col-start-9 md:mt-24",
];

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
    <section className="bg-ink py-28 md:py-40">
      <Container>
        <div className="max-w-xl">
          <Reveal>
            <span
              className="font-label text-light"
              style={{ fontSize: "11px", letterSpacing: "0.2em" }}
            >
              {eyebrow.toUpperCase()}
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-display-3 mt-4 text-warm-white">{title}</h2>
          </Reveal>
        </div>

        <RevealGroup className="mt-20 grid grid-cols-2 gap-x-6 gap-y-16 md:grid-cols-12">
          {stats.map((stat, i) => (
            <RevealItem
              key={stat.label[locale]}
              className={cn("col-span-2", spans[i % spans.length])}
            >
              <p className="font-heading text-5xl font-light text-gradient-rainbow md:text-7xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="font-body mt-4 max-w-[16ch] text-sm font-light text-light">
                {stat.label[locale]}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
