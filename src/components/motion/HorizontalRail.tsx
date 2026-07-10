"use client";

import { useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type HorizontalRailProps = {
  children: ReactNode;
  className?: string;
  showArrows?: boolean;
};

/**
 * Snap-scroll horizontal gallery. Native overflow-x scrolling (accessible,
 * momentum-friendly on touch) with optional desktop arrow controls and
 * soft edge fades to hint at more content off-screen.
 */
export function HorizontalRail({ children, className, showArrows = true }: HorizontalRailProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  function updateEdges() {
    const el = scrollerRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }

  function scrollByPage(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  }

  return (
    <div className={cn("relative", className)}>
      <div
        ref={scrollerRef}
        onScroll={updateEdges}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      {showArrows && (
        <div className="mt-6 hidden items-center gap-3 sm:flex">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={atStart}
            aria-label="Précédent"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink-soft transition-colors duration-fast hover:bg-paper-alt disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={atEnd}
            aria-label="Suivant"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink-soft transition-colors duration-fast hover:bg-paper-alt disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
