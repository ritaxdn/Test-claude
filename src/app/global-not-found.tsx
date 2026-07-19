import { headers } from "next/headers";
import type { Metadata } from "next";
import { cormorant, raleway, spaceMono } from "@/lib/fonts";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 — Cellulift",
  description: "The page you are looking for does not exist.",
};

const text = {
  fr: {
    eyebrow: "Erreur 404",
    title: "Cette page n'existe pas.",
    description:
      "Le lien que vous avez suivi est peut-être obsolète, ou la page a été déplacée.",
    cta: "Retour à l'accueil",
  },
  en: {
    eyebrow: "404 error",
    title: "This page doesn't exist.",
    description: "The link you followed may be outdated, or the page has moved.",
    cta: "Back to home",
  },
} as const;

export default async function GlobalNotFound() {
  const headersList = await headers();

  const pathname = headersList.get("x-pathname") ?? "";
  const pathSegment = pathname.split("/")[1];

  const acceptLanguage = headersList.get("accept-language") ?? "";
  const languageGuess = acceptLanguage.toLowerCase().startsWith("en") ? "en" : defaultLocale;

  const guessed = pathSegment && isLocale(pathSegment) ? pathSegment : languageGuess;
  const lang = isLocale(guessed) ? guessed : defaultLocale;
  const t = text[lang];

  return (
    <html
      lang={lang}
      className={`${cormorant.variable} ${raleway.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col items-center justify-center bg-ivory px-6 text-center text-ink">
        <span
          className="font-label text-muted"
          style={{ fontSize: "11px", letterSpacing: "0.2em" }}
        >
          {t.eyebrow.toUpperCase()}
        </span>
        <h1 className="font-heading mt-5 text-4xl font-light md:text-5xl">{t.title}</h1>
        <p className="font-body mt-5 max-w-md text-base font-light leading-relaxed text-ink-soft">
          {t.description}
        </p>
        <a
          href={`/${lang}`}
          className="mt-9 inline-flex items-center justify-center rounded-full bg-ink px-6 py-3.5 font-body text-sm font-medium text-warm-white transition-colors hover:bg-ink-soft"
        >
          {t.cta}
        </a>
      </body>
    </html>
  );
}
