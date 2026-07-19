export type LocalizedText = {
  fr: string;
  en: string;
};

export type CategoryKey =
  | "body"
  | "face"
  | "hair-removal"
  | "hair-restoration";

export interface Technology {
  slug: string;
  name: string;
  category: CategoryKey;
  tagline: LocalizedText;
  description: LocalizedText;
  indications: LocalizedText[];
  benefits: LocalizedText[];
  certifications: string[];
}

export const categories: Record<CategoryKey, LocalizedText> = {
  body: { fr: "Remodelage corporel", en: "Body contouring" },
  face: { fr: "Rajeunissement facial", en: "Facial rejuvenation" },
  "hair-removal": { fr: "Épilation définitive", en: "Laser hair removal" },
  "hair-restoration": { fr: "Technologies capillaires", en: "Hair restoration" },
};

export const technologies: Technology[] = [
  {
    slug: "cellushape-pro",
    name: "CelluShape Pro",
    category: "body",
    tagline: {
      fr: "Remodelage corporel non invasif par radiofréquence multipolaire.",
      en: "Non-invasive body contouring by multipolar radiofrequency.",
    },
    description: {
      fr: "CelluShape Pro combine radiofréquence multipolaire et vacuum thérapeutique pour cibler les tissus adipeux résistants et raffermir la peau, sans temps de récupération.",
      en: "CelluShape Pro combines multipolar radiofrequency and therapeutic vacuum to target resistant adipose tissue and firm the skin, with no downtime.",
    },
    indications: [
      { fr: "Cellulite et capitons", en: "Cellulite and dimpling" },
      { fr: "Relâchement cutané modéré", en: "Moderate skin laxity" },
      { fr: "Silhouette et fermeté", en: "Body contouring and firmness" },
    ],
    benefits: [
      { fr: "Sans douleur, sans éviction sociale", en: "Pain-free, no downtime" },
      { fr: "Résultats progressifs et durables", en: "Progressive, lasting results" },
      { fr: "Protocoles adaptés à chaque zone", en: "Protocols adapted per treatment area" },
    ],
    certifications: ["CE Medical", "ISO 13485"],
  },
  {
    slug: "celluice-cryo",
    name: "CelluIce Cryo",
    category: "body",
    tagline: {
      fr: "Cryolipolyse de nouvelle génération pour la réduction localisée des graisses.",
      en: "Next-generation cryolipolysis for localized fat reduction.",
    },
    description: {
      fr: "Technologie de cryolipolyse à double applicateur, contrôle thermique précis et confort patient optimisé pour un traitement des amas graisseux localisés en toute sécurité.",
      en: "Dual-applicator cryolipolysis technology with precise thermal control and optimized patient comfort for safely treating localized fat deposits.",
    },
    indications: [
      { fr: "Amas graisseux localisés", en: "Localized fat deposits" },
      { fr: "Zones abdominale, flancs, cuisses", en: "Abdomen, flanks, thighs" },
    ],
    benefits: [
      { fr: "Double applicateur, séance optimisée", en: "Dual applicator, optimized session time" },
      { fr: "Contrôle thermique de sécurité", en: "Safety thermal control" },
      { fr: "Aucune éviction sociale", en: "No social downtime" },
    ],
    certifications: ["CE Medical", "FDA"],
  },
  {
    slug: "celluglow-hifu",
    name: "CelluGlow HIFU",
    category: "face",
    tagline: {
      fr: "Lifting facial par ultrasons focalisés de haute intensité.",
      en: "Facial lifting with high-intensity focused ultrasound.",
    },
    description: {
      fr: "CelluGlow HIFU délivre une énergie ultrasonique focalisée dans les plans profonds du derme et du SMAS, stimulant la production de collagène pour un effet lifting naturel et progressif.",
      en: "CelluGlow HIFU delivers focused ultrasound energy into the deep dermal and SMAS layers, stimulating collagen production for a natural, progressive lifting effect.",
    },
    indications: [
      { fr: "Relâchement du visage et du cou", en: "Facial and neck laxity" },
      { fr: "Ovale du visage", en: "Facial contour redefinition" },
    ],
    benefits: [
      { fr: "Effet lifting sans chirurgie", en: "Lifting effect without surgery" },
      { fr: "Stimulation naturelle du collagène", en: "Natural collagen stimulation" },
      { fr: "Résultats visibles dès 8 à 12 semaines", en: "Visible results from 8–12 weeks" },
    ],
    certifications: ["CE Medical", "FDA"],
  },
  {
    slug: "cellutight-rf",
    name: "CelluTight RF",
    category: "face",
    tagline: {
      fr: "Fractionnée par radiofréquence pour le resurfaçage cutané.",
      en: "Fractional radiofrequency for skin resurfacing.",
    },
    description: {
      fr: "Système de microneedling assisté par radiofréquence fractionnée, indiqué pour le resurfaçage cutané, les cicatrices et le renouvellement de la texture de peau.",
      en: "Fractional radiofrequency-assisted microneedling system, indicated for skin resurfacing, scarring and skin texture renewal.",
    },
    indications: [
      { fr: "Cicatrices d'acné", en: "Acne scarring" },
      { fr: "Texture et pores dilatés", en: "Skin texture and enlarged pores" },
      { fr: "Vergetures", en: "Stretch marks" },
    ],
    benefits: [
      { fr: "Profondeur d'aiguille ajustable", en: "Adjustable needle depth" },
      { fr: "Compatible tous phototypes", en: "Suitable for all skin phototypes" },
      { fr: "Temps de récupération minimal", en: "Minimal recovery time" },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "cellupulse-diode",
    name: "CelluPulse Diode",
    category: "hair-removal",
    tagline: {
      fr: "Épilation laser diode triple longueur d'onde.",
      en: "Triple-wavelength diode laser hair removal.",
    },
    description: {
      fr: "Plateforme laser diode combinant trois longueurs d'onde (755, 810, 1064 nm) pour une épilation définitive efficace et sécurisée sur tous types de peau, y compris les peaux mates et foncées.",
      en: "Diode laser platform combining three wavelengths (755, 810, 1064 nm) for effective, safe permanent hair reduction across all skin types, including darker skin tones.",
    },
    indications: [
      { fr: "Épilation définitive corps et visage", en: "Permanent hair reduction, body and face" },
      { fr: "Peaux mates à foncées (phototypes IV-VI)", en: "Medium to dark skin (Fitzpatrick IV-VI)" },
    ],
    benefits: [
      { fr: "Triple longueur d'onde, sécurité renforcée", en: "Triple wavelength, enhanced safety" },
      { fr: "Système de refroidissement intégré", en: "Integrated cooling system" },
      { fr: "Adapté aux peaux africaines", en: "Adapted for African skin tones" },
    ],
    certifications: ["CE Medical", "FDA"],
  },
  {
    slug: "cellucap-regen",
    name: "CelluCap Regen",
    category: "hair-restoration",
    tagline: {
      fr: "Stimulation capillaire par LED et micro-stimulation.",
      en: "Hair stimulation via LED and micro-stimulation.",
    },
    description: {
      fr: "Casque de photobiomodulation LED associé à la micro-stimulation du cuir chevelu, conçu pour ralentir la chute et stimuler la repousse dans un cadre médicalisé.",
      en: "LED photobiomodulation cap combined with scalp micro-stimulation, designed to slow hair loss and stimulate regrowth in a medically supervised setting.",
    },
    indications: [
      { fr: "Alopécie débutante à modérée", en: "Early to moderate alopecia" },
      { fr: "Densité et vitalité capillaire", en: "Hair density and vitality" },
    ],
    benefits: [
      { fr: "Protocole non invasif", en: "Non-invasive protocol" },
      { fr: "Complémentaire aux traitements médicaux", en: "Complements medical treatments" },
      { fr: "Séances courtes, confortables", en: "Short, comfortable sessions" },
    ],
    certifications: ["CE Medical"],
  },
];

export function getTechnologyBySlug(slug: string) {
  return technologies.find((t) => t.slug === slug);
}
