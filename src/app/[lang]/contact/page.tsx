import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/alternates";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { contactPageContent } from "@/content/contact-page";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { machineNames } from "@/content/technologies";
import { DirectContact } from "@/components/sections/DirectContact";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return pageMetadata({
    lang,
    path: "/contact",
    title: isFr ? "Contact : parler à un expert" : "Contact: talk to an expert",
    description: isFr
      ? "Contactez Cellulift pour demander une démonstration, parler à un expert ou rejoindre une masterclass. Showrooms à Casablanca, Marrakech et Tanger."
      : "Contact Cellulift to request a demo, speak to an expert or join a masterclass. Showrooms in Casablanca, Marrakech and Tangier.",
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const content = contactPageContent[lang];

  return (
    <>
      <Breadcrumbs lang={lang} items={[["Contact", "/contact"]]} />
      <PageHero
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        subtitle={content.hero.subtitle}
      />

      <section className="px-3 pb-12 md:px-5 md:pb-16">
        <Container className="grid grid-cols-1 gap-3 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="glass rounded-[1.75rem] p-7 md:p-9">
            <h2 className="display text-2xl text-deep">{content.form.title}</h2>
            <div className="mt-8">
              <ContactForm text={content.form} machines={machineNames} />
            </div>
          </Reveal>

          <DirectContact
            locale={lang}
            title={content.directContact.title}
            labels={content.directContact}
          />
        </Container>
      </section>
    </>
  );
}
