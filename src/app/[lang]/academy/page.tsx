import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { academyPageContent } from "@/content/academy-page";
import { PageHero } from "@/components/sections/PageHero";
import { Positioning } from "@/components/sections/Positioning";
import { ProgramsGrid } from "@/components/sections/ProgramsGrid";
import { WhyCellulift } from "@/components/sections/WhyCellulift";
import { FinalCta } from "@/components/sections/FinalCta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: "Cellulift Academy",
    description: isFr
      ? "Masterclasses, formations certifiantes et expertise médicale pour une pratique sûre des technologies médico-esthétiques."
      : "Masterclasses, certified training and medical expertise for a safe practice of medical aesthetic technologies.",
  };
}

export default async function AcademyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const content = academyPageContent[lang];

  return (
    <>
      <PageHero
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        subtitle={content.hero.subtitle}
      />

      <Positioning
        eyebrow={content.whyTraining.eyebrow}
        title={content.whyTraining.title}
        description={content.whyTraining.description}
      />

      <ProgramsGrid
        locale={lang}
        eyebrow={content.programsEyebrow}
        title={content.programsTitle}
      />

      <WhyCellulift
        eyebrow={content.expertise.eyebrow}
        title={content.expertise.title}
        items={content.expertise.items}
      />

      <FinalCta
        locale={lang}
        title={content.cta.title}
        description={content.cta.description}
        ctaPrimary={content.cta.ctaPrimary}
        ctaSecondary={content.cta.ctaSecondary}
      />
    </>
  );
}
