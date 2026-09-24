import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { GridBackdrop } from "@/components/visuals/GridBackdrop";
import { GlowMesh } from "@/components/visuals/GlowMesh";

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
    <section className="isolate relative overflow-hidden border-b border-hairline pt-16 pb-20 md:pt-24 md:pb-28">
      <GridBackdrop className="pointer-events-none absolute inset-0 -z-20" />
      <GlowMesh variant="compact" className="pointer-events-none absolute inset-0 -z-20 overflow-hidden" />

      <Container className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-4">
            <span className="h-px w-8 bg-ink md:h-12 md:w-px" />
            <span
              className="font-label whitespace-nowrap text-muted"
              style={{ fontSize: "11px", letterSpacing: "0.2em" }}
            >
              {eyebrow.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="md:col-span-10">
          <SplitReveal lines={[title]} className="text-display-2 text-ink" />
          {subtitle && (
            <Reveal delay={0.3}>
              <p className="font-body mt-7 max-w-lg text-base font-light leading-relaxed text-ink-soft md:ml-auto md:text-right md:text-lg">
                {subtitle}
              </p>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}
