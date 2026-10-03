import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Pill } from "./Cta";
import type { Locale } from "@/lib/i18n/config";
import { faq } from "@/content/faq";

/** FAQ en accordéon natif (<details>, accessible sans JavaScript) + données structurées FAQPage pour Google. */
export function Faq({ locale }: { locale: Locale }) {
  const c = faq[locale];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
  return (
    <section id="faq" className="scroll-mt-24 px-3 pb-14 md:px-5 md:pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="mx-auto grid max-w-7xl gap-8 px-3 md:px-7 lg:grid-cols-[1fr_1.6fr]">
        <Reveal>
          <Pill>{c.eyebrow}</Pill>
          <h2 className="display mt-4 text-[clamp(1.6rem,2.6vw,2.5rem)] text-deep">{c.title}</h2>
        </Reveal>
        <div className="border-t border-deep/15">
          {c.items.map((it) => (
            <details key={it.q} className="group border-b border-deep/15">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-sans text-base font-medium text-deep marker:hidden [&::-webkit-details-marker]:hidden">
                {it.q}
                <Plus size={16} strokeWidth={1.75} aria-hidden="true" className="shrink-0 transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="pb-5 pr-10 font-sans text-sm leading-relaxed text-deep-soft">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
