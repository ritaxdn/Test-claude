import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Cta } from "./Cta";
import type { Locale } from "@/lib/i18n/config";
import { homeSystem } from "@/content/home-system";
import { academyPageContent } from "@/content/academy-page";

/** Academy et Support : des actifs de marque, présentés au même niveau que les technologies. */
export function AcademySupport({ locale }: { locale: Locale }) {
  const a = homeSystem[locale].academy;
  const s = homeSystem[locale].support;
  const faculty = academyPageContent[locale].faculty.members;
  return (
    <>
      <section className="bg-porcelain py-24 text-void md:py-36">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 md:px-10 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <Reveal>
            <p className="data-label text-void/50">{a.eyebrow}</p>
            <h2 className="display mt-8 text-[clamp(2rem,3.9vw,3.6rem)]">{a.title}</h2>
            <p className="mt-8 max-w-lg font-sans text-lg leading-relaxed text-void/65">{a.text}</p>
            <div className="mt-10">
              <Cta href={`/${locale}/academy`} tone="light">{a.cta}</Cta>
            </div>
          </Reveal>
          <RevealGroup className="self-end">
            {faculty.map((m) => (
              <RevealItem key={m.name} className="relative border border-void/10 bg-white/60 p-8 backdrop-blur md:p-10">
                <div className="signal-line absolute inset-x-0 top-0" />
                <p className="data-label text-void/45">{a.facultyLabel}</p>
                <p className="mt-6 font-display text-2xl font-medium uppercase tracking-tight [font-stretch:112%]">{m.name}</p>
                <p className="mt-1 font-sans text-sm text-void/60">{m.role}</p>
                <ul className="mt-6 space-y-2 border-t border-void/10 pt-5">
                  {m.credentials.map((c) => (
                    <li key={c} className="font-sans text-sm leading-snug text-void/70">{c}</li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-void py-24 text-platinum md:py-36">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal>
            <p className="data-label text-silver">{s.eyebrow}</p>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
              <h2 className="display text-[clamp(2.2rem,5.2vw,4.6rem)]">{s.title}</h2>
              <p className="max-w-md font-sans leading-relaxed text-silver">{s.text}</p>
            </div>
          </Reveal>
          <RevealGroup className="mt-16 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {s.items.map((it) => (
              <RevealItem key={it.code} className="bg-void p-8">
                <p className="data-label text-silver">SUP-{it.code}</p>
                <h3 className="mt-10 font-sans text-lg font-medium">{it.title}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-silver">{it.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
          <div className="mt-10">
            <Cta href={`/${locale}/support`} variant="line">{s.cta}</Cta>
          </div>
        </div>
      </section>
    </>
  );
}
