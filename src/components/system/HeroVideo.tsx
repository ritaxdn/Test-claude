"use client";

import { useEffect, useRef } from "react";

/**
 * Vidéo d'arrière-plan en lecture automatique.
 * React n'écrit pas l'attribut `muted` dans le HTML serveur : sans lui, Safari/iOS et Chrome bloquent
 * la lecture automatique. On injecte donc la balise telle quelle, puis on force la lecture côté client.
 */
export function HeroVideo({ src, webm, poster, className }: { src: string; webm?: string; poster: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = ref.current?.querySelector("video");
    if (!video) return;
    video.muted = true;
    const play = () => video.play().catch(() => {});
    play();
    // Relance si le navigateur a mis la vidéo en pause (onglet en arrière-plan, économie d'énergie…).
    document.addEventListener("visibilitychange", play);
    return () => document.removeEventListener("visibilitychange", play);
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={{
        __html: `<video poster="${poster}" autoplay muted loop playsinline webkit-playsinline preload="auto" disablepictureinpicture style="width:100%;height:100%;object-fit:cover">${
          webm ? `<source src="${webm}" type="video/webm">` : ""
        }<source src="${src}" type="video/mp4"></video>`,
      }}
    />
  );
}
