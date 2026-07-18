import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Check } from "lucide-react";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { categories, getTechnologyBySlug, technologies } from "@/content/technologies";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { TechnologyCard } from "@/components/technologies/TechnologyCard";

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
      <section className="pt-16 pb-16 md:pt-24 md:pb-20">
        <Container className="max-w-3xl">
          <Reveal>
            <Link
              href={`/${lang}/technologies`}
              className="inline-flex items-center gap-2 font-body text-sm text-ink-soft transition-colors hover:text-ink"
            >
              <ArrowLeft size={16} />
              {dict.common.backTo} {dict.nav.technologies}
            </Link>
          </Reveal>

          <Reveal delay={0.08}>
            <span
              className="font-label mt-8 block text-muted"
              style={{ fontSize: "11px", letterSpacing: "0.2em" }}
            >
              {categories[tech.category][lang].toUpperCase()}
            </span>
          </Reveal>

          <Reveal delay={0.14}>
            <h1 className="font-heading mt-3 text-4xl font-light leading-[1.1] text-ink sm:text-5xl">
              {tech.name}
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="font-body mt-6 text-base font-light leading-relaxed text-ink-soft md:text-lg">
              {tech.tagline[lang]}
            </p>
          </Reveal>

          <Reveal delay={0.26}>
            <div className="mt-6 flex flex-wrap gap-2">
              {tech.certifications.map((cert) => (
                <Badge key={cert}>{cert}</Badge>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button href={`/${lang}/contact`}>{dict.common.requestDemo}</Button>
              <Button href={`/${lang}/contact`} variant="ghost">
                {dict.common.speakToExpert}
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-hairline bg-ivory-2 py-20">
        <Container className="grid grid-cols-1 gap-14 max-w-3xl lg:grid-cols-1">
          <Reveal>
            <p className="font-body text-base font-light leading-relaxed text-ink-soft md:text-lg">
              {tech.description[lang]}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
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
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container>
          <h2 className="font-heading text-2xl font-light text-ink md:text-3xl">
            {lang === "fr" ? "Autres technologies" : "Other technologies"}
          </h2>
          <RevealGroup className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {related.map((t) => (
              <RevealItem key={t.slug}>
                <TechnologyCard technology={t} locale={lang} readMoreLabel={dict.common.readMore} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>
    </>
  );
}
