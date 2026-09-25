import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Boutons de la direction « système » : verre sombre ou ligne fine, jamais de couleur pleine. */
export function Cta({
  href,
  children,
  variant = "solid",
  tone = "dark",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "line";
  tone?: "dark" | "light";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center justify-between gap-6 px-5 py-3.5 font-sans text-sm transition-colors duration-300",
        variant === "solid" &&
          (dark ? "bg-platinum text-void hover:bg-white" : "bg-void text-platinum hover:bg-steel"),
        variant === "line" &&
          (dark
            ? "border border-white/15 text-platinum hover:border-white/40"
            : "border border-void/15 text-void hover:border-void/40"),
        className
      )}
    >
      {children}
      <ArrowUpRight size={15} strokeWidth={1.5} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}
