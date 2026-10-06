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

  // À compléter quand les adresses exactes seront connues (intitulés vus dans Google) :
  // Contact, Actualités, Solutions Lasers, Service après-vente.
};

/**
 * Anciennes pages supprimées définitivement (sans équivalent sur le nouveau site) : réponse 410 « supprimée »,
 * pour que Google les retire rapidement de son index.
 */
export const legacyGone = new Set<string>([
  "/aquapeel", // machine retirée du catalogue (constatée dans Google)
]);

/** Normalise une adresse pour la recherche dans la table : minuscules, sans barre finale. */
const legacyKey = (pathname: string) => pathname.toLowerCase().replace(/\/+$/, "") || "/";

export function legacyTarget(pathname: string): string | undefined {
  return legacyRedirects[legacyKey(pathname)];
}

export function isLegacyGone(pathname: string): boolean {
  return legacyGone.has(legacyKey(pathname));
}
