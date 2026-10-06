import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/alternates";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { Pill } from "@/components/system/Cta";
import { Reveal } from "@/components/ui/Reveal";
import { GuideForm } from "@/components/guide/GuideForm";
import { guideContent, guideCover, guidePdf } from "@/content/guide";
import { contactPageContent } from "@/content/contact-page";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const m = guideContent[lang].meta;
  return pageMetadata({ lang, path: "/guide", title: m.title, description: m.description });
}

// Guide gratuit : promesse + contenu à gauche, formulaire à droite (au-dessus sur téléphone).
export default async function GuidePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = guideContent[lang];

  return (
    <section className="px-3 pb-20 pt-10 md:px-5 md:pt-14">
      <Breadcrumbs lang={lang} items={[[lang === "fr" ? "Guide gratuit" : "Free guide", "/guide"]]} />
      {/* Téléphone : titre → formulaire → contenu du guide. Grand écran : titre et contenu à gauche, formulaire à droite. */}
      <div className="mx-auto grid max-w-7xl gap-10 px-3 md:px-7 lg:grid-cols-[1.2fr_1fr] lg:gap-x-16 lg:gap-y-0">
        <Reveal className="lg:col-start-1 lg:row-start-1">
          <Pill className="bg-white/60">{c.eyebrow}</Pill>
          <h1 className="display mt-5 text-balance text-[clamp(2rem,4.4vw,3.8rem)] leading-[1] text-deep">{c.title}</h1>
          <p className="mt-5 max-w-xl font-sans text-lg leading-relaxed text-deep-soft">{c.subtitle}</p>
        </Reveal>

        <Reveal className="lg:col-start-1 lg:row-start-2 lg:mt-10">
          <div className="grid gap-8 sm:grid-cols-[11rem_1fr] sm:items-start">
            <Image
              src={guideCover}
              alt={c.title}
              width={640}
              height={905}
              sizes="176px"
              className="hidden w-44 rounded-lg shadow-[0_24px_60px_-24px_rgba(29,27,38,.45)] sm:block"
            />
            <div>
              <p className="data-label text-deep-soft">{c.insideTitle}</p>
              <ol className="mt-4 space-y-2.5">
                {c.inside.map((q, i) => (
                  <li key={q} className="flex gap-3 font-sans text-sm text-deep">
                    <span className="data-label w-6 shrink-0 pt-0.5 text-deep-soft">{String(i + 1).padStart(2, "0")}</span>
                    {q}
                  </li>
                ))}
              </ol>
              <p className="mt-5 flex gap-2 font-sans text-sm text-deep-soft">
                <Check size={16} className="mt-0.5 shrink-0 text-[var(--rainbow-2)]" />
                {c.bonus}
              </p>
              <p className="data-label mt-5 text-deep-soft">{c.pages}</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="glass relative h-fit rounded-[1.75rem] p-7 md:p-9 max-lg:row-start-2 lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <GuideForm
            text={c.form}
            specialtyOptions={contactPageContent[lang].form.specialtyOptions}
            pdf={guidePdf}
            contactHref={`/${lang}/contact?sujet=expert`}
          />
        </Reveal>
      </div>
    </section>
  );
}
