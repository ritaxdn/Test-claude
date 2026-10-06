import { technologies, type CategoryKey } from "../content/technologies";

/**
 * Redirections permanentes de l'ancien site WordPress (cellulift.ma) vers les nouvelles pages.
 * Google transfère ainsi le référencement des anciennes adresses et remplace ses anciens résultats.
 */
type Redirect = { source: string; destination: string; permanent: true };

const pages: Record<string, string> = {
  "/accueil": "/fr",
  "/home": "/fr",
  "/a-propos": "/fr/about",
  "/qui-sommes-nous": "/fr/about",
  "/academy": "/fr/academy",
  "/cellulift-academy": "/fr/academy",
  "/formations": "/fr/academy",
  "/contact": "/fr/contact",
  "/contactez-nous": "/fr/contact",
  "/support": "/fr/support",
  "/sav": "/fr/support",
  "/service-apres-vente": "/fr/support",
  "/actualites": "/fr",
  "/blog": "/fr",
  "/produits": "/fr/technologies",
  "/nos-produits": "/fr/technologies",
  "/shop": "/fr/technologies",
  "/boutique": "/fr/technologies",
  "/machines": "/fr/technologies",
  "/technologies": "/fr/technologies",
  // Machines retirées du catalogue
  "/aquapeel": "/fr/technologies",
  "/mentions-legales": "/fr/terms",
  "/politique-de-confidentialite": "/fr/privacy",
};

// Anciennes pages de gammes (plusieurs orthographes possibles) → page Technologies, gamme ouverte.
const categoryAliases: Record<CategoryKey, string[]> = {
  amincissement: ["amincissement", "amincissement-avance", "solutions-amincissement"],
  lasers: ["lasers", "laser", "solutions-lasers", "solutions-laser"],
  rejuvenation: ["rejuvenation", "rejuvenation-cutanee", "soins-visage"],
  photomodulation: ["photomodulation"],
  hifu: ["hifu"],
  therapie: ["therapie", "therapie-avancee", "physiotherapie"],
};

// Anciens articles de blog connus → page la plus proche.
const articles: Record<string, string> = {
  "/une-nouvelle-technique-dans-le-traitement-de-la-cellulite": "/fr/technologies",
  "/photomodulation-optimisez-les-soins-de-vos-patients-avec-cellulift": "/fr/technologies",
};

/** Variantes d'adresse d'une machine sur l'ancien site : « perfectlift », « perfect-lift », « new-epillight »… */
function oldSlugs(name: string, slug: string) {
  const base = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[’'`]/g, "")
    .replace(/\+/g, "");
  const dashed = base.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const compact = base.replace(/[^a-z0-9]+/g, "");
  return [...new Set([slug, dashed, compact])];
}

export function legacyRedirects(): Redirect[] {
  const out = new Map<string, string>();
  const add = (source: string, destination: string) => {
    if (!out.has(source)) out.set(source, destination);
  };

  for (const [from, to] of Object.entries(pages)) add(from, to);
  for (const [from, to] of Object.entries(articles)) add(from, to);
  for (const [cat, aliases] of Object.entries(categoryAliases)) {
    for (const a of aliases) add(`/${a}`, `/fr/technologies#${cat}`);
  }
  // Fiches machines : « /brasilift », « /product/longilyse », « /produit/… »
  for (const t of technologies) {
    for (const s of oldSlugs(t.name, t.slug)) {
      for (const prefix of ["", "/product", "/produit", "/produits"]) add(`${prefix}/${s}`, `/fr/technologies/${t.slug}`);
    }
  }
  // Autres anciennes fiches produit inconnues → catalogue
  add("/product/:slug", "/fr/technologies");
  add("/produit/:slug", "/fr/technologies");
  add("/category/:path*", "/fr/technologies");
  add("/product-category/:path*", "/fr/technologies");

  return [...out].map(([source, destination]) => ({ source, destination, permanent: true }));
}
