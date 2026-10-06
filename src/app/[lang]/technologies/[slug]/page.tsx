import { GuideBanner } from "@/components/guide/GuideBanner";
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
import { SignalLine } from "@/components/system/SignalPath";
import { ScanFrame } from "@/components/system/ScanFrame";
import photoSizes from "@/content/photo-sizes.json";

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
    alternates: localeAlternates(`/technologies/${slug}`, lang),
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
    facts: [
      ["Pour", "Médecins et centres médico-esthétiques"],
      ["Inclus", "Installation · Formation · Protocoles"],
      ["Garantie", "24 mois · pièces et main-d'œuvre"],
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
    facts: [
      ["For", "Physicians and medical aesthetic centres"],
      ["Included", "Installation · Training · Protocols"],
      ["Warranty", "24 months · parts and labour"],
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
            <h1 className="display mt-6 text-balance text-[clamp(2.4rem,6vw,5.6rem)] text-deep">{tech.name}</h1>
            {tech.tagline && <p className="mt-6 max-w-xl font-sans text-lg text-deep-soft">{tech.tagline[lang]}</p>}
            {tech.certifications && (
              <div className="mt-6 flex flex-wrap gap-2">
                {tech.certifications.map((c) => (
                  <Pill key={c}>{c}</Pill>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Cta href={`/${lang}/contact?sujet=demo`}>{dict.common.requestDemo}</Cta>
            <Cta href={`/${lang}/contact?sujet=expert`} variant="line">{dict.common.speakToExpert}</Cta>
          </div>
        </Reveal>

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
          // Toutes les photos entières, à leur format d'origine : jamais recadrées.
          <Reveal
            className={
              tech.images.length === 1
                ? "mx-auto mt-8 max-w-xl"
                : tech.images.length === 2
                  ? "mt-8 columns-2 gap-2 sm:gap-3"
                  : "mt-8 columns-2 gap-2 sm:gap-3 lg:columns-3"
            }
          >
            {tech.images.map((src, i) => {
              const [w, h] = ((photoSizes as Record<string, number[]>)[src] ?? [1100, 1100]) as [number, number];
              return (
                <ScanFrame key={src} className="mb-2 break-inside-avoid rounded-[1.5rem] bg-[#0b0d14] sm:mb-3">
                  <Image
                    src={src}
                    alt={`${tech.name} — ${i + 1}`}
                    width={w}
                    height={h}
                    priority={i === 0}
                    sizes={tech.images!.length === 1 ? "(min-width:640px) 576px, 100vw" : "(min-width:1024px) 33vw, 50vw"}
                    className="block h-auto w-full"
                  />
                </ScanFrame>
              );
            })}
          </Reveal>
        ) : null}

        <GuideBanner locale={lang} className="mt-10" />

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
                <Cta href={`/${lang}/contact?sujet=expert`}>{dict.common.speakToExpert}</Cta>
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
