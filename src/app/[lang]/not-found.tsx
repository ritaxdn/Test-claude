"use client";

import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
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
    <section className="flex min-h-[70vh] items-center py-24">
      <Container className="max-w-xl text-center">
        <span
          className="font-label text-muted"
          style={{ fontSize: "11px", letterSpacing: "0.2em" }}
        >
          {t.eyebrow.toUpperCase()}
        </span>
        <h1 className="font-heading mt-5 text-4xl font-light text-ink md:text-5xl">
          {t.title}
        </h1>
        <p className="font-body mt-5 text-base font-light leading-relaxed text-ink-soft">
          {t.description}
        </p>
        <div className="mt-9 flex justify-center">
          <Button href={`/${lang}`}>{t.cta}</Button>
        </div>
        <SectionSeparator className="mx-auto mt-16 max-w-xs" />
      </Container>
    </section>
  );
}
