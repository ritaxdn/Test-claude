import { sheets } from "./technology-sheets";

export type LocalizedText = {
  fr: string;
  en: string;
};

export type CategoryKey = "amincissement" | "lasers" | "rejuvenation" | "photomodulation" | "hifu" | "therapie";

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
  // « tall » : photos très verticales (machine sur pied), affichées en colonnes côte à côte, sans recadrage.
  // « portrait » : photos verticales 2/3, alignées en 4 colonnes (2 sur téléphone).
  imageLayout?: "tall" | "portrait";
}

// Gammes de produits (même découpage que le dossier MACHINES du Drive).
export const categories: Record<CategoryKey, LocalizedText> = {
  amincissement: { fr: "Amincissement avancé", en: "Advanced slimming" },
  lasers: { fr: "Solutions lasers", en: "Laser solutions" },
  rejuvenation: { fr: "Réjuvénation cutanée", en: "Skin rejuvenation" },
  photomodulation: { fr: "Photomodulation", en: "Photomodulation" },
  hifu: { fr: "HIFU", en: "HIFU" },
  therapie: { fr: "Thérapie avancée", en: "Advanced therapy" },
};

// Libellé complet quand le nom court ne suffit pas.
export const categoryDetail: Partial<Record<CategoryKey, LocalizedText>> = {
  hifu: { fr: "Ultrasons focalisés de haute intensité", en: "High-intensity focused ultrasound" },
};

// Catalogue Cellulift, par gamme.
const catalog: Record<CategoryKey, string[]> = {
  amincissement: [
    "BODYTECH 9", "BRASILIFT", "ELITECOLOMBIA", "HOT POWER", "LONGCHOC", "LONGISHAPE", "LONGILYSE", "PANDASLIM",
    "PRESSOLIGNE 5", "SHOCSTEEL", "SLIMAX LIPO 3", "SLIMAX LIPO 7", "STEEL MUSCLE", "TANITA",
  ],
  lasers: [
    "ALEX YAG ULTRA", "FOTOKROM", "FRAC’COV 4", "HANOVER 5G", "LA QUEEN", "LASER SHOCK", "MEGALIGHT",
    "NEW EPIL’LIGHT", "SEVENWAVES", "SYNERGY+",
  ],
  rejuvenation: [
    "BIOFILLER X7", "CENTRIFUGEL", "DERMABRASIF 6G", "DERMAPLEX", "FREQUENCIOUS",
    "MYM DERMAPEN", "PISTOR +34", "SKIN ANALYSER G7", "SKIN BRIGHT",
  ],
  photomodulation: ["LED BIO-LIGHT", "LED FOTOSKIN", "LED FOTOSKIN ULTRA", "LONGIFLASH"],
  hifu: ["PERFECT’LIFT", "REJUVSKIN", "VAGILASE"],
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
  brasilift: ["00", "01", "02", "03"].map((n) => `/images/technologies/brasilift/${n}.jpg`),
  "slimax-lipo-7": ["00", "01"].map((n) => `/images/technologies/slimax-lipo-7/${n}.jpg`),
  centrifugel: ["00", "01", "02", "03"].map((n) => `/images/technologies/centrifugel/${n}.jpg`),
  longishape: ["00", "01", "02"].map((n) => `/images/technologies/longishape/${n}.jpg`),
  "pressoligne-5": ["00", "01", "02", "03"].map((n) => `/images/technologies/pressoligne-5/${n}.jpg`),
  elitecolombia: ["/images/technologies/elitecolombia/00.jpg"],
  longilyse: ["00", "01", "02", "03", "04", "05", "06", "07"].map((n) => `/images/technologies/longilyse/${n}.jpg`),
  sevenwaves: ["00", "01", "02", "03", "04", "05", "06"].map((n) => `/images/technologies/sevenwaves/${n}.jpg`),
  "slimax-lipo-3": ["00", "01", "02", "03", "04", "05"].map((n) => `/images/technologies/slimax-lipo-3/${n}.jpg`),
  "steel-muscle": ["00", "01", "02", "03", "04"].map((n) => `/images/technologies/steel-muscle/${n}.jpg`),
  tanita: ["00", "01", "02", "03", "04"].map((n) => `/images/technologies/tanita/${n}.jpg`),
  longchoc: ["/images/technologies/longchoc/00.jpg"],
  "la-queen": ["00", "01", "02", "03", "04"].map((n) => `/images/technologies/la-queen/v2-${n}.jpg`),
  "hanover-5g": ["00", "01", "02", "03", "04"].map((n) => `/images/technologies/hanover-5g/v2-${n}.jpg`),
  frequentazia: ["00", "01", "02", "03"].map((n) => `/images/technologies/frequentazia/${n}.jpg`),
  "led-bio-light": ["00", "01", "02", "03"].map((n) => `/images/technologies/led-bio-light/${n}.jpg`),
  longiflash: ["00", "01", "02", "03", "04", "05"].map((n) => `/images/technologies/longiflash/${n}.jpg`),
  "synergy-plus": ["00", "01", "02"].map((n) => `/images/technologies/synergy-plus/${n}.jpg`),
};

// Mise en page des photos par machine (sinon : grande photo + vignettes).
const layouts: Record<string, Technology["imageLayout"]> = { longishape: "tall", "pressoligne-5": "portrait" };

export const technologies: Technology[] = (Object.keys(catalog) as CategoryKey[]).flatMap((category) =>
  catalog[category].map((name) => {
    const slug = slugify(name);
    return { slug, name, category, ...sheets[slug], images: photos[slug], imageLayout: layouts[slug] };
  })
);

export const technologiesIn = (category: CategoryKey) => technologies.filter((t) => t.category === category);

// Photo de couverture d'un univers : celle de la première machine photographiée de la famille.
// Couvertures choisies explicitement (sinon : première machine photographiée de la famille).
const covers: Partial<Record<CategoryKey, string>> = {
  rejuvenation: "/images/technologies/dermabrasif-6g/00.jpg",
};

export const universeCover = (category: CategoryKey) =>
  covers[category] ?? technologiesIn(category).find((t) => t.images?.length)?.images?.[0];

export function getTechnologyBySlug(slug: string) {
  return technologies.find((t) => t.slug === slug);
}
