import type { MetadataRoute } from "next";
import { actPath, acts, doctor, universes } from "@/content/site";
import { formationsPage } from "@/content/formations";
import { concerns } from "@/content/concerns";
import { publishedArticles } from "@/content/articles";
import { absolute } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: absolute("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: absolute(doctor.path), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...universes.map((u) => ({ url: absolute(`/soins/${u.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...acts.map((a) => ({ url: absolute(actPath(a)), lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...concerns.map((c) => ({ url: absolute(`/preoccupations/${c.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: absolute("/rendez-vous"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...(publishedArticles().length ? [{ url: absolute("/conseils"), lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 }] : []),
    ...publishedArticles().map((a) => ({ url: absolute(`/conseils/${a.slug}`), lastModified: a.reviewed ? new Date(a.reviewed) : now, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: absolute("/formations"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...formationsPage.courses.map((c) => ({ url: absolute(`/formations/${c.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
