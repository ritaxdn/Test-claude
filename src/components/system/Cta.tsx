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
  // Tout en verre : « solid » = verre en relief, « glass » / « line » = verre léger.
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center justify-between gap-4 rounded-full py-2 pl-6 pr-2 font-sans text-sm text-deep transition-all duration-300 hover:-translate-y-0.5",
        variant === "solid" ? "glass-strong hover:bg-white" : "glass-soft hover:bg-white/60",
        className
      )}
    >
      {children}
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,1),0_6px_16px_-8px_rgba(29,27,38,0.35)] transition-transform duration-300 group-hover:rotate-45">
        <span className="absolute inset-0 rounded-full opacity-60 [background:conic-gradient(from_200deg,#7fe3f0,#a797ff,#f29bd0,#ffc58f,#7fe3f0)] [mask:radial-gradient(circle,transparent_62%,black_64%)]" />
        <ArrowUpRight size={15} strokeWidth={1.75} className="relative" />
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
