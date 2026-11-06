import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, locales } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/alternates";
import { siloChildren, topicBySlug, topicPath, topics } from "@/content/tech-topics";
import { TechTopicPage } from "@/components/sections/TechTopicPage";

const SILO = "radiofrequence-esthetique" as const;

// Seules les technologies définies ont une page : toute autre adresse renvoie une 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => siloChildren(SILO).map((k) => ({ lang, tech: topics[k].slug! })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; tech: string }> }): Promise<Metadata> {
  const { lang, tech } = await params;
  const k = topicBySlug(SILO, tech);
  if (!isLocale(lang) || !k) return {};
  return pageMetadata({ lang, path: topicPath(k), title: topics[k].title[lang], description: topics[k].description[lang] });
}

export default async function Page({ params }: { params: Promise<{ lang: string; tech: string }> }) {
  const { lang, tech } = await params;
  const k = topicBySlug(SILO, tech);
  if (!isLocale(lang) || !k) notFound();
  return <TechTopicPage lang={lang} topic={k} />;
}
