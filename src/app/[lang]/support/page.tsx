import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/alternates";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { supportPageContent } from "@/content/support-page";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { SystemStatus } from "@/components/sections/SystemStatus";
import { ExplodedView } from "@/components/sections/ExplodedView";

// Vue éclatée : photos réelles Brasilift et position de chaque pièce sur la scène (% ; centre 50/50).
const explodedParts = [
  { src: "/images/technologies/brasilift/01.jpg", x: 13, y: 25 },
  { src: "/images/technologies/brasilift/02.jpg", x: 13, y: 75 },
  { src: "/images/technologies/brasilift/03.jpg", x: 87, y: 50 },
];
import { WhyCellulift } from "@/components/sections/WhyCellulift";
import { FinalCta } from "@/components/sections/FinalCta";
import { company } from "@/content/company";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return pageMetadata({
    lang,
    path: "/support",
    title: isFr ? "Support et service après-vente" : "Support and after-sales service",
    description: isFr
      ? "Garantie 24 mois, techniciens qui se déplacent, atelier intégré et ligne support directe : le SAV Cellulift."
      : "24-month warranty, on-site technicians, in-house workshop and a direct support line: Cellulift after-sales.",
  });
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
      <Breadcrumbs lang={lang} items={[[lang === "fr" ? "Support et SAV" : "Support", "/support"]]} />
      <PageHero
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        subtitle={content.hero.subtitle}
      />

      <SystemStatus
        eyebrow={content.status.eyebrow}
        title={content.status.title}
        live={content.status.live}
        rows={content.status.rows.map((r) =>
          r.value === "{phone}"
            ? { ...r, value: company.supportPhone, href: `tel:${company.supportPhone.replace(/\s/g, "")}` }
            : { ...r }
        )}
      />

      <ExplodedView
        eyebrow={content.exploded.eyebrow}
        title={content.exploded.title}
        intro={content.exploded.intro}
        machine="/images/technologies/brasilift/00.jpg"
        machineAlt={content.exploded.machineAlt}
        parts={content.exploded.parts.map((part, i) => ({ ...part, ...explodedParts[i] }))}
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
        primarySujet="support"
        secondarySujet="expert"
        phone={{ label: lang === "fr" ? "Ligne support" : "Support line", number: company.supportPhone }}
      />
    </>
  );
}
