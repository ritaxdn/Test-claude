import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { archivo, cormorant, instrumentSans, jetbrainsMono } from "@/lib/fonts";
import { locales, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SITE_URL } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
        ? "Cellulift — Technologies médico-esthétiques professionnelles"
        : "Cellulift — Professional medical aesthetic technology",
      template: "%s — Cellulift",
    },
    description: isFr
      ? "Distributeur officiel LGL Expert en Afrique depuis 2002 : technologies médico-esthétiques, installation, formation Cellulift Academy et support."
      : "Official LGL Expert distributor in Africa since 2002: medical aesthetic technology, installation, Cellulift Academy training and support.",
    // Partage sur les réseaux (l'image vient de opengraph-image.tsx)
    openGraph: {
      type: "website",
      siteName: "Cellulift",
      locale: isFr ? "fr_MA" : "en_US",
      alternateLocale: isFr ? ["en_US"] : ["fr_MA"],
    },
    twitter: { card: "summary_large_image" },
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
      className={`${cormorant.variable} ${archivo.variable} ${instrumentSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="pearl-bg flex min-h-full flex-col pb-20 text-deep sm:pb-0">
        {/* Lien d'évitement pour la navigation au clavier */}
        <a
          href="#contenu"
          className="glass-strong sr-only z-[60] rounded-full px-4 py-2 font-sans text-sm text-deep focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          {lang === "fr" ? "Aller au contenu" : "Skip to content"}
        </a>
        <Header locale={lang} dict={dict} />
        <main id="contenu" className="flex-1">{children}</main>
        <Footer locale={lang} dict={dict} />
        <MobileTabBar locale={lang} dict={dict} />
        <CookieConsent locale={lang} />
        {/* Mesure d'audience Vercel : anonyme et sans cookie */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
