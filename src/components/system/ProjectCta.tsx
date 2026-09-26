import { Reveal } from "@/components/ui/Reveal";
import { Signal } from "./Signal";
import { Cta } from "./Cta";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";
import { company } from "@/content/company";

export function ProjectCta({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].cta;
  return (
    <section className="px-3 pb-3 md:px-5 md:pb-5">
      <Reveal className="glass relative overflow-hidden rounded-[2rem] text-deep md:rounded-[2.5rem]">
        <Signal className="pointer-events-none absolute inset-x-0 top-1/2 h-14 opacity-60" animate={false} />
        <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-12 md:px-12 md:pb-12 md:pt-14">
          <div className="max-w-3xl">
            <p className="data-label text-deep-soft">{c.eyebrow}</p>
            <h2 className="display mt-6 text-[clamp(1.9rem,4.2vw,3.6rem)]">
              <span className="iridescent-text">{c.title}</span>
            </h2>
          </div>
          <div className="mt-8 max-w-lg">
            <p className="font-sans leading-relaxed text-deep-soft">{c.text}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Cta href={`/${locale}/contact`}>{c.ctaPrimary}</Cta>
              <Cta href={`tel:${company.phone.replace(/\s/g, "")}`} variant="line">
                {c.ctaSecondary} · {company.phone}
              </Cta>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
