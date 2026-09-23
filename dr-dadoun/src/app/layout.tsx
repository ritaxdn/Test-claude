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
    "Dr Dadoun, médecin esthétique à Paris : améliorer sans dénaturer. Injections, lasers médicaux et gynécologie esthétique, fondés sur l'anatomie et la précision.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: `${doctor.name} — ${doctor.title}`,
    description: "Améliorer sans dénaturer.",
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
