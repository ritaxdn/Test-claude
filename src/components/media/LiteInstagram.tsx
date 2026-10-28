"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { track } from "@/lib/analytics";

/**
 * Reel Instagram « léger » : seule une photo du site est chargée.
 * Le lecteur Instagram (et ses cookies) n'est inséré qu'au clic.
 */
export function LiteInstagram({ url, poster, title, playLabel }: { url: string; poster: string; title: string; playLabel: string }) {
  const [on, setOn] = useState(false);
  const embed = `${url.replace(/\/?$/, "/")}embed`;

  if (on) {
    return (
      <div className="relative aspect-[9/16] overflow-hidden rounded-[1.5rem] bg-white">
        <iframe src={embed} title={title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setOn(true);
        track("video_play", { video: url });
      }}
      aria-label={`${playLabel} : ${title}`}
      className="group relative block aspect-[9/16] w-full overflow-hidden rounded-[1.5rem] bg-black"
    >
      <Image src={poster} alt={title} fill sizes="(min-width:1024px) 320px, 80vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
      <span className="glass-strong absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-deep transition-transform duration-300 group-hover:scale-110">
        <Play size={22} fill="currentColor" className="ml-1" />
      </span>
    </button>
  );
}
