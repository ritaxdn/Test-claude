import type { Certification, EstablishmentType } from "@/lib/types";

/**
 * PLACEHOLDER — replace with Cellulift's actual certificates, partnership
 * documents and regulatory approvals before launch.
 */
export const certifications: Certification[] = [
  {
    name: "Distributeur officiel LGL Expert",
    description:
      "Cellulift est le distributeur et ambassadeur officiel de la marque française LGL Expert sur le continent africain.",
  },
  {
    name: "Marquage CE",
    description:
      "L'ensemble des technologies distribuées respecte les normes européennes de conformité applicables aux dispositifs médico-esthétiques.",
  },
  {
    name: "Certification ISO 13485",
    description:
      "Les sites de fabrication partenaires appliquent un système de management de la qualité dédié aux dispositifs médicaux.",
  },
  {
    name: "Garantie constructeur",
    description:
      "Chaque machine est couverte par une garantie constructeur, avec extension possible via nos contrats de maintenance.",
  },
  {
    name: "Formation clinique certifiante",
    description:
      "Chaque installation s'accompagne d'une formation pratique certifiante pour vos équipes médicales et esthétiques.",
  },
  {
    name: "Support technique local",
    description:
      "Une équipe technique basée en Afrique francophone assure l'installation, la maintenance et le SAV de votre parc machines.",
  },
];

export const establishmentTypes: EstablishmentType[] = [
  "Cabinet de médecine esthétique",
  "Clinique privée",
  "Institut de beauté premium",
  "Cabinet de dermatologie",
  "Cabinet de chirurgie plastique",
  "Centre de kinésithérapie / physiothérapie",
  "Pharmacie / parapharmacie",
  "Hôpital / établissement de santé",
  "Autre",
];

export const targetCountries = [
  "Côte d'Ivoire",
  "Sénégal",
  "Cameroun",
  "Maroc",
  "Tunisie",
  "Algérie",
  "Gabon",
  "République Démocratique du Congo",
  "Bénin",
  "Togo",
  "Burkina Faso",
  "Mali",
  "Autre pays d'Afrique",
];
