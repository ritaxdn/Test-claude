import { Star } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Pill } from "./Cta";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";

/** Avis Google repris de cellulift.ma. */
export function Testimonials({ locale }: { locale: Locale }) {
  const c = homeSystem[locale].testimonials;
  return (
    <section className="px-3 pb-12 md:px-5 md:pb-16">
      <div className="mx-auto grid max-w-7xl gap-3 px-3 md:px-7 lg:grid-cols-[1fr_2fr]">
        <Reveal className="glass flex flex-col justify-between rounded-[1.75rem] p-7 md:p-8">
          <div>
            <Pill className="bg-white/60">{c.eyebrow}</Pill>
            <h2 className="display mt-4 text-[clamp(1.7rem,3.3vw,2.9rem)] text-deep">{c.title}</h2>
          </div>
          <div className="mt-8">
            <div className="flex gap-1 text-[#f5b400]" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p className="display mt-3 text-2xl text-deep">{c.rating}</p>
            <p className="font-sans text-sm text-deep-soft">{c.count}</p>
          </div>
        </Reveal>
        <RevealGroup className="grid gap-3 md:grid-cols-[1.5fr_1fr]">
          {c.quotes.map((q) => (
            <RevealItem key={q.author} className="glass flex flex-col justify-between rounded-[1.75rem] p-7 md:p-8">
              <p className="font-sans text-[0.95rem] leading-relaxed text-deep">« {q.text} »</p>
              <p className="data-label mt-6 text-deep-soft">{q.author}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
