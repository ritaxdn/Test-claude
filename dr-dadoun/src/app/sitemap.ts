import type { MetadataRoute } from "next";
import { universes } from "@/content/site";
import { formationsPage } from "@/content/formations";
import { absolute } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: absolute("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...universes.map((u) => ({ url: absolute(`/soins/${u.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 })),
    { url: absolute("/rendez-vous"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absolute("/formations"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...formationsPage.courses.map((c) => ({ url: absolute(`/formations/${c.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
