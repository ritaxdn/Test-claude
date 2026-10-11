import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * `alternates` d'une page bilingue : URL canonique de la langue courante + versions FR/EN (hreflang).
 * @param path chemin sans préfixe de langue, ex. "/about" ou "" pour l'accueil
 * @param lang langue de la page affichée
 */
export function localeAlternates(path: string = "", lang: string = "fr"): Metadata["alternates"] {
  return {
    canonical: `/${lang}${path}`,
    languages: {
      fr: `/fr${path}`,
      en: `/en${path}`,
      "x-default": `/fr${path}`,
    },
  };
}

/**
 * Métadonnées complètes d'une page : titre, description, canonique, hreflang et partage (Open Graph / X).
 * `title` passe par le modèle « … | CELLULIFT » sauf si `absoluteTitle` est fourni.
 * Image de partage : celle de app/[lang]/opengraph-image.tsx par défaut ; `image` la remplace (ex. photo de la machine).
 */
export function pageMetadata({
  lang,
  path = "",
  title,
  absoluteTitle,
  description,
  image,
}: {
  lang: string;
  path?: string;
  title?: string;
  absoluteTitle?: string;
  description: string;
  image?: { url: string; width: number; height: number; alt: string };
}): Metadata {
  const fullTitle = absoluteTitle ?? `${title} | CELLULIFT`;
  const isFr = lang !== "en";
  // Image de partage par défaut : celle de app/[lang]/opengraph-image.tsx (sinon les pages intérieures n'en ont aucune).
  const shareImage = image ?? {
    url: `${SITE_URL}/${lang}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: isFr ? "CELLULIFT — Technologies médico-esthétiques pour professionnels" : "CELLULIFT — Medical aesthetic technology for professionals",
  };
  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: localeAlternates(path, lang),
    openGraph: {
      type: "website",
      siteName: "CELLULIFT",
      url: `${SITE_URL}/${lang}${path}`,
      title: fullTitle,
      description,
      locale: isFr ? "fr_MA" : "en_US",
      alternateLocale: isFr ? ["en_US"] : ["fr_MA"],
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [shareImage.url],
    },
  };
}
