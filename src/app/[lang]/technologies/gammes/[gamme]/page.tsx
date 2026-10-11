import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { isLocale, locales } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/alternates";
import { SITE_URL } from "@/lib/site";
import { Breadcrumbs, JsonLd } from "@/components/seo/JsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { technologies } from "@/content/technologies";
import { technologiesPageContent } from "@/content/technologies-page";
import { homeContent } from "@/content/home";
import { categoryLandings, landingKeys, landingLabels, landingPath, type LandingKey } from "@/content/category-landings";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { TechnologyCard } from "@/components/technologies/TechnologyCard";
import { IncludedServices } from "@/components/technologies/IncludedServices";
import { GuideBanner } from "@/components/guide/GuideBanner";
import { FinalCta } from "@/components/sections/FinalCta";

// Seules les gammes validées ont une page : toute autre adresse /technologies/gammes/… renvoie une 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => landingKeys.map((gamme) => ({ lang, gamme })));
}

const isLanding = (g: string): g is LandingKey => (landingKeys as string[]).includes(g);

export async function generateMetadata({ params }: { params: Promise<{ lang: string; gamme: string }> }): Promise<Metadata> {
  const { lang, gamme } = await params;
  if (!isLocale(lang) || !isLanding(gamme)) return {};
  const l = categoryLandings[gamme];
  return pageMetadata({ lang, path: landingPath(gamme), title: l.title[lang], description: l.description[lang] });
}

export default async function RangePage({ params }: { params: Promise<{ lang: string; gamme: string }> }) {
  const { lang, gamme } = await params;
  if (!isLocale(lang) || !isLanding(gamme)) notFound();

  const l = categoryLandings[gamme];
  const t = landingLabels[lang];
  const dict = getDictionary(lang);
  const cta = homeContent[lang].finalCta;
  const page = technologiesPageContent[lang];
  // Machines de la gamme (catalogue existant), hors exclusions décidées par Cellulift
  const machines = technologies.filter((m) => m.category === l.category && !l.exclude.includes(m.slug));
  // Accompagnement existant, sans la ligne Certification (CE/FDA en attente de validation machine par machine)
  const included = page.included.filter(([k]) => k !== "Certification");
  const withIndications = machines.filter((m) => m.indications?.length);

  return (
    <>
      <Breadcrumbs lang={lang} items={[["Technologies", "/technologies"], [l.h1[lang], landingPath(gamme)]]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: l.h1[lang],
          numberOfItems: machines.length,
          itemListElement: machines.map((m, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: m.name,
            url: `${SITE_URL}/${lang}/technologies/${m.slug}`,
          })),
        }}
      />
      <PageHero eyebrow={t.eyebrow} title={l.h1[lang]} subtitle={l.intro[lang] || undefined} compact />

      <section className="px-3 pb-12 md:px-5 md:pb-16">
        <Container>
          <h2 className="display text-2xl text-deep md:text-3xl">{t.technologies}</h2>
          <RevealGroup className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {machines.map((m) => (
              <RevealItem key={m.slug}>
                <TechnologyCard technology={m} locale={lang} readMoreLabel={dict.common.readMore} />
              </RevealItem>
            ))}
          </RevealGroup>

          {withIndications.length > 0 && (
            <div className="mt-16">
              <h2 className="display text-2xl text-deep md:text-3xl">{t.guide}</h2>
              <p className="mt-2 font-sans text-sm text-deep-soft">{t.guideNote}</p>
              <dl className="mt-6 divide-y divide-deep/10 border-y border-deep/10">
                {withIndications.map((m) => (
                  <div key={m.slug} className="grid gap-2 py-5 md:grid-cols-[14rem_1fr] md:gap-8">
                    <dt>
                      <Link href={`/${lang}/technologies/${m.slug}`} className="display text-lg text-deep hover:underline">
                        {m.name}
                      </Link>
                    </dt>
                    <dd>
                      <ul className="flex flex-wrap gap-2">
                        {m.indications!.map((ind) => (
                          <li key={ind[lang]} className="glass-soft rounded-full px-3 py-1.5 font-sans text-sm text-deep">
                            {ind[lang]}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-16">
            <IncludedServices label={page.includedLabel} items={included} />
          </div>
          <GuideBanner locale={lang} className="mt-2" />
        </Container>
      </section>

      <FinalCta
        locale={lang}
        title={cta.title}
        description={cta.description}
        ctaPrimary={dict.common.requestDemo}
        ctaSecondary={dict.common.speakToExpert}
        primarySujet="demo"
        secondarySujet="expert"
      />
    </>
  );
}
