import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Boutons en pilule : plein (encre), verre, ou ligne fine. */
export function Cta({
  href,
  children,
  variant = "solid",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "glass" | "line";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center justify-between gap-4 rounded-full py-2 pl-6 pr-2 font-sans text-sm transition-all duration-300",
        variant === "solid" && "bg-deep text-white hover:bg-black",
        variant === "glass" && "glass text-deep hover:bg-white",
        variant === "line" && "border border-deep/20 text-deep hover:border-deep/50",
        className
      )}
    >
      {children}
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-45",
          variant === "solid" ? "bg-white text-deep" : "bg-deep text-white"
        )}
      >
        <ArrowUpRight size={15} strokeWidth={1.75} />
      </span>
    </Link>
  );
}

/** Petite étiquette en pilule (catégories, étapes). */
export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-deep/15 px-3 py-1 font-sans text-xs text-deep-soft", className)}>
      {children}
    </span>
  );
}
