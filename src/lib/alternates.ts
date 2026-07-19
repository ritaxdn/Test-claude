import type { Metadata } from "next";

/**
 * Builds the `alternates.languages` metadata field for a bilingual route.
 * @param path route path with no locale prefix, e.g. "/about" or "" for home
 */
export function localeAlternates(path: string = ""): Metadata["alternates"] {
  return {
    languages: {
      fr: `/fr${path}`,
      en: `/en${path}`,
    },
  };
}
