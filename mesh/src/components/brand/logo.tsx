import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-7", className)}>
      <defs>
        <linearGradient id="mesh-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="oklch(0.6 0.22 293)" />
          <stop offset="1" stopColor="oklch(0.45 0.22 285)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#mesh-g)" />
      <g stroke="white" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round">
        <path d="M9 10.5L16 16M23 10.5L16 16M9 21.5L16 16M23 21.5L16 16M9 10.5V21.5M23 10.5V21.5" />
      </g>
      <g fill="white">
        <circle cx="9" cy="10.5" r="2.3" />
        <circle cx="23" cy="10.5" r="2.3" />
        <circle cx="9" cy="21.5" r="2.3" />
        <circle cx="23" cy="21.5" r="2.3" />
        <circle cx="16" cy="16" r="3" />
      </g>
    </svg>
  );
}

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2 rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40", className)}>
      <LogoMark />
      <span className="text-[17px] font-semibold tracking-[0.12em]">MESH</span>
    </Link>
  );
}
