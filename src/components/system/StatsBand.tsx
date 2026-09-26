import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";
import { company } from "@/content/company";

/** Chiffres clés, très grands, sans paragraphe : une lecture d'instrument. */
export function StatsBand({ locale }: { locale: Locale }) {
  const stats = homeSystem[locale].stats;
  const fill = (v: string) => v.replace("{s}", String(company.showrooms.length));
  return (
    <section className="px-3 py-10 md:px-5 md:py-16">
      <RevealGroup className="mx-auto grid max-w-7xl grid-cols-2 px-3 md:px-7 lg:grid-cols-4">
        {stats.map((s, i) => (
          <RevealItem
            key={s.label}
            className="relative border-t border-deep/15 pb-6 pt-4 pr-4 lg:border-l lg:border-t-0 lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
          >
            <span className="data-label text-deep-soft">{String(i + 1).padStart(2, "0")}</span>
            <p className="display stat-num mt-3 flex items-baseline gap-2 text-[clamp(2.6rem,5.4vw,6rem)] leading-[0.85] text-deep">
              <span className={i === 1 ? "iridescent-text" : undefined}>{fill(s.value)}</span>
              {"unit" in s && s.unit && (
                <span className="text-[clamp(1rem,2vw,1.8rem)] tracking-normal">{s.unit}</span>
              )}
            </p>
            <p className="data-label mt-4 text-deep">{s.label}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
