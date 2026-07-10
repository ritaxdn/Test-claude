import { CONTACT } from "@/lib/data/contact";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cellulift.com";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: CONTACT.companyName,
    url: siteUrl,
    description:
      "Cellulift est le distributeur et ambassadeur officiel de LGL Expert en Afrique, spécialisé dans les technologies médico-esthétiques professionnelles.",
    telephone: CONTACT.phoneDisplay,
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: CONTACT.addressLine,
    },
    areaServed: "Africa",
    sameAs: [],
  };
}

export function productJsonLd(product: {
  name: string;
  tagline: string;
  description: string;
  slug: string;
  categoryName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.categoryName,
    brand: {
      "@type": "Brand",
      name: "LGL Expert",
    },
    url: `${siteUrl}/produits/${product.slug}`,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "PriceSpecification",
        price: "Sur devis",
      },
      seller: {
        "@type": "Organization",
        name: CONTACT.companyName,
      },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}
