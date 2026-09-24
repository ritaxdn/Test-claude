import { doctor, faq, philosophy, practice, treatments, universes } from "@/content/site";
import { formationsPage } from "@/content/formations";
import { absolute } from "@/lib/seo";

// /llms.txt : résumé du site destiné aux assistants IA (GEO), généré depuis le contenu.
export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${doctor.name} — Médecin esthétique & lasériste à Casablanca`,
    "",
    `> ${doctor.name} est médecin esthétique et lasériste à Casablanca (Maroc), avec plus de 35 ans d'expérience. Sa philosophie : « Améliorer sans dénaturer ». Il forme également des médecins depuis plus de 10 ans.`,
    "",
    "## Cabinet",
    `- Adresse : ${practice.addressLine1}, ${practice.addressLine2}`,
    `- Téléphone : ${practice.phone} (+212 5 22 49 01 09)`,
    ...practice.hours.map((h) => `- ${h.day} : ${h.time}`),
    `- Prise de rendez-vous en ligne : ${absolute("/rendez-vous")}`,
    "",
    "## Approche",
    philosophy.intro,
    ...philosophy.method.map((m) => `- ${m.title} : ${m.text}`),
    "",
    "## Soins",
    ...universes.flatMap((u) => [
      `### ${u.title} (${absolute(`/soins/${u.slug}`)})`,
      u.intro,
      ...treatments
        .filter((c) => u.categories.includes(c.id))
        .flatMap((c) => c.treatments.map((t) => `- ${t.name} : ${t.description} Durée : ${t.duration}. Suites : ${t.downtime}.`)),
      "",
    ]),
    "## Questions fréquentes",
    ...faq.flatMap((f) => [`- ${f.q}`, `  ${f.a}`]),
    "",
    "## Formations pour médecins",
    `${formationsPage.hero.text} Réservé aux médecins. ${absolute("/formations")}`,
    ...formationsPage.courses.map((c) => `- ${c.title} : ${c.summary} (${absolute(`/formations/${c.slug}`)})`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
