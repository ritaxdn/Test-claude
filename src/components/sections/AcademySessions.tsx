import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Heading } from "@/components/system/Heading";
import { Cta } from "@/components/system/Cta";
import type { Locale } from "@/lib/i18n/config";
import { academyCalendarUrl, upcomingSessions } from "@/content/academy-sessions";
import { company } from "@/content/company";
import { InstagramIcon } from "@/components/icons/SocialIcons";

const t = {
  fr: { register: "S'inscrire", full: "Complet", seats: "places", onRequest: "Inscription sur demande", empty: "Les prochaines dates seront annoncées prochainement.", calendar: "Voir tout le calendrier" },
  en: { register: "Register", full: "Full", seats: "seats", onRequest: "Registration on request", empty: "Upcoming dates will be announced soon.", calendar: "See the full calendar" },
} as const;

const MONTHS = {
  fr: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

/** Prochaines formations : date, intitulé, intervenant, lieu, horaire, places, inscription. */
export function AcademySessions({ locale, eyebrow, title }: { locale: Locale; eyebrow: string; title: string }) {
  const l = t[locale];
  const sessions = upcomingSessions();
  return (
    <section id="sessions" className="scroll-mt-24 px-3 pb-12 md:px-5 md:pb-16">
      <div className="mx-auto max-w-7xl px-3 md:px-7">
        <Heading eyebrow={eyebrow} title={title} />
        {sessions.length === 0 ? (
          <Reveal className="glass mt-8 flex items-center gap-3 rounded-[1.75rem] p-7 font-sans text-deep">
            <CalendarDays size={18} /> {l.empty}
          </Reveal>
        ) : (
          <Reveal className="mt-8 space-y-3">
            {sessions.map((s) => {
              const [, m, d] = s.start.split("-");
              const contact = `/${locale}/contact`;
              return (
                <article
                  key={s.start + s.title}
                  className="glass grid gap-5 rounded-[1.75rem] p-5 md:grid-cols-[5.5rem_1fr_auto] md:items-center md:gap-8 md:p-6"
                >
                  <div className="glass-strong hidden w-full flex-col items-center rounded-2xl py-3 text-deep md:flex">
                    <span className="display text-3xl leading-none">{d}</span>
                    <span className="data-label mt-1 text-deep-soft">{MONTHS[locale][Number(m) - 1]}</span>
                  </div>

                  <div>
                    <h3 className="font-sans text-lg font-medium leading-snug text-deep">{s.title}</h3>
                    {s.subtitle && <p className="mt-1 font-sans text-sm text-deep-soft">{s.subtitle}</p>}
                    <ul className="mt-3 flex flex-wrap gap-2 font-sans text-xs text-deep">
                      <li className="glass-soft inline-flex items-center gap-1.5 rounded-full px-3 py-1.5">
                        <CalendarDays size={13} /> {s.date[locale]}
                      </li>
                      {s.place && (
                        <li className="glass-soft inline-flex items-center gap-1.5 rounded-full px-3 py-1.5">
                          <MapPin size={13} /> {s.place}
                        </li>
                      )}
                      {s.time && (
                        <li className="glass-soft inline-flex items-center gap-1.5 rounded-full px-3 py-1.5">
                          <Clock size={13} /> {s.time[locale]}
                        </li>
                      )}
                      {s.seats && (
                        <li className="glass-soft inline-flex items-center gap-1.5 rounded-full px-3 py-1.5">
                          <Users size={13} /> {s.seats} {l.seats}
                        </li>
                      )}
                    </ul>
                  </div>

                  {s.status === "full" ? (
                    <span className="data-label text-deep-soft">{l.full}</span>
                  ) : s.link ? (
                    <Link
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-strong group inline-flex items-center justify-between gap-4 self-start whitespace-nowrap rounded-full py-2 pl-5 pr-2 font-sans text-sm text-deep transition-colors hover:bg-white md:self-center"
                    >
                      {l.register}
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 transition-transform group-hover:rotate-45">
                        <ArrowUpRight size={14} />
                      </span>
                    </Link>
                  ) : (
                    <Link href={contact} className="self-start font-sans text-sm text-deep underline-offset-4 hover:underline md:self-center">
                      {l.onRequest}
                    </Link>
                  )}
                </article>
              );
            })}
          </Reveal>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Cta href={academyCalendarUrl} variant="line">{l.calendar}</Cta>
          <a
            href={company.social.instagramAcademy.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-soft inline-flex items-center gap-2 self-start rounded-full px-4 py-2.5 font-sans text-sm text-deep transition-colors hover:bg-white sm:self-auto"
          >
            <InstagramIcon /> {company.social.instagramAcademy.handle}
          </a>
        </div>
      </div>
    </section>
  );
}
