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
        "glass inline-flex items-center rounded-full px-3 py-1.5 font-label text-muted",
        className
      )}
      style={{ fontSize: "10px", letterSpacing: "0.12em" }}
    >
      {children}
    </span>
  );
}
