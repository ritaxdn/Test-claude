"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsapConfig";
import type { ElementType } from "react";

type SplitHeadlineProps = {
  children: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  trigger?: "mount" | "scroll";
};

/**
 * Splits a headline into words and reveals them with a staggered
 * translate+opacity animation. `trigger="mount"` plays immediately (hero);
 * `trigger="scroll"` plays once the element enters the viewport.
 */
export function SplitHeadline({
  children,
  as: Tag = "h2",
  className,
  delay = 0,
  trigger = "scroll",
}: SplitHeadlineProps) {
  const ref = useRef<HTMLElement>(null);
  const words = children.split(" ");

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const wordEls = el.querySelectorAll("[data-word]");

      if (prefersReducedMotion) {
        gsap.set(wordEls, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(wordEls, { opacity: 0, y: "0.6em" });

      const animation = {
        opacity: 1,
        y: "0em",
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.06,
        delay,
      };

      if (trigger === "mount") {
        gsap.to(wordEls, animation);
      } else {
        gsap.to(wordEls, {
          ...animation,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });
      }
    },
    { scope: ref, dependencies: [children, trigger] }
  );

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden pb-[0.15em]">
          <span data-word className="inline-block will-change-transform">
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
