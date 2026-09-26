import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { SystemHero } from "@/components/system/SystemHero";
import { SystemPillars } from "@/components/system/SystemPillars";
import { Ticker } from "@/components/system/Ticker";
import { StatsBand } from "@/components/system/StatsBand";
import { PartnersBand } from "@/components/system/PartnersBand";
import { TechIndex } from "@/components/system/TechIndex";
import { WhyCellulift } from "@/components/system/WhyCellulift";
import { AcademySupport } from "@/components/system/AcademySupport";
import { ProjectCta } from "@/components/system/ProjectCta";
import { ShowroomMap } from "@/components/system/ShowroomMap";

// Accueil : hero → fonctionnalités → pourquoi Cellulift → produits → Academy & SAV → showrooms
// → devis. Textes repris de cellulift.ma.
export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <div className="pearl-bg">
      <SystemHero locale={lang} />
      <Ticker locale={lang} />
      <StatsBand locale={lang} />
      <PartnersBand locale={lang} />
      <SystemPillars locale={lang} />
      <TechIndex locale={lang} />
      <WhyCellulift locale={lang} />
      <AcademySupport locale={lang} />
      <ShowroomMap locale={lang} />
      <ProjectCta locale={lang} />
    </div>
  );
}
