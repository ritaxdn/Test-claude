"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Pillar = { code: string; name: string; title: string; text: string };

/** Cartes compactes (numéro + titre) : le détail s'ouvre au clic, une carte à la fois. */
export function PillarCards({ pillars }: { pillars: readonly Pillar[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="mt-8 grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {pillars.map((p, i) => {
        const on = open === p.code;
        return (
          <button
            key={p.code}
            type="button"
            aria-expanded={on}
            onClick={() => setOpen(on ? null : p.code)}
            className={cn(
              "glass group flex w-full flex-col rounded-[1.75rem] p-5 text-left transition-shadow duration-300 sm:p-7",
              on ? "glass-strong" : "hover:bg-white/60"
            )}
          >
            <span className="flex w-full items-center justify-between">
              <span className="data-label text-deep-soft">0{i + 1}</span>
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-deep shadow-[inset_0_0_0_1px_rgba(255,255,255,1),0_6px_16px_-8px_rgba(29,27,38,0.35)] transition-transform duration-300",
                  on && "rotate-45"
                )}
              >
                <Plus size={15} strokeWidth={1.75} />
              </span>
            </span>
            <span className="display mt-4 block text-[1.3rem] leading-[1.05] text-deep sm:mt-8 sm:min-h-[2.1em] lg:flex lg:items-end">{p.name}</span>
            {/* Détail, révélé au clic */}
            <span
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
                on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <span className="overflow-hidden">
                <span className="mt-1 block font-sans text-sm text-deep-soft">{p.title}</span>
                <span className="mt-4 block font-sans text-[0.95rem] leading-relaxed text-deep/80">{p.text}</span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
