import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { archivo, cormorant, instrumentSans, jetbrainsMono, raleway, spaceMono } from "@/lib/fonts";
import { locales, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SITE_URL } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: isFr
        ? "Cellulift — Partenaire médico-esthétique de référence"
        : "Cellulift — The reference medical aesthetics partner",
      template: "%s — Cellulift",
    },
    description: isFr
      ? "Depuis 2002, Cellulift équipe les médecins et les centres esthétiques au Maroc en technologies médico-esthétiques certifiées CE Medical et FDA, avec formation Cellulift Academy et service après-vente. Casablanca, Marrakech, Tanger."
      : "Since 2002, Cellulift has equipped physicians and aesthetic centers in Morocco with CE Medical and FDA certified medical aesthetic technologies, with Cellulift Academy training and after-sales service. Casablanca, Marrakech, Tangier.",
    alternates: {
      languages: { fr: "/fr", en: "/en" },
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <html
      lang={lang}
      className={`${cormorant.variable} ${raleway.variable} ${spaceMono.variable} ${archivo.variable} ${instrumentSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="pearl-bg flex min-h-full flex-col text-deep">
        <Header locale={lang} dict={dict} />
        <main className="flex-1">{children}</main>
        <Footer locale={lang} dict={dict} />
      </body>
    </html>
  );
}
