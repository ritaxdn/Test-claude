import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/alternates";
import { topicPath, topics } from "@/content/tech-topics";
import { TechTopicPage } from "@/components/sections/TechTopicPage";

const KEY = "laser-esthetique" as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const tp = topics[KEY];
  return pageMetadata({ lang, path: topicPath(KEY), title: tp.title[lang], description: tp.description[lang] });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <TechTopicPage lang={lang} topic={KEY} />;
}
