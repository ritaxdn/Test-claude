// Coordonnées reprises de cellulift.ma.
export const company = {
  name: "Cellulift",
  legalName: "Cellulift",
  tagline: "Metamorphosis Technology",
  since: 2002,
  // Boîtes Gmail en attendant Google Workspace (les adresses @cellulift.ma ne sont pas encore créées).
  email: "cellulift@gmail.com",
  academyEmail: "cellulift.academy1@gmail.com",
  // Vide : pas de ligne « Partenariats » séparée dans le pied de page (les demandes arrivent sur l'adresse principale).
  partnershipsEmail: "" as string,
  phone: "+212 5 22 49 01 09",
  // Ligne directe du support technique / SAV
  supportPhone: "+212 660 815632",
  // Ligne de Cellulift Academy (formations, masterclasses)
  academyPhone: "+212 665 614049",
  // Numéro professionnel (WhatsApp). Vide = tous les boutons WhatsApp masqués.
  whatsapp: "+212 670 842795" as string,
  address: {
    fr: "N°02 Rue Savoie, Quartier des Hôpitaux, Casablanca",
    en: "N°02 Rue Savoie, Quartier des Hôpitaux, Casablanca",
  },
  // Points de vente (carte de l'accueil). Sans adresse publique pour Rabat, Agadir, Paris et Dakar : seule la ville est affichée.
  showrooms: [
    { id: "casablanca", city: { fr: "Casablanca", en: "Casablanca" }, country: { fr: "Maroc", en: "Morocco" }, address: "N°02 Rue Savoie, Quartier des Hôpitaux", hq: true, lon: -7.5898, lat: 33.5731 },
    { id: "marrakech", city: { fr: "Marrakech", en: "Marrakech" }, country: { fr: "Maroc", en: "Morocco" }, address: "Hay Al Massira III, C 624", lon: -7.9811, lat: 31.6295 },
    { id: "tanger", city: { fr: "Tanger", en: "Tangier" }, country: { fr: "Maroc", en: "Morocco" }, address: "N°73, Bd Moulay Rachid", lon: -5.834, lat: 35.7595 },
    { id: "rabat", city: { fr: "Rabat", en: "Rabat" }, country: { fr: "Maroc", en: "Morocco" }, address: "", lon: -6.8498, lat: 34.0209 },
    { id: "agadir", city: { fr: "Agadir", en: "Agadir" }, country: { fr: "Maroc", en: "Morocco" }, address: "", lon: -9.5981, lat: 30.4278 },
    { id: "paris", city: { fr: "Paris", en: "Paris" }, country: { fr: "France", en: "France" }, address: "", lon: 2.3522, lat: 48.8566 },
    { id: "dakar", city: { fr: "Dakar", en: "Dakar" }, country: { fr: "Sénégal", en: "Senegal" }, address: "", lon: -17.4677, lat: 14.7167 },
  ] as { id: string; city: { fr: string; en: string }; country: { fr: string; en: string }; address: string; hq?: boolean; lon: number; lat: number }[],
  social: {
    instagram: { handle: "@cellulift.officiel", url: "https://www.instagram.com/cellulift.officiel/" },
    instagramAcademy: { handle: "@cellulift.academy", url: "https://www.instagram.com/cellulift.academy/" },
  },
} as const;

/** Lien WhatsApp avec un premier message déjà écrit (le visiteur n'a plus qu'à appuyer sur Envoyer). */
export function whatsappHref(locale: "fr" | "en") {
  const text =
    locale === "fr"
      ? "Bonjour Cellulift, je souhaite des informations sur vos technologies."
      : "Hello Cellulift, I would like information about your technologies.";
  return `https://wa.me/${company.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}
