import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { contactPageContent } from "@/content/contact-page";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { DirectContact } from "@/components/sections/DirectContact";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: "Contact",
    description: isFr
      ? "Contactez Cellulift pour demander une démonstration, parler à un expert ou rejoindre une masterclass."
      : "Contact Cellulift to request a demo, speak to an expert or join a masterclass.",
  };
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
      <PageHero
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        subtitle={content.hero.subtitle}
      />

      <section className="pb-24 md:pb-32">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="border border-hairline bg-warm-white p-8 md:p-10">
            <h2 className="font-heading text-2xl font-light text-ink">{content.form.title}</h2>
            <div className="mt-8">
              <ContactForm text={content.form} />
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
