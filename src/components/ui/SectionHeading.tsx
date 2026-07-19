import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <Reveal>
          <span
            className="font-label text-muted"
            style={{ fontSize: "11px", letterSpacing: "0.2em" }}
          >
            {eyebrow.toUpperCase()}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2 className="font-heading mt-4 text-3xl font-light leading-tight text-ink md:text-4xl lg:text-5xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p className="font-body mt-5 text-base font-light leading-relaxed text-ink-soft md:text-lg">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
