import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/alternates";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { Pill } from "@/components/system/Cta";
import { Reveal } from "@/components/ui/Reveal";
import { WaitlistForm } from "@/components/academy/WaitlistForm";
import { waitlistContent } from "@/content/academy-waitlist";
import { contactPageContent } from "@/content/contact-page";
import { technologies } from "@/content/technologies";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const m = waitlistContent[lang].meta;
  return pageMetadata({ lang, path: "/academy/avant-premiere", absoluteTitle: m.title, description: m.description });
}

// Avant-première de la CELLULIFT Academy en ligne (cible du teaser) : promesse à gauche, inscription à droite
// (au-dessus du contenu sur téléphone, comme la page du guide).
export default async function WaitlistPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = waitlistContent[lang];
  const machines = [...new Set(technologies.map((t) => t.name))].sort((a, b) => a.localeCompare(b, "fr"));

  return (
    <section className="px-3 pb-20 pt-10 md:px-5 md:pt-14">
      <Breadcrumbs
        lang={lang}
        items={[
          ["Cellulift Academy", "/academy"],
          [lang === "fr" ? "Avant-première" : "Early access", "/academy/avant-premiere"],
        ]}
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-3 md:px-7 lg:grid-cols-[1.2fr_1fr] lg:gap-x-16 lg:gap-y-0">
        <div className="animate-fade-rise opacity-0 lg:col-start-1 lg:row-start-1">
          <Pill className="bg-white/60">{c.eyebrow}</Pill>
          <h1 className="display mt-5 text-balance text-[clamp(2rem,4.4vw,3.8rem)] leading-[1] text-deep">{c.title}</h1>
          <p className="mt-5 max-w-xl font-sans text-lg leading-relaxed text-deep-soft">{c.subtitle}</p>
        </div>

        <Reveal className="lg:col-start-1 lg:row-start-2 lg:mt-10">
          <p className="data-label text-deep-soft">{c.insideTitle}</p>
          <ol className="mt-4 grid gap-4 sm:grid-cols-2">
            {c.inside.map(([t, d], i) => (
              <li key={t} className="glass-soft rounded-2xl p-5 font-sans text-sm text-deep">
                <span className="data-label text-deep-soft">{String(i + 1).padStart(2, "0")}</span>
                <span className="mt-2 block font-medium">{t}</span>
                <span className="mt-1 block text-deep-soft">{d}</span>
              </li>
            ))}
          </ol>
          <p className="data-label mt-10 text-deep-soft">{c.perksTitle}</p>
          <ul className="mt-4 space-y-2.5">
            {c.perks.map((p) => (
              <li key={p} className="flex gap-2 font-sans text-sm text-deep">
                <Check size={16} className="mt-0.5 shrink-0 text-[var(--rainbow-2)]" />
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-6 font-sans text-xs text-deep-soft">{c.note}</p>
        </Reveal>

        <Reveal className="glass relative h-fit rounded-[1.75rem] p-7 md:p-9 max-lg:row-start-2 lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <WaitlistForm
            text={c.form}
            specialtyOptions={contactPageContent[lang].form.specialtyOptions}
            machines={machines}
            backHref={`/${lang}/academy`}
          />
        </Reveal>
      </div>
    </section>
  );
}
