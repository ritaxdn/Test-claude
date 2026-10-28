import Image from "next/image";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Cta, Pill } from "@/components/system/Cta";
import type { Locale } from "@/lib/i18n/config";
import { currentHighlight } from "@/content/academy-sessions";
import { company } from "@/content/company";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/site";

const t = {
  fr: { badge: "À la une", register: "S'inscrire", programme: "Voir le programme", call: "Appeler l'Academy", speaker: "Key speaker", agenda: "Au programme" },
  en: { badge: "Highlight", register: "Register", programme: "See the programme", call: "Call the Academy", speaker: "Key speaker", agenda: "Programme" },
} as const;

/**
 * Événement Academy à la une (masterclass) : version complète avec le programme (page Academy)
 * ou version courte qui renvoie vers la page Academy (accueil). Disparaît après la date.
 */
export function AcademyHighlight({ locale, full = false }: { locale: Locale; full?: boolean }) {
  const h = currentHighlight();
  if (!h) return null;
  const l = t[locale];
  const register = `/${locale}/contact?sujet=masterclass&session=${h.start}`;

  return (
    <section id="masterclass" className="scroll-mt-24 px-3 pb-12 md:px-5 md:pb-16">
      {full && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "EducationEvent",
            name: `${h.kicker.fr} ${h.title.join(" ")} : ${h.subtitle.fr}`,
            startDate: `${h.start}T16:00:00+01:00`,
            endDate: `${h.start}T21:00:00+01:00`,
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: { "@type": "Place", name: "Kenzi Tower Hotel", address: { "@type": "PostalAddress", addressLocality: "Casablanca", addressCountry: "MA" } },
            image: `${SITE_URL}${h.speaker.photo}`,
            performer: { "@type": "Person", name: h.speaker.name },
            organizer: { "@id": `${SITE_URL}/#organization` },
            url: `${SITE_URL}/${locale}/academy#masterclass`,
          }}
        />
      )}
      <Reveal className="glass mx-auto grid max-w-7xl gap-8 rounded-[2rem] p-6 md:grid-cols-[1.5fr_1fr] md:items-center md:p-10">
        <div>
          <div className="flex flex-wrap gap-2">
            <Pill className="bg-white/60">{l.badge}</Pill>
            <Pill>{h.kicker[locale]}</Pill>
          </div>
          <h2 className={`display mt-5 leading-[0.95] text-deep ${full ? "text-[clamp(2.4rem,6vw,5rem)]" : "text-[clamp(2rem,4.5vw,3.6rem)]"}`}>
            <span className="block">{h.title[0]}</span>
            <span className="block">
              <span className="iridescent-text inline-block">{h.title[1]}</span>
            </span>
          </h2>
          <p className="mt-4 max-w-xl font-sans text-lg text-deep">{h.subtitle[locale]}</p>
          <ul className="mt-5 flex flex-wrap gap-2 font-sans text-xs text-deep">
            <li className="glass-soft inline-flex items-center gap-1.5 rounded-full px-3 py-1.5">
              <CalendarDays size={13} /> {h.date[locale]}
            </li>
            <li className="glass-soft inline-flex items-center gap-1.5 rounded-full px-3 py-1.5">
              <Clock size={13} /> {h.time[locale]}
            </li>
            <li className="glass-soft inline-flex items-center gap-1.5 rounded-full px-3 py-1.5">
              <MapPin size={13} /> {h.place}
            </li>
          </ul>
          <p className="data-label mt-5 text-deep-soft">
            {h.registration[locale]} · {h.partners[locale]}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Cta href={register}>{l.register}</Cta>
            {full ? (
              <Cta href={`tel:${company.academyPhone.replace(/\s/g, "")}`} variant="line">
                {l.call}
              </Cta>
            ) : (
              <Cta href={`/${locale}/academy#masterclass`} variant="line">
                {l.programme}
              </Cta>
            )}
          </div>
        </div>

        {/* Key speaker */}
        <figure className="glass-strong mx-auto w-full max-w-xs overflow-hidden rounded-[1.5rem] p-3">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.1rem]">
            <Image src={h.speaker.photo} alt={h.speaker.name} fill sizes="(min-width:768px) 320px, 80vw" className="object-cover" />
          </div>
          <figcaption className="px-2 pb-2 pt-4">
            <p className="data-label text-deep-soft">{l.speaker}</p>
            <p className="mt-2 font-sans text-base font-medium leading-snug text-deep">{h.speaker.name}</p>
            <p className="mt-1 font-sans text-xs text-deep-soft">{h.speaker.role[locale]}</p>
            <p className="mt-1 font-sans text-xs text-deep-soft">{h.speaker.expertise[locale]}</p>
          </figcaption>
        </figure>

        {full && (
          <div className="md:col-span-2">
            <h3 className="display text-2xl text-deep md:text-3xl">{l.agenda}</h3>
            <ol className="mt-5 grid gap-x-8 md:grid-cols-2">
              {h.programme.map((p) => (
                <li
                  key={p.time}
                  className={`grid grid-cols-[3.75rem_1fr] gap-3 border-t border-deep/10 py-4 ${p.pause ? "text-deep-soft" : "text-deep"}`}
                >
                  <span className="data-label pt-0.5">{p.time}</span>
                  <span>
                    <span className="block font-sans text-sm font-medium leading-snug">{p.title[locale]}</span>
                    {p.detail && <span className="mt-1 block font-sans text-xs leading-relaxed text-deep-soft">{p.detail[locale]}</span>}
                    {p.by && <span className="data-label mt-1.5 block text-deep-soft">{p.by}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </Reveal>
    </section>
  );
}
