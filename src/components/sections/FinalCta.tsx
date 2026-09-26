import { Reveal } from "@/components/ui/Reveal";
import { Cta } from "@/components/system/Cta";
import { Signal } from "@/components/system/Signal";
import type { Locale } from "@/lib/i18n/config";

export function FinalCta({
  locale,
  title,
  description,
  ctaPrimary,
  ctaSecondary,
}: {
  locale: Locale;
  title: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
}) {
  return (
    <section className="px-3 pb-3 md:px-5 md:pb-5">
      <Reveal className="glass relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem]">
        <Signal className="pointer-events-none absolute inset-x-0 top-1/2 h-14 opacity-50" animate={false} />
        <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-12 md:px-12 md:pb-12 md:pt-14">
          <h2 className="display max-w-3xl text-[clamp(1.9rem,4.2vw,3.6rem)]">
            <span className="iridescent-text">{title}</span>
          </h2>
          <p className="mt-6 max-w-lg font-sans leading-relaxed text-deep-soft">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Cta href={`/${locale}/contact`}>{ctaPrimary}</Cta>
            <Cta href={`/${locale}/contact`} variant="line">{ctaSecondary}</Cta>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
