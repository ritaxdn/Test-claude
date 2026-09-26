// Coordonnées reprises de cellulift.ma.
export const company = {
  name: "Cellulift",
  legalName: "Cellulift",
  tagline: "Metamorphosis Technology",
  since: 2002,
  email: "cellulift@gmail.com",
  phone: "+212 5 22 49 01 09",
  // À COMPLÉTER : numéro WhatsApp (laissé vide, le bouton WhatsApp est alors masqué)
  whatsapp: "" as string,
  address: {
    fr: "N°02 Rue Savoie, Quartier des Hôpitaux, Casablanca",
    en: "N°02 Rue Savoie, Quartier des Hôpitaux, Casablanca",
  },
  offices: [
    { city: "Casablanca", address: "N°02 Rue Savoie, Quartier des Hôpitaux" },
    { city: "Marrakech", address: "Hay Al Massira III, C 624" },
    { city: "Tanger", address: "N°73, Bd Moulay Rachid" },
  ],
  social: {
    instagram: "https://instagram.com/cellulift",
    linkedin: "https://linkedin.com/company/cellulift",
    facebook: "https://facebook.com/cellulift",
  },
} as const;
