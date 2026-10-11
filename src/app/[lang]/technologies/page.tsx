import { GuideBanner } from "@/components/guide/GuideBanner";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/alternates";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { technologiesPageContent } from "@/content/technologies-page";
import { homeContent } from "@/content/home";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { TechnologyGrid } from "@/components/technologies/TechnologyGrid";
import { FinalCta } from "@/components/sections/FinalCta";
import { IncludedServices } from "@/components/technologies/IncludedServices";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return pageMetadata({
    lang,
    path: "/technologies",
    title: isFr ? "Technologies médico-esthétiques professionnelles" : "Professional medical aesthetic technology",
    description: isFr
      ? "Le catalogue Cellulift : amincissement, lasers, réjuvénation cutanée, photomodulation, HIFU et thérapie avancée. Chaque technologie est livrée avec installation, formation et SAV."
      : "The Cellulift catalogue: body contouring, lasers, skin rejuvenation, photomodulation, HIFU and advanced therapy. Every technology comes with installation, training and after-sales.",
  });
}

export default async function TechnologiesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const content = technologiesPageContent[lang];
  const dict = getDictionary(lang);
  const cta = homeContent[lang].finalCta;

  return (
    <>
      <Breadcrumbs lang={lang} items={[["Technologies", "/technologies"]]} />
      <PageHero eyebrow={content.eyebrow} title={content.title} subtitle={content.subtitle} />

      <section className="px-3 pb-12 md:px-5 md:pb-16">
        <Container>
          {/* Ce qui accompagne chaque technologie : la réponse avant même de choisir */}
          <IncludedServices label={content.includedLabel} items={content.included} />
          <TechnologyGrid
            locale={lang}
            readMoreLabel={dict.common.readMore}
          />
          <GuideBanner locale={lang} className="mt-12" />
        </Container>
      </section>

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
