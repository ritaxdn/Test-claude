import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Check, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/alternates";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { homeContent } from "@/content/home";
import { company, whatsappHref } from "@/content/company";
import { senegalPage } from "@/content/senegal";
import { categoryLandings, landingKeys, landingPath } from "@/content/category-landings";
import { topicKeys, topicPath, topics } from "@/content/tech-topics";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Cta } from "@/components/system/Cta";
import { Faq } from "@/components/system/Faq";
import { GuideBanner } from "@/components/guide/GuideBanner";
import { FinalCta } from "@/components/sections/FinalCta";

const PATH = "/appareils-esthetiques-senegal";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const c = senegalPage[lang];
  return pageMetadata({ lang, path: PATH, title: c.meta.title, description: c.meta.description });
}

/** Page Sénégal : appareils médico-esthétiques au Sénégal / à Dakar, coordonnées du siège de Casablanca. */
export default async function SenegalPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = senegalPage[lang];
  const dict = getDictionary(lang);
  const cta = homeContent[lang].finalCta;
  const tel = (n: string) => `tel:${n.replace(/[^\d+]/g, "")}`;
  const contacts = [
    { icon: MessageCircle, label: c.whatsapp, value: company.whatsapp, href: whatsappHref(lang) },
    { icon: Phone, label: c.phone, value: company.phone, href: tel(company.phone) },
    { icon: Mail, label: c.email, value: company.email, href: `mailto:${company.email}` },
    { icon: MapPin, label: c.address, value: company.address[lang], href: `/${lang}/agences/casablanca` },
  ];

  return (
    <>
      <Breadcrumbs lang={lang} items={[[c.eyebrow, PATH]]} />
      <PageHero eyebrow={c.eyebrow} title={c.h1} subtitle={c.answer} compact />

      <section className="px-3 pb-12 md:px-5 md:pb-16">
        <Container>
          <div className="flex flex-wrap gap-3">
            {company.whatsapp && <Cta href={whatsappHref(lang)}>{c.whatsappCta}</Cta>}
            <Cta href={`/${lang}/contact?sujet=devis`} variant="line">
              {c.quoteCta}
            </Cta>
          </div>

          <Reveal className="mt-12">
            <h2 className="display text-2xl text-deep md:text-3xl">{c.whyTitle}</h2>
          </Reveal>
          <RevealGroup className="mt-6 grid gap-3 sm:grid-cols-2">
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

          <Reveal className="mt-16">
            <h2 className="display text-2xl text-deep md:text-3xl">{c.rangesTitle}</h2>
          </Reveal>
          <RevealGroup className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {landingKeys.map((k) => (
              <RevealItem key={k}>
                <Link href={`/${lang}${landingPath(k)}`} className="glass flex h-full flex-col rounded-[1.5rem] p-6 transition-colors hover:bg-white/70">
                  {/* Titres de gamme sans « au Maroc » (textes écrits pour les pages marocaines) */}
                  <h3 className="display text-lg text-deep">{categoryLandings[k].h1[lang].replace(/ (au Maroc|in Morocco)$/, "")}</h3>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
          <p className="data-label mt-8 text-deep-soft">{c.techTitle}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {topicKeys.map((k) => (
              <Link key={k} href={`/${lang}${topicPath(k)}`} className="glass-soft rounded-full px-4 py-2 font-sans text-sm text-deep transition-colors hover:bg-white">
                {topics[k].name[lang]}
              </Link>
            ))}
          </div>

          <Reveal className="glass mt-16 rounded-[1.75rem] p-8 md:p-10">
            <h2 className="display text-2xl text-deep md:text-3xl">{c.contactTitle}</h2>
            <p className="mt-3 font-sans text-sm text-deep-soft">{c.contactNote}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {contacts
                .filter((x) => x.value)
                .map(({ icon: Icon, label, value, href }) => (
                  <li key={label}>
                    <a href={href} className="glass-soft flex items-start gap-3 rounded-[1.25rem] p-4 transition-colors hover:bg-white">
                      <Icon size={18} className="mt-0.5 shrink-0 text-deep-soft" />
                      <span>
                        <span className="data-label block text-deep-soft">{label}</span>
                        <span className="font-sans text-deep">{value}</span>
                      </span>
                    </a>
                  </li>
                ))}
            </ul>
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
