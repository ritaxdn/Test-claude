import type { CategoryKey, LocalizedText } from "./technologies";

/**
 * Pages de gamme (landing pages SEO), une par gamme du catalogue. Solutions lasers et Amincissement : textes validés par
 * Cellulift. Réjuvénation, Photomodulation, HIFU et Thérapie avancée : descriptions reprises des fiches machines,
 * introductions sur le modèle des introductions validées (à valider par Cellulift).
 * Machines et indications viennent du catalogue existant (technologies.ts, technology-sheets.ts) : rien n'est rédigé ici
 * en dehors des titres et des introductions validées par Cellulift (`intro`, vide = non affiché).
 * Module léger (sans le catalogue) : utilisable dans les composants client.
 */
export type LandingKey = "lasers" | "amincissement" | "rejuvenation" | "photomodulation" | "hifu" | "therapie";

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
      fr: "Lasers médicaux et esthétiques professionnels au Maroc",
      en: "Professional medical and aesthetic lasers in Morocco",
    },
    h1: { fr: "Solutions lasers professionnelles", en: "Professional laser solutions" },
    description: {
      fr: "Découvrez les lasers médicaux et esthétiques distribués par CELLULIFT au Maroc : épilation, pigments, détatouage, resurfaçage CO2 et endolift.",
      en: "Discover the medical and aesthetic lasers distributed by CELLULIFT in Morocco: hair removal, pigmentation, tattoo removal, CO2 resurfacing and endolift.",
    },
    // Introduction validée par Cellulift
    intro: {
      fr: "CELLULIFT propose une sélection de technologies laser professionnelles destinées aux médecins, cliniques et centres spécialisés. Découvrez les différentes plateformes de la gamme et identifiez la technologie adaptée à votre pratique, avec l’accompagnement CELLULIFT : installation, formation et support.",
      en: "CELLULIFT offers a selection of professional laser technologies for physicians, clinics and specialized centers. Explore the platforms in the range and identify the technology suited to your practice, supported by CELLULIFT installation, training and support services.",
    },
  },
  amincissement: {
    category: "amincissement",
    // Décision Cellulift : hors du cœur de la landing Amincissement
    exclude: ["hot-power", "bodytech-9", "tanita", "longchoc", "shocsteel"],
    title: {
      fr: "Appareils d'amincissement professionnels au Maroc",
      en: "Professional body contouring devices in Morocco",
    },
    h1: { fr: "Amincissement et remodelage corporel", en: "Body contouring and slimming" },
    description: {
      fr: "Appareils d'amincissement et de remodelage corporel distribués par CELLULIFT au Maroc : cellulite, graisse localisée, relâchement cutané et drainage.",
      en: "Discover the body contouring and slimming devices distributed by CELLULIFT in Morocco: cellulite, localised fat, skin laxity and drainage.",
    },
    // Introduction validée par Cellulift
    intro: {
      fr: "Découvrez les technologies professionnelles CELLULIFT dédiées au remodelage corporel et à l’accompagnement des protocoles d’amincissement. Comparez les différentes solutions de la gamme et échangez avec notre équipe pour identifier l’équipement adapté à votre pratique.",
      en: "Discover CELLULIFT professional technologies dedicated to body contouring and slimming protocols. Compare the solutions in the range and speak with our team to identify the equipment suited to your practice.",
    },
  },
  rejuvenation: {
    category: "rejuvenation",
    exclude: [],
    title: {
      fr: "Appareils de réjuvénation cutanée professionnels au Maroc",
      en: "Professional skin rejuvenation devices in Morocco",
    },
    h1: { fr: "Réjuvénation cutanée", en: "Skin rejuvenation" },
    description: {
      fr: "Appareils professionnels de réjuvénation cutanée distribués par CELLULIFT au Maroc : radiofréquence à micro-aiguilles, microneedling, plasma pen, Biofiller autologue et analyse de peau.",
      en: "Professional skin rejuvenation devices distributed by CELLULIFT in Morocco: microneedle radiofrequency, microneedling, plasma pen, autologous Biofiller and skin analysis.",
    },
    intro: {
      fr: "CELLULIFT propose une sélection de technologies professionnelles de réjuvénation cutanée destinées aux médecins, cliniques et centres spécialisés. Découvrez les différentes solutions de la gamme et identifiez la technologie adaptée à votre pratique, avec l’accompagnement CELLULIFT : installation, formation et support.",
      en: "CELLULIFT offers a selection of professional skin rejuvenation technologies for physicians, clinics and specialized centers. Explore the solutions in the range and identify the technology suited to your practice, supported by CELLULIFT installation, training and support services.",
    },
  },
  photomodulation: {
    category: "photomodulation",
    exclude: [],
    title: {
      fr: "LED et photomodulation professionnelles au Maroc",
      en: "Professional LED and photomodulation devices in Morocco",
    },
    h1: { fr: "Photomodulation LED", en: "LED photomodulation" },
    description: {
      fr: "Panneaux LED professionnels pour le visage, le corps et la zone intime, distribués par CELLULIFT au Maroc, pour renforcer vos protocoles de soin.",
      en: "Professional LED panels for the face, body and intimate area, distributed by CELLULIFT in Morocco, to enhance your treatment protocols.",
    },
    intro: {
      fr: "Découvrez les technologies de photomodulation LED proposées par CELLULIFT pour le visage, le corps et la zone intime. Comparez les solutions de la gamme et échangez avec notre équipe pour identifier l’équipement adapté à votre pratique.",
      en: "Discover the LED photomodulation technologies offered by CELLULIFT for the face, body and intimate area. Compare the solutions in the range and speak with our team to identify the equipment suited to your practice.",
    },
  },
  hifu: {
    category: "hifu",
    exclude: [],
    title: {
      fr: "Appareils HIFU professionnels au Maroc",
      en: "Professional HIFU devices in Morocco",
    },
    h1: { fr: "HIFU, ultrasons focalisés", en: "HIFU, focused ultrasound" },
    description: {
      fr: "Plateformes HIFU (ultrasons focalisés de haute intensité) distribuées par CELLULIFT au Maroc : visage, corps et zone intime, sans chirurgie.",
      en: "HIFU (high-intensity focused ultrasound) platforms distributed by CELLULIFT in Morocco: face, body and intimate area, without surgery.",
    },
    intro: {
      fr: "CELLULIFT propose des plateformes HIFU professionnelles destinées aux médecins, cliniques et centres spécialisés. Découvrez les technologies de la gamme et identifiez celle adaptée à votre pratique, avec l’accompagnement CELLULIFT : installation, formation et support.",
      en: "CELLULIFT offers professional HIFU platforms for physicians, clinics and specialized centers. Explore the technologies in the range and identify the one suited to your practice, supported by CELLULIFT installation, training and support services.",
    },
  },
  therapie: {
    category: "therapie",
    exclude: [],
    title: {
      fr: "Appareils de physiothérapie et thérapie avancée au Maroc",
      en: "Advanced therapy and physiotherapy devices in Morocco",
    },
    h1: { fr: "Thérapie avancée", en: "Advanced therapy" },
    description: {
      fr: "Technologies de thérapie avancée distribuées par CELLULIFT au Maroc : physiothérapie, técarthérapie, cryothérapie compressive, radiofréquence intime et équipement de cabinet.",
      en: "Advanced therapy technologies distributed by CELLULIFT in Morocco: physiotherapy, tecar therapy, compressive cryotherapy, intimate radiofrequency and practice equipment.",
    },
    intro: {
      fr: "Découvrez les technologies professionnelles CELLULIFT dédiées à la physiothérapie, à la récupération et à la santé intime. Comparez les solutions de la gamme et échangez avec notre équipe pour identifier l’équipement adapté à votre cabinet.",
      en: "Discover CELLULIFT professional technologies dedicated to physiotherapy, recovery and intimate health. Compare the solutions in the range and speak with our team to identify the equipment suited to your practice.",
    },
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
