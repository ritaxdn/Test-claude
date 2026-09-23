import { ArrowUpRight, Clock, MapPin, Phone, Mail, Plus } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { BookingCalendar } from "@/components/BookingCalendar";
import { articles, expertise } from "@/content/journal";
import {
  about,
  doctor,
  faq,
  hero,
  practice,
  principles,
  steps,
  treatments,
} from "@/content/site";

function BookingButton({ variant = "dark" }: { variant?: "dark" | "light" }) {
  return (
    <a
      href={practice.bookingUrl}
      className={`group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-colors ${
        variant === "dark"
          ? "bg-ink text-porcelain hover:bg-accent-deep"
          : "bg-porcelain text-ink hover:bg-accent-soft"
      }`}
    >
      Prendre rendez-vous
      <ArrowUpRight
        size={16}
        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </a>
  );
}

function SectionTitle({ eyebrow, title, light }: { eyebrow: string; title: string; light?: boolean }) {
  return (
    <div className="max-w-2xl">
      <p className={`eyebrow ${light ? "!text-accent-soft" : ""}`}>{eyebrow}</p>
      <h2 className="mt-4 font-display text-4xl leading-[1.1] md:text-5xl">{title}</h2>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        {/* Hero */}
        <section className="relative overflow-hidden pt-28 md:pt-36">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 md:px-8 lg:grid-cols-[1.15fr_1fr] lg:pb-28">
            <div>
              <p className="eyebrow rise">{hero.eyebrow}</p>
              <h1 className="rise rise-2 mt-6 font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                {hero.title[0]}
                <br />
                <em className="text-accent-deep">{hero.title[1]}</em>
              </h1>
              <p className="rise rise-3 mt-7 max-w-lg text-lg leading-relaxed text-ink-soft">
                {hero.text}
              </p>
              <div className="rise rise-4 mt-10 flex flex-wrap items-center gap-4">
                <BookingButton />
                <a
                  href="#soins"
                  className="rounded-full border border-ink/20 px-7 py-3.5 text-sm font-medium transition-colors hover:border-ink"
                >
                  Découvrir les soins
                </a>
              </div>
            </div>

            <div className="rise rise-3 relative mx-auto w-full max-w-md">
              <div className="halo aspect-[4/5] w-full rounded-t-full" aria-hidden="true">
                {/* À COMPLÉTER : remplacer par un portrait du Dr Dadoun ou une photo du cabinet */}
                <div className="flex h-full items-end justify-center pb-16">
                  <span className="font-display text-[9rem] italic leading-none text-porcelain/80">D</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-4 rounded-2xl bg-porcelain px-6 py-5 shadow-[0_20px_50px_-20px_rgba(11,42,51,0.35)] sm:-left-10">
                <p className="font-display text-xl italic">{doctor.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">{doctor.title}</p>
              </div>
            </div>
          </div>

          <div className="border-y border-line">
            <dl className="mx-auto grid max-w-6xl divide-y divide-line px-5 md:grid-cols-3 md:divide-x md:divide-y-0 md:px-8">
              {hero.facts.map((f) => (
                <div key={f.value} className="py-6 md:px-8 md:first:pl-0">
                  <dt className="font-display text-2xl italic">{f.value}</dt>
                  <dd className="mt-1 text-sm text-muted">{f.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Le docteur */}
        <section id="docteur" className="py-24 md:py-32">
          <div className="mx-auto grid max-w-6xl gap-14 px-5 md:px-8 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionTitle eyebrow="Le Docteur" title={about.title} />
              <div className="mt-8 space-y-5 text-[1.05rem] leading-relaxed text-ink-soft">
                {about.paragraphs.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-between gap-10">
              <blockquote className="border-l-2 border-accent pl-6 font-display text-3xl italic leading-snug">
                « {about.quote} »
              </blockquote>
              <div className="rounded-3xl bg-sand p-8">
                <p className="eyebrow">Formation</p>
                <ul className="mt-5 space-y-4">
                  {about.credentials.map((c) => (
                    <li key={c} className="flex gap-4 text-sm leading-relaxed text-ink-soft">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Soins */}
        <section id="soins" className="bg-sand/60 py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionTitle eyebrow="Les soins" title="Des traitements médicaux, adaptés à chacun" />
              <p className="max-w-sm text-ink-soft">
                Chaque soin est précédé d&apos;une consultation médicale afin de vérifier son
                indication et l&apos;absence de contre-indication.
              </p>
            </div>

            <div className="mt-16 space-y-16">
              {treatments.map((cat, i) => (
                <div key={cat.id} className="grid gap-8 border-t border-line pt-10 lg:grid-cols-[1fr_2.4fr]">
                  <div>
                    <span className="font-display text-sm italic text-accent-deep">0{i + 1}</span>
                    <h3 className="mt-2 font-display text-3xl">{cat.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{cat.intro}</p>
                  </div>
                  <div className="grid gap-5 md:grid-cols-3">
                    {cat.treatments.map((t) => (
                      <article
                        key={t.name}
                        className="flex flex-col rounded-3xl bg-porcelain p-7 transition-shadow duration-300 hover:shadow-[0_24px_50px_-28px_rgba(11,42,51,0.4)]"
                      >
                        <h4 className="font-display text-xl">{t.name}</h4>
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{t.description}</p>
                        <dl className="mt-6 space-y-2 border-t border-line pt-5 text-xs">
                          <div className="flex justify-between gap-3">
                            <dt className="text-muted">Durée</dt>
                            <dd className="text-right font-medium">{t.duration}</dd>
                          </div>
                          <div className="flex justify-between gap-3">
                            <dt className="text-muted">Suites</dt>
                            <dd className="text-right font-medium">{t.downtime}</dd>
                          </div>
                        </dl>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Approche */}
        <section id="approche" className="bg-ink py-24 text-porcelain md:py-32">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <SectionTitle light eyebrow="L'approche" title="Quatre engagements, à chaque rendez-vous" />
            <div className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-porcelain/15 sm:grid-cols-2 lg:grid-cols-4">
              {principles.map((p, i) => (
                <div key={p.title} className="bg-ink p-8">
                  <span className="font-display text-5xl italic text-accent">{i + 1}</span>
                  <h3 className="mt-6 font-display text-2xl">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-porcelain/70">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Parcours */}
        <section id="parcours" className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <SectionTitle eyebrow="Votre parcours" title="De la première consultation au suivi" />
            <ol className="mt-16 grid gap-10 md:grid-cols-4 md:gap-8">
              {steps.map((s, i) => (
                <li key={s.title} className="relative">
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent font-display text-lg italic text-accent-deep">
                      {i + 1}
                    </span>
                    <span className="hidden h-px flex-1 bg-line md:block" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Le savoir */}
        <section id="savoir" className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionTitle eyebrow="Le savoir" title="Une expertise médicale, partagée avec vous" />
              <Link
                href="/journal"
                className="inline-flex items-center gap-1.5 text-sm font-medium underline decoration-accent underline-offset-4"
              >
                Tous les articles du Journal <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {expertise.map((e) => (
                <div key={e.title} className="bg-porcelain p-7">
                  <h3 className="font-display text-xl">{e.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{e.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {articles.slice(0, 3).map((a, i) => (
                <ArticleCard key={a.slug} article={a} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-line py-24 md:py-32">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 md:px-8 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <SectionTitle eyebrow="Questions fréquentes" title="Vos questions, nos réponses" />
              <p className="mt-6 text-ink-soft">
                Une autre question ? Le cabinet vous répond par téléphone au{" "}
                <a href={`tel:${practice.phoneHref}`} className="underline decoration-accent underline-offset-4">
                  {practice.phone}
                </a>
                .
              </p>
            </div>
            <div className="divide-y divide-line border-y border-line">
              {faq.map((item) => (
                <details key={item.q} className="group py-6">
                  <summary className="flex cursor-pointer items-start justify-between gap-6 font-display text-xl">
                    {item.q}
                    <Plus size={20} className="faq-icon mt-1 shrink-0 text-accent-deep transition-transform" />
                  </summary>
                  <p className="mt-4 pr-10 leading-relaxed text-ink-soft">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Rendez-vous */}
        <section id="rendez-vous" className="bg-sand/60 py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionTitle eyebrow="Rendez-vous en ligne" title="Choisissez votre créneau" />
              <p className="max-w-sm text-ink-soft">
                Sélectionnez le motif, le jour et l&apos;heure : le cabinet vous confirme le rendez-vous
                sous 24 h ouvrées.
              </p>
            </div>
            <div className="mt-12">
              <BookingCalendar />
            </div>
          </div>
        </section>

        {/* Cabinet */}
        <section id="cabinet" className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <SectionTitle eyebrow="Le cabinet" title="Vous accueillir au cœur de Paris" />
            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl border border-line p-8">
                <MapPin size={20} className="text-accent-deep" />
                <h3 className="mt-5 font-display text-2xl">Adresse</h3>
                <p className="mt-3 text-ink-soft">
                  {practice.addressLine1}
                  <br />
                  {practice.addressLine2}
                </p>
                <ul className="mt-5 space-y-1.5 text-sm text-muted">
                  {practice.access.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
                <a
                  href={practice.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium underline decoration-accent underline-offset-4"
                >
                  Itinéraire <ArrowUpRight size={14} />
                </a>
              </div>

              <div className="rounded-3xl border border-line p-8">
                <Clock size={20} className="text-accent-deep" />
                <h3 className="mt-5 font-display text-2xl">Horaires</h3>
                <dl className="mt-3 space-y-3">
                  {practice.hours.map((h) => (
                    <div key={h.day} className="flex justify-between gap-4 border-b border-line/70 pb-3 text-sm">
                      <dt className="text-ink-soft">{h.day}</dt>
                      <dd className="font-medium">{h.time}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 text-sm text-muted">Consultations sur rendez-vous uniquement.</p>
              </div>

              <div className="flex flex-col rounded-3xl bg-ink p-8 text-porcelain">
                <h3 className="font-display text-2xl">Prendre rendez-vous</h3>
                <p className="mt-3 text-sm leading-relaxed text-porcelain/70">
                  Réservez votre consultation en ligne ou contactez le secrétariat.
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  <li>
                    <a href={`tel:${practice.phoneHref}`} className="inline-flex items-center gap-3 hover:text-accent-soft">
                      <Phone size={16} /> {practice.phone}
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${practice.email}`} className="inline-flex items-center gap-3 hover:text-accent-soft">
                      <Mail size={16} /> {practice.email}
                    </a>
                  </li>
                </ul>
                <div className="mt-auto pt-8">
                  <BookingButton variant="light" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
