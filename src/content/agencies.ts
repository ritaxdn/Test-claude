import { company } from "./company";

/**
 * Pages agences (SEO local : « matériel esthétique Casablanca », « … Marrakech », « … Tanger »).
 * Adresses et coordonnées : celles des showrooms de company.ts. Textes à valider par Cellulift.
 */
export type AgencyKey = "casablanca" | "marrakech" | "tanger";

type Text = { fr: string; en: string };

export const agencies: Record<AgencyKey, { title: Text; h1: Text; description: Text; intro: Text }> = {
  casablanca: {
    title: { fr: "Matériel médico-esthétique à Casablanca : showroom", en: "Medical aesthetic equipment in Casablanca: showroom" },
    h1: { fr: "Matériel médico-esthétique à Casablanca", en: "Medical aesthetic equipment in Casablanca" },
    description: {
      fr: "Showroom et siège CELLULIFT à Casablanca : démonstration des technologies médico-esthétiques, installation, formation Cellulift Academy et service après-vente.",
      en: "CELLULIFT showroom and head office in Casablanca: medical aesthetic technology demonstrations, installation, Cellulift Academy training and after-sales service.",
    },
    intro: {
      fr: "Le siège de CELLULIFT et son showroom vous accueillent à Casablanca, dans le Quartier des Hôpitaux. Découvrez nos technologies en démonstration et échangez avec notre équipe sur votre projet : choix de la machine, installation, formation et service après-vente.",
      en: "CELLULIFT’s head office and showroom welcome you in Casablanca, in the Quartier des Hôpitaux. See our technologies in demonstration and discuss your project with our team: choice of device, installation, training and after-sales service.",
    },
  },
  marrakech: {
    title: { fr: "Matériel médico-esthétique à Marrakech : agence", en: "Medical aesthetic equipment in Marrakech: branch" },
    h1: { fr: "Matériel médico-esthétique à Marrakech", en: "Medical aesthetic equipment in Marrakech" },
    description: {
      fr: "Agence CELLULIFT à Marrakech : technologies médico-esthétiques pour médecins, cliniques et centres, avec démonstration, installation, formation et service après-vente.",
      en: "CELLULIFT branch in Marrakech: medical aesthetic technologies for physicians, clinics and centers, with demonstration, installation, training and after-sales service.",
    },
    intro: {
      fr: "L’agence CELLULIFT de Marrakech accompagne les médecins, cliniques et centres de la région. Découvrez nos technologies et échangez avec notre équipe sur votre projet : choix de la machine, installation, formation et service après-vente.",
      en: "CELLULIFT’s Marrakech branch supports physicians, clinics and centers in the region. Discover our technologies and discuss your project with our team: choice of device, installation, training and after-sales service.",
    },
  },
  tanger: {
    title: { fr: "Matériel médico-esthétique à Tanger : agence", en: "Medical aesthetic equipment in Tangier: branch" },
    h1: { fr: "Matériel médico-esthétique à Tanger", en: "Medical aesthetic equipment in Tangier" },
    description: {
      fr: "Agence CELLULIFT à Tanger : technologies médico-esthétiques pour médecins, cliniques et centres du Nord, avec démonstration, installation, formation et service après-vente.",
      en: "CELLULIFT branch in Tangier: medical aesthetic technologies for physicians, clinics and centers in the North, with demonstration, installation, training and after-sales service.",
    },
    intro: {
      fr: "L’agence CELLULIFT de Tanger accompagne les médecins, cliniques et centres du Nord du Maroc. Découvrez nos technologies et échangez avec notre équipe sur votre projet : choix de la machine, installation, formation et service après-vente.",
      en: "CELLULIFT’s Tangier branch supports physicians, clinics and centers in northern Morocco. Discover our technologies and discuss your project with our team: choice of device, installation, training and after-sales service.",
    },
  },
};

export const agencyKeys = Object.keys(agencies) as AgencyKey[];
export const agencyPath = (key: AgencyKey) => `/agences/${key}`;
/** Adresse, ville et coordonnées GPS de l'agence (showrooms de company.ts). */
export const agencyShowroom = (key: AgencyKey) => company.showrooms.find((s) => s.id === key)!;

export const agencyLabels = {
  fr: {
    eyebrow: "Agence CELLULIFT",
    breadcrumb: "Agences",
    address: "Adresse",
    phone: "Téléphone",
    directions: "Itinéraire",
    demo: "Demander une démonstration",
    whatsapp: "Écrire sur WhatsApp",
    whatsappText: (city: string) => `Bonjour Cellulift, je souhaite une démonstration dans votre agence de ${city}.`,
    ranges: "Les gammes disponibles",
    rangesNote: "Toutes nos technologies sont disponibles depuis chaque agence.",
    others: "Nos autres agences",
    hq: "Siège et showroom",
  },
  en: {
    eyebrow: "CELLULIFT branch",
    breadcrumb: "Branches",
    address: "Address",
    phone: "Phone",
    directions: "Directions",
    demo: "Request a demo",
    whatsapp: "Message us on WhatsApp",
    whatsappText: (city: string) => `Hello Cellulift, I would like a demonstration at your ${city} branch.`,
    ranges: "Available ranges",
    rangesNote: "All our technologies are available from every branch.",
    others: "Our other branches",
    hq: "Head office and showroom",
  },
};
