import { useId } from "react";

/** Tracé ECG ultra-fin au dégradé Cellulift : le signal de la marque, jamais une décoration. */
export function Signal({ className, animate = true }: { className?: string; animate?: boolean }) {
  const id = useId();
  return (
    <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--rainbow-1)" stopOpacity="0" />
          <stop offset="18%" stopColor="var(--rainbow-1)" />
          <stop offset="40%" stopColor="var(--rainbow-2)" />
          <stop offset="60%" stopColor="var(--rainbow-3)" />
          <stop offset="80%" stopColor="var(--rainbow-4)" />
          <stop offset="100%" stopColor="var(--rainbow-5)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        className={animate ? "signal-run" : undefined}
        d="M0 30 H430 L446 30 L458 12 L474 50 L490 20 L500 30 H640 L652 30 L662 6 L676 54 L690 30 H1200"
        stroke={`url(#${id})`}
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
