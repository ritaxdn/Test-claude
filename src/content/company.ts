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
  // Showrooms (carte de l'accueil). À COMPLÉTER : adresses de Paris, Dakar et Djeddah.
  showrooms: [
    { id: "casablanca", city: { fr: "Casablanca", en: "Casablanca" }, country: { fr: "Maroc", en: "Morocco" }, address: "N°02 Rue Savoie, Quartier des Hôpitaux", hq: true, lon: -7.5898, lat: 33.5731 },
    { id: "marrakech", city: { fr: "Marrakech", en: "Marrakech" }, country: { fr: "Maroc", en: "Morocco" }, address: "Hay Al Massira III, C 624", lon: -7.9811, lat: 31.6295 },
    { id: "tanger", city: { fr: "Tanger", en: "Tangier" }, country: { fr: "Maroc", en: "Morocco" }, address: "N°73, Bd Moulay Rachid", lon: -5.834, lat: 35.7595 },
    { id: "paris", city: { fr: "Paris", en: "Paris" }, country: { fr: "France", en: "France" }, address: "", lon: 2.3522, lat: 48.8566 },
    { id: "dakar", city: { fr: "Dakar", en: "Dakar" }, country: { fr: "Sénégal", en: "Senegal" }, address: "", lon: -17.4677, lat: 14.7167 },
    { id: "jeddah", city: { fr: "Djeddah", en: "Jeddah" }, country: { fr: "Arabie saoudite", en: "Saudi Arabia" }, address: "", lon: 39.1925, lat: 21.4858 },
  ] as { id: string; city: { fr: string; en: string }; country: { fr: string; en: string }; address: string; hq?: boolean; lon: number; lat: number }[],
  social: {
    instagram: { handle: "@cellulift.officiel", url: "https://www.instagram.com/cellulift.officiel/" },
    instagramAcademy: { handle: "@cellulift.academy", url: "https://www.instagram.com/cellulift.academy/" },
  },
} as const;
