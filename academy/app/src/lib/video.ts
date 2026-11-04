import "server-only";
import { createSign } from "node:crypto";

export type Playback =
  | { kind: "local"; src: string }
  | { kind: "mux"; playbackId: string; token: string; drmToken?: string }
  | { kind: "missing" };

const b64url = (b: Buffer | string) => Buffer.from(b).toString("base64url");

/**
 * Durée de validité du jeton Mux. Mux refuse TOUTE requête (manifeste et segments) après l'expiration,
 * même pendant une lecture : le jeton doit donc couvrir la vidéo. On prend la durée de la leçon
 * + 10 min de marge, entre 15 min et 2 h (2 h si la durée est inconnue). Après une révocation, un
 * jeton déjà émis reste utilisable au plus ce temps-là ; recharger la page en émet un nouveau
 * (après un nouveau contrôle d'accès).
 */
export function muxTokenTtl(durationSec: number | null | undefined): number {
  if (!durationSec || durationSec <= 0) return 7200;
  return Math.min(7200, Math.max(900, Math.ceil(durationSec) + 600));
}

/** Jeton de lecture signé Mux (RS256), lié à l'utilisateur. */
function muxToken(playbackId: string, aud: "v" | "d", userId: string, ttlSec: number): string {
  const kid = process.env.MUX_SIGNING_KEY_ID!;
  const key = Buffer.from(process.env.MUX_SIGNING_PRIVATE_KEY_BASE64!, "base64").toString("utf8");
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT", kid }));
  const payload = b64url(JSON.stringify({ sub: playbackId, aud, exp: Math.floor(Date.now() / 1000) + ttlSec, kid, custom: { user: userId } }));
  const sig = createSign("RSA-SHA256").update(`${header}.${payload}`).sign(key);
  return `${header}.${payload}.${b64url(sig)}`;
}

/** Ce qu'il faut au lecteur pour cette leçon. Appelé seulement après vérification des droits. */
export function playbackFor(lessonId: string, videoRef: string | null, userId: string, durationSec?: number | null): Playback {
  if (!videoRef) return { kind: "missing" };
  if ((process.env.VIDEO_PROVIDER ?? "local") === "mux") {
    const ttl = muxTokenTtl(durationSec);
    return { kind: "mux", playbackId: videoRef, token: muxToken(videoRef, "v", userId, ttl), drmToken: process.env.MUX_DRM_ENABLED === "true" ? muxToken(videoRef, "d", userId, ttl) : undefined };
  }
  return { kind: "local", src: `/api/video/${lessonId}` };
}
