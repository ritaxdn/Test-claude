import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Heading } from "./Heading";
import { Cta, Pill } from "./Cta";
import { Orb, Lens } from "./Orb";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";
import { academyPageContent } from "@/content/academy-page";

/** Academy et Support : des actifs de marque, en mosaïque de cartes. */
export function AcademySupport({ locale }: { locale: Locale }) {
  const a = homeSystem[locale].academy;
  const s = homeSystem[locale].support;
  const faculty = academyPageContent[locale].faculty.members;
  return (
    <>
      <section className="px-3 pb-24 md:px-5 md:pb-32">
        <div className="mx-auto grid max-w-7xl gap-3 px-3 md:px-7 lg:grid-cols-[1.35fr_1fr]">
          <Reveal className="glass relative overflow-hidden rounded-[1.75rem] p-8 md:p-12">
            <Orb size={300} className="pointer-events-none absolute -bottom-24 -right-20 opacity-90" />
            <Lens size={120} className="pointer-events-none absolute bottom-28 right-40 hidden md:block" />
            <div className="relative max-w-xl">
              <Pill className="bg-white/60">{a.eyebrow}</Pill>
              <h2 className="display mt-6 text-[clamp(1.9rem,3.6vw,3.3rem)] text-deep">{a.title}</h2>
              <p className="mt-6 font-sans text-lg leading-relaxed text-deep-soft">{a.text}</p>
              <div className="mt-8">
                <Cta href={`/${locale}/academy`}>{a.cta}</Cta>
              </div>
            </div>
          </Reveal>
          <RevealGroup className="grid gap-3">
            {faculty.map((m) => (
              <RevealItem key={m.name} className="glass rounded-[1.75rem] p-8 md:p-10">
                <p className="data-label text-deep-soft">{a.facultyLabel}</p>
                <p className="display mt-6 text-2xl text-deep">{m.name}</p>
                <p className="mt-1 font-sans text-sm text-deep-soft">{m.role}</p>
                <ul className="mt-6 space-y-2 border-t border-deep/10 pt-5">
                  {m.credentials.map((c) => (
                    <li key={c} className="font-sans text-sm leading-snug text-deep/80">{c}</li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="px-3 pb-24 md:px-5 md:pb-32">
        <div className="mx-auto max-w-7xl px-3 md:px-7">
          <Heading eyebrow={s.eyebrow} title={s.title} intro={s.text} />
          <RevealGroup className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {s.items.map((it) => (
              <RevealItem key={it.code} className="glass flex min-h-[13rem] flex-col rounded-[1.5rem] p-7">
                <Pill className="self-start bg-white/60">SUP-{it.code}</Pill>
                <h3 className="mt-auto pt-8 font-sans text-lg font-medium text-deep">{it.title}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-deep-soft">{it.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
          <div className="mt-6">
            <Cta href={`/${locale}/support`} variant="line">{s.cta}</Cta>
          </div>
        </div>
      </section>
    </>
  );
}
