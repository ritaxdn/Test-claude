import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MapPin, Phone } from "lucide-react";
import { isLocale, locales } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/alternates";
import { SITE_URL } from "@/lib/site";
import { Breadcrumbs, JsonLd } from "@/components/seo/JsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { company } from "@/content/company";
import { agencies, agencyKeys, agencyLabels, agencyPath, agencyShowroom, type AgencyKey } from "@/content/agencies";
import { categoryLandings, landingKeys, landingPath } from "@/content/category-landings";
import { technologiesPageContent } from "@/content/technologies-page";
import { homeContent } from "@/content/home";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Cta } from "@/components/system/Cta";
import { IncludedServices } from "@/components/technologies/IncludedServices";
import { FinalCta } from "@/components/sections/FinalCta";

// Seules les agences avec une adresse publique ont une page : toute autre adresse /agences/… renvoie une 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => agencyKeys.map((ville) => ({ lang, ville })));
}

const isAgency = (v: string): v is AgencyKey => (agencyKeys as string[]).includes(v);

export async function generateMetadata({ params }: { params: Promise<{ lang: string; ville: string }> }): Promise<Metadata> {
  const { lang, ville } = await params;
  if (!isLocale(lang) || !isAgency(ville)) return {};
  const a = agencies[ville];
  return pageMetadata({ lang, path: agencyPath(ville), title: a.title[lang], description: a.description[lang] });
}

export default async function AgencyPage({ params }: { params: Promise<{ lang: string; ville: string }> }) {
  const { lang, ville } = await params;
  if (!isLocale(lang) || !isAgency(ville)) notFound();

  const a = agencies[ville];
  const s = agencyShowroom(ville);
  const t = agencyLabels[lang];
  const dict = getDictionary(lang);
  const cta = homeContent[lang].finalCta;
  const city = s.city[lang];
  const included = technologiesPageContent[lang].included.filter(([k]) => k !== "Certification");
  const whatsapp = `https://wa.me/${company.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(t.whatsappText(city))}`;
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`CELLULIFT ${s.address} ${s.city.fr}`)}`;

  return (
    <>
      <Breadcrumbs lang={lang} items={[[a.h1[lang], agencyPath(ville)]]} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": `${SITE_URL}/#${ville}`,
          name: `CELLULIFT — ${s.hq ? "Siège" : "Agence"} ${s.city.fr}`,
          description: a.description[lang],
          url: `${SITE_URL}/${lang}${agencyPath(ville)}`,
          // Téléphone uniquement pour le siège : pas de numéro propre confirmé pour les autres agences.
          ...(s.hq ? { telephone: company.phone } : {}),
          address: { "@type": "PostalAddress", streetAddress: s.address, addressLocality: s.city.fr, addressCountry: "MA" },
          geo: { "@type": "GeoCoordinates", latitude: s.lat, longitude: s.lon },
          parentOrganization: { "@id": `${SITE_URL}/#organization` },
        }}
      />
      <PageHero eyebrow={s.hq ? t.hq : t.eyebrow} title={a.h1[lang]} subtitle={a.intro[lang]} compact />

      <section className="px-3 pb-12 md:px-5 md:pb-16">
        <Container>
          <div className="glass grid gap-6 rounded-[1.75rem] p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <dl className="grid gap-4 font-sans text-deep sm:grid-cols-2">
              <div>
                <dt className="data-label text-deep-soft">{t.address}</dt>
                <dd className="mt-2 flex items-start gap-2">
                  <MapPin size={16} className="mt-1 shrink-0" />
                  <span>
                    {s.address}, {city}
                    <br />
                    <a href={maps} target="_blank" rel="noopener noreferrer" className="text-sm text-deep-soft underline hover:text-deep">
                      {t.directions}
                    </a>
                  </span>
                </dd>
              </div>
              <div>
                <dt className="data-label text-deep-soft">{t.phone}</dt>
                <dd className="mt-2 flex items-center gap-2">
                  <Phone size={16} className="shrink-0" />
                  <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="hover:underline">{company.phone}</a>
                </dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-3">
              <Cta href={`/${lang}/contact?sujet=demo`}>{t.demo}</Cta>
              {company.whatsapp && (
                <Cta href={whatsapp} variant="glass">
                  {t.whatsapp}
                </Cta>
              )}
            </div>
          </div>

          <div className="mt-16">
            <h2 className="display text-2xl text-deep md:text-3xl">{t.ranges}</h2>
            <p className="mt-2 font-sans text-sm text-deep-soft">{t.rangesNote}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {landingKeys.map((k) => (
                <li key={k}>
                  <Link href={`/${lang}${landingPath(k)}`} className="glass block h-full rounded-[1.5rem] p-5 transition-transform hover:-translate-y-0.5">
                    <span className="display text-lg text-deep">{categoryLandings[k].h1[lang]}</span>
                    <span className="mt-2 block font-sans text-sm leading-relaxed text-deep-soft">{categoryLandings[k].description[lang]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-16">
            <IncludedServices label={technologiesPageContent[lang].includedLabel} items={included} />
          </div>

          <div className="mt-12">
            <h2 className="display text-xl text-deep">{t.others}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {agencyKeys
                .filter((k) => k !== ville)
                .map((k) => (
                  <li key={k}>
                    <Link href={`/${lang}${agencyPath(k)}`} className="glass-soft inline-block rounded-full px-4 py-2 font-sans text-sm text-deep hover:bg-white/60">
                      {agencies[k].h1[lang]}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </Container>
      </section>

      <FinalCta
        locale={lang}
        title={cta.title}
        description={cta.description}
        ctaPrimary={dict.common.requestDemo}
        ctaSecondary={dict.common.speakToExpert}
        primarySujet="demo"
        secondarySujet="expert"
      />
    </>
  );
}
