// Domaine de production (à définir sur Vercel : NEXT_PUBLIC_SITE_URL). Sert aux URL canoniques, au sitemap et aux partages.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.cellulift-africa.com").replace(/\/$/, "");
