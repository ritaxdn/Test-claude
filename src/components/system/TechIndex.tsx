import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Cta } from "./Cta";
import type { Locale } from "@/lib/i18n/config";
import { categories, technologiesIn, universeCover, universeCoverName, type CategoryKey } from "@/content/technologies";
import { homeSystem } from "@/content/home-system";
import { landingForCategory, landingPath } from "@/content/category-landings";

/** Une ligne par gamme, courte, à la manière des tuiles Apple. */
const tagline: Record<CategoryKey, { fr: string; en: string }> = {
  lasers: { fr: "Épilation, détatouage, pigments, vasculaire.", en: "Hair removal, tattoos, pigment, vascular." },
  amincissement: { fr: "Moins de graisse. Plus de fermeté.", en: "Less fat. More firmness." },
  hifu: { fr: "Le lifting, sans chirurgie.", en: "Lifting, without surgery." },
  rejuvenation: { fr: "Texture, rides, éclat.", en: "Texture, wrinkles, radiance." },
  photomodulation: { fr: "La lumière au service de la peau.", en: "Light, working for the skin." },
  therapie: { fr: "Récupération, physiothérapie, santé intime.", en: "Recovery, physiotherapy, intimate health." },
};
/** Gammes dont la photo est sur fond clair : texte foncé, sans voile. */
const lightCover = new Set<CategoryKey>(["therapie"]);

/**
 * Les gammes en grandes tuiles photo, façon apple.com : titre et une ligne centrés en haut,
 * deux liens (« En savoir plus », « Demander une démo »), la photo de la machine en fond.
 */
export function TechIndex({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].technologies;
  const keys = Object.keys(categories) as CategoryKey[];
  const more = locale === "fr" ? "En savoir plus" : "Learn more";
  const demo = locale === "fr" ? "Demander une démo" : "Request a demo";
  return (
    <section className="px-3 pb-14 md:px-5 md:pb-20">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col items-center px-3 text-center">
          <h2 className="display text-[clamp(1.8rem,3.4vw,3.2rem)] text-deep">
            <span className="block">{c.title}</span>
            <span className="iridescent-text block">{c.titleAccent}</span>
          </h2>
          <Cta href={`/${locale}/technologies`} variant="link" className="mt-5">
            {c.viewAll}
          </Cta>
        </Reveal>

        <RevealGroup className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2">
          {keys.map((key) => {
            const cover = universeCover(key);
            const light = !cover || lightCover.has(key);
            // Photos sur fond sombre : tuile sombre ; photo sur fond clair ou absente : tuile de verre.
            const href = landingForCategory[key] ? `/${locale}${landingPath(landingForCategory[key])}` : `/${locale}/technologies#${key}`;
            return (
              <RevealItem key={key}>
                <div className={`group relative flex h-[30rem] flex-col items-center overflow-hidden rounded-[1.75rem] px-6 pt-10 text-center md:h-[36rem] ${light ? "glass" : "bg-[#0b0d14]"}`}>
                  {cover && (
                    <div className="tile-photo pointer-events-none absolute bottom-0 left-1/2 aspect-[4/5] h-[66%] -translate-x-1/2">
                      <Image
                        src={cover}
                        alt={`${universeCoverName(key) ?? categories[key][locale]} — ${categories[key][locale]}`}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover object-bottom transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                  )}
                  <div className="relative">
                    <h3 className={`display tile-title text-[clamp(1.6rem,2.6vw,2.4rem)] ${light ? "text-deep" : "text-white"}`}>{categories[key][locale]}</h3>
                    <p className={`mt-2 font-sans text-base md:text-lg ${light ? "text-deep-soft" : "text-white/80"}`}>{tagline[key][locale]}</p>
                    <div className={`mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-sans text-[0.95rem] ${light ? "text-deep" : "text-white"}`}>
                      <Link href={href} className="inline-flex items-center gap-0.5 hover:underline hover:underline-offset-4">
                        {more}
                        <ChevronRight size={16} strokeWidth={2} aria-hidden />
                        <span className="sr-only"> : {categories[key][locale]}</span>
                      </Link>
                      <Link href={`/${locale}/contact?sujet=demo`} className="inline-flex items-center gap-0.5 hover:underline hover:underline-offset-4">
                        {demo}
                        <ChevronRight size={16} strokeWidth={2} aria-hidden />
                      </Link>
                    </div>
                  </div>
                  {!cover && (
                    <ul className="relative mt-auto mb-12 flex flex-wrap justify-center gap-2">
                      {technologiesIn(key).map((m) => (
                        <li key={m.slug}>
                          <Link href={`/${locale}/technologies/${m.slug}`} className="glass-strong inline-block rounded-full px-5 py-2.5 font-sans text-base text-deep transition-colors hover:bg-white">
                            {m.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
