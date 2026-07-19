"use client";

import { motion } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Reveals each line of a multi-line headline as an independent clip-path sweep,
 * staggered — the "cinematic title card" move instead of a flat fade-in.
 */
export function SplitReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
  as: Tag = "h1",
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "div";
}) {
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className={cn("block", lineClassName)}
            initial={{ y: shouldReduceMotion ? 0 : "100%", opacity: shouldReduceMotion ? 1 : 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
              duration: shouldReduceMotion ? 0.01 : 0.9,
              delay: shouldReduceMotion ? 0 : delay + i * 0.09,
              ease: [0.19, 1, 0.22, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
