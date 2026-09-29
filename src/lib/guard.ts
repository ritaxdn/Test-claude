import { NextResponse } from "next/server";

/**
 * Protections communes des routes API (formulaires) :
 *  - origine : seules les requêtes envoyées depuis le site lui-même sont acceptées ;
 *  - taille : corps limité (évite les envois géants) ;
 *  - débit : nombre d'envois limité par adresse IP et par fenêtre de temps.
 * La limite de débit est tenue en mémoire (par instance serveur) : elle arrête les rafales de robots.
 * Pour une limite globale, ajouter aussi une règle « Rate limit » dans Vercel → Firewall.
 */

const MAX_BODY_BYTES = 20_000;
const buckets = new Map<string, number[]>();

export function clientIp(request: Request) {
  return request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

function rateLimited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  buckets.set(key, recent);
  // Nettoyage occasionnel pour que la mémoire ne grossisse pas indéfiniment.
  if (buckets.size > 5000) for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  return recent.length > max;
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false; // les navigateurs envoient toujours Origin sur un POST fetch
  try {
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * À appeler au début de chaque POST. Renvoie une réponse d'erreur si la requête doit être refusée, sinon null.
 * `name` sépare les compteurs par formulaire ; `max` envois autorisés par IP toutes les `windowMs`.
 */
export function guard(request: Request, name: string, max = 5, windowMs = 10 * 60 * 1000): NextResponse | null {
  if (!sameOrigin(request)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_BODY_BYTES) return NextResponse.json({ error: "too_large" }, { status: 413 });
  if (rateLimited(`${name}:${clientIp(request)}`, max, windowMs)) {
    return NextResponse.json({ error: "Trop de demandes. Merci de réessayer dans quelques minutes." }, { status: 429 });
  }
  return null;
}

/** Texte d'une seule ligne (objets d'e-mail) : supprime retours à la ligne et caractères de contrôle. */
export const oneLine = (s: string) => s.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();
