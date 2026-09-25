import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowDown, ArrowRight, CalendarDays, Check, GraduationCap, Mail } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MediaSlot } from "@/components/formations/MediaSlot";
import { VideoCarousel } from "@/components/formations/VideoCarousel";
import { image, video } from "@/lib/images";
import { FormationRequestSection } from "@/components/formations/FormationRequest";
import { NewsletterSignup } from "@/components/formations/NewsletterSignup";
import { RevealOnScroll } from "@/components/formations/RevealOnScroll";
import { JsonLd } from "@/components/JsonLd";
import { getSessions, placesLeft, registrationEnabled, sessionTitle } from "@/lib/sessions";
import { absolute, breadcrumb, physicianId } from "@/lib/seo";
import { formationsPage as f } from "@/content/formations";
import { practice } from "@/content/site";

export const metadata: Metadata = {
  title: "Formations en médecine esthétique pour médecins — Casablanca",
  description:
    "Formations réservées aux médecins, dispensées par le Dr Dadoun à Casablanca (35+ ans d'expérience, formateur depuis 10+ ans) : injectables, lasers médicaux, endolifting. Petits groupes, pratique encadrée.",
  alternates: { canonical: "/formations" },
  openGraph: { url: "/formations" },
};

const section = "mx-auto max-w-6xl px-5 md:px-8";
// Liens vers le formulaire de demande, avec pré-sélection.
const requestLink = (demande: string, formation?: string) =>
  `/formations?demande=${demande}${formation ? `&formation=${formation}` : ""}#demande`;

const pill =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-medium uppercase tracking-wide transition-colors";

// Les sessions viennent d'un Google Sheet : la page est régénérée toutes les 5 minutes.
export const revalidate = 300;

