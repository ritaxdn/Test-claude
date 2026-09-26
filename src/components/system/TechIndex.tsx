import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Pill, Cta } from "./Cta";
import { TechVisual } from "./TechVisual";
import type { Locale } from "@/lib/i18n/config";
import { categories, categoryDetail, technologiesIn, type CategoryKey } from "@/content/technologies";
import { homeSystem } from "@/content/home-system";

/**
 * Les 6 gammes en grandes cartes immersives (besoin → technologie → machine) :
 * un visuel propre à chaque indication ; au survol, les technologies de la gamme apparaissent.
 */
export function TechIndex({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].technologies;
  const keys = Object.keys(categories) as CategoryKey[];
  return (
    <section className="px-3 pb-12 md:px-5 md:pb-16">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Reveal className="flex flex-col items-start gap-6">
          <div>
            <Pill>{c.eyebrow}</Pill>
            <h2 className="display mt-4 text-[clamp(2rem,4.3vw,4.4rem)] text-deep">
              <span className="block">{c.title}</span>
              <span className="iridescent-text block">{c.titleAccent}</span>
            </h2>
          </div>
          <Cta href={`/${locale}/technologies`}>{c.viewAll}</Cta>
        </Reveal>

        <RevealGroup className="m-rail mt-8 sm:grid-cols-2 lg:grid-cols-3">
          {keys.map((key, i) => {
            const machines = technologiesIn(key);
            return (
              <RevealItem key={key}>
                <Link
                  href={`/${locale}/technologies#${key}`}
                  className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-[1.75rem] bg-[#0b0d14] p-5 text-white shadow-[0_30px_60px_-30px_rgba(29,27,38,0.55)] ring-1 ring-white/10 md:p-6"
                >
                  {/* Visuel immersif de la gamme */}
                  <TechVisual
                    kind={key}
                    className="absolute inset-0 h-full w-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
                  />
                  {/* Voile bas pour la lisibilité, plus dense au survol quand la liste apparaît */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0b0d14] via-[#0b0d14]/60 to-transparent transition-opacity duration-500 md:opacity-80 md:group-hover:opacity-100" />

                  <div className="relative flex items-center justify-between">
                    <span className="data-label text-white/70">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur-md transition-transform duration-300 group-hover:rotate-45">
                      <ArrowUpRight size={15} strokeWidth={1.75} />
                    </span>
                  </div>

                  <div className="relative mt-auto">
                    <h3 className="display text-[clamp(1.3rem,1.95vw,1.9rem)] leading-[0.95]">{categories[key][locale]}</h3>
                    {categoryDetail[key] && <p className="data-label mt-2 text-white/70">{categoryDetail[key]![locale]}</p>}
                    {/* Technologies de la gamme : discrètes, révélées au survol (masquées sur téléphone, sans survol) */}
                    <ul className="mt-4 hidden flex-wrap gap-x-3 gap-y-1 transition-all md:flex duration-500 md:max-h-0 md:translate-y-2 md:overflow-hidden md:opacity-0 md:group-hover:max-h-40 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                      {machines.map((m) => (
                        <li key={m.slug} className="font-sans text-xs text-white/75">
                          {m.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
