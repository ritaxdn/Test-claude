import type { CategoryKey, LocalizedText } from "./technologies";

/**
 * Pages de gamme (landing pages SEO) validées par Cellulift : Solutions lasers et Amincissement.
 * Machines et indications viennent du catalogue existant (technologies.ts, technology-sheets.ts) : rien n'est rédigé ici
 * en dehors des titres. `intro` : texte d'introduction fourni par Cellulift (vide = non affiché).
 * Module léger (sans le catalogue) : utilisable dans les composants client.
 */
export type LandingKey = "lasers" | "amincissement";

type Landing = {
  category: CategoryKey;
  /** Machines de la gamme à ne pas afficher sur la landing (décision Cellulift) */
  exclude: string[];
  title: LocalizedText;
  h1: LocalizedText;
  description: LocalizedText;
  intro: LocalizedText;
};

export const categoryLandings: Record<LandingKey, Landing> = {
  lasers: {
    category: "lasers",
    exclude: [],
    title: {
      fr: "Solutions lasers médico-esthétiques professionnelles",
      en: "Professional medical aesthetic laser solutions",
    },
    h1: { fr: "Solutions lasers professionnelles", en: "Professional laser solutions" },
    description: {
      fr: "Les solutions lasers distribuées par Cellulift : épilation, pigments, détatouage, resurfaçage et endolift. Chaque technologie est livrée avec installation, formation Cellulift Academy et SAV.",
      en: "Laser solutions distributed by Cellulift: hair removal, pigmentation, tattoo removal, resurfacing and endolift. Every technology comes with installation, Cellulift Academy training and after-sales.",
    },
    // À COMPLÉTER : introduction validée par Cellulift
    intro: { fr: "", en: "" },
  },
  amincissement: {
    category: "amincissement",
    // Décision Cellulift : hors du cœur de la landing Amincissement
    exclude: ["hot-power", "bodytech-9", "tanita", "longchoc", "shocsteel"],
    title: {
      fr: "Appareils d'amincissement et de remodelage corporel professionnels",
      en: "Professional body contouring and slimming devices",
    },
    h1: { fr: "Amincissement et remodelage corporel", en: "Body contouring and slimming" },
    description: {
      fr: "Les appareils d'amincissement et de remodelage corporel distribués par Cellulift : cellulite, graisse localisée, relâchement cutané et drainage. Installation, formation Cellulift Academy et SAV inclus.",
      en: "Body contouring and slimming devices distributed by Cellulift: cellulite, localised fat, skin laxity and drainage. Installation, Cellulift Academy training and after-sales included.",
    },
    // À COMPLÉTER : introduction validée par Cellulift
    intro: { fr: "", en: "" },
  },
};

export const landingKeys = Object.keys(categoryLandings) as LandingKey[];

/** Chemin de la landing (sans langue). */
export const landingPath = (key: LandingKey) => `/technologies/gammes/${key}`;

/** Gamme du catalogue → landing correspondante, quand elle existe. */
export const landingForCategory: Partial<Record<CategoryKey, LandingKey>> = Object.fromEntries(
  landingKeys.map((k) => [categoryLandings[k].category, k])
);

export const landingLabels = {
  fr: {
    eyebrow: "Gamme",
    technologies: "Les technologies de la gamme",
    guide: "Repères de choix",
    guideNote: "Indications de chaque technologie, reprises de sa fiche.",
    seeRange: "Voir la page de la gamme",
  },
  en: {
    eyebrow: "Range",
    technologies: "Technologies in this range",
    guide: "Choosing guide",
    guideNote: "Indications for each technology, taken from its product sheet.",
    seeRange: "View the range page",
  },
} as const;
