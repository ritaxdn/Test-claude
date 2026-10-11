// Module léger (sans le catalogue) : utilisable dans les composants client.

/** Machine concernée par la page : fiche /{lang}/technologies/{slug}, ou paramètre ?machine={slug}. Slug inconnu → aucune. */
export function machineFromLocation(pathname: string, search: string, names: Record<string, string>) {
  const fromPath = pathname.match(/^\/[a-z]{2}\/technologies\/([^/?#]+)/)?.[1];
  const slug = fromPath ?? new URLSearchParams(search).get("machine") ?? "";
  return names[slug] ? { slug, name: names[slug] } : null;
}
