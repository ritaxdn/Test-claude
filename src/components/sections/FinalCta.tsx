import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Cta } from "@/components/system/Cta";
import { Signal } from "@/components/system/Signal";
import type { Locale } from "@/lib/i18n/config";

/**
 * CTA de fin de page : une seule action principale (vente consultative),
 * l'action secondaire reste un lien discret pour ne pas faire hésiter entre deux boutons équivalents.
 */
export function FinalCta({
  locale,
  title,
  description,
  ctaPrimary,
  ctaSecondary,
  primarySujet = "expert",
  secondarySujet = "proposition",
  phone,
}: {
  locale: Locale;
  title: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  primarySujet?: string;
  secondarySujet?: string;
  /** Ligne directe affichée sous les actions (ex. support technique). */
  phone?: { label: string; number: string };
}) {
  return (
    <section className="px-3 pb-3 md:px-5 md:pb-5">
      <Reveal className="glass relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem]">
        <div className="relative mx-auto max-w-7xl px-6 pb-6 pt-12 md:px-12 md:pb-8 md:pt-14">
          <h2 className="display max-w-3xl text-[clamp(1.9rem,4.2vw,3.6rem)]">
            <span className="iridescent-text">{title}</span>
          </h2>
          <p className="mt-6 max-w-xl font-sans leading-relaxed text-deep-soft">{description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Cta href={`/${locale}/contact?sujet=${primarySujet}`}>{ctaPrimary}</Cta>
            <Link
              href={`/${locale}/contact?sujet=${secondarySujet}`}
              className="group inline-flex items-center gap-1.5 font-sans text-sm text-deep underline decoration-deep/25 underline-offset-4 transition-colors hover:decoration-deep"
            >
              {ctaSecondary}
              <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
          {phone && (
            <a href={`tel:${phone.number.replace(/[\s-]/g, "")}`} className="data-label mt-8 inline-block text-deep-soft hover:text-deep">
              {phone.label} · {phone.number}
            </a>
          )}
        </div>
        {/* Ligne ECG dans le flux, sous le contenu : elle ne passe jamais sous le texte */}
        <Signal className="pointer-events-none -mt-4 mb-4 h-12 w-full opacity-40 md:-mt-6" animate={false} />
      </Reveal>
    </section>
  );
}
