// Title et meta description spécifiques à certaines fiches (sinon : modèle générique de la fiche).
// Validé par Cellulift. Le title passe par le modèle « … | CELLULIFT ».

type LocalizedText = { fr: string; en: string };

export const technologySeo: Record<string, { title: LocalizedText; description: LocalizedText }> = {
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
      fr: "LA QUEEN — Laser épilation diode, Nd:YAG et IPL",
      en: "LA QUEEN — Diode hair removal laser, Nd:YAG and IPL",
    },
    description: {
      fr: "LA QUEEN : laser diode 755/808/1064 nm, laser vasculaire 980 nm, Nd:YAG Q-switched et IPL. Épilation, vasculaire, pigments et détatouage. CELLULIFT au Maroc.",
      en: "LA QUEEN: 755/808/1064 nm diode laser, 980 nm vascular laser, Q-switched Nd:YAG and IPL. Hair removal, vascular, pigment and tattoo removal. CELLULIFT, Morocco.",
    },
  },
};
