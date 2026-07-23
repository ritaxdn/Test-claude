import type { LocalizedText } from "./technologies";

export type MetierKey = "medecin" | "clinique" | "spa" | "kine" | "institut";

export interface MetierProfile {
  key: MetierKey;
  label: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  focus: LocalizedText[];
}

export const metiers: MetierProfile[] = [
  {
    key: "medecin",
    label: { fr: "Médecin", en: "Physician" },
    title: {
      fr: "Une pratique augmentée par la technologie.",
      en: "A practice elevated by technology.",
    },
    description: {
      fr: "Dermatologues, chirurgiens et médecins esthétiques : intégrez des dispositifs certifiés à vos protocoles, avec un accompagnement scientifique de bout en bout.",
      en: "Dermatologists, surgeons and aesthetic physicians: integrate certified devices into your protocols, backed by end-to-end scientific support.",
    },
    focus: [
      { fr: "Protocoles cliniques validés", en: "Validated clinical protocols" },
      { fr: "Formation certifiante continue", en: "Ongoing certified training" },
      { fr: "Support technique prioritaire", en: "Priority technical support" },
    ],
  },
  {
    key: "clinique",
    label: { fr: "Clinique", en: "Clinic" },
    title: {
      fr: "Équiper une clinique qui grandit.",
      en: "Equipping a growing clinic.",
    },
    description: {
      fr: "Des plateformes multi-technologies pensées pour un volume patient élevé, une rentabilité mesurable et une gestion simplifiée du parc d'équipements.",
      en: "Multi-technology platforms built for high patient volume, measurable profitability and simplified equipment fleet management.",
    },
    focus: [
      { fr: "Plateformes multi-protocoles", en: "Multi-protocol platforms" },
      { fr: "Maintenance planifiée", en: "Scheduled maintenance" },
      { fr: "Accompagnement à l'ouverture", en: "Launch support" },
    ],
  },
  {
    key: "spa",
    label: { fr: "Spa", en: "Spa" },
    title: {
      fr: "L'exigence médicale au service du bien-être.",
      en: "Medical-grade rigor in service of wellness.",
    },
    description: {
      fr: "Des technologies non invasives, sûres et confortables, pour élever l'offre de votre spa au niveau des standards médico-esthétiques.",
      en: "Non-invasive, safe and comfortable technologies that elevate your spa's offering to medico-aesthetic standards.",
    },
    focus: [
      { fr: "Protocoles sans éviction sociale", en: "Zero-downtime protocols" },
      { fr: "Expérience patient premium", en: "Premium client experience" },
      { fr: "Formation aux gestes esthétiques", en: "Aesthetic technique training" },
    ],
  },
  {
    key: "kine",
    label: { fr: "Kiné", en: "Physio" },
    title: {
      fr: "Des technologies au service de la récupération.",
      en: "Technology in service of recovery.",
    },
    description: {
      fr: "Des dispositifs de médecine physique complémentaires à vos protocoles de rééducation, de drainage et de récupération musculaire.",
      en: "Physical medicine devices that complement your rehabilitation, drainage and muscular recovery protocols.",
    },
    focus: [
      { fr: "Technologies de récupération", en: "Recovery technologies" },
      { fr: "Protocoles complémentaires", en: "Complementary protocols" },
      { fr: "Formation aux indications", en: "Indication-based training" },
    ],
  },
  {
    key: "institut",
    label: { fr: "Institut", en: "Institute" },
    title: {
      fr: "Élever l'institut au rang de référence.",
      en: "Elevating your institute to reference status.",
    },
    description: {
      fr: "Des équipements haut de gamme et une formation rigoureuse pour différencier votre institut par la qualité clinique de vos protocoles.",
      en: "High-end equipment and rigorous training to set your institute apart through the clinical quality of your protocols.",
    },
    focus: [
      { fr: "Différenciation par la technologie", en: "Technology-driven differentiation" },
      { fr: "Certification des équipes", en: "Team certification" },
      { fr: "Accompagnement marketing clinique", en: "Clinical marketing support" },
    ],
  },
];
