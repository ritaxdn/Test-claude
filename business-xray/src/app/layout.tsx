import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Business X-Ray",
  description:
    "Analyse d'entreprise : business model, concurrents, proposition de valeur et opportunités, avec sources et hypothèses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
