import Link from "next/link";
import { Check } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/site";
import { Breadcrumbs, JsonLd } from "@/components/seo/JsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { technologies } from "@/content/technologies";
import { homeContent } from "@/content/home";
import { indicationPath, indications } from "@/content/indications";
import { siloChildren, topicKeys, topicPath, topics, type TopicKey } from "@/content/tech-topics";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { TechnologyCard } from "@/components/technologies/TechnologyCard";
import { Faq } from "@/components/system/Faq";
import { GuideBanner } from "@/components/guide/GuideBanner";
import { FinalCta } from "@/components/sections/FinalCta";

/** Minuscule initiale seulement (garde Nd:YAG, CO2, IPL) */
const lc = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

const labels = {
  fr: {
    know: "Ce qu'il faut savoir",
    techs: "Les technologies",
    machines: "Les machines CELLULIFT",
    table: "Comparatif",
    machine: "Machine",
    technology: "Technologie",
    indications: "Par indication",
    others: "Autres technologies",
    faq: (n: string) => `Questions fréquentes : ${lc(n)}`,
    price: (n: string) => `Quel est le prix d'une machine ${lc(n)} professionnelle au Maroc ?`,
    priceA:
      "Le prix dépend de la machine, des longueurs d'onde ou des pièces à main choisies, et des options : il est communiqué sur demande, avec un devis détaillé. L'installation, la formation CELLULIFT Academy et la garantie 24 mois main-d'œuvre sont incluses. Des solutions de financement sont disponibles.",
    where: (n: string) => `Où acheter une machine ${lc(n)} au Maroc ?`,
    whereA:
      "CELLULIFT distribue ses machines au Maroc depuis 2002, avec 3 agences (Casablanca, Marrakech, Tanger) et un SAV local. Vous pouvez essayer chaque machine en agence avant d'acheter.",
    demo: "Peut-on faire une démonstration ?",
    demoA: "Oui. Réservez une démonstration dans l'une de nos agences, à Casablanca, Marrakech ou Tanger, ou demandez l'avis d'un expert CELLULIFT.",
  },
  en: {
    know: "What you need to know",
    techs: "Technologies",
    machines: "CELLULIFT devices",
    table: "Comparison",
    machine: "Device",
    technology: "Technology",
    indications: "By indication",
    others: "Other technologies",
    faq: (n: string) => `FAQ: ${lc(n)}`,
    price: (n: string) => `How much does a professional ${lc(n)} device cost in Morocco?`,
    priceA:
      "The price depends on the device, the wavelengths or handpieces chosen, and the options: it is given on request, with a detailed quote. Installation, CELLULIFT Academy training and a 24-month labour warranty are included. Financing solutions are available.",
    where: (n: string) => `Where can I buy a ${lc(n)} device in Morocco?`,
    whereA:
      "CELLULIFT has distributed its devices in Morocco since 2002, with 3 branches (Casablanca, Marrakech, Tangier) and local after-sales service. You can try every device at a branch before buying.",
    demo: "Can I get a demonstration?",
    demoA: "Yes. Book a demonstration at one of our branches in Casablanca, Marrakech or Tangier, or ask a CELLULIFT expert for advice.",
  },
};

