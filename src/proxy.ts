import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n/config";
import { isLegacyGone, legacyTarget } from "@/lib/legacy-redirects";
import { knownSections } from "@/lib/sections";

/**
 * Langue et redirections, toujours en UN SEUL saut (pas de chaîne de redirections) :
 * 1. anciennes adresses connues de l'ancien site → 301 vers la nouvelle page (ou 410 si supprimée) ;
 * 2. barre finale ou majuscules dans la langue (« /FR/contact/ ») → 308 vers l'adresse propre ;
 * 3. page sans langue (« /about ») → langue du navigateur (français par défaut).
 * Une adresse inconnue n'est jamais envoyée vers l'accueil : elle aboutit à une vraie page 404.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  // URL construite à la main : request.nextUrl conserverait la barre finale d'origine.
  const to = (path: string, keepQuery = true) => new URL(path + (keepQuery ? search : ""), request.url);
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  // 1. Ancien site
  const legacy = legacyTarget(clean);
  if (legacy) {
    return NextResponse.redirect(to(legacy, false), 301);
  }
  if (isLegacyGone(clean)) {
    return new NextResponse(
      '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page supprimée | CELLULIFT</title></head><body style="font-family:system-ui,sans-serif;max-width:32rem;margin:15vh auto;padding:0 1.5rem;color:#1d1b26"><h1 style="font-weight:500">Cette page n\u2019existe plus.</h1><p>Cette technologie ne fait plus partie du catalogue Cellulift.</p><p><a href="/fr/technologies" style="color:#1d1b26">Voir nos technologies</a></p></body></html>',
      { status: 410, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  const first = clean.split("/")[1] ?? "";
  const lower = first.toLowerCase();

  // 2. Adresse avec langue : on corrige seulement la forme (barre finale, majuscules)
  if (locales.some((l) => l === lower)) {
    const normalized = `/${lower}${clean.slice(first.length + 1)}`;
    if (normalized !== pathname) return NextResponse.redirect(to(normalized), 308);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // 3. Page du site sans langue → langue du navigateur
  if (knownSections.has(lower)) {
    const accept = request.headers.get("accept-language")?.toLowerCase() ?? "";
    const lang = accept.startsWith("en") ? "en" : defaultLocale;
    return NextResponse.redirect(to(`/${lang}${clean === "/" ? "" : clean}`));
  }

  // Adresse inconnue : page 404 (avec le bon code HTTP), jamais une redirection vers l'accueil.
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|api|videos/|apple-icon|icon|favicon|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|webp|avif|gif|ico|css|js|txt|xml|json|woff|woff2|mp4|webm|mov|pdf)$).*)",
  ],
};
