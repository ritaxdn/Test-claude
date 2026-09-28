import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (pathnameHasLocale) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const url = request.nextUrl.clone();
  // « /FR/contact » → « /fr/contact » (majuscules tapées à la main)
  const first = pathname.split("/")[1] ?? "";
  const lower = first.toLowerCase();
  if (locales.some((l) => l === lower)) {
    url.pathname = `/${lower}${pathname.slice(first.length + 1)}`;
    return NextResponse.redirect(url, 308);
  }
  // Langue du navigateur : anglais si demandé en premier, sinon français.
  const accept = request.headers.get("accept-language")?.toLowerCase() ?? "";
  const lang = accept.startsWith("en") ? "en" : defaultLocale;
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next|api|videos/|apple-icon|icon|favicon|.*\\.(?:svg|png|jpg|jpeg|webp|avif|gif|ico|css|js|txt|xml|json|woff|woff2|mp4|webm|mov|pdf)$).*)",
  ],
};
