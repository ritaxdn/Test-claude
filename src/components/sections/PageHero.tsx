import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden pt-16 pb-16 md:pt-24 md:pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(26,24,20,1) 1px, transparent 1px), linear-gradient(90deg, rgba(26,24,20,1) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>
      <Container className="max-w-3xl">
        <Reveal>
          <Badge>{eyebrow}</Badge>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="font-heading mt-6 text-4xl font-light leading-[1.1] text-ink sm:text-5xl md:text-6xl">
            {title}
          </h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={0.16}>
            <p className="font-body mt-6 max-w-xl text-base font-light leading-relaxed text-ink-soft md:text-lg">
              {subtitle}
            </p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
