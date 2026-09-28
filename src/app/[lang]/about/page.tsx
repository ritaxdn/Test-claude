import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/alternates";
import { aboutContent } from "@/content/about";
import { PageHero } from "@/components/sections/PageHero";
import { Pillars } from "@/components/sections/Pillars";
import { CelluliftSystem } from "@/components/sections/CelluliftSystem";
import { Heading } from "@/components/system/Heading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
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
      ? "Depuis 2002, Cellulift accompagne médecins, cliniques et centres dans l'intégration de technologies médico-esthétiques : sélection, formation, installation, SAV et développement."
      : "Since 2002, Cellulift has supported physicians, clinics and centres in integrating medical aesthetic technology: selection, training, installation, after-sales and growth.",
    alternates: localeAlternates("/about", lang),
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

      <CelluliftSystem
        eyebrow={content.system.eyebrow}
        title={content.system.title}
        intro={content.system.intro}
        center={content.system.center}
        poles={content.system.poles}
      />

      <Pillars
        eyebrow={content.commitment.eyebrow}
        title={content.commitment.title}
        mission={content.commitment.items[0]}
        vision={content.commitment.items[1]}
        values={content.commitment.items[2]}
      />

      {/* Preuves en lecture technique (lignes fines) : un autre rythme que les cartes */}
      <section className="px-3 pb-12 md:px-5 md:pb-16">
        <div className="mx-auto max-w-7xl px-3 md:px-7">
          <Heading eyebrow={content.partner.eyebrow} title={content.partner.title} />
          <RevealGroup className="mt-8 border-t border-deep/15">
            {content.partner.items.map((it, i) => (
              <RevealItem
                key={it.title}
                className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 border-b border-deep/15 py-4 sm:grid-cols-[3rem_1fr_1.4fr] sm:py-5"
              >
                <span className="data-label text-deep-soft">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-sans text-base font-medium text-deep sm:text-lg">{it.title}</span>
                <span className="col-start-2 font-sans text-sm text-deep-soft sm:col-start-3">{it.description}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
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
