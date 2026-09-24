import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { cn } from "@/lib/utils";

export function SplitHighlight({
  eyebrow,
  title,
  description,
  cta,
  href,
  icon: Icon,
  reverse = false,
  glowVar = "--plate-academy",
}: {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: LucideIcon;
  reverse?: boolean;
  glowVar?: string;
}) {
  return (
    <section className="border-b border-hairline">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div
          className={cn(
            "relative flex min-h-[360px] items-center justify-center overflow-hidden bg-ivory-2 md:min-h-[460px] lg:col-span-5",
            reverse && "lg:order-2"
          )}
        >
          <div
            aria-hidden="true"
            className="absolute h-[70%] w-[70%] rounded-full opacity-40 blur-[90px]"
            style={{ background: `radial-gradient(circle, var(${glowVar}) 0%, transparent 70%)` }}
          />
          <div className="glass relative flex h-40 w-40 items-center justify-center rounded-full">
            <Icon size={64} strokeWidth={1} className="text-ink" aria-hidden="true" />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-5 px-6 py-16 md:px-10 md:py-20 lg:col-span-7 lg:px-16 xl:px-24">
          <Reveal>
            <span
              className="font-label text-muted"
              style={{ fontSize: "11px", letterSpacing: "0.2em" }}
            >
              {eyebrow.toUpperCase()}
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-display-3 text-ink">{title}</h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="font-body max-w-md text-base font-light leading-relaxed text-ink-soft md:text-lg">
              {description}
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <Magnetic className="inline-block">
              <Link
                href={href}
                className="mt-2 inline-flex items-center gap-2 font-body text-sm text-ink transition-transform duration-300 hover:translate-x-1"
              >
                {cta}
                <ArrowUpRight size={16} />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
