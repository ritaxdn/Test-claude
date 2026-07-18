import type { LocalizedText } from "./technologies";

export interface AcademyProgram {
  slug: string;
  level: LocalizedText;
  title: LocalizedText;
  format: LocalizedText;
  duration: LocalizedText;
  description: LocalizedText;
  topics: LocalizedText[];
}

export const academyPrograms: AcademyProgram[] = [
  {
    slug: "fondamentaux-esthetique-medicale",
    level: { fr: "Fondamentaux", en: "Fundamentals" },
    title: {
      fr: "Fondamentaux de l'esthétique médicale",
      en: "Fundamentals of medical aesthetics",
    },
    format: { fr: "Présentiel", en: "In-person" },
    duration: { fr: "2 jours", en: "2 days" },
    description: {
      fr: "Bases scientifiques, physiologie cutanée et sélection des indications pour une pratique sûre et efficace des technologies médico-esthétiques.",
      en: "Scientific foundations, skin physiology and indication selection for a safe, effective practice of medical aesthetic technologies.",
    },
    topics: [
      { fr: "Physiologie de la peau et des tissus", en: "Skin and tissue physiology" },
      { fr: "Sélection des indications", en: "Indication selection" },
      { fr: "Protocoles de sécurité", en: "Safety protocols" },
    ],
  },
  {
    slug: "masterclass-radiofrequence-hifu",
    level: { fr: "Masterclass", en: "Masterclass" },
    title: {
      fr: "Masterclass Radiofréquence & HIFU",
      en: "Radiofrequency & HIFU masterclass",
    },
    format: { fr: "Présentiel + pratique", en: "In-person + hands-on" },
    duration: { fr: "1 jour", en: "1 day" },
    description: {
      fr: "Approfondissement technique et pratique clinique encadrée sur les protocoles de remodelage corporel et de lifting facial par ultrasons focalisés.",
      en: "Advanced technical training with supervised clinical practice on body contouring and HIFU facial lifting protocols.",
    },
    topics: [
      { fr: "Réglages et paramétrage machine", en: "Device settings and parameters" },
      { fr: "Cas cliniques commentés", en: "Commented clinical cases" },
      { fr: "Pratique encadrée sur modèle", en: "Supervised practice on model" },
    ],
  },
  {
    slug: "epilation-laser-peaux-foncees",
    level: { fr: "Spécialisation", en: "Specialization" },
    title: {
      fr: "Épilation laser sur peaux mates et foncées",
      en: "Laser hair removal on medium to dark skin",
    },
    format: { fr: "Présentiel + pratique", en: "In-person + hands-on" },
    duration: { fr: "1 jour", en: "1 day" },
    description: {
      fr: "Spécificités du traitement laser sur phototypes IV à VI : sécurité, choix des paramètres et prévention des effets indésirables.",
      en: "Specifics of laser treatment for Fitzpatrick IV-VI skin types: safety, parameter selection, and adverse-effect prevention.",
    },
    topics: [
      { fr: "Phototypes et longueurs d'onde", en: "Skin phototypes and wavelengths" },
      { fr: "Gestion des effets indésirables", en: "Managing adverse effects" },
      { fr: "Suivi patient", en: "Patient follow-up" },
    ],
  },
  {
    slug: "business-cabinet-esthetique",
    level: { fr: "Business", en: "Business" },
    title: {
      fr: "Développer son cabinet d'esthétique médicale",
      en: "Growing a medical aesthetics practice",
    },
    format: { fr: "Distanciel", en: "Remote" },
    duration: { fr: "3 sessions", en: "3 sessions" },
    description: {
      fr: "Positionnement, tarification et fidélisation patient pour intégrer durablement les nouvelles technologies dans votre offre de soins.",
      en: "Positioning, pricing and patient retention to sustainably integrate new technologies into your care offering.",
    },
    topics: [
      { fr: "Positionnement et tarification", en: "Positioning and pricing" },
      { fr: "Parcours patient", en: "Patient journey" },
      { fr: "Communication médicale responsable", en: "Responsible medical communication" },
    ],
  },
];
