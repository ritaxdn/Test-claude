"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { track } from "@/lib/analytics";

/**
 * Vidéo YouTube « légère » : seule la vignette (hébergée sur le site) est chargée.
 * Le lecteur YouTube (version sans cookie) n'est inséré qu'au clic.
 */
export function LiteYouTube({ id, title, playLabel, vertical = false }: { id: string; title: string; playLabel: string; vertical?: boolean }) {
  const [on, setOn] = useState(false);
  const aspect = vertical ? "aspect-[9/16]" : "aspect-video";

  if (on) {
    return (
      <div className={`relative overflow-hidden rounded-[1.5rem] bg-black ${aspect}`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setOn(true);
        track("video_play", { video: id });
      }}
      aria-label={`${playLabel} : ${title}`}
      className={`group relative block w-full overflow-hidden rounded-[1.5rem] bg-black ${aspect}`}
    >
      <Image
        src={`/images/media/${id}.jpg`}
        alt=""
        fill
        sizes={vertical ? "(min-width:1024px) 220px, 60vw" : "(min-width:1024px) 40vw, 100vw"}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
      <span className="glass-strong absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-deep transition-transform duration-300 group-hover:scale-110">
        <Play size={22} fill="currentColor" className="ml-1" />
      </span>
    </button>
  );
}
