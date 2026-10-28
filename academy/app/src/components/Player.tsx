"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Playback = { kind: "local"; src: string } | { kind: "mux"; playbackId: string; token: string; drmToken?: string } | { kind: "missing" };
type Props = { lessonId: string; playback: Playback; duration: number; startAt: number; maxReached: number; completed: boolean; watermark: string; nextHref: string | null };
type Media = HTMLVideoElement;

export function Player({ lessonId, playback, duration, startAt, maxReached, completed, watermark, nextHref }: Props) {
  const router = useRouter();
  const ref = useRef<Media | null>(null);
  const max = useRef(maxReached);
  const [done, setDone] = useState(completed);
  const [warn, setWarn] = useState("");
  const [wm, setWm] = useState({ left: 8, top: 78 });
  const [muxReady, setMuxReady] = useState(playback.kind !== "mux");

  // Lecteur Mux (production) : composant web chargé à la demande.
  useEffect(() => {
    if (playback.kind !== "mux" || customElements.get("mux-player")) { setMuxReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@mux/mux-player@3.14.0/dist/mux-player.js";
    s.onload = () => setMuxReady(true);
    document.head.appendChild(s);
  }, [playback.kind]);

  useEffect(() => {
    const t = setInterval(() => setWm({ left: 5 + Math.random() * 50, top: 8 + Math.random() * 60 }), 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || !muxReady) return;
    let beat: ReturnType<typeof setInterval> | null = null;
    const send = async () => {
      const position = v.currentTime || 0;
      try {
        const res = await fetch(`/api/progress/${lessonId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ position }), keepalive: true });
        if (!res.ok) return;
        const r = (await res.json()) as { completed: boolean; maxPosition: number };
        max.current = Math.max(max.current, r.maxPosition);
        if (r.completed && !done) { setDone(true); router.refresh(); }
      } catch { /* réseau : le prochain battement rattrapera */ }
    };
    const onLoaded = () => { if (startAt > 1 && startAt < duration - 2) v.currentTime = startAt; };
    const onPlay = () => { send(); beat ??= setInterval(send, 10000); };
    const onPause = () => { if (beat) { clearInterval(beat); beat = null; } send(); };
    const onTime = () => { if (v.currentTime > max.current) max.current = Math.min(v.currentTime, max.current + 1.5); };
    const onSeeking = () => {
      if (!done && v.currentTime > max.current + 2) {
        v.currentTime = max.current;
        setWarn("Pour valider la leçon, regardez la vidéo sans avancer au-delà de ce que vous avez déjà vu.");
      }
    };
    const onHide = () => { if (document.visibilityState === "hidden") send(); };
    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onPause);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("seeking", onSeeking);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      if (beat) clearInterval(beat);
      v.removeEventListener("loadedmetadata", onLoaded); v.removeEventListener("play", onPlay); v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onPause); v.removeEventListener("timeupdate", onTime); v.removeEventListener("seeking", onSeeking);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [lessonId, startAt, duration, done, muxReady, router]);

  return (
    <div className="stack" style={{ gap: 12 }}>
      <div className="player" onContextMenu={(e) => e.preventDefault()}>
        {playback.kind === "local" && (
          <video ref={ref} src={playback.src} controls playsInline preload="metadata" controlsList="nodownload noplaybackrate" disablePictureInPicture aria-label="Vidéo de la leçon" />
        )}
        {playback.kind === "mux" && muxReady && (
          // @ts-expect-error composant web Mux
          <mux-player ref={ref} playback-id={playback.playbackId} playback-token={playback.token} drm-token={playback.drmToken} stream-type="on-demand" accent-color="#7B61FF" />
        )}
        {playback.kind === "missing" && <div className="empty"><p>La vidéo de cette leçon n'est pas encore disponible.</p></div>}
        {playback.kind !== "missing" && <span className="wm" style={{ left: `${wm.left}%`, top: `${wm.top}%` }} aria-hidden="true">{watermark}</span>}
      </div>
      {warn && <p className="alert info" role="status">{warn}</p>}
      <div className="row between wrap">
        {done ? <span className="badge ok">Leçon terminée</span> : <span className="small muted">La leçon est validée à 90 % de la vidéo regardée.</span>}
        {nextHref && (done ? <a className="btn solid" href={nextHref}>Leçon suivante</a> : <span className="btn" aria-disabled="true" title="Terminez cette leçon pour continuer">Leçon suivante</span>)}
        {!nextHref && done && <a className="btn solid" href="?fin=1">Voir mon bilan</a>}
      </div>
    </div>
  );
}
