"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsapConfig";
import { cn } from "@/lib/utils";

type Chapter = {
  title: string;
  body: string;
};

type ScrollStoryProps = {
  chapters: Chapter[];
  visual: React.ReactNode;
  className?: string;
};

/**
 * Apple/Tesla-style pinned scroll section: a fixed visual pane on one side
 * while chapters crossfade in on the other as the user scrolls through the
 * pinned block. Falls back to a plain stacked layout (no pinning) for
 * reduced-motion users and narrow viewports.
 */
export function ScrollStory({ chapters, visual, className }: ScrollStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      if (prefersReducedMotion || !isDesktop) return;

      const panels = gsap.utils.toArray<HTMLElement>("[data-chapter]", container);

      panels.forEach((panel, index) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        });
      });

      const pinTrigger = ScrollTrigger.create({
        trigger: container,
        start: "top top+=80",
        end: () => `+=${container.scrollHeight - window.innerHeight}`,
        pin: "[data-visual-pane]",
        pinSpacing: false,
      });

      return () => pinTrigger.kill();
    },
    { scope: containerRef, dependencies: [chapters.length] }
  );

  return (
    <div ref={containerRef} className={cn("grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20", className)}>
      <div data-visual-pane className="order-1 lg:order-2 lg:h-screen lg:pt-24">
        <div className="mx-auto flex h-full max-h-[560px] w-full max-w-md items-center justify-center lg:max-h-none">
          {visual}
        </div>
      </div>

      <div className="order-2 flex flex-col gap-24 lg:order-1 lg:gap-0 lg:py-24">
        {chapters.map((chapter, index) => (
          <div
            key={chapter.title}
            data-chapter
            className={cn(
              "flex flex-col justify-center transition-opacity duration-500 lg:min-h-screen lg:opacity-40",
              index === activeIndex && "lg:opacity-100"
            )}
          >
            <span className="font-display text-sm text-bronze-dark">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 max-w-md font-display text-2xl text-ink md:text-3xl">{chapter.title}</h3>
            <p className="mt-4 max-w-md text-base leading-relaxed text-graphite">{chapter.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
