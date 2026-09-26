import { Cta } from "./Cta";
import { HeroVideo } from "./HeroVideo";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";

/**
 * Accueil : vidéo en plein cadre, et une seule colonne de texte bien alignée
 * (repères de confiance → titre → phrase → actions), lisible grâce à un voile nacré à gauche.
 */
export function SystemHero({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].hero;
  return (
    <section className="relative flex overflow-hidden px-6 pb-16 pt-12 md:px-12 lg:h-[calc(100svh-6.5rem)] lg:min-h-[40rem] lg:max-h-[56rem] lg:items-center lg:py-0">
      {/* Vidéo d'arrière-plan (muette, en boucle) + voiles pour la lisibilité */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <HeroVideo className="h-full w-full" src="/videos/hero.mp4" webm="/videos/hero.webm" poster="/videos/hero-poster.jpg" />
        <div className="absolute inset-0 bg-gradient-to-r from-pearl/90 via-pearl/55 to-pearl/0 lg:via-pearl/40" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-pearl to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="max-w-2xl">
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

          <h1 className="display mt-7 animate-fade-rise text-[clamp(2.6rem,6vw,5.6rem)] leading-[0.95] text-deep opacity-0 [animation-delay:120ms]">
            <span className="block">{c.title[0]}</span>
            <span className="iridescent-text block">{c.title[1]}</span>
          </h1>

          <p className="mt-6 max-w-md animate-fade-rise font-sans text-base leading-relaxed text-deep opacity-0 [animation-delay:240ms] md:text-lg">
            {c.titleAccent}
          </p>

          <div className="mt-8 flex animate-fade-rise flex-col gap-3 opacity-0 [animation-delay:360ms] sm:flex-row">
            <Cta href={`/${locale}/contact`}>{c.ctaPrimary}</Cta>
            <Cta href={`/${locale}/technologies`} variant="line">
              {c.ctaSecondary}
            </Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
