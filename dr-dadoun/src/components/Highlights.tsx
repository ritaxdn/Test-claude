"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Photo } from "@/components/Photo";

type Item = { title: string; text: string; src: string | null };

export function Highlights({ items, children }: { items: Item[]; children: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("article");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 300) + 12), behavior: "smooth" });
  };

  const arrow =
    "flex h-24 w-16 items-center justify-center rounded-full border border-line bg-white transition-colors hover:border-ink hover:bg-ink hover:text-white md:h-28 md:w-[4.5rem]";

  return (
    <>
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        {children}
        <div className="hidden gap-3 md:flex">
          <button type="button" onClick={() => scroll(-1)} aria-label="Précédent" className={arrow}>
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="Suivant" className={arrow}>
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div
        ref={track}
        className="no-scrollbar -mr-5 mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto pr-5 md:-mr-8 md:pr-8"
      >
        {items.map((item, i) => (
          <article
            key={item.title}
            className="relative aspect-[5/8] w-[78%] shrink-0 snap-start overflow-hidden rounded-2xl sm:w-[46%] lg:w-[calc(25%-9px)]"
          >
            <Photo src={item.src} alt={item.title} fallback={(i % 5) + 1} sizes="(min-width:1024px) 25vw, 80vw" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0a5f6d]/85 via-[#0a5f6d]/45 to-transparent p-5 pt-24 text-white">
              <h3 className="font-display text-xl font-medium">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-snug text-white/85">{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
