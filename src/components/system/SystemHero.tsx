import { Cta } from "./Cta";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";

/**
 * Accueil : hero nacré avec une seule colonne de texte : repère de confiance, H1, accroche, réassurance et actions.
 */
export function SystemHero({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].hero;
  return (
    <section className="relative flex overflow-hidden px-6 pb-16 pt-12 md:px-12 lg:h-[calc(100svh-6.5rem)] lg:min-h-[40rem] lg:max-h-[56rem] lg:items-center lg:py-0">
      <div className="relative mx-auto w-full max-w-7xl">
        <div className="max-w-4xl">
          {/* Repères de confiance */}
          <ul className="flex animate-fade-rise flex-wrap gap-2 opacity-0">
            {c.badges.map((b) => (
              <li
                key={b}
                className="glass-strong flex items-center gap-2 rounded-full px-3.5 py-1.5 font-sans text-xs text-deep md:text-[0.8rem]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[conic-gradient(#7fe3f0,#a797ff,#f29bd0,#ffc58f,#7fe3f0)]" />
                {b}
              </li>
            ))}
          </ul>

          {/* H1 unique : ce que vend Cellulift et où (référencement), puis l'accroche de marque en paragraphe */}
          <h1 className="display hero-title mt-7 animate-fade-rise text-[clamp(1.9rem,3.3vw,3.4rem)] leading-[0.98] text-deep opacity-0 [animation-delay:120ms]">
            <span className="block">{c.title[0]}</span>{" "}
            <span className="iridescent-text block">{c.title[1]}</span>
          </h1>

          <p className="mt-6 max-w-2xl animate-fade-rise font-sans text-base leading-relaxed text-deep opacity-0 [animation-delay:240ms] md:text-lg">
            {c.subtitle}
          </p>
          <p className="data-label mt-4 max-w-2xl animate-fade-rise text-deep-soft opacity-0 [animation-delay:300ms]">{c.reassurance}</p>

          <div className="mt-8 flex animate-fade-rise flex-wrap gap-3 opacity-0 [animation-delay:360ms]">
            <Cta href={`/${locale}/contact?sujet=demo`}>{c.ctaPrimary}</Cta>
            <Cta href={`/${locale}/guide`} variant="line">
              {c.ctaSecondary}
            </Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
