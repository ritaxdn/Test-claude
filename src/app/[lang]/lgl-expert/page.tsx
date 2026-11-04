import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/alternates";
import { SITE_URL } from "@/lib/site";
import { Breadcrumbs, JsonLd } from "@/components/seo/JsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { categories, technologies } from "@/content/technologies";
import { homeContent } from "@/content/home";
import { landingForCategory, landingPath } from "@/content/category-landings";
import { lglExpertOrder, lglExpertPage, lglExpertSlugs } from "@/content/lgl-expert";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { TechnologyCard } from "@/components/technologies/TechnologyCard";
import { Faq } from "@/components/system/Faq";
import { GuideBanner } from "@/components/guide/GuideBanner";
import { FinalCta } from "@/components/sections/FinalCta";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const c = lglExpertPage[lang];
  return pageMetadata({ lang, path: "/lgl-expert", title: c.meta.title, description: c.meta.description });
}

/** Page marque LGL Expert : distributeur officiel, pourquoi acheter chez nous, la gamme par famille, FAQ. */
export default async function LglExpertPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = lglExpertPage[lang];
  const dict = getDictionary(lang);
  const cta = homeContent[lang].finalCta;
  const machines = technologies.filter((m) => lglExpertSlugs.includes(m.slug));
  const groups = lglExpertOrder.map((cat) => ({ cat, items: machines.filter((m) => m.category === cat) })).filter((g) => g.items.length);

  return (
    <>
      <Breadcrumbs lang={lang} items={[["LGL Expert", "/lgl-expert"]]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: c.rangeTitle,
          numberOfItems: machines.length,
          itemListElement: machines.map((m, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: m.name,
            url: `${SITE_URL}/${lang}/technologies/${m.slug}`,
          })),
        }}
      />
      <PageHero eyebrow={c.eyebrow} title={c.h1} subtitle={c.intro} compact />

      <section className="px-3 pb-12 md:px-5 md:pb-16">
        <Container>
          <Reveal>
            <h2 className="display text-2xl text-deep md:text-3xl">{c.whyTitle}</h2>
          </Reveal>
          <RevealGroup className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {c.why.map(([title, text]) => (
              <RevealItem key={title}>
                <div className="glass h-full rounded-[1.5rem] p-6">
                  <Check size={18} className="text-[var(--rainbow-2)]" />
                  <h3 className="mt-4 font-sans text-base font-medium text-deep">{title}</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-deep-soft">{text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-16">
            <h2 className="display text-2xl text-deep md:text-3xl">{c.rangeTitle}</h2>
            <p className="mt-2 font-sans text-sm text-deep-soft">{c.rangeNote}</p>
            {groups.map(({ cat, items }) => {
              const landing = landingForCategory[cat];
              return (
                <div key={cat} className="mt-10">
                  <h3 className="display text-xl text-deep">
                    {landing ? (
                      <Link href={`/${lang}${landingPath(landing)}`} className="hover:underline">
                        {categories[cat][lang]}
                      </Link>
                    ) : (
                      categories[cat][lang]
                    )}
                  </h3>
                  <RevealGroup className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((m) => (
                      <RevealItem key={m.slug}>
                        <TechnologyCard technology={m} locale={lang} readMoreLabel={dict.common.readMore} />
                      </RevealItem>
                    ))}
                  </RevealGroup>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <Faq locale={lang} title={c.faqTitle} items={c.faq.map(([q, a]) => ({ q, a }))} />

      <section className="px-3 pb-12 md:px-5 md:pb-16">
        <Container>
          <GuideBanner locale={lang} />
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
