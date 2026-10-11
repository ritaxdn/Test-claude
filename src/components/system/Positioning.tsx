import { Reveal } from "@/components/ui/Reveal";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";

/** Positionnement sous les chiffres : qui nous sommes, pour qui, et ce qui accompagne chaque équipement. */
export function Positioning({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].positioning;
  return (
    <section className="px-3 pb-12 md:px-5 md:pb-16">
      <Reveal className="mx-auto max-w-7xl px-3 md:px-7">
        <h2 className="display max-w-4xl text-[clamp(1.6rem,2.6vw,2.5rem)] text-deep">{c.title}</h2>
        <p className="mt-5 max-w-3xl font-sans text-lg leading-relaxed text-deep-soft">{c.text}</p>
      </Reveal>
    </section>
  );
}
