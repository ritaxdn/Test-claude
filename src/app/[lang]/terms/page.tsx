import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/alternates";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { terms } from "@/content/legal";
import { LegalDoc } from "@/components/sections/LegalDoc";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMetadata({
    lang,
    path: "/terms",
    title: terms[lang].title,
    description:
      lang === "fr"
        ? "Conditions d’utilisation du site Cellulift : éditeur, hébergement, propriété intellectuelle et responsabilité."
        : "Terms of use of the Cellulift website: publisher, hosting, intellectual property and liability.",
  });
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <>
      <Breadcrumbs lang={lang} items={[[terms[lang].title, "/terms"]]} />
      <LegalDoc doc={terms[lang]} />
    </>
  );
}
