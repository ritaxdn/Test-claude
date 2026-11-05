import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/alternates";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { indicationKeys, indicationLabels, indicationPath, indications } from "@/content/indications";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const l = indicationLabels[lang];
  return pageMetadata({ lang, path: "/indications", title: l.hubTitle, description: l.hubDescription });
}

/** Sommaire des pages par indication. */
export default async function IndicationsHub({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const l = indicationLabels[lang];
  return (
    <>
      <Breadcrumbs lang={lang} items={[[l.hub, "/indications"]]} />
      <PageHero eyebrow={l.hub} title={l.hubTitle} subtitle={l.hubIntro} compact />
      <section className="px-3 pb-16 md:px-5 md:pb-24">
        <Container>
          <RevealGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {indicationKeys.map((k) => (
              <RevealItem key={k}>
                <Link href={`/${lang}${indicationPath(k)}`} className="glass group flex h-full flex-col rounded-[1.5rem] p-6 transition-colors hover:bg-white/70">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="display text-xl text-deep">{indications[k].name[lang]}</h2>
                    <span className="glass-strong flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-deep transition-transform group-hover:rotate-45">
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-deep-soft">{indications[k].description[lang]}</p>
                  <p className="data-label mt-auto pt-4 text-deep-soft">{indications[k].slugs.length} technologies</p>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>
    </>
  );
}
