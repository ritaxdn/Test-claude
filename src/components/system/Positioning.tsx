import { Reveal } from "@/components/ui/Reveal";
import { withLgl } from "@/components/brand/LglLink";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";

/** Positionnement sous les chiffres, centré : qui nous sommes, pour qui, et ce qui accompagne chaque équipement. */
export function Positioning({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].positioning;
  return (
    <section className="px-3 pb-14 md:px-5 md:pb-20">
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center px-3 text-center md:px-7">
        <h2 className="display text-[clamp(1.6rem,3vw,2.8rem)] text-deep">{c.title}</h2>
        <p className="mt-6 font-sans text-lg leading-relaxed text-deep-soft md:text-xl">{withLgl(c.text)}</p>
      </Reveal>
    </section>
  );
}
