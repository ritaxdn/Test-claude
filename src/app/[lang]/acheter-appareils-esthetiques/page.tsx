import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Check, MapPin } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/alternates";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { homeContent } from "@/content/home";
import { buyGuide } from "@/content/buy-guide";
import { categoryLandings, landingKeys, landingPath } from "@/content/category-landings";
import { agencyKeys, agencyPath, agencyShowroom } from "@/content/agencies";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Cta } from "@/components/system/Cta";
import { Faq } from "@/components/system/Faq";
import { GuideBanner } from "@/components/guide/GuideBanner";
import { FinalCta } from "@/components/sections/FinalCta";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const c = buyGuide[lang];
  return pageMetadata({ lang, path: "/acheter-appareils-esthetiques", title: c.meta.title, description: c.meta.description });
}

/** Guide d'achat : où acheter des appareils esthétiques au Maroc (réponse directe, points à vérifier, gammes, agences, FAQ). */
export default async function BuyGuidePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = buyGuide[lang];
  const dict = getDictionary(lang);
  const cta = homeContent[lang].finalCta;

  return (
    <>
      <Breadcrumbs lang={lang} items={[[c.eyebrow, "/acheter-appareils-esthetiques"]]} />
      <PageHero eyebrow={c.eyebrow} title={c.h1} subtitle={c.answer} compact />

      <section className="px-3 pb-12 md:px-5 md:pb-16">
        <Container>
          <div className="flex flex-wrap gap-3">
            <Cta href={`/${lang}/contact?sujet=demo`}>{dict.common.requestDemo}</Cta>
            <Cta href={`/${lang}/contact?sujet=devis`} variant="line">
              {lang === "fr" ? "Demander un devis" : "Request a quote"}
            </Cta>
          </div>

          <Reveal className="mt-12">
            <h2 className="display text-2xl text-deep md:text-3xl">{c.checkTitle}</h2>
          </Reveal>
          <RevealGroup className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {c.check.map(([title, text]) => (
              <RevealItem key={title}>
                <div className="glass h-full rounded-[1.5rem] p-6">
                  <Check size={18} className="text-[var(--rainbow-2)]" />
                  <h3 className="mt-4 font-sans text-base font-medium text-deep">{title}</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-deep-soft">{text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-16">
            <h2 className="display text-2xl text-deep md:text-3xl">{c.rangesTitle}</h2>
            <p className="mt-2 font-sans text-sm text-deep-soft">{c.rangesNote}</p>
          </Reveal>
          <RevealGroup className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {landingKeys.map((k) => (
              <RevealItem key={k}>
                <Link href={`/${lang}${landingPath(k)}`} className="glass flex h-full flex-col rounded-[1.5rem] p-6 transition-colors hover:bg-white/70">
                  <h3 className="display text-lg text-deep">{categoryLandings[k].h1[lang]}</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-deep-soft">{categoryLandings[k].description[lang]}</p>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal className="glass mt-3 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] p-6">
            <p className="font-sans text-deep">{c.byIndication}</p>
            <Cta href={`/${lang}/indications`} variant="line">
              {c.byIndicationCta}
            </Cta>
          </Reveal>

          <Reveal className="mt-16">
            <h2 className="display text-2xl text-deep md:text-3xl">{c.agenciesTitle}</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {agencyKeys.map((k) => {
                const a = agencyShowroom(k);
                return (
                  <Link key={k} href={`/${lang}${agencyPath(k)}`} className="glass rounded-[1.5rem] p-6 transition-colors hover:bg-white/70">
                    <MapPin size={16} className="text-deep-soft" />
                    <p className="display mt-3 text-lg text-deep">{a.city[lang]}</p>
                    <p className="mt-1 font-sans text-sm text-deep-soft">{a.address}</p>
                  </Link>
                );
              })}
            </div>
          </Reveal>
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
