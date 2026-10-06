import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/alternates";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { CentersDirectory } from "@/components/centers/CentersDirectory";
import { centers, centersPageContent } from "@/content/centers";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const m = centersPageContent[lang].meta;
  return {
    ...pageMetadata({ lang, path: "/centres", title: m.title, description: m.description }),
    // Brouillon : la liste attend la validation de Cellulift (page hors menu et hors sitemap).
    robots: { index: false, follow: true },
  };
}

export default async function CentresPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = centersPageContent[lang];

  return (
    <>
      <Breadcrumbs lang={lang} items={[[c.title, "/centres"]]} />
      <PageHero eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />
      <section className="px-3 pb-16 md:px-5">
        <div className="mx-auto max-w-7xl px-3 md:px-7">
          <CentersDirectory centers={centers} labels={{ all: c.all, other: c.other, unit: c.unit }} />
          <div className="glass mt-12 flex flex-col gap-4 rounded-[1.75rem] p-7 md:flex-row md:items-center md:justify-between md:p-9">
            <div>
              <p className="font-sans text-xl text-deep">{c.join.title}</p>
              <p className="mt-1 max-w-xl font-sans text-sm text-deep-soft">{c.join.text}</p>
            </div>
            <Link
              href={`/${lang}/contact?sujet=partenariat`}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-deep px-6 py-3 font-sans text-sm text-white hover:bg-deep/90"
            >
              {c.join.cta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
