import type { LocalizedText } from "./technologies";

export interface TimelineMilestone {
  year: string;
  title: LocalizedText;
  description: LocalizedText;
}

export const timeline: TimelineMilestone[] = [
  {
    year: "2007",
    title: { fr: "Fondation", en: "Founded" },
    description: {
      fr: "Cellulift est créé pour distribuer des technologies médico-esthétiques certifiées auprès des premiers cabinets partenaires en Afrique de l'Ouest.",
      en: "Cellulift is founded to distribute certified medico-aesthetic technologies to its first partner practices in West Africa.",
    },
  },
  {
    year: "2012",
    title: { fr: "Expansion régionale", en: "Regional expansion" },
    description: {
      fr: "Ouverture de nouveaux partenariats à Casablanca et Rabat, et structuration d'une équipe technique dédiée à l'installation et à la maintenance.",
      en: "New partnerships open in Casablanca and Rabat, alongside a dedicated technical team for installation and maintenance.",
    },
  },
  {
    year: "2016",
    title: { fr: "Naissance de Cellulift Academy", en: "Cellulift Academy is born" },
    description: {
      fr: "Lancement du programme de formation continue, sous la direction scientifique du Dr. Dadoun, pour certifier les praticiens sur chaque protocole.",
      en: "Launch of the continuous education program, under the scientific direction of Dr. Dadoun, to certify practitioners on every protocol.",
    },
  },
  {
    year: "2019",
    title: { fr: "Réseau AMED · IALIDRA · IYADA", en: "AMED · IALIDRA · IYADA network" },
    description: {
      fr: "Cellulift renforce ses liens avec les réseaux professionnels AMED, IALIDRA et IYADA pour ancrer sa rigueur clinique auprès des instances de référence.",
      en: "Cellulift strengthens ties with the AMED, IALIDRA and IYADA professional networks, anchoring its clinical rigor with leading reference bodies.",
    },
  },
  {
    year: "2023",
    title: { fr: "Présence à Marrakech, Tanger et Paris", en: "Presence in Marrakech, Tangier and Paris" },
    description: {
      fr: "Le réseau Cellulift s'étend pour couvrir Casablanca, Rabat, Marrakech, Tanger et Paris, au plus près de ses partenaires cliniques.",
      en: "The Cellulift network expands to cover Casablanca, Rabat, Marrakech, Tangier and Paris, staying close to its clinical partners.",
    },
  },
  {
    year: "2026",
    title: { fr: "19 ans d'exigence clinique", en: "19 years of clinical rigor" },
    description: {
      fr: "Cellulift poursuit sa mission : élever la pratique médico-esthétique africaine au niveau des standards technologiques les plus exigeants au monde.",
      en: "Cellulift continues its mission: elevating African medico-aesthetic practice to the world's most demanding technological standards.",
    },
  },
];
