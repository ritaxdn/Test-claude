import { Cta } from "./Cta";
import { Orb } from "./Orb";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";

/**
 * Accueil : fond nacré avec une sphère irisée à droite, et une seule colonne de texte bien alignée
 * (repères de confiance → titre → phrase → actions).
 */
export function SystemHero({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].hero;
  return (
    <section className="relative flex overflow-hidden px-6 pb-16 pt-12 md:px-12 lg:h-[calc(100svh-6.5rem)] lg:min-h-[40rem] lg:max-h-[56rem] lg:items-center lg:py-0">
      {/* Sphère irisée décorative (grand écran uniquement) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        <Orb className="absolute right-[6%] top-1/2 -translate-y-1/2" size={440} />
      </div>

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
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

          {/* H1 : ligne de contexte (ce que fait Cellulift) + grand titre de marque */}
          <h1 className="mt-7 animate-fade-rise text-deep opacity-0 [animation-delay:120ms]">
            <span className="data-label block text-deep">{c.seo}</span>
            <span className="display hero-title mt-4 block text-[clamp(2.3rem,4.1vw,4.1rem)] leading-[0.95]">
              <span className="block">{c.title[0]}</span>{" "}
              <span className="iridescent-text block">{c.title[1]}</span>
            </span>
          </h1>

          <p className="mt-6 max-w-md animate-fade-rise font-sans text-sm font-medium tracking-wide text-deep opacity-0 [animation-delay:240ms] md:text-base">
            {c.titleAccent}
          </p>

          <div className="mt-8 flex animate-fade-rise flex-wrap gap-3 opacity-0 [animation-delay:360ms]">
            <Cta href={`/${locale}/contact?sujet=demo`}>{c.ctaPrimary}</Cta>
            <Cta href={`/${locale}/technologies`} variant="line">
              {c.ctaSecondary}
            </Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
