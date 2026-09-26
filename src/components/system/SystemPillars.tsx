import { Heading } from "./Heading";
import { PillarCards } from "./PillarCards";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";

/** Nos fonctionnalités : uniquement les titres ; le détail s'ouvre au clic. */
export function SystemPillars({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].system;
  return (
    <section id="systeme" className="scroll-mt-24 px-3 py-12 md:px-5 md:py-16">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Heading eyebrow={c.eyebrow} title={c.title} />
        <PillarCards pillars={c.pillars} />
      </div>
    </section>
  );
}
