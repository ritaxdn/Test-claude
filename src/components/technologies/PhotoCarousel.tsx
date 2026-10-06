"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Carrousel façon Instagram : on fait glisser les photos au doigt (ou flèches / points sur ordinateur).
 * Format 4:5, photo entière (jamais recadrée) sur fond sombre. Toutes les photos sont dans la page (lisibles par Google).
 */
export function PhotoCarousel({
  images,
  name,
  family,
  labels,
}: {
  images: string[];
  name: string;
  family: string;
  labels: { prev: string; next: string; photo: string };
}) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // Photo affichée = celle la plus proche du bord gauche
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setIndex(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const target = Math.max(0, Math.min(images.length - 1, i));
    el.scrollTo({ left: target * el.clientWidth, behavior: "smooth" });
  };

  const many = images.length > 1;

  return (
    <div className="relative mx-auto mt-8 max-w-xl" aria-roledescription="carousel" aria-label={name}>
      <div
        ref={track}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(index + 1);
          if (e.key === "ArrowLeft") go(index - 1);
        }}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-[1.75rem] bg-[#0b0d14] focus:outline-none focus-visible:ring-2 focus-visible:ring-deep/30"
      >
        {images.map((src, i) => (
          <div
            key={src}
            className="relative aspect-[4/5] w-full shrink-0 snap-center snap-always"
            aria-roledescription="slide"
            aria-label={`${labels.photo} ${i + 1} / ${images.length}`}
          >
            <Image
              src={src}
              alt={`${name}, ${family.toLowerCase()} — ${labels.photo.toLowerCase()} ${i + 1}`}
              fill
              priority={i === 0}
              sizes="(min-width:640px) 576px, 100vw"
              className="object-contain"
            />
          </div>
        ))}
      </div>

      {many && (
        <>
          {/* Compteur, comme sur Instagram */}
          <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-black/55 px-2.5 py-1 font-sans text-xs text-white">
            {index + 1}/{images.length}
          </span>

          {/* Flèches (ordinateur) */}
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label={labels.prev}
            className={`absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-deep shadow transition-opacity sm:flex ${index === 0 ? "pointer-events-none opacity-0" : "opacity-100"}`}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label={labels.next}
            className={`absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-deep shadow transition-opacity sm:flex ${index === images.length - 1 ? "pointer-events-none opacity-0" : "opacity-100"}`}
          >
            <ChevronRight size={18} />
          </button>

          {/* Points */}
          <div className="mt-4 flex justify-center gap-1.5">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => go(i)}
                aria-label={`${labels.photo} ${i + 1}`}
                aria-current={i === index}
                className="flex h-6 items-center px-0.5"
              >
                <span className={`block h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-deep" : "w-1.5 bg-deep/25"}`} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
