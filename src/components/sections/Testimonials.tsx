import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { testimonials } from "@/content/stats";
import type { Locale } from "@/lib/i18n/config";

export function Testimonials({
  locale,
  eyebrow,
  title,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading align="center" eyebrow={eyebrow} title={title} className="max-w-2xl" />

        <RevealGroup className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <RevealItem
              key={t.author}
              className="flex flex-col justify-between border border-hairline bg-warm-white p-8"
            >
              <div>
                <Quote size={22} strokeWidth={1.5} className="text-rainbow-3" />
                <p className="font-body mt-5 text-sm font-light leading-relaxed text-ink-soft">
                  {t.quote[locale]}
                </p>
              </div>
              <div className="mt-7 border-t border-hairline pt-5">
                <p className="font-heading text-base text-ink">{t.author}</p>
                <p className="font-label mt-1 text-muted" style={{ fontSize: "10px", letterSpacing: "0.1em" }}>
                  {t.role[locale].toUpperCase()}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
