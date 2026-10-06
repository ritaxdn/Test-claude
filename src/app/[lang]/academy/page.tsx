import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/alternates";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { academyPageContent } from "@/content/academy-page";
import { company } from "@/content/company";
import { PageHero } from "@/components/sections/PageHero";
import { AcademySessions } from "@/components/sections/AcademySessions";
import { WhyCellulift } from "@/components/sections/WhyCellulift";
import { FinalCta } from "@/components/sections/FinalCta";
import { ProtocolPath } from "@/components/system/SignalPath";
import { Faculty } from "@/components/sections/Faculty";

// Les sessions passées disparaissent : la page est régénérée chaque jour.
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return pageMetadata({
    lang,
    path: "/academy",
    absoluteTitle: isFr
      ? "Cellulift Academy | Formations et masterclasses en médecine esthétique"
      : "Cellulift Academy | Aesthetic medicine training and masterclasses",
    description: isFr
      ? "Masterclasses, formations certifiantes et expertise médicale pour une pratique sûre des technologies médico-esthétiques."
      : "Masterclasses, certified training and medical expertise for a safe practice of medical aesthetic technologies.",
  });
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
      <Breadcrumbs lang={lang} items={[["Cellulift Academy", "/academy"]]} />
      <PageHero
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        subtitle={content.hero.subtitle}
      />

      {/* Le parcours de formation, visualisé : le tracé ECG progresse au défilement */}
      <section className="overflow-x-clip px-3 pb-12 md:px-5 md:pb-20">
        <div className="mx-auto max-w-7xl px-3 md:px-7">
          <p className="data-label text-deep-soft">{content.whyTraining.eyebrow}</p>
          <h2 className="display mt-4 max-w-3xl text-[clamp(1.6rem,3vw,2.6rem)] leading-[1] text-deep">{content.whyTraining.title}</h2>
          <p className="mt-4 max-w-xl font-sans leading-relaxed text-deep-soft">{content.whyTraining.description}</p>
          <div className="mt-10 md:mt-14">
            <ProtocolPath steps={content.whyTraining.steps} />
          </div>
        </div>
      </section>

      <AcademySessions locale={lang} eyebrow={content.programsEyebrow} title={content.programsTitle} />

      <WhyCellulift
        eyebrow={content.expertise.eyebrow}
        title={content.expertise.title}
        items={content.expertise.items}
      />

      <Faculty
        eyebrow={content.faculty.eyebrow}
        title={content.faculty.title}
        members={content.faculty.members}
      />

      <FinalCta
        locale={lang}
        title={content.cta.title}
        description={content.cta.description}
        ctaPrimary={content.cta.ctaPrimary}
        ctaSecondary={content.cta.ctaSecondary}
        primarySujet="masterclass"
        secondarySujet="expert"
        phone={{ label: "Cellulift Academy", number: company.academyPhone }}
        email={{ label: "Cellulift Academy", address: company.academyEmail }}
      />
    </>
  );
}
