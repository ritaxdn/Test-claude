import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "CELLULIFT Academy", template: "%s · CELLULIFT Academy" },
  description: "Formation des praticiens équipés de technologies CELLULIFT.",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#021223" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..600&family=Cormorant+Garamond:wght@400&family=Instrument+Sans:wght@400..600&family=JetBrains+Mono:wght@400;500&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