export default async function Formations() {
  const sessions = await getSessions();
  const online = registrationEnabled();

  return (
    <>
      <Header variant="pro" />
      <RevealOnScroll />
      <main>
        {/* 1 — Hero */}
        <section className="p-2 md:p-3">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-ink pb-12 pt-32 text-white md:pb-16 md:pt-44">
            <div className="mesh-4 absolute -right-48 -top-48 h-[36rem] w-[36rem] rounded-full opacity-45 blur-3xl" aria-hidden="true" />
            <div className={`${section} relative grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:items-end`}>
              <div>
                <p className="rise text-xs font-medium uppercase tracking-[0.14em] text-accent">{f.hero.eyebrow}</p>
                <h1 className="rise rise-2 mt-6 font-display text-[2.7rem] font-medium uppercase leading-[0.92] sm:text-7xl lg:text-[5.4rem]">
                  <span className="block">{f.hero.title[0]}</span>
                  <span className="block">{f.hero.title[1]}</span>
                  <span className="block text-accent">{f.hero.title[2]}</span>
                </h1>
                <p className="rise rise-3 mt-8 max-w-lg leading-relaxed text-white/75">{f.hero.text}</p>
                <a href="#formations" className={`rise rise-4 mt-10 bg-white text-ink hover:bg-accent-soft ${pill} group`}>
                  Découvrir les formations
                  <ArrowDown size={14} className="transition-transform duration-300 group-hover:translate-y-0.5" />
                </a>
              </div>

              <div className="rise rise-4">
                <dl className="grid grid-cols-2 border-t border-white/15 lg:grid-cols-1">
                  {f.hero.facts.map((fact) => (
                    <div key={fact.label} className="border-b border-white/15 py-6 pr-4 lg:py-8">
                      <dt className="font-display text-5xl font-medium leading-none md:text-7xl">{fact.value}</dt>
                      <dd className="mt-3 text-xs uppercase tracking-[0.14em] text-white/65">{fact.label}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 flex items-center gap-2 text-xs text-white/60">
                  <GraduationCap size={14} /> {f.hero.audience}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2 — L'expérience au service de la transmission */}
        <section id="transmission" className="scroll-mt-24 py-28 md:py-40">
          <div className={`${section} grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20`}>
            <div data-reveal>
              <MediaSlot
                image={f.transmission.media.image}
                video={f.transmission.media.video}
                label={f.transmission.media.label}
                className="aspect-[4/5] w-full"
                sizes="(min-width:1024px) 45vw, 100vw"
              />
            </div>
            <div data-reveal>
              <p className="eyebrow">Transmission</p>
              <h2 className="mt-5 font-display text-4xl font-medium uppercase leading-[0.98] md:text-[3.4rem]">
                {f.transmission.title[0]}
                <br />
                <span className="text-accent-deep">{f.transmission.title[1]}</span>
              </h2>
              <p className="mt-7 max-w-md leading-relaxed text-ink-soft">{f.transmission.intro}</p>
              <ol className="mt-12 border-t border-line">
                {f.transmission.principles.map((p, i) => (
                  <li key={p.title} className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-line py-5 sm:grid-cols-[2.5rem_11rem_1fr]">
                    <span className="pt-1 text-xs font-medium text-muted">0{i + 1}</span>
                    <h3 className="font-display text-xl font-medium">{p.title}</h3>
                    <p className="col-start-2 mt-1 text-sm leading-relaxed text-ink-soft sm:col-start-3 sm:mt-0.5">{p.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* 3 — Les formations */}
        <section id="formations" className="scroll-mt-24 pb-28 md:pb-40">
          <div className={section}>
            <div className="flex flex-col justify-between gap-6 border-t border-line pt-14 md:flex-row md:items-end" data-reveal>
              <h2 className="font-display text-4xl sm:text-5xl font-medium uppercase leading-[0.95] md:text-7xl">Les formations</h2>
              <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
                Chaque domaine fait l&apos;objet d&apos;une formation à part entière, avec son programme et ses sessions.
              </p>
            </div>
            <ul className="mt-14 grid gap-4 md:grid-cols-3">
              {f.courses.map((c, i) => (
                <li key={c.slug} data-reveal>
                  <Link
                    href={`/formations/${c.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-line p-7 transition-colors md:min-h-60 duration-300 hover:border-ink/25 hover:bg-sand/50 md:p-9"
                  >
                    <span className="text-xs font-medium text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-6 font-display text-3xl font-medium md:mt-10 md:text-4xl">{c.title}</h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">{c.summary}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-8 text-xs font-medium uppercase tracking-wide">
                      Découvrir
                      <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4 — Une formation axée sur la pratique */}
        <section className="pb-28 md:pb-40">
          <div className={`${section} grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20`}>
            <div data-reveal>
              <h2 className="font-display text-4xl font-medium uppercase leading-[0.98] md:text-[3.4rem]">
                {f.practice.title[0]}
                <br />
                <span className="text-accent-deep">{f.practice.title[1]}</span>
              </h2>
              <p className="mt-7 max-w-md leading-relaxed text-ink-soft">{f.practice.text}</p>
              <ul className="mt-10 grid gap-x-8 sm:grid-cols-2">
                {f.practice.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 border-b border-line py-4 text-[0.95rem] font-medium">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-deep">
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-0" data-reveal>
              <VideoCarousel
                items={f.practice.media.flatMap((m) => {
                  const src = video(m.video);
                  return src ? [{ src, poster: image(m.image) ?? undefined, label: m.label }] : [];
                })}
              />
            </div>
          </div>
        </section>

        {/* 5 — Le parcours du Dr Dadoun */}
        <section id="parcours" className="scroll-mt-24 px-2 md:px-3">
          <div className="rounded-[1.75rem] bg-ink py-20 text-white md:py-28">
            <div className={section}>
              <h2 className="font-display text-4xl font-medium uppercase leading-[0.98] md:text-[3.4rem]" data-reveal>
                {f.career.title[0]}
                <br />
                <span className="text-accent">{f.career.title[1]}</span>
              </h2>

              <dl className="mt-14 grid grid-cols-2 border-t border-white/15 md:grid-cols-4" data-reveal>
                {f.career.facts.map((fact) => (
                  <div key={fact.label} className="border-b border-white/15 py-7 pr-4 md:border-b-0">
                    <dt className="font-display text-3xl font-medium md:text-5xl">{fact.value}</dt>
                    <dd className="mt-2 text-xs uppercase tracking-[0.14em] text-white/60">{fact.label}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-16 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
                <div data-reveal>
                  <MediaSlot
                    image={f.career.media.image}
                    label={f.career.media.label}
                    tone="dark"
                    position="object-[50%_15%]"
                    className="aspect-[4/5] w-full max-w-sm"
                    sizes="(min-width:1024px) 40vw, 100vw"
                  />
                </div>
                <ol className="relative border-l border-white/15 pl-8" data-reveal>
                  {f.career.steps.length > 0 ? (
                    f.career.steps.map((s) => (
                      <li key={s.title} className="relative pb-10 last:pb-0">
                        <span className="absolute -left-[2.3rem] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
                        {s.period && <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">{s.period}</p>}
                        <h3 className="mt-1 font-display text-xl font-medium">{s.title}</h3>
                        {s.detail && <p className="mt-1 text-sm leading-relaxed text-white/65">{s.detail}</p>}
                      </li>
                    ))
                  ) : (
                    <>
                      {[
                        { title: "Médecine esthétique", detail: "Plus de 35 ans d'expérience." },
                        { title: "Lasers médicaux", detail: "Lasériste." },
                        { title: "Transmission", detail: "Formateur de médecins depuis plus de 10 ans." },
                      ].map((s) => (
                        <li key={s.title} className="relative pb-10 last:pb-0">
                          <span className="absolute -left-[2.3rem] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
                          <h3 className="font-display text-xl font-medium">{s.title}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-white/65">{s.detail}</p>
                        </li>
                      ))}
                    </>
                  )}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* 6 — Prochaines formations */}
        <section id="sessions" className="scroll-mt-24 py-28 md:py-40">
          <div className={section}>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end" data-reveal>
              <h2 className="font-display text-4xl font-medium uppercase leading-[0.98] md:text-[3.4rem]">
                Prochaines
                <br />
                <span className="text-accent-deep">formations</span>
              </h2>
            </div>

            {sessions.length > 0 ? (
              <ul className="mt-12 border-t border-line" data-reveal>
                {sessions.map((s) => (
                  <li
                    key={`${s.course ?? s.title}-${s.date}`}
                    className="grid gap-2 border-b border-line py-6 md:grid-cols-[1.3fr_1fr_0.8fr_1.4fr_7rem] md:items-center md:gap-6"
                  >
                    <p className="font-display text-xl font-medium">{sessionTitle(s)}</p>
                    <p className="flex items-center gap-2 text-sm"><CalendarDays size={14} className="text-accent-deep" /> {s.date}</p>
                    <p className="text-sm text-ink-soft">{s.place}</p>
                    <p className="text-sm text-ink-soft">
                      {s.format}
                      {placesLeft(s) !== undefined && s.status !== "full" && (
                        <span className="mt-1 block text-xs font-medium text-accent-deep">
                          {placesLeft(s)} place{placesLeft(s)! > 1 ? "s" : ""} restante{placesLeft(s)! > 1 ? "s" : ""}
                        </span>
                      )}
                    </p>
                    {s.status === "full" ? (
                      <span className="text-xs font-medium uppercase tracking-wide text-muted">Complet</span>
                    ) : (
                      <Link
                        href={online && s.id ? `/formations/inscription/${s.id}` : requestLink("inscription", s.course)}
                        className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide"
                      >
                        S&apos;inscrire <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-12 flex items-center gap-4 border-y border-line py-8 font-display text-xl font-medium md:text-2xl" data-reveal>
                <CalendarDays size={22} strokeWidth={1.5} className="shrink-0 text-accent-deep" />
                {f.sessions.empty}
              </p>
            )}

            {/* Newsletter Cellulift Academy */}
            <div id="newsletter" className="mt-10 scroll-mt-28 rounded-2xl bg-sand p-6 md:p-10" data-reveal>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-accent-deep" />
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent-deep">Newsletter {f.newsletter.name}</p>
              </div>
              <h3 className="mt-4 font-display text-2xl font-medium md:text-3xl">{f.newsletter.title}</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">{f.newsletter.text}</p>
              <div className="mt-6">
                <NewsletterSignup name={f.newsletter.name} consent={f.newsletter.consent} specialties={f.request.professions} />
              </div>
            </div>
          </div>
        </section>

        {/* 7 — Demande (formulaire) */}
        <section id="demande" className="scroll-mt-24 pb-24 md:pb-32">
          <div className={`${section} border-t border-line pt-20 md:pt-28`}>
            <div className="mx-auto max-w-3xl text-center" data-reveal>
              <h2 className="font-display text-4xl font-medium uppercase leading-[0.98] md:text-6xl">
                {f.request.title[0]}
                <br />
                <span className="text-accent-deep">{f.request.title[1]}</span>
              </h2>
              <p className="mx-auto mt-6 max-w-md leading-relaxed text-ink-soft">{f.request.text}</p>
            </div>
            <div className="mx-auto mt-12 max-w-3xl">
              <Suspense>
                <FormationRequestSection
                  courses={f.courses.map((c) => ({ slug: c.slug, title: c.title }))}
                  kinds={f.request.kinds}
                  professions={f.request.professions}
                  phone={practice.phone}
                />
              </Suspense>
            </div>
          </div>
        </section>
      </main>
      <Footer variant="pro" />
      <JsonLd data={breadcrumb([{ name: "Accueil", path: "/" }, { name: "Formations", path: "/formations" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Formations pour médecins du Dr Dadoun",
          itemListElement: f.courses.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Course",
              name: `Formation ${c.title}`,
              description: c.summary,
              url: absolute(`/formations/${c.slug}`),
              provider: { "@id": physicianId },
              audience: { "@type": "Audience", audienceType: "Médecins" },
              inLanguage: "fr",
            },
          })),
        }}
      />
    </>
  );
}
