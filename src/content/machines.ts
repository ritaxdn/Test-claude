import type { CategoryKey, LocalizedText } from "./technologies";

export interface MachineSpec {
  label: LocalizedText;
  value: LocalizedText;
}

export interface Machine {
  slug: string;
  name: string;
  category: CategoryKey;
  tagline: LocalizedText;
  description: LocalizedText;
  specs: MachineSpec[];
  certifications: string[];
}

export const machines: Machine[] = [
  {
    slug: "aquapeel",
    name: "Aqua'Peel",
    category: "face",
    tagline: {
      fr: "Hydra-nettoyage profond et illumination immédiate de la peau.",
      en: "Deep hydra-cleansing and immediate skin radiance.",
    },
    description: {
      fr: "Système d'hydradermabrasion à vortex qui exfolie, extrait et infuse en une seule séance, pour un teint visiblement plus lumineux dès la sortie de cabine.",
      en: "Vortex hydradermabrasion system that exfoliates, extracts and infuses in a single session, for a visibly brighter complexion the moment treatment ends.",
    },
    specs: [
      { label: { fr: "Technologie", en: "Technology" }, value: { fr: "Vortex hydradermabrasion", en: "Vortex hydradermabrasion" } },
      { label: { fr: "Séance", en: "Session" }, value: { fr: "30–45 min", en: "30–45 min" } },
      { label: { fr: "Éviction sociale", en: "Downtime" }, value: { fr: "Aucune", en: "None" } },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "brazilift",
    name: "Brazilift",
    category: "body",
    tagline: {
      fr: "Remodelage et fermeté corporelle par technologie combinée.",
      en: "Body remodeling and firmness through combined technology.",
    },
    description: {
      fr: "Plateforme de remodelage corporel associant radiofréquence et vacuum thérapeutique pour raffermir, tonifier et redessiner la silhouette sans chirurgie.",
      en: "Body contouring platform combining radiofrequency and therapeutic vacuum to firm, tone and reshape the silhouette without surgery.",
    },
    specs: [
      { label: { fr: "Technologie", en: "Technology" }, value: { fr: "RF multipolaire + vacuum", en: "Multipolar RF + vacuum" } },
      { label: { fr: "Zones traitées", en: "Treatment areas" }, value: { fr: "Fessiers, cuisses, abdomen", en: "Glutes, thighs, abdomen" } },
      { label: { fr: "Protocole", en: "Protocol" }, value: { fr: "6–8 séances recommandées", en: "6–8 sessions recommended" } },
    ],
    certifications: ["CE Medical", "ISO 13485"],
  },
  {
    slug: "skinbright",
    name: "Skinbright",
    category: "face",
    tagline: {
      fr: "Traitement des taches pigmentaires et uniformisation du teint.",
      en: "Pigmentation treatment and complexion uniformity.",
    },
    description: {
      fr: "Plateforme lumière pulsée de précision, calibrée pour cibler la mélanine en excès et corriger les irrégularités de pigmentation sur tous phototypes.",
      en: "Precision pulsed-light platform, calibrated to target excess melanin and correct pigmentation irregularities across all skin phototypes.",
    },
    specs: [
      { label: { fr: "Technologie", en: "Technology" }, value: { fr: "IPL nouvelle génération", en: "Next-gen IPL" } },
      { label: { fr: "Indications", en: "Indications" }, value: { fr: "Taches, mélasma, teint terne", en: "Spots, melasma, dull skin" } },
      { label: { fr: "Phototypes", en: "Skin types" }, value: { fr: "Adapté peaux mates à foncées", en: "Suited to medium–dark skin" } },
    ],
    certifications: ["CE Medical", "FDA"],
  },
  {
    slug: "slimax-lipo-7",
    name: "Slimax Lipo 7",
    category: "body",
    tagline: {
      fr: "Plateforme 7-en-1 pour la silhouette et la performance clinique.",
      en: "7-in-1 platform for body contouring and clinical performance.",
    },
    description: {
      fr: "Sept technologies complémentaires — cryolipolyse, RF, ultrasons, vacuum, EMS — réunies sur une seule plateforme pour composer des protocoles sur-mesure à haute rentabilité.",
      en: "Seven complementary technologies — cryolipolysis, RF, ultrasound, vacuum, EMS — united on a single platform to build high-yield, tailor-made protocols.",
    },
    specs: [
      { label: { fr: "Modules", en: "Modules" }, value: { fr: "7 technologies intégrées", en: "7 integrated technologies" } },
      { label: { fr: "Positionnement", en: "Positioning" }, value: { fr: "Plateforme phare cabinet/clinique", en: "Flagship clinic platform" } },
      { label: { fr: "ROI", en: "ROI" }, value: { fr: "Multi-protocoles, un investissement", en: "Multi-protocol, one investment" } },
    ],
    certifications: ["CE Medical", "ISO 13485"],
  },
  {
    slug: "laser-co2",
    name: "Laser CO2",
    category: "face",
    tagline: {
      fr: "Resurfaçage cutané fractionné de référence.",
      en: "Reference-standard fractional skin resurfacing.",
    },
    description: {
      fr: "Laser CO2 fractionné à balayage micro-précis, indiqué pour le resurfaçage cutané, les cicatrices et le relâchement modéré, avec un contrôle thermique optimisé.",
      en: "Fractional CO2 laser with micro-precise scanning, indicated for skin resurfacing, scarring and moderate laxity, with optimized thermal control.",
    },
    specs: [
      { label: { fr: "Technologie", en: "Technology" }, value: { fr: "CO2 fractionné 10 600 nm", en: "Fractional CO2, 10,600 nm" } },
      { label: { fr: "Indications", en: "Indications" }, value: { fr: "Cicatrices, texture, rides", en: "Scarring, texture, wrinkles" } },
      { label: { fr: "Récupération", en: "Recovery" }, value: { fr: "3–5 jours selon protocole", en: "3–5 days depending on protocol" } },
    ],
    certifications: ["CE Medical", "FDA"],
  },
  {
    slug: "hot-power",
    name: "Hot Power",
    category: "body",
    tagline: {
      fr: "Radiofréquence thermique pour la fermeté profonde.",
      en: "Thermal radiofrequency for deep firmness.",
    },
    description: {
      fr: "Génération de chaleur volumique contrôlée en profondeur du derme pour stimuler la néocollagenèse et raffermir durablement corps et visage.",
      en: "Controlled deep-dermal volumetric heating that stimulates neocollagenesis for lasting firmness on both body and face.",
    },
    specs: [
      { label: { fr: "Technologie", en: "Technology" }, value: { fr: "RF monopolaire haute puissance", en: "High-power monopolar RF" } },
      { label: { fr: "Zones traitées", en: "Treatment areas" }, value: { fr: "Corps et visage", en: "Body and face" } },
      { label: { fr: "Confort patient", en: "Patient comfort" }, value: { fr: "Contrôle thermique en temps réel", en: "Real-time thermal control" } },
    ],
    certifications: ["CE Medical"],
  },
  {
    slug: "dermabrasif-6g",
    name: "Dermabrasif 6G",
    category: "face",
    tagline: {
      fr: "Microdermabrasion nouvelle génération, précision chirurgicale.",
      en: "Next-generation microdermabrasion, surgical precision.",
    },
    description: {
      fr: "Sixième génération du système de microdermabrasion Cellulift : contrôle de pression assisté, embouts calibrés, résultats reproductibles pour une pratique exigeante.",
      en: "Sixth generation of the Cellulift microdermabrasion system: assisted pressure control, calibrated tips, reproducible results for a demanding practice.",
    },
    specs: [
      { label: { fr: "Technologie", en: "Technology" }, value: { fr: "Microdermabrasion assistée", en: "Assisted microdermabrasion" } },
      { label: { fr: "Génération", en: "Generation" }, value: { fr: "6G — contrôle de pression", en: "6G — pressure control" } },
      { label: { fr: "Usage", en: "Use case" }, value: { fr: "Instituts, cliniques, spas médicaux", en: "Institutes, clinics, medical spas" } },
    ],
    certifications: ["CE Medical"],
  },
];

export function getMachineBySlug(slug: string) {
  return machines.find((m) => m.slug === slug);
}
