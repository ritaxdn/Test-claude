import type { CategoryKey, LocalizedText } from "./technologies";

const t = (fr: string, en: string): LocalizedText => ({ fr, en });

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
  /** Questions fréquentes de la page (facultatif) */
  faq?: [LocalizedText, LocalizedText][];
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
    // Recherches HIFU les plus fréquentes du site (Search Console, oct. 2026) : « lipo hifu », « hifu visage prix maroc », « hifu ».
    title: {
      fr: "Machine HIFU professionnelle au Maroc : visage, lipo HIFU, intime",
      en: "Professional HIFU machines in Morocco: face, lipo HIFU, intimate",
    },
    h1: { fr: "Machines HIFU professionnelles au Maroc", en: "Professional HIFU machines in Morocco" },
    description: {
      fr: "Machines HIFU pour médecins et centres au Maroc : HIFU visage (lifting sans chirurgie), lipo HIFU sur la graisse localisée, HIFU vaginal. Prix sur demande, démo en agence.",
      en: "HIFU machines for physicians and centres in Morocco: face HIFU (non-surgical lifting), lipo HIFU on localised fat, vaginal HIFU. Price on request, branch demos.",
    },
    intro: {
      fr: "Le HIFU (ultrasons focalisés de haute intensité) retend les tissus en profondeur, sans chirurgie ni éviction sociale. CELLULIFT distribue au Maroc des plateformes HIFU pour le visage (lifting, ovale, double menton), le corps (lipo HIFU, relâchement) et la zone intime, avec l'installation, la formation CELLULIFT Academy et le SAV.",
      en: "HIFU (high-intensity focused ultrasound) tightens tissue in depth, without surgery or downtime. CELLULIFT distributes HIFU platforms in Morocco for the face (lifting, jawline, double chin), the body (lipo HIFU, laxity) and the intimate area, with installation, CELLULIFT Academy training and after-sales.",
    },
    faq: [
      [t("Qu'est-ce que le HIFU ?", "What is HIFU?"), t("Des ultrasons focalisés de haute intensité qui chauffent les tissus en profondeur pour les retendre et stimuler le collagène, sans incision ni éviction sociale.", "High-intensity focused ultrasound that heats tissue in depth to tighten it and stimulate collagen, with no incision and no downtime.")],
      [t("Quelle machine HIFU pour le visage et la lipo HIFU ?", "Which HIFU machine for the face and lipo HIFU?"), t("Rejuvskin couvre le visage, le corps (lipo HIFU, relâchement) et la zone intime sur une seule plateforme. Perfect'Lift est dédié au HIFU vaginal.", "Rejuvskin covers face, body (lipo HIFU, laxity) and the intimate area on a single platform. Perfect'Lift is dedicated to vaginal HIFU.")],
      [t("Quel est le prix d'une machine HIFU au Maroc ?", "How much does a HIFU machine cost in Morocco?"), t("Le prix dépend de la machine et de sa configuration (têtes de traitement) : il est communiqué sur demande. Des solutions de financement sont disponibles.", "Pricing depends on the device and its configuration (treatment heads) and is shared on request. Financing options are available.")],
      [t("Peut-on essayer une machine HIFU avant d'acheter ?", "Can I try a HIFU machine before buying?"), t("Oui, sur rendez-vous dans nos agences de Casablanca, Marrakech et Tanger.", "Yes, by appointment at our branches in Casablanca, Marrakech and Tangier.")],
    ],
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
