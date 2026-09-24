import type { Metadata, Viewport } from "next";
import { inter, interTight } from "@/lib/fonts";
import { doctor } from "@/content/site";
import { siteGraph, siteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";

const title = `${doctor.name} — Médecin esthétique & lasériste à Casablanca`;
const description =
  "Dr Dadoun, médecin esthétique et lasériste à Casablanca depuis plus de 35 ans : toxine botulique, acide hyaluronique, laser CO₂, endolifting et gynécologie esthétique. Améliorer sans dénaturer.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s · ${doctor.name}` },
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
