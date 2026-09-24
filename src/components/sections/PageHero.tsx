import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { GridBackdrop } from "@/components/visuals/GridBackdrop";

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
    <section className="isolate relative overflow-hidden border-b border-hairline pt-20 pb-24 md:pt-32 md:pb-36">
      <GridBackdrop className="pointer-events-none absolute inset-0 -z-20" />

      {/* Diagonal rainbow accent, echoing the homepage hero's bolder separator scale */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-15%] bottom-[15%] -z-10 h-[2px] origin-left -rotate-[2deg] bg-gradient-rainbow opacity-30"
      />

      <Container className="grid grid-cols-1 gap-10 md:grid-cols-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-4">
            <span className="h-px w-8 bg-ink md:h-20 md:w-[3px]" />
            <span
              className="font-label whitespace-nowrap text-muted"
              style={{ fontSize: "11px", letterSpacing: "0.2em" }}
            >
              {eyebrow.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="md:col-span-10 md:col-start-3">
          <SplitReveal lines={[title]} className="text-display-2 text-ink -ml-1" />
          {subtitle && (
            <Reveal delay={0.3}>
              <p className="font-body mt-8 max-w-lg text-base font-light leading-relaxed text-ink-soft md:ml-auto md:text-right md:text-lg">
                {subtitle}
              </p>
            </Reveal>
          )}
        </div>
      </Container>
    </section>
  );
}
