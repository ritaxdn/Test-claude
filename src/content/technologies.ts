export type LocalizedText = {
  fr: string;
  en: string;
};

export type CategoryKey = "lasers" | "face" | "body" | "aesthetic-gyneco" | "physio";

export interface Technology {
  slug: string;
  name: string;
  category: CategoryKey;
  // Fiche détaillée : à compléter machine par machine (rien n'est affiché tant que ce n'est pas renseigné).
  tagline?: LocalizedText;
  description?: LocalizedText;
  indications?: LocalizedText[];
  benefits?: LocalizedText[];
  certifications?: string[];
}

export const categories: Record<CategoryKey, LocalizedText> = {
  lasers: { fr: "Lasers & technologies lumière", en: "Lasers & light technologies" },
  face: { fr: "Visage & diagnostic", en: "Face & diagnostics" },
  body: { fr: "Remodelage corporel & amincissement", en: "Body contouring & slimming" },
  "aesthetic-gyneco": { fr: "Médecine esthétique & gynécologie", en: "Aesthetic medicine & gynecology" },
  physio: { fr: "Physiothérapie & équipements", en: "Physiotherapy & equipment" },
};

// Nom court des univers (grandes cartes de l'accueil).
export const universeLabels: Record<CategoryKey, string> = {
  lasers: "Laser",
  face: "Face",
  body: "Body",
  "aesthetic-gyneco": "Medical",
  physio: "Physio",
};

// Catalogue Cellulift, par famille.
const catalog: Record<CategoryKey, string[]> = {
  lasers: [
    "ALEX YAG ULTRA", "FRAC’COV 4", "HANOVER 5G", "LA QUEEN", "LASER SHOCK", "MEGALIGHT", "SYNERGY+",
    "NEW EPIL’LIGHT", "LED FOTOSKIN", "LED BIO-LIGHT", "LED FOTOSKIN ULTRA", "LONGIFLASH", "VAGILASE",
    "SEVENWAVES", "FOTOKROM",
  ],
  face: [
    "AQUA’PEEL", "BIOFILLER X7", "CENTRIFUGEL", "DERMABRASIF 6G", "DERMAPLEX", "FREQUENCIOUS",
    "MYM DERMAPEN", "PISTOR +34", "SKIN ANALYSER G7", "SKIN BRIGHT",
  ],
  body: [
    "BODYTECH 9", "BRASILIFT", "ELITECOLOMBIA", "HOT POWER", "LONGCHOC", "LONGISHAPE", "PANDASLIM",
    "PRESSOLIGNE 5", "SHOCSTEEL", "SLIMAX LIPO 3", "SLIMAX LIPO 7", "TANITA", "STEEL MUSCLE",
  ],
  "aesthetic-gyneco": ["FREQUENTAZIA", "PERFECT’LIFT", "REJUVSKIN"],
  physio: ["T-CARE 6G", "CRYOCOVER", "DREAMTECH PRO", "PHYSIOMEDIC A600", "UltraTrio Pro", "LONGILYSE"],
};

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\+/g, " plus ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const technologies: Technology[] = (Object.keys(catalog) as CategoryKey[]).flatMap((category) =>
  catalog[category].map((name) => ({ slug: slugify(name), name, category }))
);

export const technologiesIn = (category: CategoryKey) => technologies.filter((t) => t.category === category);

export function getTechnologyBySlug(slug: string) {
  return technologies.find((t) => t.slug === slug);
}
