"use client";

import { useCallback, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export function BeforeAfterSlider({
  beforeLabel,
  afterLabel,
  className,
}: {
  beforeLabel: string;
  afterLabel: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(50);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setPercent(Math.max(0, Math.min(100, ratio)));
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-[16/10] w-full touch-none overflow-hidden rounded-[1.5rem] border border-hairline select-none",
        className
      )}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        updateFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (dragging.current) updateFromClientX(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerLeave={() => {
        dragging.current = false;
      }}
    >
      {/* "Après" layer — full width base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(255,193,7,0.18), transparent 55%), radial-gradient(circle at 75% 75%, rgba(0,188,212,0.16), transparent 55%), var(--warm-white)",
        }}
      >
        <span
          className="font-label absolute top-4 right-4 border border-light bg-warm-white/80 px-2.5 py-1 text-muted backdrop-blur-sm"
          style={{ fontSize: "9px", letterSpacing: "0.14em" }}
        >
          {afterLabel.toUpperCase()}
        </span>
      </div>

      {/* "Avant" layer — clipped to slider position */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${percent}%` }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, var(--ivory-2), var(--ivory))",
            filter: "saturate(0.7) brightness(0.97)",
          }}
        >
          <span
            className="font-label absolute top-4 left-4 border border-light bg-ivory/80 px-2.5 py-1 text-muted backdrop-blur-sm"
            style={{ fontSize: "9px", letterSpacing: "0.14em" }}
          >
            {beforeLabel.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Handle */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 w-[1.5px] bg-gradient-rainbow opacity-80"
        style={{ left: `${percent}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-warm-white shadow-[0_8px_24px_-8px_rgba(26,24,20,0.3)]">
          <MoveHorizontal size={16} strokeWidth={1.5} className="text-ink" />
        </div>
      </div>
    </div>
  );
}
