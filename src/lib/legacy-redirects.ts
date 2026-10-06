/**
 * Migration SEO : anciennes adresses du site WordPress cellulift.ma → nouvelles pages (redirection 301, un seul saut).
 *
 * RÈGLE : n'ajouter ici que des adresses RÉELLEMENT constatées (résultats Google, Search Console, export de l'ancien site).
 * Ne jamais deviner une ancienne adresse. Les clés sont écrites en minuscules, sans barre finale.
 * Une ancienne adresse absente de cette liste aboutit à une page 404 (visible dans Search Console → à ajouter ici).
 *
 * Pour ajouter une ligne :  "/ancienne-adresse": "/fr/nouvelle-page",
 */
export const legacyRedirects: Record<string, string> = {
  // Constatées dans les résultats Google (recherche « site:cellulift.ma », octobre 2026)
  "/academy": "/fr/academy",
  "/a-propos": "/fr/about",
  "/brasilift": "/fr/technologies/brasilift",
  "/perfectlift": "/fr/technologies/perfect-lift",
  "/product/longilyse": "/fr/technologies/longilyse",
  // Anciens articles de blog : pas de page équivalente sur le nouveau site → gamme la plus proche (à valider).
  "/une-nouvelle-technique-dans-le-traitement-de-la-cellulite": "/fr/technologies#amincissement",
  "/photomodulation-optimisez-les-soins-de-vos-patients-avec-cellulift": "/fr/technologies#photomodulation",

  // Constatée mais SANS équivalent (machine absente du catalogue actuel) : volontairement non redirigée → 404.
  // "/aquapeel": "",

  // À compléter quand les adresses exactes seront connues (intitulés vus dans Google) :
  // Contact, Actualités, Solutions Lasers, Service après-vente.
};

/** Normalise une adresse pour la recherche dans la table : minuscules, sans barre finale. */
export function legacyTarget(pathname: string): string | undefined {
  const key = pathname.toLowerCase().replace(/\/+$/, "") || "/";
  return legacyRedirects[key];
}
