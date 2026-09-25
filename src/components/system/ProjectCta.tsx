import { Reveal } from "@/components/ui/Reveal";
import { Signal } from "./Signal";
import { Cta } from "./Cta";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";

export function ProjectCta({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].cta;
  return (
    <section className="px-3 pb-3 md:px-5 md:pb-5">
      <Reveal className="glass relative overflow-hidden rounded-[2rem] text-deep md:rounded-[2.5rem]">
        <Signal className="pointer-events-none absolute inset-x-0 top-1/2 h-14 opacity-60" animate={false} />
        <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-56 md:px-12 md:pb-16 lg:pt-28">
          <div className="max-w-3xl">
            <p className="data-label text-deep-soft">{c.eyebrow}</p>
            <h2 className="display mt-6 text-[clamp(2.2rem,6vw,5.4rem)]">
              <span className="iridescent-text">{c.title}</span>
            </h2>
          </div>
          <div className="mt-8 max-w-lg">
            <p className="font-sans leading-relaxed text-deep-soft">{c.text}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Cta href={`/${locale}/contact`}>{c.ctaPrimary}</Cta>
              <Cta href={`/${locale}/contact`} variant="line">{c.ctaSecondary}</Cta>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
