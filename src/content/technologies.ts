export type LocalizedText = {
  fr: string;
  en: string;
};

export type CategoryKey = "rejuvenation" | "amincissement" | "lasers" | "hifu" | "photomodulation" | "therapie";

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
  // Photos (dans public/images/technologies/<slug>/) : la première sert de couverture.
  images?: string[];
}

// Familles par type de technologie (même découpage que le dossier MACHINES du Drive).
export const categories: Record<CategoryKey, LocalizedText> = {
  rejuvenation: { fr: "Réjuvénation cutanée", en: "Skin rejuvenation" },
  amincissement: { fr: "Amincissement", en: "Body slimming" },
  lasers: { fr: "Lasers", en: "Lasers" },
  hifu: { fr: "HIFU", en: "HIFU" },
  photomodulation: { fr: "Photomodulation", en: "Photomodulation" },
  therapie: { fr: "Thérapie avancée", en: "Advanced therapy" },
};

// Catalogue Cellulift, par famille.
const catalog: Record<CategoryKey, string[]> = {
  rejuvenation: [
    "AQUA’PEEL", "BIOFILLER X7", "CENTRIFUGEL", "DERMABRASIF 6G", "DERMAPLEX", "FREQUENCIOUS",
    "MYM DERMAPEN", "PISTOR +34", "SKIN ANALYSER G7", "SKIN BRIGHT",
  ],
  amincissement: [
    "BODYTECH 9", "BRASILIFT", "ELITECOLOMBIA", "HOT POWER", "LONGCHOC", "LONGISHAPE", "LONGILYSE", "PANDASLIM",
    "PRESSOLIGNE 5", "SHOCSTEEL", "SLIMAX LIPO 3", "SLIMAX LIPO 7", "STEEL MUSCLE", "TANITA",
  ],
  lasers: [
    "ALEX YAG ULTRA", "FOTOKROM", "FRAC’COV 4", "HANOVER 5G", "LA QUEEN", "LASER SHOCK", "MEGALIGHT",
    "NEW EPIL’LIGHT", "SEVENWAVES", "SYNERGY+",
  ],
  hifu: ["PERFECT’LIFT", "REJUVSKIN", "VAGILASE"],
  photomodulation: ["LED BIO-LIGHT", "LED FOTOSKIN", "LED FOTOSKIN ULTRA", "LONGIFLASH"],
  therapie: ["CRYOCOVER", "DREAMTECH PRO", "FREQUENTAZIA", "PHYSIOMEDIC A600", "T-CARE 6G", "UltraTrio Pro"],
};

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\+/g, " plus ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Photos par machine (slug → fichiers).
const photos: Record<string, string[]> = {
  "dermabrasif-6g": ["00", "05", "01", "02", "03", "04"].map((n) => `/images/technologies/dermabrasif-6g/${n}.jpg`),
};

export const technologies: Technology[] = (Object.keys(catalog) as CategoryKey[]).flatMap((category) =>
  catalog[category].map((name) => {
    const slug = slugify(name);
    return { slug, name, category, images: photos[slug] };
  })
);

export const technologiesIn = (category: CategoryKey) => technologies.filter((t) => t.category === category);

// Photo de couverture d'un univers : celle de la première machine photographiée de la famille.
export const universeCover = (category: CategoryKey) =>
  technologiesIn(category).find((t) => t.images?.length)?.images?.[0];

export function getTechnologyBySlug(slug: string) {
  return technologies.find((t) => t.slug === slug);
}
