import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Pill, Cta } from "./Cta";
import { Machine } from "./Machine";
import type { Locale } from "@/lib/i18n/config";
import { categories, technologiesIn, universeCover, type CategoryKey } from "@/content/technologies";
import { homeSystem } from "@/content/home-system";

/** Les familles de technologies (par type de soin) en grandes cartes : au survol, la machine apparaît sous un faisceau de balayage. */
export function TechIndex({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].technologies;
  const keys = Object.keys(categories) as CategoryKey[];
  return (
    <section className="px-3 pb-12 md:px-5 md:pb-16">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Pill>{c.eyebrow}</Pill>
            <h2 className="display mt-4 text-[clamp(2rem,5vw,4.6rem)] text-deep">
              <span className="block">{c.title}</span>
              <span className="iridescent-text block">{c.titleAccent}</span>
            </h2>
          </div>
          <Cta href={`/${locale}/technologies`}>{c.viewAll}</Cta>
        </Reveal>

        <RevealGroup className="m-rail mt-8 sm:grid-cols-3">
          {keys.map((key, i) => {
            const cover = universeCover(key);
            // Avec photo : texte clair quand la photo est visible (toujours sur téléphone, au survol sur ordinateur).
            const ink = cover ? "text-white md:text-deep md:group-hover:text-white" : "text-deep";
            const soft = cover ? "text-white/70 md:text-deep-soft md:group-hover:text-white/70" : "text-deep-soft";
            return (
            <RevealItem key={key}>
              <Link
                href={`/${locale}/technologies#${key}`}
                className="glass group relative flex aspect-[3/4] flex-col sm:aspect-[4/5] lg:aspect-[5/4] overflow-hidden rounded-[1.75rem] p-5 md:p-6"
              >
                {cover ? (
                  /* Photo réelle en plein cadre, révélée au survol (toujours visible sur téléphone) */
                  <div className="pointer-events-none absolute inset-0 transition-all duration-700 ease-out md:scale-105 md:opacity-0 md:group-hover:scale-100 md:group-hover:opacity-100">
                    <Image src={cover} alt="" fill sizes="(min-width:1024px) 20vw, (min-width:640px) 33vw, 75vw" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d14]/85 via-[#0b0d14]/10 to-[#0b0d14]/30" />
                  </div>
                ) : (
                  /* Machine + balayage, révélés au survol (toujours visibles en léger sur téléphone) */
                  <div className="pointer-events-none absolute inset-x-0 top-14 bottom-28 flex justify-center opacity-25 transition-all duration-700 ease-out md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                    <Machine className="h-full w-auto drop-shadow-[0_24px_30px_rgba(29,27,38,0.18)]" />
                  </div>
                )}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-full opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="scan-beam absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--rainbow-2)] to-transparent shadow-[0_0_12px_rgba(123,97,255,0.6)]" />
                </div>

                <div className="relative flex items-center justify-between">
                  <span className={`data-label transition-colors duration-300 ${soft}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="glass-strong flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-deep transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight size={15} strokeWidth={1.75} />
                  </span>
                </div>

                <div className="relative mt-auto">
                  <h3 className={`display text-[clamp(1.15rem,1.9vw,1.9rem)] leading-[0.95] transition-colors duration-300 ${ink}`}>
                    {categories[key][locale]}
                  </h3>
                  <p className={`mt-3 line-clamp-2 font-sans text-xs transition-colors duration-300 ${soft}`}>
                    {technologiesIn(key).slice(0, 4).map((t) => t.name).join(" · ")}
                  </p>
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
