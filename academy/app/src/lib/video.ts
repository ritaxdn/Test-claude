import "server-only";
import { createSign } from "node:crypto";

export type Playback =
  | { kind: "local"; src: string }
  | { kind: "mux"; playbackId: string; token: string; drmToken?: string }
  | { kind: "missing" };

const b64url = (b: Buffer | string) => Buffer.from(b).toString("base64url");

/** Jeton de lecture signé Mux (RS256), lié à l'utilisateur, valable 2 h. */
function muxToken(playbackId: string, aud: "v" | "d", userId: string): string {
  const kid = process.env.MUX_SIGNING_KEY_ID!;
  const key = Buffer.from(process.env.MUX_SIGNING_PRIVATE_KEY_BASE64!, "base64").toString("utf8");
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT", kid }));
  const payload = b64url(JSON.stringify({ sub: playbackId, aud, exp: Math.floor(Date.now() / 1000) + 7200, kid, custom: { user: userId } }));
  const sig = createSign("RSA-SHA256").update(`${header}.${payload}`).sign(key);
  return `${header}.${payload}.${b64url(sig)}`;
}

/** Ce qu'il faut au lecteur pour cette leçon. Appelé seulement après vérification des droits. */
export function playbackFor(lessonId: string, videoRef: string | null, userId: string): Playback {
  if (!videoRef) return { kind: "missing" };
  if ((process.env.VIDEO_PROVIDER ?? "local") === "mux") {
    return { kind: "mux", playbackId: videoRef, token: muxToken(videoRef, "v", userId), drmToken: process.env.MUX_DRM_ENABLED === "true" ? muxToken(videoRef, "d", userId) : undefined };
  }
  return { kind: "local", src: `/api/video/${lessonId}` };
}
