import type { Metadata, Viewport } from "next";
import { inter, interTight } from "@/lib/fonts";
import { doctor } from "@/content/site";
import { siteGraph, siteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";

// « Docteur Dadoun » en tête : c'est ce que les patients tapent dans Google.
const title = "Docteur Dadoun — Médecin esthétique & lasériste à Casablanca";
const description =
  "Docteur Mohamed Dadoun, médecin esthétique et lasériste à Casablanca depuis plus de 35 ans : toxine botulique, acide hyaluronique, laser CO₂, endolifting et gynécologie esthétique. Cabinet Quartier des Hôpitaux, sur rendez-vous.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s · Docteur Dadoun" },
  description,
  applicationName: `${doctor.name} — Médecine esthétique`,
  keywords: [
    "médecin esthétique Casablanca",
    "médecine esthétique Casablanca",
    "botox Casablanca",
    "toxine botulique Casablanca",
    "acide hyaluronique Casablanca",
    "laser CO2 Casablanca",
    "endolifting Casablanca",
    "gynécologie esthétique Casablanca",
    "lasériste Casablanca",
    "Dr Dadoun",
    "Docteur Dadoun",
    "Docteur Mohamed Dadoun",
    "Dr Mohamed Dadoun",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    siteName: `${doctor.name} — Médecin esthétique à Casablanca`,
    title,
    description: "Améliorer sans dénaturer. Médecine esthétique et lasers médicaux à Casablanca.",
    url: "/",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: true, address: true },
  other: { "geo.region": "MA-06", "geo.placename": "Casablanca" },
  // Google Search Console : coller le code « Balise HTML » dans la variable GOOGLE_SITE_VERIFICATION (Vercel).
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
};

export const viewport: Viewport = { themeColor: "#0a1b21" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-MA" className={`${interTight.variable} ${inter.variable}`}>
      <body>
        {children}
        <JsonLd data={siteGraph()} />
      </body>
    </html>
  );
}
