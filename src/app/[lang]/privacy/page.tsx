import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/alternates";
import { privacy } from "@/content/legal";
import { LegalDoc } from "@/components/sections/LegalDoc";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: privacy[lang].title,
    description:
      lang === "fr"
        ? "Données collectées sur le site Cellulift, finalités, durée de conservation et vos droits (loi 09-08)."
        : "Data collected on the Cellulift website, purposes, retention and your rights (law 09-08).",
    alternates: localeAlternates("/privacy", lang),
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <LegalDoc doc={privacy[lang]} />;
}
