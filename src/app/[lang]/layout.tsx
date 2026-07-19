import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cormorant, raleway, spaceMono } from "@/lib/fonts";
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
      ? "Cellulift accompagne les professionnels de santé et de l'esthétique en Afrique avec des technologies médico-esthétiques avancées, une formation continue via Cellulift Academy et un support long terme."
      : "Cellulift partners with medical and aesthetic professionals across Africa through advanced technologies, continuous education via Cellulift Academy, and long-term support.",
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
      className={`${cormorant.variable} ${raleway.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ivory text-ink">
        <div className="grain-overlay" aria-hidden="true" />
        <Header locale={lang} dict={dict} />
        <main className="flex-1">{children}</main>
        <Footer locale={lang} dict={dict} />
      </body>
    </html>
  );
}
