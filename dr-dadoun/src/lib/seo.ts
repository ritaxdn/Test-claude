import { about, doctor, practice, treatments } from "@/content/site";

/**
 * Adresse publique du site (sans / final). À définir quand le nom de domaine sera acheté :
 * variable NEXT_PUBLIC_SITE_URL (ex. https://www.drdadoun.ma). Sinon, domaine Vercel de production.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  "https://docteurdadoun.com"
).replace(/\/$/, "");

export const absolute = (path = "/") => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

export const clinicId = absolute("/#cabinet");
export const physicianId = absolute("/#docteur");

const address = {
  "@type": "PostalAddress",
  streetAddress: "N°02 Rue Savoie, Quartier des Hôpitaux",
  addressLocality: practice.city,
  postalCode: "20250",
  addressRegion: "Casablanca-Settat",
  addressCountry: "MA",
};

const openingHoursSpecification = practice.openingHours.map((h) => ({
  "@type": "OpeningHoursSpecification",
  dayOfWeek: h.days,
  opens: h.opens,
  closes: h.closes,
}));

const procedures = treatments.flatMap((c) =>
  c.treatments.map((t) => ({ "@type": "MedicalProcedure", name: t.name, description: t.description })),
);

/** Données structurées communes à tout le site : site, cabinet, médecin. */
export function siteGraph() {
  const contact = {
    telephone: practice.phoneHref,
    ...(practice.email ? { email: practice.email } : {}),
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": absolute("/#site"),
        url: siteUrl,
        name: "Docteur Dadoun",
        alternateName: [doctor.name, doctor.fullName, "Docteur Mohamed Dadoun"],
        inLanguage: "fr-MA",
        publisher: { "@id": clinicId },
      },
      {
        "@type": ["MedicalClinic", "MedicalBusiness"],
        "@id": clinicId,
        name: `Cabinet du ${doctor.name}`,
        alternateName: "Cabinet du Docteur Dadoun",
        description:
          "Cabinet de médecine esthétique et de lasers médicaux à Casablanca : injections, laser CO₂, endolifting et gynécologie esthétique.",
        url: siteUrl,
        image: absolute("/images/docteur.jpg"),
        address,
        hasMap: practice.mapsUrl,
        areaServed: { "@type": "City", name: "Casablanca" },
        openingHoursSpecification,
        availableService: procedures,
        founder: { "@id": physicianId },
        ...contact,
        ...(practice.sameAs.length ? { sameAs: practice.sameAs } : {}),
      },
      {
        "@type": "Physician",
        "@id": physicianId,
        name: doctor.fullName,
        alternateName: [doctor.name, "Docteur Dadoun", "Docteur Mohamed Dadoun"],
        description:
          "Médecin esthétique et lasériste à Casablanca, spécialisé en gynécologie esthétique, plus de 35 ans d'expérience. Formateur de médecins depuis plus de 10 ans.",
        memberOf: about.affiliations.map((a) => ({ "@type": "Organization", name: a.org })),
        image: absolute("/images/docteur.jpg"),
        url: absolute(doctor.path),
        mainEntityOfPage: absolute(doctor.path),
        sameAs: [...practice.sameAs, ...about.profiles],
        address,
        worksFor: { "@id": clinicId },
        knowsAbout: [
          "Médecine esthétique",
          "Lasers médicaux",
          "Toxine botulique",
          "Acide hyaluronique",
          "Laser CO₂",
          "Endolifting",
          "Gynécologie esthétique",
        ],
        ...contact,
      },
    ],
  };
}

export const breadcrumb = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absolute(it.path) })),
});
