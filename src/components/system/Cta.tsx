import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Boutons style Apple : « solid » = pilule pleine (encre), « line » / « glass » = pilule à contour,
 * « link » = lien texte avec chevron. Liens externes (http, wa.me) ouverts tels quels.
 */
export function Cta({
  href,
  children,
  variant = "solid",
  size,
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "glass" | "line" | "link";
  size?: "sm";
  className?: string;
}) {
  if (variant === "link") {
    return (
      <Link href={href} className={cn("btn-link", className)}>
        {children}
        <ChevronRight size={16} strokeWidth={2} className="chev" aria-hidden />
      </Link>
    );
  }
  return (
    <Link href={href} className={cn("btn", variant === "solid" ? "btn-primary" : "btn-secondary", size === "sm" && "btn-sm", className)}>
      {children}
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
