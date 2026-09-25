import { Orb, Lens } from "./Orb";
import { Signal } from "./Signal";
import { Cta, Pill } from "./Cta";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";

export function SystemHero({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].hero;
  const pillars = homeSystem[locale].system.pillars;
  return (
    <section className="px-3 pt-3 md:px-5">
      <div className="glass relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem]">
        {/* Composition irisée */}
        <div className="pointer-events-none absolute -left-24 top-10 md:-left-10 lg:left-[2%] lg:top-16">
          <Orb size={420} className="float scale-[0.62] md:scale-90 lg:scale-100" />
        </div>
        <Lens size={170} className="float-slow pointer-events-none absolute left-[27%] top-[60%] hidden lg:block" />
        <div className="pointer-events-none absolute left-[30%] top-[14%] hidden lg:block">
          <Orb size={70} className="float-slow" />
        </div>
        <Signal className="pointer-events-none absolute inset-x-0 top-[46%] h-14 opacity-80" />

        <div className="relative mx-auto grid max-w-7xl px-6 pb-10 pt-[21rem] md:px-12 md:pt-24 lg:grid-cols-[0.9fr_1.1fr] lg:pb-14 lg:pt-32">
          <div />
          <div>
            <p className="data-label animate-fade-rise text-deep-soft opacity-0">{c.eyebrow}</p>
            <h1 className="display mt-6 animate-fade-rise text-[clamp(2.2rem,6vw,5.6rem)] text-deep opacity-0 [animation-delay:120ms]">
              <span className="block">{c.title[0]}</span>
              <span className="iridescent-text block">{c.title[1]}</span>
            </h1>
            <p className="mt-6 max-w-lg animate-fade-rise font-sans text-xl text-deep opacity-0 [animation-delay:240ms] md:text-2xl">
              {c.titleAccent}
            </p>
            <div className="mt-8 flex animate-fade-rise flex-col gap-3 opacity-0 [animation-delay:340ms] sm:flex-row">
              <Cta href={`/${locale}/contact`}>{c.ctaPrimary}</Cta>
              <Cta href="#systeme" variant="line">{c.ctaSecondary}</Cta>
            </div>
          </div>
        </div>

        {/* Lecture du système */}
        <div className="relative mx-auto max-w-7xl px-6 pb-8 md:px-12 md:pb-12">
          <div className="grid gap-6 border-t border-deep/10 pt-6 md:grid-cols-[auto_1fr_1fr] md:items-center md:gap-10">
            <p className="data-label flex items-center gap-2 text-deep">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--rainbow-2)]" />
              {c.readout.label} · {c.readout.status}
            </p>
            <div className="flex flex-wrap gap-2">
              {pillars.map((p) => (
                <Pill key={p.code} className="bg-white/60">{p.name}</Pill>
              ))}
            </div>
            <p className="font-sans text-sm leading-relaxed text-deep-soft md:text-right">{c.subtitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
