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
import { localeAlternates } from "@/lib/alternates";
import { SITE_URL } from "@/lib/site";
import { company } from "@/content/company";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: {
      absolute: isFr
        ? "Cellulift — Technologies médico-esthétiques professionnelles"
        : "Cellulift — Professional medical aesthetic technology",
    },
    description: isFr
      ? "Distributeur officiel LGL Expert en Afrique. Technologies médico-esthétiques pour médecins, cliniques et centres : conseil, installation, formation Cellulift Academy et support."
      : "Official LGL Expert distributor in Africa. Medical aesthetic technology for physicians, clinics and centers: advice, installation, Cellulift Academy training and support.",
    alternates: localeAlternates("", lang),
  };
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
      {/* Données structurées : l'entreprise (Google) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Cellulift",
            url: SITE_URL,
            logo: `${SITE_URL}/icon.svg`,
            email: company.email,
            telephone: company.phone,
            foundingDate: "2002",
            sameAs: [company.social.instagram.url, company.social.instagramAcademy.url],
            address: { "@type": "PostalAddress", streetAddress: company.showrooms[0].address, addressLocality: "Casablanca", addressCountry: "MA" },
          }),
        }}
      />
    </div>
  );
}
