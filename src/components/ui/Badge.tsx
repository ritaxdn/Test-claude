import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border border-light px-2.5 py-1 font-label text-muted",
        className
      )}
      style={{ fontSize: "10px", letterSpacing: "0.12em" }}
    >
      {children}
    </span>
  );
}
