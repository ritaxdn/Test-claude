import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Check } from "lucide-react";
import { isLocale, locales } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/alternates";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { categories, getTechnologyBySlug, technologies, technologiesIn } from "@/content/technologies";
import { Reveal } from "@/components/ui/Reveal";
import { Cta, Pill } from "@/components/system/Cta";

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
  return {
    title: tech.name,
    description:
      tech.tagline?.[lang] ??
      (lang === "fr"
        ? `${tech.name} — ${family}. Technologie Cellulift livrée avec formation, protocoles et support.`
        : `${tech.name} — ${family}. Cellulift technology delivered with training, protocols and support.`),
    alternates: localeAlternates(`/technologies/${slug}`),
  };
}

const t = {
  fr: {
    sheet: "Fiche technique sur demande",
    sheetText:
      "Caractéristiques, indications, protocoles et conditions d'installation : un expert Cellulift vous envoie la fiche complète et répond à vos questions.",
    included: "Inclus avec la technologie",
    includedItems: ["Installation et mise en service", "Formation Cellulift Academy", "Protocoles de traitement", "Support et maintenance"],
    sameFamily: "Dans la même famille",
  },
  en: {
    sheet: "Technical sheet on request",
    sheetText:
      "Specifications, indications, protocols and installation requirements: a Cellulift expert sends you the full sheet and answers your questions.",
    included: "Included with the technology",
    includedItems: ["Installation and commissioning", "Cellulift Academy training", "Treatment protocols", "Support and maintenance"],
    sameFamily: "In the same family",
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

  return (
    <div className="px-3 pb-24 pt-10 md:px-5 md:pt-14">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Link
          href={`/${lang}/technologies`}
          className="inline-flex items-center gap-2 font-sans text-sm text-deep-soft transition-colors hover:text-deep"
        >
          <ArrowLeft size={16} /> {dict.common.backTo} {dict.nav.technologies}
        </Link>

        <Reveal className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <Pill className="bg-white/60">{categories[tech.category][lang]}</Pill>
            <h1 className="display mt-6 text-[clamp(2.4rem,6vw,5.6rem)] text-deep">{tech.name}</h1>
            {tech.tagline && <p className="mt-6 max-w-xl font-sans text-lg text-deep-soft">{tech.tagline[lang]}</p>}
            {tech.certifications && (
              <div className="mt-6 flex flex-wrap gap-2">
                {tech.certifications.map((c) => (
                  <Pill key={c}>{c}</Pill>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Cta href={`/${lang}/contact`}>{dict.common.requestDemo}</Cta>
            <Cta href={`/${lang}/contact`} variant="line">{dict.common.speakToExpert}</Cta>
          </div>
        </Reveal>

        {tech.images?.length ? (
          <Reveal className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2">
            {tech.images.map((src, i) => (
              <div
                key={src}
                className={`relative overflow-hidden rounded-[1.75rem] bg-[#0b0d14] ${
                  i === 0 ? "col-span-2 aspect-[4/5] md:row-span-2 md:aspect-auto" : "aspect-square"
                }`}
              >
                <Image
                  src={src}
                  alt={`${tech.name} — ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes={i === 0 ? "(min-width:768px) 50vw, 100vw" : "(min-width:768px) 25vw, 50vw"}
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>
            ))}
          </Reveal>
        ) : null}

        <div className="mt-14 grid gap-3 lg:grid-cols-[1.3fr_1fr]">
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
                <Cta href={`/${lang}/contact`}>{dict.common.speakToExpert}</Cta>
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
