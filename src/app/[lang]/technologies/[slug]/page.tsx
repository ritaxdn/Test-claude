import { GuideBanner } from "@/components/guide/GuideBanner";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Check } from "lucide-react";
import { isLocale, locales } from "@/lib/i18n/config";
import { technologySeo } from "@/content/technology-seo";
import { pageMetadata } from "@/lib/alternates";
import { Breadcrumbs, JsonLd } from "@/components/seo/JsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { categories, getTechnologyBySlug, technologies, technologiesIn } from "@/content/technologies";
import { Reveal } from "@/components/ui/Reveal";
import { Cta, Pill } from "@/components/system/Cta";
import { SignalLine } from "@/components/system/SignalPath";
import photoSizes from "@/content/photo-sizes.json";
import { PhotoCarousel } from "@/components/technologies/PhotoCarousel";
import { loc, richSheets } from "@/content/technology-rich";
import { company } from "@/content/company";
import { SITE_URL } from "@/lib/site";
import { landingForCategory, landingPath } from "@/content/category-landings";
import { Faq } from "@/components/system/Faq";
import { LiteInstagram } from "@/components/media/LiteInstagram";

export function generateStaticParams() {
  return locales.flatMap((lang) => technologies.map((tech) => ({ lang, slug: tech.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const tech = getTechnologyBySlug(slug);
  if (!tech) return {};
  const family = categories[tech.category][lang];
  const cover = tech.images?.[0];
  const size = cover ? ((photoSizes as Record<string, number[]>)[cover] ?? [1100, 1100]) : null;
  const seo = technologySeo[slug];
  return pageMetadata({
    lang,
    path: `/technologies/${slug}`,
    // Gammes au nom identique en FR et EN (Photomodulation, HIFU) : title EN distinct du FR
    title: seo ? seo.title[lang] : `${tech.name} — ${family}${lang === "en" && family === categories[tech.category].fr ? " device" : ""}`,
    description: seo
      ? seo.description[lang]
      : tech.tagline
        ? lang === "fr"
          ? `${tech.name} : ${tech.tagline.fr} Installation, formation Cellulift Academy et SAV inclus.`
          : `${tech.name}: ${tech.tagline.en} Installation, Cellulift Academy training and after-sales included.`
        : lang === "fr"
          ? `${tech.name} — ${family}. Technologie Cellulift livrée avec formation, protocoles et support.`
          : `${tech.name} — ${family}. Cellulift technology delivered with training, protocols and support.`,
    // Partage : photo de la machine plutôt que l'image générique
    image: cover && size ? { url: cover, width: size[0], height: size[1], alt: tech.name } : undefined,
  });
}

const t = {
  fr: {
    sheet: "Fiche technique sur demande",
    sheetText:
      "Caractéristiques, indications, protocoles et conditions d'installation : un expert Cellulift vous envoie la fiche complète et répond à vos questions.",
    included: "Inclus avec la technologie",
    includedItems: ["Installation et mise en service", "Formation Cellulift Academy", "Protocoles de traitement", "Support et maintenance"],
    sameFamily: "Dans la même famille",
    modules: (n: number) => `${n} technologies dans une seule plateforme`,
    indicationsTitle: "Indications",
    indicationCol: "Indication",
    techCol: "Technologie",
    specsTitle: "Caractéristiques techniques",
    profitTitle: "Pourquoi c'est rentable",
    includedRich: (m: string) => `Inclus avec ${m}`,
    includedRichItems: [
      ["Installation et mise en service", "par nos techniciens, dans votre cabinet."],
      ["Formation CELLULIFT Academy", "prise en main, sécurité et paramétrage par indication."],
      ["Protocoles de traitement", "prêts à l'emploi pour chaque indication."],
      ["Garantie 24 mois main-d'œuvre", "support technique et atelier intégré."],
    ],
    seeAlso: "Pour aller plus loin",
    gamme: (g: string) => `Toute la gamme ${g}`,
    academyLink: "Les formations CELLULIFT Academy",
    guideLink: "Guide : 7 questions avant d'investir",
    forWho: "Pour quel cabinet ?",
    protocol: "Protocoles",
    price: "Prix et financement",
    priceTitle: "Prix sur demande",
    priceText: "Le prix dépend de la configuration. Des solutions de financement sont disponibles : un conseiller Cellulift vous envoie un devis et les options adaptées à votre cabinet.",
    quote: "Demander un devis",
    whatsapp: "Devis sur WhatsApp",
    waQuote: (m: string) => `Bonjour Cellulift, je souhaite un devis et les options de financement pour ${m}.`,
    video: "En vidéo",
    play: "Lire la vidéo",
    faq: (m: string) => `Questions fréquentes sur ${m}`,
    facts: [
      ["Pour", "Médecins et centres médico-esthétiques"],
      ["Inclus", "Installation · Formation · Protocoles"],
      ["Garantie", "24 mois · main-d'œuvre"],
      ["Après l'achat", "Support technique et atelier intégré"],
    ],
  },
  en: {
    sheet: "Technical sheet on request",
    sheetText:
      "Specifications, indications, protocols and installation requirements: a Cellulift expert sends you the full sheet and answers your questions.",
    included: "Included with the technology",
    includedItems: ["Installation and commissioning", "Cellulift Academy training", "Treatment protocols", "Support and maintenance"],
    sameFamily: "In the same family",
    modules: (n: number) => `${n} technologies in a single platform`,
    indicationsTitle: "Indications",
    indicationCol: "Indication",
    techCol: "Technology",
    specsTitle: "Technical specifications",
    profitTitle: "Why it pays off",
    includedRich: (m: string) => `Included with ${m}`,
    includedRichItems: [
      ["Installation and commissioning", "by our technicians, at your practice."],
      ["CELLULIFT Academy training", "getting started, safety and settings for each indication."],
      ["Treatment protocols", "ready to use for each indication."],
      ["24-month labour warranty", "technical support and in-house workshop."],
    ],
    seeAlso: "Go further",
    gamme: (g: string) => `The full ${g} range`,
    academyLink: "CELLULIFT Academy training",
    guideLink: "Guide: 7 questions before investing",
    forWho: "Which practice is it for?",
    protocol: "Protocols",
    price: "Pricing and financing",
    priceTitle: "Price on request",
    priceText: "Pricing depends on the configuration. Financing options are available: a Cellulift advisor sends you a quote and the options that suit your practice.",
    quote: "Request a quote",
    whatsapp: "Quote on WhatsApp",
    waQuote: (m: string) => `Hello Cellulift, I would like a quote and financing options for ${m}.`,
    video: "On video",
    play: "Play the video",
    faq: (m: string) => `${m}: frequently asked questions`,
    facts: [
      ["For", "Physicians and medical aesthetic centres"],
      ["Included", "Installation · Training · Protocols"],
      ["Warranty", "24 months · labour"],
      ["After purchase", "Technical support and in-house workshop"],
    ],
  },
} as const;

export default async function TechnologyDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const tech = getTechnologyBySlug(slug);
  if (!tech) notFound();

  const dict = getDictionary(lang);
  const l = t[lang];
  const family = technologiesIn(tech.category).filter((x) => x.slug !== tech.slug);
  const hasSheet = !!(tech.description || tech.indications?.length || tech.benefits?.length);
  const rich = richSheets[tech.slug];
  const waQuote = `https://wa.me/${company.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(l.waQuote(tech.name))}`;

  return (
    <div className="px-3 pb-24 pt-10 md:px-5 md:pt-14">
      <Breadcrumbs
        lang={lang}
        items={[
          ["Technologies", "/technologies"],
          [tech.name, `/technologies/${tech.slug}`],
        ]}
      />
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Link
          href={`/${lang}/technologies`}
          className="inline-flex items-center gap-2 font-sans text-sm text-deep-soft transition-colors hover:text-deep"
        >
          <ArrowLeft size={16} /> {dict.common.backTo} {dict.nav.technologies}
        </Link>

        <div className="mt-10 grid animate-fade-rise gap-10 opacity-0 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <Pill className="bg-white/60">{categories[tech.category][lang]}</Pill>
            <h1 className="mt-6 text-deep">
              <span className="display block text-balance text-[clamp(2.4rem,6vw,5.6rem)]">{tech.name}</span>
              {rich && (
                <span className="mt-4 block max-w-2xl font-sans text-[clamp(1.15rem,1.8vw,1.5rem)] font-medium leading-snug first-letter:uppercase">
                  <span className="sr-only"> : </span>
                  {rich.h1[lang]}
                </span>
              )}
            </h1>
            {rich ? (
              <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-deep-soft">{rich.hook[lang]}</p>
            ) : (
              tech.tagline && <p className="mt-6 max-w-xl font-sans text-lg text-deep-soft">{tech.tagline[lang]}</p>
            )}
            {tech.certifications && (
              <div className="mt-6 flex flex-wrap gap-2">
                {tech.certifications.map((c) => (
                  <Pill key={c}>{c}</Pill>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Cta href={`/${lang}/contact?sujet=demo&machine=${tech.slug}`}>{dict.common.requestDemo}</Cta>
            <Cta href={`/${lang}/contact?sujet=expert&machine=${tech.slug}`} variant="line">{dict.common.speakToExpert}</Cta>
          </div>
        </div>

        {/* Réponses immédiates : pour qui, ce qui est inclus, la garantie, l'après-vente */}
        <Reveal className="mt-10 grid grid-cols-2 border-t border-deep/15 lg:grid-cols-4">
          {l.facts.map(([k, v], i) => (
            <div
              key={k}
              className="relative border-b border-deep/15 py-4 pr-4 odd:border-r lg:border-b-0 lg:border-r lg:px-5 lg:first:pl-0 lg:last:border-r-0 [&:nth-child(even)]:pl-4 lg:[&:nth-child(even)]:pl-5"
            >
              <SignalLine delay={i * 0.1} className="absolute inset-x-0 top-[-1px]" />
              <p className="data-label text-deep-soft">{k}</p>
              <p className="mt-2 font-sans text-sm font-medium text-deep">{v}</p>
            </div>
          ))}
        </Reveal>

        {tech.images?.length ? (
          <PhotoCarousel
            images={tech.images}
            name={tech.name}
            family={categories[tech.category][lang]}
            labels={
              lang === "fr"
                ? { prev: "Photo précédente", next: "Photo suivante", photo: "Photo" }
                : { prev: "Previous photo", next: "Next photo", photo: "Photo" }
            }
          />
        ) : null}

        {!rich && <GuideBanner locale={lang} className="mt-10" />}

        {!rich && (
        <div className="mt-6 grid gap-3 lg:grid-cols-[1.3fr_1fr]">
          {hasSheet ? (
            <Reveal className="glass rounded-[1.75rem] p-8 md:p-10">
              {tech.description && <p className="font-sans text-lg leading-relaxed text-deep">{tech.description[lang]}</p>}
              <div className="mt-8 grid gap-8 md:grid-cols-2">
                {[
                  { title: dict.common.indications, items: tech.indications },
                  { title: dict.common.benefits, items: tech.benefits },
                ]
                  .filter((b) => b.items?.length)
                  .map((b) => (
                      <div key={b.title}>
                        <p className="data-label text-deep-soft">{b.title}</p>
                        <ul className="mt-4 space-y-2.5">
                          {b.items!.map((x) => (
                            <li key={x.fr} className="flex items-start gap-2.5 font-sans text-sm text-deep">
                              <Check size={15} className="mt-0.5 shrink-0 text-[var(--rainbow-2)]" /> {x[lang]}
                            </li>
                          ))}
                        </ul>
                      </div>
                  ))}
              </div>
            </Reveal>
          ) : (
            <Reveal className="glass rounded-[1.75rem] p-8 md:p-10">
              <p className="data-label text-deep-soft">{tech.name}</p>
              <h2 className="display mt-6 text-2xl text-deep md:text-3xl">{l.sheet}</h2>
              <p className="mt-4 max-w-lg font-sans leading-relaxed text-deep-soft">{l.sheetText}</p>
              <div className="mt-8">
                <Cta href={`/${lang}/contact?sujet=expert&machine=${tech.slug}`}>{dict.common.speakToExpert}</Cta>
              </div>
            </Reveal>
          )}
          <Reveal className="glass rounded-[1.75rem] p-8 md:p-10">
            <p className="data-label text-deep-soft">{l.included}</p>
            <ul className="mt-6 border-t border-deep/10">
              {l.includedItems.map((x, i) => (
                <li key={x} className="flex items-center gap-4 border-b border-deep/10 py-4 font-sans text-deep">
                  <span className="data-label text-deep-soft">0{i + 1}</span> {x}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        )}

        {rich && (
          <>
            {/* Pour qui, protocole, vidéo */}
            <div className={`mt-10 grid gap-3 ${rich.instagram ? "lg:grid-cols-[1.6fr_1fr]" : ""}`}>
              <Reveal className="glass rounded-[1.75rem] p-8 md:p-10">
                <h2 className="display text-2xl text-deep md:text-3xl">{l.forWho}</h2>
                <ul className="mt-6 space-y-4">
                  {rich.forWho.map((x) => (
                    <li key={x.fr} className="flex items-start gap-3 font-sans text-deep">
                      <Check size={16} className="mt-1 shrink-0 text-[var(--rainbow-2)]" /> {x[lang]}
                    </li>
                  ))}
                </ul>
                <h2 className="display mt-10 text-2xl text-deep md:text-3xl">{l.protocol}</h2>
                <p className="mt-4 font-sans leading-relaxed text-deep-soft">{rich.protocol[lang]}</p>
              </Reveal>
              {rich.instagram && (
                <Reveal className="glass rounded-[1.75rem] p-4 md:p-5">
                  <p className="data-label px-2 pb-3 pt-1 text-deep-soft">{l.video}</p>
                  <div className="mx-auto max-w-xs">
                    <LiteInstagram url={rich.instagram} poster={tech.images?.[0] ?? "/apple-icon"} title={`${tech.name} — ${categories[tech.category][lang]}`} playLabel={l.play} />
                  </div>
                </Reveal>
              )}
            </div>
            {/* Les modules de la machine */}
            <Reveal className="mt-16">
              <h2 className="display text-[clamp(1.6rem,2.6vw,2.5rem)] text-deep">{rich.modulesTitle?.[lang] ?? l.modules(rich.modules.length)}</h2>
              <div className={`mt-6 grid gap-3 sm:grid-cols-2 ${rich.modules.length === 3 ? "lg:grid-cols-3" : rich.modules.length >= 4 ? "lg:grid-cols-4" : ""}`}>
                {rich.modules.map((m) => (
                  <div key={loc(m.name, "fr")} className="glass rounded-[1.5rem] p-6">
                    <p className="data-label text-deep-soft">{loc(m.spec, lang)}</p>
                    <h3 className="display mt-3 text-xl text-deep">{loc(m.name, lang)}</h3>
                    <p className="mt-3 font-sans text-sm leading-relaxed text-deep-soft">{m.text[lang]}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Indications et caractéristiques techniques */}
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              <Reveal className="glass rounded-[1.75rem] p-8 md:p-10">
                <h2 className="display text-2xl text-deep md:text-3xl">{l.indicationsTitle}</h2>
                <table className="mt-6 w-full font-sans text-sm">
                  <thead>
                    <tr className="data-label text-left text-deep-soft">
                      <th className="pb-3 pr-4 font-normal">{l.indicationCol}</th>
                      <th className="pb-3 font-normal">{l.techCol}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rich.indications.map((r) => (
                      <tr key={r.indication.fr} className="border-t border-deep/10 align-top">
                        <td className="py-3 pr-4 text-deep">{r.indication[lang]}</td>
                        <td className="py-3 text-deep-soft">{loc(r.tech, lang)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Reveal>
              <Reveal className="glass rounded-[1.75rem] p-8 md:p-10">
                <h2 className="display text-2xl text-deep md:text-3xl">{l.specsTitle}</h2>
                <dl className="mt-6 font-sans text-sm">
                  {rich.specs.map(([k, v]) => (
                    <div key={k.fr} className="grid grid-cols-[1fr_1.2fr] gap-4 border-t border-deep/10 py-3">
                      <dt className="text-deep-soft">{k[lang]}</dt>
                      <dd className="text-deep">{v[lang]}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            {/* Rentabilité et ce qui est inclus */}
            <div className="mt-3 grid gap-3 lg:grid-cols-[1.3fr_1fr]">
              <Reveal className="glass rounded-[1.75rem] p-8 md:p-10">
                <h2 className="display text-2xl text-deep md:text-3xl">{l.profitTitle}</h2>
                <p className="mt-4 font-sans text-lg leading-relaxed text-deep">{rich.profit[lang]}</p>
                {tech.description && <p className="mt-4 font-sans leading-relaxed text-deep-soft">{tech.description[lang]}</p>}
              </Reveal>
              <Reveal className="glass rounded-[1.75rem] p-8 md:p-10">
                <h2 className="display text-2xl text-deep md:text-3xl">{l.includedRich(tech.name)}</h2>
                <ol className="mt-6 border-t border-deep/10">
                  {l.includedRichItems.map(([k, v], i) => (
                    <li key={k} className="flex gap-4 border-b border-deep/10 py-4 font-sans text-deep">
                      <span className="data-label pt-1 text-deep-soft">0{i + 1}</span>
                      <span>
                        <strong className="font-medium">{k}</strong>, {v}
                      </span>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </>
        )}

        {/* Prix et financement (toutes les fiches) : prix jamais publié, devis par formulaire ou WhatsApp */}
        <Reveal className="glass mt-3 grid gap-6 rounded-[1.75rem] p-8 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <p className="data-label text-deep-soft">{l.price}</p>
            <h2 className="display mt-3 text-2xl text-deep md:text-3xl">{l.priceTitle}</h2>
            <p className="mt-3 max-w-2xl font-sans leading-relaxed text-deep-soft">{l.priceText}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Cta href={`/${lang}/contact?sujet=devis&machine=${tech.slug}`}>{l.quote}</Cta>
            {company.whatsapp && (
              <Cta href={waQuote} variant="line">
                {l.whatsapp}
              </Cta>
            )}
          </div>
        </Reveal>

        {rich && (
          <Faq
            locale={lang}
            title={l.faq(tech.name)}
            items={rich.faq.map((f) => ({ q: f.q[lang], a: f.a[lang] }))}
            className="-mx-3 mt-16 md:-mx-7"
          />
        )}

        {rich && (
          <>
            <GuideBanner locale={lang} className="mt-4" />
            <Reveal className="mt-16">
              <p className="data-label text-deep-soft">{l.seeAlso}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  ...(landingForCategory[tech.category]
                    ? [[l.gamme(categories[tech.category][lang]), `/${lang}${landingPath(landingForCategory[tech.category]!)}`]]
                    : []),
                  ...rich.related.flatMap((r) => {
                    const x = technologies.find((m) => m.slug === r);
                    return x ? [[x.name, `/${lang}/technologies/${x.slug}`]] : [];
                  }),
                  [l.academyLink, `/${lang}/academy`],
                  [l.guideLink, `/${lang}/guide`],
                ].map(([label, href]) => (
                  <Link key={href} href={href} className="glass-soft rounded-full px-4 py-2 font-sans text-sm text-deep transition-colors hover:bg-white">
                    {label}
                  </Link>
                ))}
              </div>
            </Reveal>
            {/* Données Product : sans prix ni avis (aucun prix publié, pas d'avis vérifiés) */}
            <JsonLd
              data={{
                "@context": "https://schema.org",
                "@type": "Product",
                name: tech.name,
                description: rich.hook[lang],
                category: categories[tech.category][lang],
                ...(rich.brand ? { brand: { "@type": "Brand", name: rich.brand } } : {}),
                ...(tech.images?.[0] ? { image: `${SITE_URL}${tech.images[0]}` } : {}),
                url: `${SITE_URL}/${lang}/technologies/${tech.slug}`,
              }}
            />
          </>
        )}

        {family.length > 0 && (
          <Reveal className="mt-16">
            <p className="data-label text-deep-soft">
              {l.sameFamily} · {categories[tech.category][lang]}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {family.map((f) => (
                <Link
                  key={f.slug}
                  href={`/${lang}/technologies/${f.slug}`}
                  className="glass-soft rounded-full px-4 py-2 font-sans text-sm text-deep transition-colors hover:bg-white"
                >
                  {f.name}
                </Link>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
