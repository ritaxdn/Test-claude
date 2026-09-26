export type LocalizedText = {
  fr: string;
  en: string;
};

export type CategoryKey = "lasers" | "rajeunissement" | "amincissement" | "visage" | "medecine" | "physio";

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

// Familles par indication.
export const categories: Record<CategoryKey, LocalizedText> = {
  lasers: { fr: "Lasers", en: "Lasers" },
  rajeunissement: { fr: "Rajeunissement cutané", en: "Skin rejuvenation" },
  amincissement: { fr: "Amincissement & remodelage corporel", en: "Slimming & body contouring" },
  visage: { fr: "Soins du visage", en: "Facial treatments" },
  medecine: { fr: "Médecine esthétique", en: "Aesthetic medicine" },
  physio: { fr: "Physiothérapie", en: "Physiotherapy" },
};

// Catalogue Cellulift, par famille.
const catalog: Record<CategoryKey, string[]> = {
  lasers: [
    "ALEX YAG ULTRA", "FOTOKROM", "FRAC’COV 4", "HANOVER 5G", "LA QUEEN", "LASER SHOCK", "LONGIFLASH", "MEGALIGHT",
    "NEW EPIL’LIGHT", "SEVENWAVES", "SYNERGY+", "VAGILASE",
  ],
  rajeunissement: [
    "BIOFILLER X7", "CENTRIFUGEL", "DERMAPLEX", "LED BIO-LIGHT", "LED FOTOSKIN", "LED FOTOSKIN ULTRA", "MYM DERMAPEN",
    "PISTOR +34",
  ],
  amincissement: [
    "BODYTECH 9", "BRASILIFT", "ELITECOLOMBIA", "HOT POWER", "LONGCHOC", "LONGISHAPE", "LONGILYSE", "PANDASLIM",
    "PRESSOLIGNE 5", "SHOCSTEEL", "SLIMAX LIPO 3", "SLIMAX LIPO 7", "STEEL MUSCLE", "TANITA",
  ],
  visage: ["AQUA’PEEL", "DERMABRASIF 6G", "FREQUENCIOUS", "SKIN ANALYSER G7", "SKIN BRIGHT"],
  medecine: ["FREQUENTAZIA", "PERFECT’LIFT", "REJUVSKIN"],
  physio: ["CRYOCOVER", "DREAMTECH PRO", "PHYSIOMEDIC A600", "T-CARE 6G", "UltraTrio Pro"],
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
