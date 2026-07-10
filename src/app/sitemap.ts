import type { MetadataRoute } from "next";
import { categories } from "@/lib/data/categories";
import { products } from "@/lib/data/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cellulift.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/catalogue",
    "/a-propos",
    "/certifications",
    "/ressources",
    "/contact",
    "/devis",
    "/mentions-legales",
    "/politique-de-confidentialite",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const categoryRoutes = categories.map((category) => ({
    url: `${siteUrl}/catalogue/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const productRoutes = products.map((product) => ({
    url: `${siteUrl}/produits/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
