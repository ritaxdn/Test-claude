import type { Metadata } from "next";

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
