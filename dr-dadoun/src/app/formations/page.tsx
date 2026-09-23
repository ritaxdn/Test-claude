import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, Check, GraduationCap, Mail } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MediaSlot } from "@/components/formations/MediaSlot";
import { RevealOnScroll } from "@/components/formations/RevealOnScroll";
import { formationsPage as f } from "@/content/formations";
import { practice } from "@/content/site";

export const metadata: Metadata = {
  title: "Formations professionnelles",
  description:
    "Formations du Dr Dadoun pour les médecins et professionnels de santé : anatomie appliquée, injectables, lasers médicaux, endolifting.",
};

const section = "mx-auto max-w-6xl px-5 md:px-8";
const mailto = (subject: string) => `mailto:${practice.email}?subject=${encodeURIComponent(subject)}`;

const pill =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-medium uppercase tracking-wide transition-colors";

export default function Formations() {
  const courseTitle = (slug: string) => f.courses.find((c) => c.slug === slug)?.title ?? slug;

  return (
    <>
      <Header />
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
                      <dt className="font-display text-6xl font-medium leading-none md:text-7xl">{fact.value}</dt>
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
        <section className="py-28 md:py-40">
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
              <h2 className="font-display text-5xl font-medium uppercase leading-[0.95] md:text-7xl">Les formations</h2>
              <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
                Chaque domaine fait l&apos;objet d&apos;une formation à part entière, avec son programme et ses sessions.
              </p>
            </div>
            <ul className="mt-14 grid gap-4 md:grid-cols-2">
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
            <div data-reveal>
              <MediaSlot
                image={f.practice.media.image}
                label={f.practice.media.label}
                className="aspect-[4/3] w-full"
                sizes="(min-width:1024px) 50vw, 100vw"
              />
            </div>
          </div>
        </section>

        {/* 5 — Le parcours du Dr Dadoun */}
        <section className="px-2 md:px-3">
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
                        { title: "Transmission", detail: "Formateur de professionnels de santé depuis plus de 10 ans." },
                      ].map((s) => (
                        <li key={s.title} className="relative pb-10">
                          <span className="absolute -left-[2.3rem] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
                          <h3 className="font-display text-xl font-medium">{s.title}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-white/65">{s.detail}</p>
                        </li>
                      ))}
                      <li className="relative">
                        <span className="absolute -left-[2.3rem] top-1.5 h-2.5 w-2.5 rounded-full border border-white/40 bg-ink" aria-hidden="true" />
                        <p className="text-sm text-white/50">{f.career.pendingNote}</p>
                      </li>
                    </>
                  )}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* 6 — Prochaines formations */}
        <section className="py-28 md:py-40">
          <div className={section}>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end" data-reveal>
              <h2 className="font-display text-4xl font-medium uppercase leading-[0.98] md:text-[3.4rem]">
                Prochaines
                <br />
                <span className="text-accent-deep">formations</span>
              </h2>
              {f.sessions.list.length > 0 && (
                <a href={mailto(f.mail.sessions)} className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide underline decoration-accent underline-offset-4">
                  Être informé des prochaines sessions <ArrowUpRight size={14} />
                </a>
              )}
            </div>

            {f.sessions.list.length > 0 ? (
              <ul className="mt-12 border-t border-line" data-reveal>
                {f.sessions.list.map((s) => (
                  <li
                    key={`${s.course}-${s.date}`}
                    className="grid gap-2 border-b border-line py-6 md:grid-cols-[1.3fr_1fr_0.8fr_1.4fr_7rem] md:items-center md:gap-6"
                  >
                    <p className="font-display text-xl font-medium">{courseTitle(s.course)}</p>
                    <p className="flex items-center gap-2 text-sm"><CalendarDays size={14} className="text-accent-deep" /> {s.date}</p>
                    <p className="text-sm text-ink-soft">{s.place}</p>
                    <p className="text-sm text-ink-soft">{s.format}</p>
                    {s.status === "full" ? (
                      <span className="text-xs font-medium uppercase tracking-wide text-muted">Complet</span>
                    ) : (
                      <a
                        href={mailto(`Inscription — ${courseTitle(s.course)} — ${s.date}`)}
                        className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide"
                      >
                        S&apos;inscrire <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div
                className="mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl border border-dashed border-ink/20 p-8 md:flex-row md:items-center md:p-10"
                data-reveal
              >
                <div className="flex items-center gap-4">
                  <CalendarDays size={22} strokeWidth={1.5} className="shrink-0 text-accent-deep" />
                  <p className="font-display text-xl font-medium md:text-2xl">{f.sessions.empty}</p>
                </div>
                <a href={mailto(f.mail.sessions)} className={`${pill} shrink-0 bg-ink text-white hover:bg-accent-deep`}>
                  <Mail size={14} /> Être informé des prochaines sessions
                </a>
              </div>
            )}
          </div>
        </section>

        {/* 7 — CTA final */}
        <section className="pb-24 md:pb-32">
          <div className={`${section} border-t border-line pt-20 text-center md:pt-28`} data-reveal>
            <h2 className="mx-auto max-w-4xl font-display text-4xl font-medium uppercase leading-[0.98] md:text-6xl">
              {f.final.title[0]}
              <br />
              <span className="text-accent-deep">{f.final.title[1]}</span>
            </h2>
            <p className="mx-auto mt-6 max-w-md leading-relaxed text-ink-soft">{f.final.text}</p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={mailto(f.mail.program)} className={`${pill} bg-ink text-white hover:bg-accent-deep`}>
                Demander le programme <ArrowUpRight size={14} />
              </a>
              <a href={mailto(f.mail.sessions)} className={`${pill} border border-ink/15 bg-white text-ink hover:border-ink`}>
                Être informé des prochaines sessions
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
