import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, MapPin, Phone } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Photo } from "@/components/Photo";
import { InstagramIcon } from "@/components/InstagramIcon";
import { Reassurance } from "@/components/Reassurance";
import { about, doctor, hero, philosophy, practice, universes } from "@/content/site";
import { formationsPage } from "@/content/formations";
import { image } from "@/lib/images";
import { absolute, breadcrumb, physicianId } from "@/lib/seo";

const title = `${doctor.fullName} — ${doctor.role} à ${practice.city}`;

export const metadata: Metadata = {
  title: { absolute: title },
  description: `${doctor.fullName}, ${doctor.role.toLowerCase()} à ${practice.city} (${practice.addressLine1}). Plus de 35 ans d'expérience, formateur de médecins. Parcours, méthode et reconnaissances.`,
  alternates: { canonical: doctor.path },
  openGraph: { url: doctor.path, title, type: "profile" },
};

const section = "mx-auto max-w-6xl px-5 md:px-8";
const pill =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-medium uppercase tracking-wide transition-colors";
const label = "text-xs font-medium uppercase tracking-[0.14em] text-accent-deep";

export default function DoctorPage() {
  const openHours = practice.hours.filter((h) => h.time !== "Fermé");
  return (
    <>
      <Header />
      <main>
        {/* Identité */}
        <section className="px-2 pt-2 md:px-3 md:pt-3">
          <div className="rounded-[1.75rem] bg-sand pb-16 pt-32 md:pb-24 md:pt-40">
            <div className={`${section} grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20`}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Photo src={image("docteur.jpg")} alt={`Portrait du ${doctor.fullName}`} fallback={2} priority sizes="(min-width:1024px) 40vw, 100vw" className="object-[50%_15%]" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="eyebrow">{practice.city} · Quartier des Hôpitaux</p>
                <h1 className="mt-4 font-display text-4xl font-medium leading-[1.02] sm:text-5xl md:text-6xl">{doctor.fullName}</h1>
                <p className="mt-3 text-lg text-accent-deep">{doctor.role}</p>
                <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft">{philosophy.intro}</p>

                <dl className="mt-8 grid grid-cols-2 gap-3 sm:max-w-md">
                  {hero.stats.map((s) => (
                    <div key={s.label} className="rounded-2xl border border-ink/10 bg-white/60 p-4">
                      <dt className="text-xs text-ink-soft">{s.label}</dt>
                      <dd className="mt-1 font-display text-3xl font-medium">{s.value}</dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-8 space-y-2 text-sm text-ink-soft">
                  <li className="flex items-start gap-3">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-accent-deep" />
                    <span>
                      Cabinet : {practice.addressLine1}, {practice.addressLine2}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock size={16} className="mt-0.5 shrink-0 text-accent-deep" />
                    <span>{openHours.map((h) => `${h.day} ${h.time}`).join(" · ")}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone size={16} className="shrink-0 text-accent-deep" />
                    <a href={`tel:${practice.phoneHref}`} className="hover:text-ink">{practice.phone}</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="shrink-0 text-accent-deep"><InstagramIcon size={16} /></span>
                    <a href={practice.instagram.url} target="_blank" rel="noopener noreferrer me" className="hover:text-ink">
                      {practice.instagram.handle}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Méthode */}
        <section className={`${section} grid gap-10 py-20 md:py-28 lg:grid-cols-[1fr_2fr] lg:gap-16`}>
          <div>
            <h2 className="font-display text-3xl font-medium uppercase leading-none md:text-4xl">
              {about.title[0]} {about.title[1]}
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">« {about.quote} »</p>
          </div>
          <ol className="border-t border-line">
            {philosophy.method.map((m, i) => (
              <li key={m.title} className="grid grid-cols-[2.25rem_1fr] gap-x-3 border-b border-line py-4 sm:grid-cols-[2.25rem_9rem_1fr]">
                <span className="pt-0.5 text-xs font-medium text-muted">0{i + 1}</span>
                <p className="font-display text-lg font-medium">{m.title}</p>
                <p className="col-start-2 text-sm leading-relaxed text-ink-soft sm:col-start-3">{m.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Reconnaissances, parcours, interventions */}
        <section className="bg-sand/60 py-20 md:py-28">
          <div className={`${section} grid gap-14 lg:grid-cols-2 lg:gap-16`}>
            {about.affiliations.length > 0 && (
              <div>
                <h2 className={label}>Reconnaissances</h2>
                <ul className="mt-4 border-t border-ink/10">
                  {about.affiliations.map((a) => (
                    <li key={a.org} className="border-b border-ink/10 py-4">
                      <p className="font-display text-lg font-medium">{a.org}</p>
                      <p className="text-sm text-ink-soft">{a.role}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {about.education.length > 0 && (
              <div>
                <h2 className={label}>Parcours & diplômes</h2>
                <ul className="mt-4 border-t border-ink/10">
                  {about.education.map((e) => (
                    <li key={e.title} className="border-b border-ink/10 py-4">
                      <p className="font-display text-lg font-medium">{e.title}</p>
                      <p className="text-sm text-ink-soft">{[e.period, e.place].filter(Boolean).join(" · ")}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {about.talks.length > 0 && (
              <div>
                <h2 className={label}>Conférences & interventions</h2>
                <ul className="mt-4 border-t border-ink/10">
                  {about.talks.map((t) => (
                    <li key={`${t.year}-${t.title}`} className="border-b border-ink/10 py-4">
                      <p className="font-display text-lg font-medium">
                        {t.url ? (
                          <a href={t.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent-deep">{t.title}</a>
                        ) : (
                          t.title
                        )}
                      </p>
                      <p className="text-sm text-ink-soft">{[t.event, t.place, t.year].filter(Boolean).join(" · ")}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h2 className={label}>Enseignement</h2>
              <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
                Formateur de médecins depuis plus de 10 ans : formations pratiques réservées aux médecins, en petits groupes.
              </p>
              <ul className="mt-4 border-t border-ink/10">
                {formationsPage.courses.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/formations/${c.slug}`} className="group flex items-center justify-between gap-4 border-b border-ink/10 py-4 hover:text-accent-deep">
                      <span className="font-medium">{c.title}</span>
                      <ArrowRight size={16} className="shrink-0 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Domaines + rendez-vous */}
        <section className={`${section} py-20 md:py-28`}>
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white p-8 md:p-10">
              <h2 className="font-display text-2xl font-medium md:text-3xl">Domaines de soin</h2>
              <ul className="mt-6 border-t border-line">
                {universes.map((u) => (
                  <li key={u.slug}>
                    <Link href={`/soins/${u.slug}`} className="group flex items-center justify-between gap-4 border-b border-line py-4 hover:text-accent-deep">
                      <span>
                        <span className="font-medium">{u.title}</span>
                        <span className="block text-sm text-ink-soft">{u.tagline}</span>
                      </span>
                      <ArrowRight size={16} className="shrink-0 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-between rounded-2xl bg-ink p-8 text-white md:p-10">
              <div>
                <h2 className="text-balance font-display text-2xl font-medium md:text-3xl">Consulter le {doctor.name}</h2>
                <p className="mt-4 text-sm leading-relaxed text-white/70">
                  {practice.addressLine1}, {practice.addressLine2}.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-2 sm:flex-row">
                <a href={practice.bookingUrl} className={`${pill} bg-white text-ink hover:bg-accent-soft`}>
                  <CalendarDays size={14} /> Prendre rendez-vous
                </a>
                <a href={`tel:${practice.phoneHref}`} className={`${pill} border border-white/30 text-white hover:bg-white/10`}>
                  <Phone size={14} /> {practice.phone}
                </a>
              </div>
              <Reassurance tone="dark" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd
        data={breadcrumb([
          { name: "Accueil", path: "/" },
          { name: doctor.fullName, path: doctor.path },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          name: title,
          url: absolute(doctor.path),
          inLanguage: "fr-MA",
          isPartOf: { "@id": absolute("/#site") },
          mainEntity: { "@id": physicianId },
        }}
      />
    </>
  );
}
