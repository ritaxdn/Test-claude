import Image from "next/image";
import { withLgl } from "@/components/brand/LglLink";
import Link from "next/link";
import { Cta } from "./Cta";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";

/** Machine mise en scène sous le titre (photo studio, format paysage). */
const showcase = { slug: "skin-analyser-g7", name: "Skin Analyser G7", image: "/images/technologies/skin-analyser-g7/00.jpg" };

/**
 * Accueil, mise en page façon Apple : repère de confiance, grand titre centré, accroche, deux boutons centrés,
 * puis une grande photo de machine sur toute la largeur du contenu.
 */
export function SystemHero({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].hero;
  return (
    <section className="relative overflow-hidden px-4 pb-14 pt-14 md:px-8 md:pb-20 md:pt-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <ul className="flex animate-fade-rise flex-wrap justify-center gap-2 opacity-0">
          {c.badges.map((b) => (
            <li key={b} className="glass-strong flex items-center gap-2 rounded-full px-3.5 py-1.5 font-sans text-xs text-deep md:text-[0.8rem]">
              <span className="h-1.5 w-1.5 rounded-full bg-[conic-gradient(#7fe3f0,#a797ff,#f29bd0,#ffc58f,#7fe3f0)]" />
              {b}
            </li>
          ))}
        </ul>

        {/* H1 unique : ce que vend Cellulift et où (référencement) */}
        <h1 className="display hero-title mt-7 animate-fade-rise text-[clamp(2rem,4.6vw,4.4rem)] leading-[0.96] text-deep opacity-0 [animation-delay:120ms]">
          <span className="block">{c.title[0]}</span> <span className="iridescent-text block">{c.title[1]}</span>
        </h1>

        <p className="mt-6 max-w-2xl animate-fade-rise font-sans text-lg leading-relaxed text-deep opacity-0 [animation-delay:240ms] md:text-xl">
          {c.subtitle}
        </p>

        <div className="mt-8 flex animate-fade-rise flex-wrap justify-center gap-3 opacity-0 [animation-delay:360ms]">
          <Cta href={`/${locale}/contact?sujet=demo`}>{c.ctaPrimary}</Cta>
          <Cta href={`/${locale}/guide`} variant="line">
            {c.ctaSecondary}
          </Cta>
        </div>
        <p className="data-label mt-6 max-w-2xl animate-fade-rise text-deep-soft opacity-0 [animation-delay:420ms]">{withLgl(c.reassurance)}</p>
      </div>

      {/* Grande photo produit, comme une page Apple */}
      <Link
        href={`/${locale}/technologies/${showcase.slug}`}
        className="group relative mx-auto mt-12 block max-w-6xl animate-fade-rise overflow-hidden rounded-[1.75rem] bg-[#0b0d14] opacity-0 [animation-delay:500ms] md:mt-16 md:rounded-[2.5rem]"
      >
        <div className="relative aspect-[4/3] sm:aspect-[16/9]">
          <Image
            src={showcase.image}
            alt={`${showcase.name}, LGL Expert`}
            fill
            priority
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.02]"
          />
        </div>
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/15 px-4 py-1.5 font-sans text-xs text-white backdrop-blur-md md:bottom-6 md:text-sm">
          {showcase.name} · LGL Expert ›
        </span>
      </Link>
    </section>
  );
}
