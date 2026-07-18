import { useId } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

interface LogoProps {
  locale: Locale;
  className?: string;
  tagline?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { text: "text-lg", ecgWidth: 120, ecgHeight: 16 },
  md: { text: "text-2xl", ecgWidth: 160, ecgHeight: 20 },
  lg: { text: "text-4xl md:text-5xl", ecgWidth: 220, ecgHeight: 26 },
};

export function Logo({ locale, className, tagline, size = "md" }: LogoProps) {
  const gradientId = useId();
  const dims = sizes[size];

  return (
    <Link
      href={`/${locale}`}
      className={cn("group inline-flex flex-col items-start gap-1.5", className)}
      aria-label="Cellulift"
    >
      <span
        className={cn(
          "font-heading font-light uppercase text-gradient-rainbow leading-none",
          dims.text
        )}
        style={{ letterSpacing: "0.22em" }}
      >
        Cellulift
      </span>
      <svg
        width={dims.ecgWidth}
        height={dims.ecgHeight}
        viewBox="0 0 160 20"
        fill="none"
        className="overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="160" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--rainbow-1)" />
            <stop offset="25%" stopColor="var(--rainbow-2)" />
            <stop offset="50%" stopColor="var(--rainbow-3)" />
            <stop offset="75%" stopColor="var(--rainbow-4)" />
            <stop offset="100%" stopColor="var(--rainbow-5)" />
          </linearGradient>
        </defs>
        <path
          className="ecg-path"
          d="M0 10 H50 L58 10 L64 2 L72 18 L80 6 L86 10 H100 L106 10 L112 4 L118 16 L124 10 H160"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {tagline && (
        <span
          className="font-label text-muted"
          style={{ fontSize: "7px", letterSpacing: "0.28em" }}
        >
          {tagline.toUpperCase()}
        </span>
      )}
    </Link>
  );
}
