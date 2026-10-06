/**
 * Centres équipés Cellulift (page « Trouver un centre »).
 * RÈGLE : n'ajouter un centre qu'avec son accord, et uniquement des informations confirmées par Cellulift.
 * `city` vide = ville non encore confirmée (le centre est alors listé sans ville).
 */
export type Center = {
  name: string;
  /** Nom de l'établissement, si différent du nom du médecin */
  place?: string;
  city: string;
  country: "Maroc" | "Sénégal";
};

export const centers: Center[] = [
  { name: "Dr Hallouli", city: "", country: "Maroc" },
  { name: "Dr Lamiaa Arabaoui", city: "Casablanca", country: "Maroc" },
  { name: "Dr Fatima Ezzahra Chahouri", city: "", country: "Maroc" },
  { name: "Dr Kahak", place: "L'Atelier Skin Art", city: "", country: "Maroc" },
  { name: "Dr Mohamed Amine Lahlou", city: "Casablanca", country: "Maroc" },
  { name: "Dr Brahem Saheli", city: "Dakar", country: "Sénégal" },
  { name: "O P'tit Soin", city: "", country: "Maroc" },
  { name: "Majdouline Alaoui", place: "Centre Plénitude", city: "Marrakech", country: "Maroc" },
  { name: "Dr Ahlam Aboumaria", city: "", country: "Maroc" },
  { name: "Therasvelt", city: "Casablanca", country: "Maroc" },
];

export const centersPageContent = {
  fr: {
    meta: {
      title: "Trouver un centre équipé Cellulift",
      description: "Médecins et centres esthétiques équipés de technologies Cellulift au Maroc et en Afrique de l'Ouest.",
    },
    eyebrow: "Centres équipés",
    title: "Trouver un centre équipé Cellulift",
    subtitle: "Ces médecins et centres utilisent des technologies Cellulift et ont été formés par la Cellulift Academy.",
    all: "Toutes les villes",
    other: "Autres villes",
    unit: ["centre", "centres"] as [string, string],
    join: {
      title: "Votre centre est équipé Cellulift ?",
      text: "Apparaissez sur cette page et recevez les patients qui cherchent un centre près de chez eux.",
      cta: "Demander à figurer ici",
    },
  },
  en: {
    meta: {
      title: "Find a Cellulift-equipped clinic",
      description: "Doctors and aesthetic clinics equipped with Cellulift technology in Morocco and West Africa.",
    },
    eyebrow: "Equipped clinics",
    title: "Find a Cellulift-equipped clinic",
    subtitle: "These doctors and clinics use Cellulift technology and were trained by the Cellulift Academy.",
    all: "All cities",
    other: "Other cities",
    unit: ["clinic", "clinics"] as [string, string],
    join: {
      title: "Is your clinic equipped by Cellulift?",
      text: "Get listed on this page and reach patients looking for a clinic near them.",
      cta: "Ask to be listed",
    },
  },
};
