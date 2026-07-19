import { cn } from "@/lib/utils";

export function Marquee({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("group relative flex overflow-hidden", className)}>
      <div className="flex shrink-0 animate-marquee items-center gap-16 pr-16 group-hover:[animation-play-state:paused]">
        {children}
      </div>
      <div
        aria-hidden="true"
        className="flex shrink-0 animate-marquee items-center gap-16 pr-16 group-hover:[animation-play-state:paused]"
      >
        {children}
      </div>
    </div>
  );
}
