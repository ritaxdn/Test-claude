"use client";

import { usePathname } from "next/navigation";
import { Cta } from "@/components/system/Cta";
import { isLocale, defaultLocale } from "@/lib/i18n/config";

const text = {
  fr: {
    eyebrow: "Erreur 404",
    title: "Cette page n'existe pas.",
    description:
      "Le lien que vous avez suivi est peut-être obsolète, ou la page a été déplacée.",
    cta: "Retour à l'accueil",
  },
  en: {
    eyebrow: "404 error",
    title: "This page doesn't exist.",
    description: "The link you followed may be outdated, or the page has moved.",
    cta: "Back to home",
  },
} as const;

export default function NotFound() {
  const pathname = usePathname();
  const segment = pathname?.split("/")[1];
  const lang = segment && isLocale(segment) ? segment : defaultLocale;
  const t = text[lang];

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6 py-24">
      <div className="glass max-w-xl rounded-[2rem] p-10 text-center">
        <p className="data-label text-deep-soft">{t.eyebrow}</p>
        <h1 className="display mt-5 text-[clamp(2rem,4vw,3rem)] text-deep">{t.title}</h1>
        <p className="mt-5 font-sans leading-relaxed text-deep-soft">{t.description}</p>
        <div className="mt-8 flex justify-center">
          <Cta href={`/${lang}`}>{t.cta}</Cta>
        </div>
      </div>
    </section>
  );
}
