import { cn } from "@/lib/utils";

export function SectionSeparator({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-[2px] w-full bg-gradient-rainbow opacity-50", className)}
      role="presentation"
    />
  );
}
