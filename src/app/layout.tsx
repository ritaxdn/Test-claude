import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Analytics } from "@/components/Analytics";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cellulift.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cellulift — Distributeur officiel LGL Expert en Afrique",
    template: "%s | Cellulift",
  },
  description:
    "Cellulift, distributeur et ambassadeur officiel de LGL Expert, équipe les professionnels de la santé et de l'esthétique en Afrique francophone avec des technologies médico-esthétiques haut de gamme : HIFU, laser, radiofréquence, cryolipolyse et plus.",
  keywords: [
    "distributeur matériel médico-esthétique Afrique",
    "LGL Expert Afrique",
    "machine esthétique professionnelle",
    "HIFU professionnel",
    "épilation laser professionnelle",
    "cryolipolyse professionnelle",
    "matériel esthétique clinique",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Cellulift",
    title: "Cellulift — Distributeur officiel LGL Expert en Afrique",
    description:
      "Technologies médico-esthétiques haut de gamme pour les professionnels de la santé et de l'esthétique en Afrique.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cellulift — Distributeur officiel LGL Expert en Afrique",
    description:
      "Technologies médico-esthétiques haut de gamme pour les professionnels de la santé et de l'esthétique en Afrique.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${bodoni.variable} ${jost.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#contenu-principal"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Aller au contenu principal
        </a>
        <Navbar />
        <main id="contenu-principal" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <Analytics />
      </body>
    </html>
  );
}
