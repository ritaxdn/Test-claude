import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { aboutContent } from "@/content/about";
import { PageHero } from "@/components/sections/PageHero";
import { Story } from "@/components/sections/Story";
import { Pillars } from "@/components/sections/Pillars";
import { WhyCellulift } from "@/components/sections/WhyCellulift";
import { FinalCta } from "@/components/sections/FinalCta";
import { homeContent } from "@/content/home";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "À propos" : "About",
    description: isFr
      ? "Découvrez l'histoire, la mission et les valeurs de Cellulift, partenaire médico-esthétique de référence en Afrique."
      : "Discover Cellulift's story, mission and values as the reference medical aesthetics partner across Africa.",
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const content = aboutContent[lang];
  const cta = homeContent[lang].finalCta;

  return (
    <>
      <PageHero
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        subtitle={content.hero.subtitle}
      />

      <Story
        eyebrow={content.story.eyebrow}
        title={content.story.title}
        paragraphs={content.story.paragraphs}
      />

      <Pillars
        eyebrow={content.pillars.eyebrow}
        title={content.pillars.title}
        mission={content.pillars.mission}
        vision={content.pillars.vision}
        values={content.pillars.values}
      />

      <WhyCellulift
        eyebrow={content.difference.eyebrow}
        title={content.difference.title}
        items={content.difference.items}
      />

      <FinalCta
        locale={lang}
        title={cta.title}
        description={cta.description}
        ctaPrimary={cta.ctaPrimary}
        ctaSecondary={cta.ctaSecondary}
      />
    </>
  );
}
