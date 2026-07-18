import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { supportPageContent } from "@/content/support-page";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
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
    title: isFr ? "Support & Après-vente" : "Support & After-sales",
    description: isFr
      ? "Installation, maintenance préventive et assistance technique : découvrez l'accompagnement long terme de Cellulift."
      : "Installation, preventive maintenance and technical assistance: discover Cellulift's long-term support.",
  };
}

export default async function SupportPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const content = supportPageContent[lang];

  return (
    <>
      <PageHero
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        subtitle={content.hero.subtitle}
      />

      <ProcessSteps
        eyebrow={content.processEyebrow}
        title={content.processTitle}
        steps={content.steps}
      />

      <WhyCellulift
        eyebrow={content.reliability.eyebrow}
        title={content.reliability.title}
        items={content.reliability.items}
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
