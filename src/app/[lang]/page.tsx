import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { SystemHero } from "@/components/system/SystemHero";
import { SystemPillars } from "@/components/system/SystemPillars";
import { TechIndex } from "@/components/system/TechIndex";
import { PartnerJourney } from "@/components/system/PartnerJourney";
import { AcademySupport } from "@/components/system/AcademySupport";
import { ProjectCta } from "@/components/system/ProjectCta";

// Accueil « Cellulift System » : proposition de valeur → système → technologies → parcours
// partenaire → Academy → Support → projet.
export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <div className="pearl-bg">
      <SystemHero locale={lang} />
      <SystemPillars locale={lang} />
      <TechIndex locale={lang} />
      <PartnerJourney locale={lang} />
      <AcademySupport locale={lang} />
      <ProjectCta locale={lang} />
    </div>
  );
}
