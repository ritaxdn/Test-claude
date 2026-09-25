import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/alternates";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { technologiesPageContent } from "@/content/technologies-page";
import { homeContent } from "@/content/home";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { TechnologyGrid } from "@/components/technologies/TechnologyGrid";
import { FinalCta } from "@/components/sections/FinalCta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Technologies" : "Technologies",
    description: isFr
      ? "Les technologies médico-esthétiques Cellulift : lasers et technologies lumière, visage et diagnostic, remodelage corporel, médecine esthétique et gynécologie, physiothérapie."
      : "Cellulift medical aesthetic technologies: lasers and light, face and diagnostics, body contouring, aesthetic medicine and gynecology, physiotherapy.",
    alternates: localeAlternates("/technologies"),
  };
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
      <PageHero eyebrow={content.eyebrow} title={content.title} subtitle={content.subtitle} />

      <section className="pb-24">
        <Container>
          <TechnologyGrid
            locale={lang}
            allLabel={content.allLabel}
            readMoreLabel={dict.common.readMore}
          />
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
