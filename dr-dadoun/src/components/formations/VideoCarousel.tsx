"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

export type CarouselVideo = { src: string; poster?: string; label: string };

/**
 * Carrousel de vidéos verticales : on fait glisser au doigt (téléphone, tablette),
 * flèches sur ordinateur. Les vidéos tournent en boucle, sans son ; si le navigateur
 * bloque la lecture automatique (mode économie d'énergie), un toucher la lance.
 */
export function VideoCarousel({ items }: { items: CarouselVideo[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState<boolean[]>(() => items.map(() => true));
  // Le bouton « lecture » n'apparaît que si la lecture automatique a été bloquée.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const first = el.children[0] as HTMLElement | undefined;
      if (!first) return;
      const step = first.offsetWidth + 12;
      setIndex(Math.min(items.length - 1, Math.round(el.scrollLeft / step)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

  const go = (i: number) => {
    const el = track.current;
    const target = el?.children[i] as HTMLElement | undefined;
    if (el && target) el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  const setPausedAt = (i: number, v: boolean) => setPaused((p) => p.map((x, j) => (j === i ? v : x)));

  return (
    <div>
      <div
        ref={track}
        className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:none] md:mx-0 md:scroll-px-0 md:px-0 [&::-webkit-scrollbar]:hidden"
        aria-roledescription="carrousel"
        aria-label="Vidéos de formation"
      >
        {items.map((v, i) => (
          <figure
            key={v.src}
            className="relative aspect-[9/16] w-[68%] shrink-0 snap-start overflow-hidden rounded-2xl bg-sand sm:w-[42%] lg:w-[46%]"
            aria-roledescription="diapositive"
            aria-label={`${i + 1} sur ${items.length} : ${v.label}`}
          >
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={v.src}
              poster={v.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onPlay={() => setPausedAt(i, false)}
              onPause={() => setPausedAt(i, true)}
              onClick={(e) => {
                const el = e.currentTarget;
                if (el.paused) el.play().catch(() => {});
                else el.pause();
              }}
            />
            {ready && paused[i] && (
              <button
                type="button"
                aria-label={`Lire : ${v.label}`}
                onClick={(e) => {
                  const el = e.currentTarget.parentElement?.querySelector("video");
                  el?.play().catch(() => {});
                }}
                className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-white/80 text-ink backdrop-blur-md"
              >
                <Play size={18} className="translate-x-px" />
              </button>
            )}
            <figcaption className="absolute inset-x-3 bottom-3 rounded-full bg-white/80 px-3 py-1.5 text-xs text-ink backdrop-blur-md">
              {v.label}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex gap-2" role="tablist" aria-label="Choisir une vidéo">
          {items.map((v, i) => (
            <button
              key={v.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Vidéo ${i + 1}`}
              onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-ink" : "w-1.5 bg-ink/25"}`}
            />
          ))}
        </div>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            aria-label="Vidéo précédente"
            onClick={() => go(Math.max(0, index - 1))}
            disabled={index === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors hover:border-ink/30 disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Vidéo suivante"
            onClick={() => go(Math.min(items.length - 1, index + 1))}
            disabled={index >= items.length - 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors hover:border-ink/30 disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
