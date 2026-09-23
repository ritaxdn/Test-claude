import type { Metadata } from "next";
import { inter, interTight } from "@/lib/fonts";
import { doctor, practice } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${doctor.name} — ${doctor.title} à Paris`,
    template: `%s · ${doctor.name}`,
  },
  description:
    "Cabinet de médecine esthétique du Dr Dadoun : injections d'acide hyaluronique, toxine botulique, skinboosters, peelings et lasers. Des résultats naturels, en toute sécurité.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: `${doctor.name} — ${doctor.title}`,
    description: "Révéler votre beauté, sans la transformer.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Physician",
  name: doctor.fullName,
  telephone: practice.phoneHref,
  email: practice.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: practice.addressLine1,
    addressLocality: practice.addressLine2,
    addressCountry: "FR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${interTight.variable} ${inter.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
