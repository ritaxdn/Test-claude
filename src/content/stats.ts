import type { LocalizedText } from "./technologies";

export interface Stat {
  value: number;
  suffix: string;
  label: LocalizedText;
}

export const stats: Stat[] = [
  { value: 12, suffix: "+", label: { fr: "Pays couverts en Afrique", en: "Countries served across Africa" } },
  { value: 300, suffix: "+", label: { fr: "Cliniques et cabinets partenaires", en: "Partner clinics & practices" } },
  { value: 900, suffix: "+", label: { fr: "Praticiens formés à l'Academy", en: "Practitioners trained at the Academy" } },
  { value: 24, suffix: "/7", label: { fr: "Support technique dédié", en: "Dedicated technical support" } },
];

export interface Testimonial {
  quote: LocalizedText;
  author: string;
  role: LocalizedText;
}

export const testimonials: Testimonial[] = [
  {
    quote: {
      fr: "Cellulift ne nous a pas seulement vendu une machine : ils ont formé toute notre équipe et assurent un suivi technique irréprochable depuis trois ans.",
      en: "Cellulift didn't just sell us a machine: they trained our entire team and have provided flawless technical follow-up for three years.",
    },
    author: "Dr. A. Kouassi",
    role: { fr: "Dermatologue, Abidjan", en: "Dermatologist, Abidjan" },
  },
  {
    quote: {
      fr: "Le niveau scientifique de la formation Academy a changé notre approche des protocoles. Un vrai partenariat, pas une simple transaction.",
      en: "The scientific level of the Academy training changed our approach to protocols. A true partnership, not a simple transaction.",
    },
    author: "Dr. F. Traoré",
    role: { fr: "Médecin esthétique, Dakar", en: "Aesthetic physician, Dakar" },
  },
  {
    quote: {
      fr: "Réactivité du SAV, qualité des équipements, accompagnement humain : c'est ce qui fait la différence sur le long terme.",
      en: "After-sales responsiveness, equipment quality, human support: that's what makes the difference over the long term.",
    },
    author: "Dr. N. Adjovi",
    role: { fr: "Gynécologue, Cotonou", en: "Gynecologist, Cotonou" },
  },
];
