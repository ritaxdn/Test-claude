import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Heading } from "./Heading";
import { Cta } from "./Cta";
import type { Locale } from "@/lib/i18n/config";
import { categories, technologies, technologiesIn, type CategoryKey } from "@/content/technologies";
import { homeSystem } from "@/content/home-system";

/** Le catalogue par famille : un index, pas une vitrine de produits. */
export function TechIndex({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].technologies;
  const keys = Object.keys(categories) as CategoryKey[];
  return (
    <section className="px-3 pb-12 md:px-5 md:pb-16">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Heading eyebrow={c.eyebrow} title={c.title.replace("{n}", String(technologies.length))} intro={c.intro} />
        <Reveal className="glass mt-8 rounded-[1.75rem] px-5 py-1 md:px-8 md:py-2">
          <ul>
            {keys.map((key, i) => {
              const items = technologiesIn(key);
              return (
                <li
                  key={key}
                  className="grid gap-4 border-b border-deep/10 py-5 last:border-b-0 md:grid-cols-[4.5rem_1fr_2.2fr] md:gap-6 max-md:gap-3"
                >
                  <span className="data-label text-deep-soft">
                    {String(i + 1).padStart(2, "0")} · {String(items.length).padStart(2, "0")}
                  </span>
                  <h3 className="display text-lg text-deep md:text-xl">{categories[key][locale]}</h3>
                  <div className="no-scrollbar -mr-5 flex gap-2 overflow-x-auto pr-5 sm:mr-0 sm:flex-wrap sm:overflow-visible sm:pr-0">
                    {items.map((t) => (
                      <Link
                        key={t.slug}
                        href={`/${locale}/technologies/${t.slug}`}
                        className="glass-soft shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 font-sans text-xs text-deep transition-colors hover:bg-white"
                      >
                        {t.name}
                      </Link>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
        <div className="mt-6">
          <Cta href={`/${locale}/technologies`} variant="line">{c.viewAll}</Cta>
        </div>
      </div>
    </section>
  );
}
