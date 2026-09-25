import { Signal } from "./Signal";
import { Cta } from "./Cta";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";

export function SystemHero({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].hero;
  const pillars = homeSystem[locale].system.pillars;
  return (
    <section className="relative -mt-[73px] overflow-hidden bg-void pt-[73px] text-platinum">
      {/* Trame + faisceau de balayage */}
      <div className="hairline-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_75%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full">
        <div className="scan-beam absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-20 md:px-10 md:pt-28 lg:pb-28">
        <p className="data-label animate-fade-rise text-silver opacity-0">{c.eyebrow}</p>
        <h1 className="display mt-8 animate-fade-rise text-[clamp(2.1rem,7.2vw,7rem)] opacity-0 [animation-delay:120ms]">
          <span className="block">{c.title[0]}</span>
          <span className="block">{c.title[1]}</span>
        </h1>
        <div className="mt-10 grid gap-16 lg:grid-cols-[1.35fr_1fr] lg:items-start">
        <div className="min-w-0">
          <p className=" max-w-xl animate-fade-rise font-sans text-xl text-platinum/90 opacity-0 [animation-delay:240ms] md:text-2xl">
            {c.titleAccent}
          </p>
          <p className="mt-6 max-w-lg animate-fade-rise font-sans text-[0.95rem] leading-relaxed text-silver opacity-0 [animation-delay:320ms]">
            {c.subtitle}
          </p>
          <div className="mt-10 flex animate-fade-rise flex-col gap-3 opacity-0 [animation-delay:400ms] sm:flex-row">
            <Cta href={`/${locale}/contact`}>{c.ctaPrimary}</Cta>
            <Cta href="#systeme" variant="line">{c.ctaSecondary}</Cta>
          </div>
        </div>

        {/* Lecture du système : une interface, pas une illustration */}
        <div className="animate-fade-rise border border-white/10 bg-white/[0.03] p-6 opacity-0 backdrop-blur-xl [animation-delay:520ms] md:p-8">
          <div className="flex items-center justify-between">
            <p className="data-label whitespace-nowrap text-silver">{c.readout.label}</p>
            <p className="data-label flex items-center gap-2 text-platinum">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--rainbow-1)]" />
              {c.readout.status}
            </p>
          </div>
          <ul className="mt-6 border-t border-white/10">
            {pillars.map((p, i) => (
              <li key={p.code} className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 border-b border-white/10 py-3.5">
                <span className="data-label text-silver">{p.code}</span>
                <span className="font-sans text-[0.95rem]">{p.name}</span>
                <span className="data-label text-silver">0{i + 1}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <div className="signal-line" />
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <p className="data-label text-silver">Output</p>
              <p className="font-sans text-[0.95rem] text-platinum">{c.readout.output}</p>
            </div>
          </div>
        </div>
        </div>
      </div>

      <Signal className="relative h-12 w-full md:h-16" />
    </section>
  );
}
