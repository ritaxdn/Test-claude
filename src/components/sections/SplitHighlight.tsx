import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function SplitHighlight({
  eyebrow,
  title,
  description,
  cta,
  href,
  icon: Icon,
  reverse = false,
  tintClassName = "bg-rainbow-2",
}: {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: LucideIcon;
  reverse?: boolean;
  tintClassName?: string;
}) {
  return (
    <section className="py-20 md:py-28">
      <Container
        className={cn(
          "grid grid-cols-1 items-center gap-14 lg:grid-cols-2",
          reverse && "lg:[&>*:first-child]:order-2"
        )}
      >
        <Reveal
          className={cn(
            "relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-hairline bg-warm-white"
          )}
        >
          <div
            className={cn(
              "absolute -top-20 -right-16 h-64 w-64 rounded-full blur-3xl opacity-25",
              tintClassName
            )}
          />
          <Icon size={64} strokeWidth={1} className="relative text-ink" />
        </Reveal>

        <div>
          <Reveal>
            <span
              className="font-label text-muted"
              style={{ fontSize: "11px", letterSpacing: "0.2em" }}
            >
              {eyebrow.toUpperCase()}
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-heading mt-4 text-3xl font-light leading-tight text-ink md:text-4xl">
              {title}
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="font-body mt-5 max-w-md text-base font-light leading-relaxed text-ink-soft">
              {description}
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <Link
              href={href}
              className="mt-7 inline-flex items-center gap-2 font-body text-sm text-ink transition-transform duration-300 hover:translate-x-1"
            >
              {cta}
              <ArrowUpRight size={16} />
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
