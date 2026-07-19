import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { isLocale, locales } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/alternates";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  categories,
  categoryPlateClass,
  getTechnologyBySlug,
  technologies,
} from "@/content/technologies";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { TechnologyCard } from "@/components/technologies/TechnologyCard";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    technologies.map((tech) => ({ lang, slug: tech.slug }))
  );
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

  return {
    title: tech.name,
    description: tech.tagline[lang],
    alternates: localeAlternates(`/technologies/${slug}`),
  };
}

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
  const related = technologies.filter((t) => t.slug !== tech.slug).slice(0, 3);

  return (
    <>
      <section
        className={cn(
          "relative flex min-h-[70vh] flex-col justify-end overflow-hidden border-b border-hairline pt-28 pb-14 text-warm-white md:pt-36",
          categoryPlateClass[tech.category]
        )}
      >
        <Container className="w-full max-w-none px-6 md:px-10">
          <Reveal>
            <Link
              href={`/${lang}/technologies`}
              className="inline-flex items-center gap-2 font-body text-sm text-light transition-colors hover:text-warm-white"
            >
              <ArrowLeft size={16} />
              {dict.common.backTo} {dict.nav.technologies}
            </Link>
          </Reveal>

          <div className="mt-10 flex flex-col justify-between gap-10 md:flex-row md:items-end">
            <div>
              <span
                className="font-label text-light"
                style={{ fontSize: "11px", letterSpacing: "0.2em" }}
              >
                {categories[tech.category][lang].toUpperCase()}
              </span>
              <SplitReveal
                lines={[tech.name]}
                className="text-display-1 mt-3 text-warm-white"
                delay={0.1}
              />
            </div>

            <Reveal delay={0.4} className="max-w-sm md:text-right">
              <p className="font-body text-base font-light leading-relaxed text-light">
                {tech.tagline[lang]}
              </p>
              <div className="mt-5 flex flex-wrap gap-2 md:justify-end">
                {tech.certifications.map((cert) => (
                  <Badge key={cert}>{cert}</Badge>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <Reveal>
              <p className="font-body text-lg leading-relaxed text-ink-soft md:text-xl">
                {tech.description[lang]}
              </p>
            </Reveal>
            <Reveal delay={0.15} className="mt-8 hidden md:block">
              <Magnetic className="inline-block">
                <Button href={`/${lang}/contact`}>{dict.common.requestDemo}</Button>
              </Magnetic>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 gap-10 md:col-span-8 md:col-start-5 md:grid-cols-2">
            <div>
              <h2
                className="font-label text-muted"
                style={{ fontSize: "11px", letterSpacing: "0.15em" }}
              >
                {dict.common.indications.toUpperCase()}
              </h2>
              <RevealGroup className="mt-5 flex flex-col gap-3">
                {tech.indications.map((item, i) => (
                  <RevealItem key={i} className="flex items-start gap-3">
                    <Check size={16} className="mt-1 shrink-0 text-rainbow-1" />
                    <span className="font-body text-sm font-light text-ink-soft">
                      {item[lang]}
                    </span>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>

            <div>
              <h2
                className="font-label text-muted"
                style={{ fontSize: "11px", letterSpacing: "0.15em" }}
              >
                {dict.common.benefits.toUpperCase()}
              </h2>
              <RevealGroup className="mt-5 flex flex-col gap-3">
                {tech.benefits.map((item, i) => (
                  <RevealItem key={i} className="flex items-start gap-3">
                    <Check size={16} className="mt-1 shrink-0 text-rainbow-3" />
                    <span className="font-body text-sm font-light text-ink-soft">
                      {item[lang]}
                    </span>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>

            <Reveal delay={0.15} className="md:hidden">
              <Button href={`/${lang}/contact`}>{dict.common.requestDemo}</Button>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-t border-hairline py-20 md:py-28">
        <Container>
          <div className="flex items-end justify-between">
            <h2 className="text-display-3 text-ink">
              {lang === "fr" ? "Autres technologies" : "Other technologies"}
            </h2>
            <Link
              href={`/${lang}/technologies`}
              className="hidden items-center gap-2 font-body text-sm text-ink-soft transition-colors hover:text-ink md:flex"
            >
              {dict.common.viewAll}
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <RevealGroup className="mt-10 border-t border-hairline">
            {related.map((t, i) => (
              <RevealItem key={t.slug}>
                <TechnologyCard
                  technology={t}
                  locale={lang}
                  readMoreLabel={dict.common.readMore}
                  index={i + 1}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>
    </>
  );
}
