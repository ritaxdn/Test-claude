import { Reveal } from "@/components/ui/Reveal";
import { Signal } from "./Signal";
import { Cta } from "./Cta";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";

export function ProjectCta({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].cta;
  return (
    <section className="relative overflow-hidden bg-graphite pb-24 text-platinum md:pb-32">
      <Signal className="h-12 w-full md:h-16" animate={false} />
      <div className="mx-auto max-w-7xl px-6 pt-16 md:px-10 md:pt-24">
        <Reveal className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="data-label text-silver">{c.eyebrow}</p>
            <h2 className="display mt-8 text-[clamp(2.1rem,7vw,6rem)]">{c.title}</h2>
          </div>
          <div>
            <p className="font-sans leading-relaxed text-silver">{c.text}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Cta href={`/${locale}/contact`}>{c.ctaPrimary}</Cta>
              <Cta href={`/${locale}/contact`} variant="line">{c.ctaSecondary}</Cta>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