/** Page de silo technologique (laser, radiofréquence) : page mère ou page fille. */
export function TechTopicPage({ lang, topic }: { lang: Locale; topic: TopicKey }) {
  const tp = topics[topic];
  const l = labels[lang];
  const dict = getDictionary(lang);
  const cta = homeContent[lang].finalCta;
  const hub = topics[tp.silo as TopicKey];
  const isHub = !tp.slug;
  const children = siloChildren(tp.silo);
  const machines = tp.slugs.map((s) => technologies.find((m) => m.slug === s)).filter((m) => !!m);
  const faq = [
    ...tp.compare.map((c) => ({ q: c.q[lang], a: c.a[lang] })),
    { q: l.price(tp.name[lang]), a: l.priceA },
    { q: l.where(tp.name[lang]), a: l.whereA },
    { q: l.demo, a: l.demoA },
  ];
  const crumbs: [string, string][] = isHub
    ? [[tp.name[lang], topicPath(topic)]]
    : [
        [hub.name[lang], topicPath(tp.silo as TopicKey)],
        [tp.name[lang], topicPath(topic)],
      ];
  // Autres pages du même silo + l'autre silo
  const others = topicKeys.filter((k) => k !== topic && (topics[k].silo === tp.silo || !topics[k].slug));

  return (
    <>
      <Breadcrumbs lang={lang} items={crumbs} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: tp.h1[lang],
          numberOfItems: machines.length,
          itemListElement: machines.map((m, n) => ({ "@type": "ListItem", position: n + 1, name: m.name, url: `${SITE_URL}/${lang}/technologies/${m.slug}` })),
        }}
      />
      <PageHero eyebrow={isHub ? l.techs : hub.name[lang]} title={tp.h1[lang]} subtitle={tp.intro[lang]} compact />

      <section className="px-3 pb-12 md:px-5 md:pb-16">
        <Container>
          {isHub && children.length > 0 && (
            <Reveal className="mb-16">
              <h2 className="display text-2xl text-deep md:text-3xl">{l.techs}</h2>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {children.map((k) => (
                  <Link key={k} href={`/${lang}${topicPath(k)}`} className="glass group rounded-[1.5rem] p-6 transition-colors hover:bg-white">
                    <p className="display text-xl text-deep">{topics[k].name[lang]}</p>
                    <p className="mt-2 font-sans text-sm text-deep-soft">{topics[k].description[lang].split(/ ?: |\. /)[0]}</p>
                  </Link>
                ))}
              </div>
            </Reveal>
          )}

          <Reveal className="glass rounded-[1.75rem] p-8 md:p-10">
            <h2 className="display text-2xl text-deep md:text-3xl">{l.know}</h2>
            <ul className="mt-6 space-y-4">
              {tp.points.map(([h, d]) => (
                <li key={h.fr} className="flex items-start gap-3 font-sans text-deep">
                  <Check size={16} className="mt-1 shrink-0 text-[var(--rainbow-2)]" />
                  <span>
                    <strong className="font-medium">{h[lang]}</strong> : {d[lang]}
                  </span>
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

          {machines.length > 1 && (
            <Reveal className="mt-16">
              <h2 className="display text-2xl text-deep md:text-3xl">{l.table}</h2>
              <div className="glass mt-6 overflow-x-auto rounded-[1.75rem] p-4 md:p-8">
                <table className="w-full min-w-[30rem] font-sans text-sm">
                  <thead>
                    <tr className="data-label text-left text-deep-soft">
                      <th className="pb-3 pr-4 font-normal">{l.machine}</th>
                      <th className="pb-3 font-normal">{l.technology}</th>
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
                        <td className="py-3 text-deep-soft">{m.tagline?.[lang] ?? ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          )}
        </Container>
      </section>

      <Faq locale={lang} title={l.faq(tp.name[lang])} items={faq} />

      <section className="px-3 pb-12 md:px-5 md:pb-16">
        <Container>
          <p className="data-label text-deep-soft">{l.indications}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {tp.indications.map((k) => (
              <Link key={k} href={`/${lang}${indicationPath(k)}`} className="glass-soft rounded-full px-4 py-2 font-sans text-sm text-deep transition-colors hover:bg-white">
                {indications[k].name[lang]}
              </Link>
            ))}
          </div>
          <p className="data-label mt-10 text-deep-soft">{l.others}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {others.map((k) => (
              <Link key={k} href={`/${lang}${topicPath(k)}`} className="glass-soft rounded-full px-4 py-2 font-sans text-sm text-deep transition-colors hover:bg-white">
                {topics[k].name[lang]}
              </Link>
            ))}
            <Link href={`/${lang}/technologies/gammes/hifu`} className="glass-soft rounded-full px-4 py-2 font-sans text-sm text-deep transition-colors hover:bg-white">
              HIFU
            </Link>
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
