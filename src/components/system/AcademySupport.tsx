import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Heading } from "./Heading";
import { Cta } from "./Cta";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";
import { academyPageContent } from "@/content/academy-page";

/** Academy (éditorial) et Support (lecture technique) : deux rythmes différents, sans cartes. */
export function AcademySupport({ locale }: { locale: Locale }) {
  const a = homeSystem[locale].academy;
  const s = homeSystem[locale].support;
  const faculty = academyPageContent[locale].faculty.members;
  return (
    <>
      {/* Academy : éditorial, grand espace, sans cartes (prévu pour une photo/vidéo plein cadre) */}
      <section className="px-3 py-16 md:px-5 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-3 md:px-7 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <Reveal>
            <p className="data-label text-deep-soft">{a.eyebrow}</p>
            <h2 className="display mt-5 text-[clamp(1.9rem,3.6vw,3.4rem)] leading-[0.98] text-deep">{a.title}</h2>
            <p className="data-label mt-5 text-deep">{a.text}</p>
            <div className="mt-8">
              <Cta href={`/${locale}/academy`}>{a.cta}</Cta>
            </div>
          </Reveal>
          <RevealGroup className="border-t border-deep/15">
            {faculty.map((m) => (
              <RevealItem key={m.name} className="border-b border-deep/15 py-5">
                <p className="data-label text-deep-soft">{a.facultyLabel}</p>
                <p className="mt-2 font-sans text-lg font-medium text-deep">{m.name}</p>
                <p className="mt-0.5 font-sans text-sm text-deep-soft">{m.role}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="px-3 pb-12 md:px-5 md:pb-16">
        <div className="mx-auto max-w-7xl px-3 md:px-7">
          <Heading eyebrow={s.eyebrow} title={s.title} intro={s.text} />
          {/* Lecture technique : lignes fines façon fiche de diagnostic */}
          <RevealGroup className="mt-8 border-t border-deep/15">
            {s.items.map((it) => (
              <RevealItem key={it.code} className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 border-b border-deep/15 py-4 sm:grid-cols-[3rem_1fr_1.2fr] sm:py-5">
                <span className="data-label text-deep-soft">{it.code}</span>
                <span className="font-sans text-base font-medium text-deep sm:text-lg">{it.title}</span>
                <span className="col-start-2 font-sans text-sm text-deep-soft sm:col-start-3">{it.text}</span>
              </RevealItem>
            ))}
          </RevealGroup>
          <div className="mt-6">
            <Cta href={`/${locale}/contact?sujet=support`} variant="line">{s.cta}</Cta>
          </div>
        </div>
      </section>
    </>
  );
}
