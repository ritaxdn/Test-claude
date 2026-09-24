import { cn } from "@/lib/utils";

export function EditorialIndex({
  index,
  total,
  className,
}: {
  index: number;
  total?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-label inline-flex shrink-0 items-baseline gap-1 whitespace-nowrap text-muted",
        className
      )}
      style={{ fontSize: "12px", letterSpacing: "0.1em" }}
    >
      <span className="text-ink">{String(index).padStart(2, "0")}</span>
      {total && <span>/ {String(total).padStart(2, "0")}</span>}
    </span>
  );
}
