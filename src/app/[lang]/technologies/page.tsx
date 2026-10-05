import { GuideBanner } from "@/components/guide/GuideBanner";
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
import { SignalLine } from "@/components/system/SignalPath";

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
    alternates: localeAlternates("/technologies", lang),
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

      <section className="px-3 pb-12 md:px-5 md:pb-16">
        <Container>
          {/* Ce qui accompagne chaque technologie : la réponse avant même de choisir */}
          <p className="data-label text-deep-soft">{content.includedLabel}</p>
          <div className="mb-10 mt-4 grid grid-cols-2 border-t border-deep/15 lg:grid-cols-4">
            {content.included.map(([k, v], i) => (
              <div
                key={k}
                className="relative border-b border-deep/15 py-4 pr-4 odd:border-r lg:border-b-0 lg:border-r lg:px-5 lg:first:pl-0 lg:last:border-r-0 [&:nth-child(even)]:pl-4 lg:[&:nth-child(even)]:pl-5"
              >
                <SignalLine delay={i * 0.1} className="absolute inset-x-0 top-[-1px]" />
                <p className="data-label text-deep-soft">{k}</p>
                <p className="mt-2 font-sans text-sm font-medium text-deep">{v}</p>
              </div>
            ))}
          </div>
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
