import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Pill, Cta } from "./Cta";
import type { Locale } from "@/lib/i18n/config";
import { categories, categoryDetail, technologiesIn, universeCover, type CategoryKey } from "@/content/technologies";
import { homeSystem } from "@/content/home-system";

/**
 * Les 6 gammes en grandes cartes de verre (besoin → technologie → machine) :
 * au survol, les technologies de la gamme apparaissent ; photo réelle de machine quand elle existe.
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
            const cover = universeCover(key);
            // Avec photo : texte clair quand la photo est visible (toujours sur téléphone, au survol sur ordinateur).
            const ink = cover ? "text-white md:text-deep md:group-hover:text-white" : "text-deep";
            const soft = cover ? "text-white/75 md:text-deep-soft md:group-hover:text-white/75" : "text-deep-soft";
            return (
              <RevealItem key={key}>
                <Link
                  href={`/${locale}/technologies#${key}`}
                  className="glass group relative flex aspect-[5/4] flex-col overflow-hidden rounded-[1.75rem] p-5 md:p-6"
                >
                  {cover && (
                    <div className="pointer-events-none absolute inset-0 transition-all duration-700 ease-out md:scale-105 md:opacity-0 md:group-hover:scale-100 md:group-hover:opacity-100">
                      <Image src={cover} alt="" fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 80vw" className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d14]/85 via-[#0b0d14]/20 to-[#0b0d14]/30" />
                    </div>
                  )}

                  <div className="relative flex items-center justify-between">
                    <span className={`data-label transition-colors duration-300 ${soft}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="glass-strong flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-deep transition-transform duration-300 group-hover:rotate-45">
                      <ArrowUpRight size={15} strokeWidth={1.75} />
                    </span>
                  </div>

                  <div className="relative mt-auto">
                    <h3 className={`display text-[clamp(1.3rem,1.95vw,1.9rem)] leading-[0.95] transition-colors duration-300 ${ink}`}>
                      {categories[key][locale]}
                    </h3>
                    {categoryDetail[key] && (
                      <p className={`data-label mt-2 transition-colors duration-300 ${soft}`}>{categoryDetail[key]![locale]}</p>
                    )}
                    {/* Technologies de la gamme : discrètes, révélées au survol (masquées sur téléphone, sans survol) */}
                    <ul className="mt-4 hidden flex-wrap gap-x-3 gap-y-1 transition-all duration-500 md:flex md:max-h-0 md:translate-y-2 md:overflow-hidden md:opacity-0 md:group-hover:max-h-40 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                      {machines.map((m) => (
                        <li key={m.slug} className={`font-sans text-xs ${cover ? "text-white/80" : "text-deep-soft"}`}>
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
