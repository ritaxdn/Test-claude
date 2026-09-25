import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Cta } from "./Cta";
import type { Locale } from "@/lib/i18n/config";
import { categories, technologies } from "@/content/technologies";
import { homeSystem } from "@/content/home-system";

/** Les technologies présentées comme un index scientifique, pas comme un catalogue. */
export function TechIndex({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].technologies;
  return (
    <section className="bg-porcelain py-24 text-void md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <p className="data-label text-void/50">{c.eyebrow}</p>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <h2 className="display text-[clamp(2.2rem,5.2vw,4.6rem)]">{c.title}</h2>
            <p className="max-w-md font-sans leading-relaxed text-void/60">{c.intro}</p>
          </div>
        </Reveal>

        <Reveal className="mt-16">
          <div className="hidden grid-cols-[5rem_1.2fr_1fr_1.6fr_2rem] gap-6 border-b border-void/15 pb-3 md:grid">
            {[c.columns.ref, c.columns.name, c.columns.category, c.columns.indications].map((h) => (
              <span key={h} className="data-label text-void/45">{h}</span>
            ))}
          </div>
          <ul>
            {technologies.map((t, i) => (
              <li key={t.slug}>
                <Link
                  href={`/${locale}/technologies/${t.slug}`}
                  className="group relative grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-x-4 gap-y-1 border-b border-void/10 py-6 transition-colors hover:bg-void/[0.025] md:grid-cols-[5rem_1.2fr_1fr_1.6fr_2rem] md:gap-6"
                >
                  <span className="signal-line absolute inset-x-0 bottom-[-1px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
                  <span className="data-label text-void/45">CL-{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-xl font-medium uppercase tracking-tight [font-stretch:112%] md:text-2xl">{t.name}</span>
                  <ArrowUpRight size={18} strokeWidth={1.5} className="justify-self-end text-void/40 transition-colors group-hover:text-void md:order-last" />
                  <span className="col-start-2 font-sans text-sm text-void/60 md:col-start-auto">{categories[t.category][locale]}</span>
                  <span className="col-start-2 font-sans text-sm text-void/60 md:col-start-auto">
                    {t.indications.map((x) => x[locale]).join(" · ")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Cta href={`/${locale}/technologies`} variant="line" tone="light">{c.viewAll}</Cta>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
