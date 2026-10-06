import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { SystemHero } from "@/components/system/SystemHero";
import { StatsBand } from "@/components/system/StatsBand";
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

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return pageMetadata({
    lang,
    absoluteTitle: isFr
      ? "CELLULIFT | Technologies médico-esthétiques pour professionnels"
      : "CELLULIFT | Medical aesthetic technology for professionals",
    description: isFr
      ? "Partenaire des médecins, cliniques et centres depuis 2002 : technologies médico-esthétiques, formation, installation, SAV et accompagnement de votre activité."
      : "Partner to physicians, clinics and centres since 2002: medical aesthetic technology, training, installation, after-sales and support for your practice.",
  });
}

// Accueil allégé (9 sections) : hero → chiffres → technologies → vidéos → Academy & Support → implantations → guide → FAQ → contact.
export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <div className="pearl-bg">
      <SystemHero locale={lang} />
      <StatsBand locale={lang} />
      <TechIndex locale={lang} />
      <MediaSection locale={lang} />
      <AcademySupport locale={lang} />
      <ShowroomMap locale={lang} />
      <div className="px-3 pb-12 md:px-5 md:pb-16">
        <GuideBanner locale={lang} className="mx-auto max-w-7xl" />
      </div>
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
        ]}
      />
    </div>
  );
}
