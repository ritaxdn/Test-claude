import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/alternates";
import { terms } from "@/content/legal";
import { LegalDoc } from "@/components/sections/LegalDoc";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: terms[lang].title,
    description:
      lang === "fr"
        ? "Conditions d’utilisation du site Cellulift : éditeur, hébergement, propriété intellectuelle et responsabilité."
        : "Terms of use of the Cellulift website: publisher, hosting, intellectual property and liability.",
    alternates: localeAlternates("/terms", lang),
  };
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <LegalDoc doc={terms[lang]} />;
}
