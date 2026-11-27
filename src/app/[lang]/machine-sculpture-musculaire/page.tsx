import { notFound } from "next/navigation";
import { withLgl } from "@/components/brand/LglLink";
import Link from "next/link";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/alternates";
import { SITE_URL } from "@/lib/site";
import { Breadcrumbs, JsonLd } from "@/components/seo/JsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { homeContent } from "@/content/home";
import { technologies } from "@/content/technologies";
import { muscleSculpting } from "@/content/muscle-sculpting";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Cta } from "@/components/system/Cta";
import { Faq } from "@/components/system/Faq";
import { TechnologyCard } from "@/components/technologies/TechnologyCard";
import { FinalCta } from "@/components/sections/FinalCta";

const PATH = "/machine-sculpture-musculaire";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const c = muscleSculpting[lang];
  return pageMetadata({ lang, path: PATH, title: c.meta.title, description: c.meta.description });
}

/** Page « Machine de sculpture musculaire » : Steel Muscle (LGL Expert). */
export default async function MuscleSculptingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = muscleSculpting[lang];
  const dict = getDictionary(lang);
  const cta = homeContent[lang].finalCta;
  const steel = technologies.find((m) => m.slug === "steel-muscle");
  const rf = ["longishape", "slimax-lipo-7"].map((s) => technologies.find((m) => m.slug === s)).filter((m) => !!m);

  return (
    <>
      <Breadcrumbs lang={lang} items={[[c.eyebrow, PATH]]} />
      {steel && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: c.h1,
            numberOfItems: 1,
            itemListElement: [{ "@type": "ListItem", position: 1, name: steel.name, url: `${SITE_URL}/${lang}/technologies/${steel.slug}` }],
          }}
        />
      )}
      <PageHero eyebrow={c.eyebrow} title={c.h1} subtitle={c.answer} compact />

      <section className="px-3 pb-12 md:px-5 md:pb-16">
        <Container>
          <div className="flex flex-wrap gap-3">
            <Cta href={`/${lang}/contact?sujet=demo`}>{c.cta}</Cta>
            <Cta href={`/${lang}/technologies/steel-muscle`} variant="line">
              {c.sheet}
            </Cta>
          </div>

          <Reveal className="mt-12">
            <h2 className="display text-2xl text-deep md:text-3xl">{c.whatTitle}</h2>
          </Reveal>
          <RevealGroup className="mt-6 grid gap-3 sm:grid-cols-2">
            {c.what.map(([title, text]) => (
              <RevealItem key={title}>
                <div className="glass h-full rounded-[1.5rem] p-6">
                  <Check size={18} className="text-[var(--rainbow-2)]" />
                  <h3 className="mt-4 font-sans text-base font-medium text-deep">{title}</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-deep-soft">{withLgl(text)}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-16 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <Reveal>
              <h2 className="display text-2xl text-deep md:text-3xl">{c.tableTitle}</h2>
              <div className="glass mt-6 rounded-[1.75rem] p-4 md:p-8">
                <table className="w-full font-sans text-sm">
                  <tbody>
                    {c.table.map(([k, v]) => (
                      <tr key={k} className="border-t border-deep/10 align-top first:border-t-0">
                        <th scope="row" className="data-label w-2/5 py-3 pr-4 text-left font-normal text-deep-soft">
                          {k}
                        </th>
                        <td className="py-3 text-deep">{withLgl(v)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
            {steel && (
              <Reveal className="lg:pt-14">
                <TechnologyCard technology={steel} locale={lang} readMoreLabel={dict.common.readMore} />
              </Reveal>
            )}
          </div>

          <Reveal className="mt-16">
            <h2 className="display text-2xl text-deep md:text-3xl">{c.whyTitle}</h2>
          </Reveal>
          <RevealGroup className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {c.why.map(([title, text]) => (
              <RevealItem key={title}>
                <div className="glass h-full rounded-[1.5rem] p-6">
                  <h3 className="font-sans text-base font-medium text-deep">{title}</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-deep-soft">{withLgl(text)}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="glass mt-16 rounded-[1.75rem] p-8 md:p-10">
            <h2 className="display text-2xl text-deep md:text-3xl">{c.combineTitle}</h2>
            <p className="mt-4 max-w-3xl font-sans text-deep">{c.combine}</p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {rf.map((m) => (
                <TechnologyCard key={m.slug} technology={m} locale={lang} readMoreLabel={dict.common.readMore} />
              ))}
            </div>
            <Link href={`/${lang}/radiofrequence-esthetique`} className="mt-6 inline-block font-sans text-sm text-deep underline underline-offset-4">
              {c.combineLink}
            </Link>
          </Reveal>
        </Container>
      </section>

      <Faq locale={lang} title={c.faqTitle} items={c.faq.map(([q, a]) => ({ q, a }))} />

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
