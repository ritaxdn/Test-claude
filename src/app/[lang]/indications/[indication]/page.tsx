import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { isLocale, locales } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/alternates";
import { SITE_URL } from "@/lib/site";
import { Breadcrumbs, JsonLd } from "@/components/seo/JsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { technologies } from "@/content/technologies";
import { homeContent } from "@/content/home";
import { indicationKeys, indicationLabels, indicationPath, indications, type IndicationKey } from "@/content/indications";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { TechnologyCard } from "@/components/technologies/TechnologyCard";
import { Faq } from "@/components/system/Faq";
import { GuideBanner } from "@/components/guide/GuideBanner";
import { FinalCta } from "@/components/sections/FinalCta";

// Seules les indications définies ont une page : toute autre adresse /indications/… renvoie une 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => indicationKeys.map((indication) => ({ lang, indication })));
}

const isIndication = (k: string): k is IndicationKey => (indicationKeys as string[]).includes(k);

export async function generateMetadata({ params }: { params: Promise<{ lang: string; indication: string }> }): Promise<Metadata> {
  const { lang, indication } = await params;
  if (!isLocale(lang) || !isIndication(indication)) return {};
  const i = indications[indication];
  return pageMetadata({ lang, path: indicationPath(indication), title: i.title[lang], description: i.description[lang] });
}

/** Page par indication : technologies adaptées, comment choisir, comparatif, FAQ. */
export default async function IndicationPage({ params }: { params: Promise<{ lang: string; indication: string }> }) {
  const { lang, indication } = await params;
  if (!isLocale(lang) || !isIndication(indication)) notFound();
  const i = indications[indication];
  const l = indicationLabels[lang];
  const dict = getDictionary(lang);
  const cta = homeContent[lang].finalCta;
  const machines = i.slugs.map((s) => technologies.find((m) => m.slug === s)).filter((m) => !!m);
  // Indications de la fiche qui concernent cette page (repérées sur le texte français)
  const related = (m: (typeof machines)[number]) => (m.indications ?? []).filter((x) => i.match.test(x.fr)).map((x) => x[lang]);
  const faq = [
    { q: l.faqWhich(i.forWhat[lang]), a: l.faqWhichA(machines.map((m) => m.name).join(", ")) },
    { q: l.faqSessions, a: l.faqSessionsA },
    { q: l.faqPrice, a: l.faqPriceA },
    { q: l.faqDemo, a: l.faqDemoA },
  ];

  return (
    <>
      <Breadcrumbs lang={lang} items={[[l.hub, "/indications"], [i.name[lang], indicationPath(indication)]]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: i.h1[lang],
          numberOfItems: machines.length,
          itemListElement: machines.map((m, n) => ({ "@type": "ListItem", position: n + 1, name: m.name, url: `${SITE_URL}/${lang}/technologies/${m.slug}` })),
        }}
      />
      <PageHero eyebrow={l.hub} title={i.h1[lang]} subtitle={i.intro[lang]} compact />

      <section className="px-3 pb-12 md:px-5 md:pb-16">
        <Container>
          <Reveal className="glass rounded-[1.75rem] p-8 md:p-10">
            <h2 className="display text-2xl text-deep md:text-3xl">{l.choose}</h2>
            <ul className="mt-6 space-y-4">
              {i.choose.map((c) => (
                <li key={c.fr} className="flex items-start gap-3 font-sans text-deep">
                  <Check size={16} className="mt-1 shrink-0 text-[var(--rainbow-2)]" /> {c[lang]}
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="mt-16">
            <h2 className="display text-2xl text-deep md:text-3xl">{l.machines}</h2>
            <RevealGroup className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {machines.map((m) => (
                <RevealItem key={m.slug}>
                  <TechnologyCard technology={m} locale={lang} readMoreLabel={dict.common.readMore} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <Reveal className="mt-16">
            <h2 className="display text-2xl text-deep md:text-3xl">{l.table}</h2>
            <div className="glass mt-6 overflow-x-auto rounded-[1.75rem] p-4 md:p-8">
              <table className="w-full min-w-[36rem] font-sans text-sm">
                <thead>
                  <tr className="data-label text-left text-deep-soft">
                    <th className="pb-3 pr-4 font-normal">{l.machine}</th>
                    <th className="pb-3 pr-4 font-normal">{l.technology}</th>
                    <th className="pb-3 font-normal">{l.forThis}</th>
                  </tr>
                </thead>
                <tbody>
                  {machines.map((m) => (
                    <tr key={m.slug} className="border-t border-deep/10 align-top">
                      <td className="py-3 pr-4">
                        <Link href={`/${lang}/technologies/${m.slug}`} className="font-medium text-deep hover:underline">
                          {m.name}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-deep-soft">{m.tagline?.[lang] ?? ""}</td>
                      <td className="py-3 text-deep">{related(m).join(" · ") || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </Container>
      </section>

      <Faq locale={lang} title={l.faq(i.name[lang])} items={faq} />

      <section className="px-3 pb-12 md:px-5 md:pb-16">
        <Container>
          <p className="data-label text-deep-soft">{l.other}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {indicationKeys
              .filter((k) => k !== indication)
              .map((k) => (
                <Link key={k} href={`/${lang}${indicationPath(k)}`} className="glass-soft rounded-full px-4 py-2 font-sans text-sm text-deep transition-colors hover:bg-white">
                  {indications[k].name[lang]}
                </Link>
              ))}
          </div>
          <GuideBanner locale={lang} className="mt-10" />
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
