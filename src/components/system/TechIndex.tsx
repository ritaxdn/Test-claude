import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Heading } from "./Heading";
import { Cta, Pill } from "./Cta";
import type { Locale } from "@/lib/i18n/config";
import { categories, technologies } from "@/content/technologies";
import { homeSystem } from "@/content/home-system";

/** Les technologies comme un index scientifique, dans une carte de verre. */
export function TechIndex({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].technologies;
  return (
    <section className="px-3 pb-24 md:px-5 md:pb-32">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Heading eyebrow={c.eyebrow} title={c.title} intro={c.intro} />
        <Reveal className="glass mt-14 rounded-[1.75rem] px-5 py-3 md:px-9 md:py-5">
          <div className="hidden grid-cols-[4.5rem_1.2fr_1fr_1.6fr_2.5rem] gap-6 border-b border-deep/10 py-4 md:grid">
            {[c.columns.ref, c.columns.name, c.columns.category, c.columns.indications].map((h) => (
              <span key={h} className="data-label text-deep-soft">{h}</span>
            ))}
          </div>
          <ul>
            {technologies.map((t, i) => (
              <li key={t.slug} className="border-b border-deep/10 last:border-b-0">
                <Link
                  href={`/${locale}/technologies/${t.slug}`}
                  className="group grid grid-cols-[3rem_1fr_auto] items-center gap-x-4 gap-y-2 py-5 md:grid-cols-[4.5rem_1.2fr_1fr_1.6fr_2.5rem] md:gap-6"
                >
                  <span className="data-label text-deep-soft">CL-{String(i + 1).padStart(2, "0")}</span>
                  <span className="display text-lg text-deep md:text-xl">{t.name}</span>
                  <span className="flex h-9 w-9 items-center justify-center justify-self-end rounded-full border border-deep/15 text-deep transition-all duration-300 group-hover:rotate-45 group-hover:bg-deep group-hover:text-white md:order-last">
                    <ArrowUpRight size={15} strokeWidth={1.75} />
                  </span>
                  <span className="col-start-2 md:col-start-auto">
                    <Pill className="bg-white/60">{categories[t.category][locale]}</Pill>
                  </span>
                  <span className="col-start-2 font-sans text-sm text-deep-soft md:col-start-auto">
                    {t.indications.map((x) => x[locale]).join(" · ")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
        <div className="mt-6">
          <Cta href={`/${locale}/technologies`} variant="line">{c.viewAll}</Cta>
        </div>
      </div>
    </section>
  );
}
