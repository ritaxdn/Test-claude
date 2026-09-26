import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { SystemHero } from "@/components/system/SystemHero";
import { SystemPillars } from "@/components/system/SystemPillars";
import { TechIndex } from "@/components/system/TechIndex";
import { WhyCellulift } from "@/components/system/WhyCellulift";
import { Testimonials } from "@/components/system/Testimonials";
import { AcademySupport } from "@/components/system/AcademySupport";
import { ProjectCta } from "@/components/system/ProjectCta";
import { ShowroomMap } from "@/components/system/ShowroomMap";

// Accueil : hero → fonctionnalités → pourquoi Cellulift → produits → Academy & SAV → témoignages
// → showrooms → devis. Textes repris de cellulift.ma.
export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <div className="pearl-bg">
      <SystemHero locale={lang} />
      <SystemPillars locale={lang} />
      <WhyCellulift locale={lang} />
      <TechIndex locale={lang} />
      <AcademySupport locale={lang} />
      <Testimonials locale={lang} />
      <ShowroomMap locale={lang} />
      <ProjectCta locale={lang} />
    </div>
  );
}
