// Title et meta description spécifiques à certaines fiches (sinon : modèle générique de la fiche).
// Validé par Cellulift. Le title passe par le modèle « … | CELLULIFT ».

type LocalizedText = { fr: string; en: string };

export const technologySeo: Record<string, { title: LocalizedText; description: LocalizedText }> = {
  "alex-yag-ultra": {
    title: { fr: "ALEX YAG ULTRA — Laser Alexandrite et Nd:YAG au Maroc", en: "ALEX YAG ULTRA — Alexandrite and Nd:YAG laser in Morocco" },
    description: {
      fr: "Laser double longueur d'onde Alexandrite 755 nm et Nd:YAG 1064 nm : épilation tous phototypes, lésions pigmentaires et vasculaires. Démo, formation et SAV au Maroc.",
      en: "Dual-wavelength Alexandrite 755 nm and Nd:YAG 1064 nm laser: hair removal on all skin types, pigmented and vascular lesions. Demo, training and after-sales in Morocco.",
    },
  },
  brasilift: {
    title: { fr: "BRASILIFT — Vacuothérapie lifting fessiers et poitrine", en: "BRASILIFT — Vacuum therapy for buttock and chest lifting" },
    description: {
      fr: "Brasilift : vacuothérapie à 29 ventouses pour lifter les fessiers et redonner du volume à la poitrine, sans chirurgie. Installation, formation et SAV au Maroc.",
      en: "Brasilift: 29-cup vacuum therapy to lift the buttocks and restore chest volume, without surgery. Installation, training and after-sales in Morocco.",
    },
  },
  "led-bio-light": {
    title: { fr: "LED BIO-LIGHT — Panneau LED 4 couleurs professionnel", en: "LED BIO-LIGHT — Professional 4-colour LED panel" },
    description: {
      fr: "Photomodulation LED rouge, bleu, vert et jaune pour l'acné, les rougeurs et la régénération cellulaire, visage et corps. Installation, formation et SAV au Maroc.",
      en: "Red, blue, green and yellow LED photomodulation for acne, redness and cell regeneration, face and body. Installation, training and after-sales in Morocco.",
    },
  },
  "frac-cov-4": {
    title: {
      fr: "FRAC’COV 4 — Laser CO2 fractionné professionnel",
      en: "FRAC’COV 4 — Professional fractional CO2 laser",
    },
    description: {
      fr: "FRAC’COV 4 : laser CO2 fractionné 10 600 nm pour resurfaçage, rides et cicatrices. Installation, formation et SAV CELLULIFT au Maroc.",
      en: "FRAC’COV 4: 10,600 nm fractional CO2 laser for resurfacing, wrinkles and scars. CELLULIFT installation, training and after-sales in Morocco.",
    },
  },
  "la-queen": {
    title: {
      fr: "LA QUEEN — Laser épilation diode, Nd:YAG, IPL au Maroc",
      en: "LA QUEEN — Diode hair removal laser, Nd:YAG, IPL in Morocco",
    },
    description: {
      fr: "Plateforme laser 4-en-1 : diode 755/808/1064 nm, vasculaire 980 nm, Nd:YAG Q-switched et IPL. Installation, formation et SAV au Maroc. Démo au showroom.",
      en: "4-in-1 laser platform: 755/808/1064 nm diode, 980 nm vascular, Q-switched Nd:YAG and IPL. Installation, training and after-sales in Morocco. Showroom demo.",
    },
  },
  "laser-shock": {
    title: { fr: "LASER SHOCK — Laser Nd:YAG détatouage et pigments au Maroc", en: "LASER SHOCK — Q-switched Nd:YAG tattoo removal laser, Morocco" },
    description: {
      fr: "LASER SHOCK : laser Nd:YAG Q-switched 1064, 532 et 1320 nm pour taches pigmentaires, détatouage, naevus et Carbon Peel. CELLULIFT au Maroc.",
      en: "LASER SHOCK: Q-switched Nd:YAG laser at 1064, 532 and 1320 nm for pigmented spots, tattoo removal, naevi and Carbon Peel. CELLULIFT, Morocco.",
    },
  },
  megalight: {
    title: { fr: "MEGALIGHT — Laser épilation 755, 808 et 1064 nm", en: "MEGALIGHT — 755, 808 and 1064 nm laser hair removal" },
    description: {
      fr: "MEGALIGHT : épilation laser 755, 808 et 1064 nm dans une seule pièce à main, pour tous les phototypes (I à VI). CELLULIFT au Maroc.",
      en: "MEGALIGHT: 755, 808 and 1064 nm laser hair removal in one handpiece, for all skin types (I to VI). CELLULIFT, Morocco.",
    },
  },
  "slimax-lipo-7": {
    title: { fr: "SLIMAX LIPO 7 — Lipolaser, cavitation, radiofréquence", en: "SLIMAX LIPO 7 — Lipolaser, cavitation, radiofrequency" },
    description: {
      fr: "SLIMAX LIPO 7 : lipolaser 1060 nm, lipocavitation, radiofréquence et palper-rouler pour la graisse localisée et le relâchement cutané. CELLULIFT au Maroc.",
      en: "SLIMAX LIPO 7: 1060 nm lipolaser, cavitation, radiofrequency and roller massage for localised fat and skin laxity. CELLULIFT, Morocco.",
    },
  },
  tanita: {
    title: { fr: "TANITA — Analyseur de composition corporelle sans fil", en: "TANITA — Wireless body composition monitor" },
    description: {
      fr: "TANITA : bio-impédancemètre sans fil (ANT+) pour le bilan de composition corporelle et le suivi des programmes minceur. CELLULIFT au Maroc.",
      en: "TANITA: wireless (ANT+) bio-impedance monitor for body composition assessment and slimming programme follow-up. CELLULIFT, Morocco.",
    },
  },
};
