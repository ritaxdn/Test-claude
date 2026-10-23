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
  // Plan de migration SEO (Search Console, validé par Cellulift) : ancienne page → page réellement équivalente.
  "/contact": "/fr/contact",
  "/service-apres-vente": "/fr/support",
  "/la-queen-new": "/fr/technologies/la-queen",
  "/laser-shock": "/fr/technologies/laser-shock",
  "/steel-muscle": "/fr/technologies/steel-muscle",
  "/led-bio-light": "/fr/technologies/led-bio-light",
  "/longilyse": "/fr/technologies/longilyse",
  "/dermabrasif": "/fr/technologies/dermabrasif-6g",
  "/new-epillight": "/fr/technologies/new-epil-light",
  "/slimax-lipo-7": "/fr/technologies/slimax-lipo-7",
  "/dermaplex": "/fr/technologies/dermaplex",
  "/pressoligne-5": "/fr/technologies/pressoligne-5",
  "/alex-yag-ultras": "/fr/technologies/alex-yag-ultra",
  "/frequentazia": "/fr/technologies/frequentazia",
  "/longchoc": "/fr/technologies/longchoc",
  "/skin-bright": "/fr/technologies/skin-bright",
  "/tanita-bc-1000": "/fr/technologies/tanita", // fiche TANITA = destination commerciale pertinente
  "/my-pen": "/fr/technologies/mym-dermapen", // « My Pen » = MYM DERMAPEN (fiche)
  "/slimax-lipo-3": "/fr/technologies/slimax-lipo-3",
  "/longiflash": "/fr/technologies/longiflash",
  // Anciennes pages de gamme recréées en pages de gamme (validé par Cellulift)
  "/solutions-lasers": "/fr/technologies/gammes/lasers",
  "/amincissement-avance": "/fr/technologies/gammes/amincissement",
  // Anciens modèles remplacés par le modèle actuel (validé par Cellulift)
  "/fracov3": "/fr/technologies/frac-cov-4",
  "/pressoligne-6": "/fr/technologies/pressoligne-5",
  "/synergy": "/fr/technologies/synergy-plus",
  "/new-synergy": "/fr/technologies/synergy-plus",
  // Anciens articles de blog
  "/une-nouvelle-technique-dans-le-traitement-de-la-cellulite": "/fr/technologies/gammes/amincissement", // validé par Cellulift
  "/photomodulation-optimisez-les-soins-de-vos-patients-avec-cellulift": "/fr/technologies#photomodulation", // provisoire
  // Anciennes pages de gamme → la même gamme dans le catalogue (filtre par ancre), constatées dans Search Console (oct. 2026).
  // Une gamme regroupe plusieurs machines : on n'envoie pas vers une seule fiche.
  "/hifu-haut-intensite-focalise-ultrason": "/fr/technologies#hifu",
  "/integrall-hifu": "/fr/technologies#hifu",
  "/photomodulation": "/fr/technologies#photomodulation",
  "/rejuvenation-cutanee": "/fr/technologies#rejuvenation",
  "/therapie-avancee": "/fr/technologies#therapie",
  // MEGACRYO (cryolipolyse by Longiligne) : plus au catalogue, page encore affichée par Google (oct. 2026).
  // Pas de cryolipolyse équivalente (CRYOCOVER = cryothérapie articulaire) → gamme Amincissement.
  "/megacryo": "/fr/technologies/gammes/amincissement",

  // Laissées en 404 : sans équivalent réel sur le nouveau site (/actualites, /portfolio) ou machines dont le statut
  // catalogue n'est pas confirmé (/sculptface, /gatecare, /perfect-cool, /hightlift, /rejuvteck-7, /microgun).
  // Machine confirmée retirée → la déplacer dans legacyGone (410). Machine renommée → la rediriger vers sa nouvelle fiche.
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
