import { Reveal } from "@/components/ui/Reveal";
import { Pill } from "./Cta";
import { PillarCards } from "./PillarCards";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";

/** Nos fonctionnalités : uniquement les titres ; le détail s'ouvre au clic. */
export function SystemPillars({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].system;
  return (
    <section id="systeme" className="scroll-mt-24 px-3 py-16 md:px-5 md:py-28">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        {/* Niveau 1 : affirmation de marque, monumentale */}
        <Reveal>
          <Pill>{c.eyebrow}</Pill>
          <h2 className="display statement mt-5 max-w-5xl text-[clamp(2.6rem,6.4vw,6.6rem)] leading-[0.92] text-deep">{c.title}</h2>
        </Reveal>
        <PillarCards pillars={c.pillars} />
      </div>
    </section>
  );
}
