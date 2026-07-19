"use client";

import { useState, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Wraps a block-level area with a small label that follows the cursor while
 * hovering — used on the technologies index rows in place of a static "view"
 * icon so the interaction itself feels art-directed.
 */
export function HoverFollow({
  children,
  label,
  className,
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 300, damping: 30, mass: 0.4 });

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  return (
    <div
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      <motion.span
        aria-hidden="true"
        className="font-label pointer-events-none absolute top-0 left-0 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-warm-white md:flex"
        style={{
          x: springX,
          y: springY,
          width: 72,
          height: 72,
          fontSize: "10px",
          letterSpacing: "0.1em",
          opacity: hovered ? 1 : 0,
          scale: hovered ? 1 : 0.6,
          transition: "opacity 0.3s ease, scale 0.3s ease",
        }}
      >
        {label.toUpperCase()}
      </motion.span>
    </div>
  );
}
