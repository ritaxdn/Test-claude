"use client";

import { useEffect, useRef, useState } from "react";

/** Cadre « scanner » : une ligne de lecture balaie son contenu une fois, quand il entre à l'écran. */
export function ScanFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} data-scan={on ? "on" : "off"} className={`scan-frame relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
