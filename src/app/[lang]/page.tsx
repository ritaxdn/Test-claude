import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { SystemHero } from "@/components/system/SystemHero";
import { StatsBand } from "@/components/system/StatsBand";
import { Positioning } from "@/components/system/Positioning";
import { TechIndex } from "@/components/system/TechIndex";
import { AcademySupport } from "@/components/system/AcademySupport";
import { ProjectCta } from "@/components/system/ProjectCta";
import { ShowroomMap } from "@/components/system/ShowroomMap";
import { Faq } from "@/components/system/Faq";
import { MediaSection } from "@/components/media/MediaSection";
import { GuideBanner } from "@/components/guide/GuideBanner";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/alternates";
import { SITE_URL } from "@/lib/site";
import { company } from "@/content/company";
import { JsonLd } from "@/components/seo/JsonLd";
import { agencyKeys, agencyPath, agencyShowroom } from "@/content/agencies";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return pageMetadata({
    lang,
    absoluteTitle: isFr
      ? "Distributeur d'équipements médico-esthétiques au Maroc | CELLULIFT"
      : "Medical aesthetic equipment distributor in Morocco | CELLULIFT",
    description: isFr
      ? "Cellulift distribue au Maroc des équipements médico-esthétiques professionnels pour médecins, cliniques et centres, avec installation, formation et SAV."
      : "Cellulift supplies professional medical aesthetic equipment in Morocco to physicians, clinics and centres, with installation, training and after-sales.",
  });
}

// Accueil (10 sections) : hero → chiffres → positionnement → technologies → guide → Academy & Support → vidéos → implantations → FAQ → contact.
export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <div className="pearl-bg">
      <SystemHero locale={lang} />
      <StatsBand locale={lang} />
      <Positioning locale={lang} />
      <TechIndex locale={lang} />
      <div className="px-3 pb-12 md:px-5 md:pb-16">
        <GuideBanner locale={lang} className="mx-auto max-w-7xl" />
      </div>
      <AcademySupport locale={lang} />
      <MediaSection locale={lang} />
      <ShowroomMap locale={lang} />
      <Faq locale={lang} />
      <ProjectCta locale={lang} />
      {/* Données structurées : l'entreprise et le site (informations réelles du site uniquement) */}
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: "CELLULIFT",
            url: SITE_URL,
            logo: `${SITE_URL}/apple-icon`,
            email: company.email,
            telephone: company.phone,
            foundingDate: "2002",
            sameAs: [company.social.instagram.url, company.social.instagramAcademy.url],
            address: {
              "@type": "PostalAddress",
              streetAddress: company.showrooms[0].address,
              addressLocality: "Casablanca",
              addressCountry: "MA",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            name: "CELLULIFT",
            url: SITE_URL,
            inLanguage: ["fr", "en"],
            publisher: { "@id": `${SITE_URL}/#organization` },
          },
          // Agences (même @id que sur leur page) : téléphone uniquement pour le siège, seul numéro confirmé par agence.
          ...agencyKeys.map((key) => {
            const a = agencyShowroom(key);
            return {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": `${SITE_URL}/#${key}`,
              name: `CELLULIFT — ${a.hq ? "Siège" : "Agence"} ${a.city.fr}`,
              parentOrganization: { "@id": `${SITE_URL}/#organization` },
              url: `${SITE_URL}/${lang}${agencyPath(key)}`,
              ...(a.hq ? { telephone: company.phone } : {}),
              address: { "@type": "PostalAddress", streetAddress: a.address, addressLocality: a.city.fr, addressCountry: "MA" },
              geo: { "@type": "GeoCoordinates", latitude: a.lat, longitude: a.lon },
            };
          }),
        ]}
      />
    </div>
  );
}
