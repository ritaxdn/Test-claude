import { about, actPath, acts, doctor, faq, philosophy, practice, universes } from "@/content/site";
import { formationsPage } from "@/content/formations";
import { concernActs, concerns } from "@/content/concerns";
import { absolute } from "@/lib/seo";

// /llms.txt : résumé du site destiné aux assistants IA (GEO), généré depuis le contenu.
export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${doctor.name} — Médecin esthétique & lasériste à Casablanca`,
    "",
    `> ${doctor.name} est médecin esthétique et lasériste à Casablanca (Maroc), avec plus de 35 ans d'expérience. Sa philosophie : « Améliorer sans dénaturer ». Il forme également des médecins depuis plus de 10 ans.`,
    "",
    `Nom complet : ${doctor.fullName}, ${doctor.role.toLowerCase()} (cabinet ${practice.addressLine1}, Casablanca). Page du médecin : ${absolute(doctor.path)}. Reconnaissances :`,
    ...about.affiliations.map((a) => `- ${a.role} — ${a.org}`),
    "",
    "## Cabinet",
    `- Adresse : ${practice.addressLine1}, ${practice.addressLine2}`,
    `- Téléphone : ${practice.phone} (+212 5 22 49 01 09)`,
    ...practice.hours.map((h) => `- ${h.day} : ${h.time}`),
    `- Prise de rendez-vous en ligne : ${absolute("/rendez-vous")}`,
    `- Instagram : ${practice.instagram.url}`,
    "",
    "## Approche",
    philosophy.intro,
    ...philosophy.method.map((m) => `- ${m.title} : ${m.text}`),
    "",
    "## Soins",
    ...universes.flatMap((u) => [
      `### ${u.title} (${absolute(`/soins/${u.slug}`)})`,
      u.intro,
      ...acts
        .filter((a) => a.universe.slug === u.slug)
        .map((a) => `- [${a.name}](${absolute(actPath(a))}) : ${a.description} Durée : ${a.duration}. Suites : ${a.downtime}.`),
      "",
    ]),
    "## Par préoccupation",
    ...concerns.map((c) => `- [${c.title}](${absolute(`/preoccupations/${c.slug}`)}) : ${concernActs(c).map((a) => a.name).join(", ")}. ${c.elsewhere}`),
    "",
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
