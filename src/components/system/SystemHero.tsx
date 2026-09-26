import { Cta } from "./Cta";
import { HeroVideo } from "./HeroVideo";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";
import { technologies } from "@/content/technologies";

/**
 * Accueil : vidéo en plein cadre derrière, de grands mots blancs, un titre en lignes décalées
 * et des annotations discrètes dans les coins.
 */
export function SystemHero({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].hero;
  const pillars = homeSystem[locale].system.pillars;
  return (
    <section className="relative overflow-hidden px-6 pb-10 pt-10 md:px-12 lg:h-[calc(100svh-6.5rem)] lg:min-h-[44rem] lg:max-h-[58rem] lg:pb-0">
      {/* Vidéo d'arrière-plan (muette, en boucle) + voile nacré pour la lisibilité du texte */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <HeroVideo className="h-full w-full" src="/videos/hero.mp4" webm="/videos/hero.webm" poster="/videos/hero-poster.jpg" />
        <div className="absolute inset-0 bg-gradient-to-r from-pearl/85 via-pearl/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-pearl to-transparent" />
      </div>

      {/* Mots géants en arrière-plan */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 select-none">
        <p className="display translate-x-[4%] text-[clamp(3rem,12.5vw,13rem)] leading-[0.82] text-white/90">{c.backdrop[0]}</p>
        <p className="display pr-[3%] text-right text-[clamp(3rem,12.5vw,13rem)] leading-[0.82] text-white/90">{c.backdrop[1]}</p>
      </div>

      <div className="relative mx-auto h-full max-w-7xl">
        {/* Annotation en haut à droite */}
        <div className="hidden text-right lg:ml-auto lg:block lg:max-w-sm">
          <p className="font-sans text-sm leading-snug text-deep/80">{c.corner}</p>
          <p className="mt-2 font-sans text-base font-medium text-deep">{c.cornerStrong}</p>
        </div>

        <div className="relative lg:mt-10 lg:grid lg:grid-cols-[1fr_1.05fr_0.55fr]">
          {/* Titre en lignes décalées */}
          <h1 className="display relative z-20 animate-fade-rise pt-4 text-[clamp(2.2rem,4.3vw,4.4rem)] leading-[0.98] lg:whitespace-nowrap text-deep opacity-0 lg:pt-8">
            <span className="block pl-[18%] lg:pl-[26%]">{c.stagger[0]}</span>
            <span className="block">{c.stagger[1]}</span>
            <span className="block pl-[10%] lg:pl-[16%]">
              <span className="iridescent-text">{c.stagger[2]}</span>
            </span>
          </h1>

          {/* Repères discrets à droite */}
          <div className="hidden gap-10 pt-24 lg:col-start-3 lg:flex">
            <ul className="space-y-1.5">
              {pillars.slice(0, 2).map((p) => (
                <li key={p.code} className="font-sans text-sm text-deep/60">{p.name}</li>
              ))}
            </ul>
            <ul className="space-y-1.5">
              {pillars.slice(2).map((p) => (
                <li key={p.code} className="font-sans text-sm text-deep/60">{p.name}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Texte et actions en bas à gauche */}
        <div className="relative z-10 mt-8 max-w-sm animate-fade-rise opacity-0 [animation-delay:320ms] lg:absolute lg:bottom-12 lg:left-0 lg:mt-0">
          <p className="font-sans text-[0.95rem] leading-relaxed text-deep">{c.titleAccent}</p>
          <p className="mt-2 hidden font-sans text-sm leading-relaxed text-deep-soft sm:block">{c.subtitle}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Cta href={`/${locale}/contact`}>{c.ctaPrimary}</Cta>
            <Cta href={`/${locale}/technologies`} variant="line">
              {c.ctaSecondary.replace("{n}", String(technologies.length))}
            </Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
