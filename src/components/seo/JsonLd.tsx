import { SITE_URL } from "@/lib/site";

/** Données structurées (schema.org) insérées dans la page. N'y mettre que des informations réelles. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/** Fil d'Ariane (BreadcrumbList) : accueil → … → page courante. `items` : [nom, chemin sans langue]. */
export function Breadcrumbs({ lang, items }: { lang: string; items: [string, string][] }) {
  const home: [string, string] = [lang === "en" ? "Home" : "Accueil", ""];
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [home, ...items].map(([name, path], i) => ({
          "@type": "ListItem",
          position: i + 1,
          name,
          item: `${SITE_URL}/${lang}${path}`,
        })),
      }}
    />
  );
}
