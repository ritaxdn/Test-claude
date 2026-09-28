import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { technologies } from "@/content/technologies";
import { SITE_URL } from "@/lib/site";

const staticPaths = ["", "/about", "/technologies", "/academy", "/support", "/contact", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        alternates: { languages: { fr: `${SITE_URL}/fr${path}`, en: `${SITE_URL}/en${path}` } },
        changeFrequency: path === "" ? "monthly" : "yearly",
        priority: path === "" ? 1 : 0.7,
      });
    }
    for (const tech of technologies) {
      entries.push({
        url: `${SITE_URL}/${locale}/technologies/${tech.slug}`,
        alternates: { languages: { fr: `${SITE_URL}/fr/technologies/${tech.slug}`, en: `${SITE_URL}/en/technologies/${tech.slug}` } },
        changeFrequency: "yearly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
