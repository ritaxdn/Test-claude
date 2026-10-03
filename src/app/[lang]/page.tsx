import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { SystemHero } from "@/components/system/SystemHero";
import { SystemPillars } from "@/components/system/SystemPillars";
import { Ticker } from "@/components/system/Ticker";
import { StatsBand } from "@/components/system/StatsBand";
import { TechIndex } from "@/components/system/TechIndex";
import { WhyCellulift } from "@/components/system/WhyCellulift";
import { AcademySupport } from "@/components/system/AcademySupport";
import { ProjectCta } from "@/components/system/ProjectCta";
import { ShowroomMap } from "@/components/system/ShowroomMap";
import { Faq } from "@/components/system/Faq";
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

// Accueil : hero → chiffres → technologies → écosystème → preuves → Academy & Support → implantations → FAQ → contact.
export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <div className="pearl-bg">
      <SystemHero locale={lang} />
      <Ticker locale={lang} />
      <StatsBand locale={lang} />
      <TechIndex locale={lang} />
      <SystemPillars locale={lang} />
      <WhyCellulift locale={lang} />
      <AcademySupport locale={lang} />
      <ShowroomMap locale={lang} />
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
          }).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
