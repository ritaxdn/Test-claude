import type { CategoryKey } from "./technologies";

/**
 * Page « LGL Expert au Maroc » (recherche « lgl expert » : 3e en oct. 2026).
 * Machines LGL Expert du catalogue : celles dont la brochure Cellulift porte le logo LGL Expert.
 */
export const lglExpertSlugs = [
  "bodytech-9", "elitecolombia", "hot-power", "longishape", "pandaslim", "slimax-lipo-3", "slimax-lipo-7",
  "alex-yag-ultra", "frac-cov-4", "hanover-5g", "la-queen", "laser-shock", "sevenwaves", "synergy-plus",
  "dermabrasif-6g", "frequencious", "pistor-plus-34", "skin-analyser-g7", "skin-bright",
  "led-bio-light", "led-fotoskin-ultra", "vagilase", "rejuvskin", "frequentazia", "t-care-6g",
];

export const lglExpertOrder: CategoryKey[] = ["lasers", "amincissement", "rejuvenation", "photomodulation", "hifu", "therapie"];

export const lglExpertPage = {
  fr: {
    meta: {
      title: "LGL Expert au Maroc : distributeur officiel",
      description:
        "CELLULIFT, distributeur officiel LGL Expert au Maroc et en Afrique : lasers, amincissement, réjuvénation, LED. Démo en agence, installation, formation et SAV.",
    },
    eyebrow: "Distributeur officiel",
    h1: "LGL Expert au Maroc : CELLULIFT, distributeur officiel",
    intro:
      "CELLULIFT est le distributeur officiel de la marque LGL Expert en Afrique. Au Maroc, nous vous présentons toute la gamme dans nos agences de Casablanca, Marrakech et Tanger, et nous accompagnons chaque machine : installation, formation CELLULIFT Academy et service après-vente.",
    whyTitle: "Pourquoi acheter LGL Expert chez le distributeur officiel",
    why: [
      ["Démonstration avant d'acheter", "Les machines LGL Expert se testent dans nos agences de Casablanca, Marrakech et Tanger, sur rendez-vous."],
      ["Installation par nos techniciens", "Transport, montage et mise en service dans votre cabinet, partout au Maroc."],
      ["Formation CELLULIFT Academy", "Prise en main, sécurité et protocoles par indication, avec des médecins formateurs."],
      ["Garantie et SAV local", "24 mois de garantie main-d'œuvre, déplacement de nos techniciens et atelier intégré pour le diagnostic et la réparation."],
    ],
    rangeTitle: "La gamme LGL Expert chez CELLULIFT",
    rangeNote: "Chaque fiche présente les indications, les caractéristiques et ce qui est inclus.",
    faqTitle: "Questions fréquentes sur LGL Expert au Maroc",
    faq: [
      ["Qui distribue LGL Expert au Maroc ?", "CELLULIFT est le distributeur officiel de la marque LGL Expert en Afrique, avec des agences à Casablanca, Marrakech et Tanger."],
      ["Où voir les machines LGL Expert ?", "Dans nos agences de Casablanca, Marrakech et Tanger, sur rendez-vous : demandez une démonstration depuis la fiche de la machine ou par WhatsApp."],
      ["Quelles machines LGL Expert proposez-vous ?", "Des lasers (épilation, pigmentaire, vasculaire, CO2 fractionné), des appareils d'amincissement et de remodelage, des technologies de réjuvénation, des LED et des appareils de thérapie avancée."],
      ["Les machines LGL Expert sont-elles certifiées ?", "Nos équipements sont marqués CE. Les certifications de chaque machine (CE, FDA le cas échéant) sont indiquées sur sa fiche ou disponibles sur demande."],
      ["Qu'est-ce qui est inclus à l'achat ?", "L'installation et la mise en service, la formation CELLULIFT Academy, les protocoles de traitement, la garantie de 24 mois main-d'œuvre et le service après-vente."],
      ["Quel est le prix d'une machine LGL Expert ?", "Le prix dépend de la machine et de sa configuration : il est communiqué sur demande. Des solutions de financement sont disponibles."],
    ],
  },
  en: {
    meta: {
      title: "LGL Expert in Morocco: official distributor",
      description:
        "CELLULIFT, official LGL Expert distributor in Morocco and Africa: lasers, body contouring, rejuvenation, LED. Branch demos, installation, training and after-sales.",
    },
    eyebrow: "Official distributor",
    h1: "LGL Expert in Morocco: CELLULIFT, official distributor",
    intro:
      "CELLULIFT is the official distributor of the LGL Expert brand in Africa. In Morocco, we present the full range at our branches in Casablanca, Marrakech and Tangier, and support every device: installation, CELLULIFT Academy training and after-sales service.",
    whyTitle: "Why buy LGL Expert from the official distributor",
    why: [
      ["Demo before you buy", "LGL Expert devices can be tried at our branches in Casablanca, Marrakech and Tangier, by appointment."],
      ["Installation by our technicians", "Transport, assembly and commissioning at your practice, anywhere in Morocco."],
      ["CELLULIFT Academy training", "Getting started, safety and protocols for each indication, with physician trainers."],
      ["Warranty and local after-sales", "24-month labour warranty, on-site technician visits and an in-house workshop for diagnosis and repair."],
    ],
    rangeTitle: "The LGL Expert range at CELLULIFT",
    rangeNote: "Each page covers indications, specifications and what is included.",
    faqTitle: "LGL Expert in Morocco: frequently asked questions",
    faq: [
      ["Who distributes LGL Expert in Morocco?", "CELLULIFT is the official distributor of the LGL Expert brand in Africa, with branches in Casablanca, Marrakech and Tangier."],
      ["Where can I see LGL Expert devices?", "At our branches in Casablanca, Marrakech and Tangier, by appointment: request a demo from the device page or on WhatsApp."],
      ["Which LGL Expert devices do you offer?", "Lasers (hair removal, pigment, vascular, fractional CO2), body slimming and contouring devices, rejuvenation technology, LED and advanced therapy devices."],
      ["Are LGL Expert devices certified?", "Our equipment is CE marked. Each device's certifications (CE, and FDA where applicable) are shown on its page or available on request."],
      ["What is included with the purchase?", "Installation and commissioning, CELLULIFT Academy training, treatment protocols, the 24-month labour warranty and after-sales service."],
      ["How much does an LGL Expert device cost?", "Pricing depends on the device and its configuration, and is shared on request. Financing options are available."],
    ],
  },
} as const;
