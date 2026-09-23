import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  CalendarDays,
  Clock,
  Mail,
  MapPin,
  Mouse,
  Phone,
  Plus,
  Search,
  type LucideIcon,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Photo } from "@/components/Photo";
import { Highlights } from "@/components/Highlights";
import { BookingCalendar } from "@/components/BookingCalendar";
import { image, video } from "@/lib/images";
import {
  about,
  doctor,
  faq,
  hero,
  highlights,
  practice,
  philosophy,
  pillars,
  steps,
  training,
  treatments,
  universes,
} from "@/content/site";


function PillLink({
  href,
  children,
  variant = "dark",
  icon: Icon,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "dark" | "light" | "accent";
  icon?: LucideIcon;
}) {
  const styles = {
    dark: "bg-ink text-white hover:bg-accent-deep",
    light: "border border-ink/15 bg-white text-ink hover:border-ink",
    accent: "bg-accent text-ink hover:bg-accent-soft",
  };
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-medium uppercase tracking-wide transition-colors ${styles[variant]}`}
    >
      {Icon && <Icon size={14} />}
      {children}
    </a>
  );
}

function SectionTitle({ title, text, light }: { title: React.ReactNode; text?: string; light?: boolean }) {
  return (
    <div className="max-w-xl">
      <h2 className="font-display text-4xl font-medium leading-[1.05] md:text-5xl">{title}</h2>
      {text && (
        <p className={`mt-5 text-[0.95rem] leading-relaxed ${light ? "text-white/70" : "text-ink-soft"}`}>{text}</p>
      )}
    </div>
  );
}

const section = "mx-auto max-w-6xl px-5 md:px-8";

export default function Home() {
  const heroVideo = video("hero.mp4");
  const heroPoster = video("hero-poster.jpg");
  // Petit écran : visage réduit, centré à droite, en filigrane. Grand écran : à droite, pleine hauteur.
  const heroMedia =
    "absolute right-[-14%] top-[47%] aspect-square w-[72%] max-w-[480px] object-cover opacity-30 sm:right-[-2%] sm:top-[40%] sm:w-[55%] lg:inset-y-0 lg:right-0 lg:top-0 lg:h-full lg:w-auto lg:max-w-none lg:opacity-100";

  return (
    <>
      <Header />
      <main id="top">
        {/* ——— Hero ——— */}
        <section className="p-2 md:p-3">
          <div
            className={`relative flex min-h-[640px] flex-col overflow-hidden rounded-[1.75rem] md:min-h-[760px] lg:h-[calc(100svh-1.5rem)] ${
              heroVideo ? "border border-line bg-white text-ink" : "text-white"
            }`}
          >
            {heroVideo ? (
              <>
                {/* Vidéo sur fond noir inversée en CSS : fond blanc, tracés cyan.
                    Plein cadre atténué sur mobile, à droite en pleine hauteur sur grand écran. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroPoster ?? undefined} alt="" aria-hidden="true" className={`media-inverted ${heroMedia}`} />
                <video
                  className={`hero-video media-inverted ${heroMedia}`}
                  src={heroVideo}
                  poster={heroPoster ?? undefined}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  aria-hidden="true"
                />
                <div className="absolute inset-0 hidden lg:block lg:bg-gradient-to-r lg:from-white lg:from-35% lg:via-white/40 lg:via-55% lg:to-transparent" />
              </>
            ) : (
              <>
                <Photo src={image("hero.jpg")} alt={`${doctor.name}, ${doctor.title.toLowerCase()}`} fallback={0} priority />
                {/* Voile pour la lisibilité du texte blanc */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a5f6d]/60 via-[#0a5f6d]/10 to-[#0a5f6d]/45" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#07515d]/40 to-transparent" />
              </>
            )}

            <div className={`${section} relative flex w-full flex-1 flex-col pb-8 pt-32 md:pb-10 md:pt-40`}>
              <div className="flex flex-1 flex-col justify-between gap-12 lg:flex-row">
                <div>
                  <p className={`rise text-xs font-medium uppercase tracking-wide ${heroVideo ? "text-accent-deep" : "text-white/90"}`}>
                    {hero.eyebrow}
                  </p>
                  <h1 className="rise rise-2 mt-4 font-display text-[2.5rem] font-medium uppercase leading-[0.95] min-[400px]:text-[2.8rem] sm:text-7xl sm:leading-[0.92] lg:text-[5.6rem]">
                    <span className="block">{hero.title[0]}</span>
                    <span className={`block ${heroVideo ? "text-accent-deep" : ""}`}>{hero.title[1]}</span>
                    <span className="block">{hero.title[2]}</span>
                  </h1>
                  <div className="rise rise-3 mt-9 flex flex-wrap gap-3">
                    <PillLink href={practice.bookingUrl} icon={CalendarDays}>
                      Prendre rendez-vous
                    </PillLink>
                    <PillLink href="#soins" variant="light" icon={Search}>
                      Découvrir les soins
                    </PillLink>
                  </div>
                </div>

                <dl
                  className={`rise rise-4 grid grid-cols-2 gap-x-6 gap-y-7 lg:grid-cols-1 lg:content-start lg:gap-y-8 lg:self-start lg:text-right ${
                    heroVideo ? "lg:rounded-2xl lg:border lg:border-line lg:bg-white/70 lg:p-7 lg:backdrop-blur-md" : ""
                  }`}
                >
                  {hero.stats.map((s) => (
                    <div key={s.label}>
                      <dt className="font-display text-4xl font-medium md:text-5xl">{s.value}</dt>
                      <dd className={`mt-1 text-xs ${heroVideo ? "text-ink-soft" : "text-white/85"}`}>{s.label}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-12 flex items-end justify-between gap-6">
                <p className={`max-w-md text-sm leading-relaxed ${heroVideo ? "text-ink-soft" : "text-white/90"}`}>{hero.text}</p>
                <a
                  href="#docteur"
                  aria-label="Faire défiler"
                  className={`hidden h-11 w-20 shrink-0 items-center justify-center rounded-full border transition-colors md:flex ${
                    heroVideo ? "border-ink/20 hover:bg-sand" : "border-white/60 hover:bg-white/15"
                  }`}
                >
                  <Mouse size={16} strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ——— Le Dr Dadoun : philosophie, expérience, méthode, parcours ——— */}
        <section id="docteur" className="px-2 pt-2 md:px-3 md:pt-3">
          <div className="rounded-[1.75rem] bg-sand py-20 md:py-28">
            <div className={`${section} grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20`}>
              {/* Portrait */}
              <div className="lg:sticky lg:top-28 lg:self-start">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                  <Photo src={image("docteur.jpg")} alt={`Portrait du ${doctor.name}`} fallback={2} sizes="(min-width:1024px) 40vw, 100vw" className="object-[50%_15%]" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/70 px-5 py-4 backdrop-blur-md">
                    <div>
                      <p className="font-display text-lg font-semibold uppercase tracking-tight">{doctor.name}</p>
                      <p className="text-xs text-ink-soft">{doctor.title}</p>
                    </div>
                    <span className="rounded-full bg-ink px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-wide text-white">
                      {practice.city}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                {/* Philosophie */}
                <p className="eyebrow">Le Dr Dadoun</p>
                <h2 className="mt-4 font-display text-5xl font-medium uppercase leading-[0.95] md:text-6xl">
                  Améliorer
                  <br />
                  <span className="text-accent-deep">sans dénaturer</span>
                </h2>
                <p className="mt-6 text-sm font-medium uppercase tracking-[0.14em] text-muted">
                  {pillars.map((p) => p.label).join(" · ")}
                </p>
                <p className="mt-6 text-[1.05rem] leading-relaxed text-ink-soft">{philosophy.intro}</p>

                {/* Expérience */}
                <dl className="mt-10 grid grid-cols-3 border-y border-ink/10">
                  {[
                    { value: "35+", label: "ans d'expérience" },
                    { value: "10+", label: "ans de formation" },
                    { value: "Lasériste", label: "lasers médicaux" },
                  ].map((fact) => (
                    <div key={fact.label} className="py-6 pr-3">
                      <dt className="font-display text-3xl font-medium md:text-4xl">{fact.value}</dt>
                      <dd className="mt-1 text-xs text-muted">{fact.label}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-10 space-y-4 leading-relaxed text-ink-soft">
                  {about.paragraphs.map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                </div>
                <blockquote className="mt-8 border-l-2 border-accent pl-5 font-display text-xl font-medium leading-snug">
                  « {about.quote} »
                </blockquote>

                {/* Méthode */}
                <h3 className="mt-14 text-xs font-medium uppercase tracking-[0.14em] text-accent-deep">Sa méthode</h3>
                <ol className="mt-4 border-t border-ink/10">
                  {philosophy.method.map((m, i) => (
                    <li key={m.title} className="grid grid-cols-[2.25rem_1fr] gap-x-3 border-b border-ink/10 py-4 sm:grid-cols-[2.25rem_9rem_1fr]">
                      <span className="pt-0.5 text-xs font-medium text-muted">0{i + 1}</span>
                      <p className="font-display text-lg font-medium">{m.title}</p>
                      <p className="col-start-2 text-sm leading-relaxed text-ink-soft sm:col-start-3">{m.text}</p>
                    </li>
                  ))}
                </ol>

                {/* Parcours & diplômes */}
                <h3 className="mt-14 text-xs font-medium uppercase tracking-[0.14em] text-accent-deep">Parcours & diplômes</h3>
                <ol className="mt-5 border-l border-ink/15 pl-6">
                  {about.education.length > 0 ? (
                    about.education.map((e) => (
                      <li key={e.title} className="relative pb-6 last:pb-0">
                        <span className="absolute -left-[1.85rem] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
                        {e.period && <p className="text-xs font-medium text-accent-deep">{e.period}</p>}
                        <p className="font-medium">{e.title}</p>
                        {e.place && <p className="text-sm text-ink-soft">{e.place}</p>}
                      </li>
                    ))
                  ) : (
                    <li className="relative">
                      <span className="absolute -left-[1.85rem] top-1.5 h-2.5 w-2.5 rounded-full border border-ink/30 bg-sand" aria-hidden="true" />
                      <p className="text-sm text-muted">Écoles, diplômes et formations : bientôt disponibles.</p>
                    </li>
                  )}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ——— L'essentiel (carrousel) ——— */}
        <section id="essentiel" className="overflow-hidden py-24 md:py-32">
          <div className={section}>
            <Highlights
              items={highlights.map((h) => ({ title: h.title, text: h.text, src: image(h.image) }))}
            >
              <SectionTitle
                title={
                  <>
                    Un seul médecin,
                    <span className="text-accent-deep"> du diagnostic au suivi.</span>
                  </>
                }
                text="Injections, lasers, gynécologie esthétique : chaque acte est posé, réalisé et suivi par le Dr Dadoun lui-même, pour un résultat cohérent."
              />
            </Highlights>
          </div>
        </section>

        {/* ——— Soins ——— */}
        <section id="soins" className="pb-24 md:pb-32">
          <div className={section}>
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <SectionTitle
                title={
                  <>
                    Deux univers,
                    <br />
                    <span className="text-accent-deep">une même exigence</span>
                  </>
                }
                text="Chaque soin est précédé d'une consultation médicale afin de vérifier son indication et l'absence de contre-indication."
              />
              <div className="flex flex-wrap gap-3">
                <PillLink href={practice.bookingUrl} icon={CalendarDays}>
                  Prendre rendez-vous
                </PillLink>
              </div>
            </div>

            <div className="mt-14 grid gap-3 lg:grid-cols-2">
              {universes.map((u, i) => {
                const acts = treatments
                  .filter((c) => u.categories.includes(c.id))
                  .reduce((n, c) => n + c.treatments.length, 0);
                return (
                  <Link
                    key={u.slug}
                    href={`/soins/${u.slug}`}
                    className="group relative flex min-h-[30rem] flex-col justify-end overflow-hidden rounded-2xl text-white md:min-h-[38rem]"
                  >
                    <Photo
                      src={image(u.image)}
                      alt={u.title}
                      fallback={i === 0 ? 1 : 2}
                      sizes="(min-width:1024px) 50vw, 100vw"
                      className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07343c]/85 via-[#07343c]/25 to-transparent" />
                    <div className="relative p-7 md:p-10">
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/80">
                        {u.tagline}
                      </p>
                      <h3 className="mt-3 font-display text-4xl font-medium uppercase leading-[0.95] md:text-6xl">{u.title}</h3>
                      <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85">{u.intro}</p>
                      <span className="mt-8 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-wide">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink transition-transform duration-300 group-hover:translate-x-1">
                          <ArrowRight size={16} />
                        </span>
                        Découvrir les {acts} actes
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ——— Parcours ——— */}
        <section id="parcours" className="px-2 md:px-3">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-ink py-20 text-white md:py-28">
            <div className="mesh-4 absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full opacity-40 blur-3xl" aria-hidden="true" />
            <div className={`${section} relative`}>
              <SectionTitle
                light
                title="De la première consultation au suivi"
                text="Un parcours clair, sans précipitation : vous disposez toujours d'un temps de réflexion avant tout soin."
              />
              <ol className="mt-14 grid gap-3 md:grid-cols-4">
                {steps.map((s, i) => (
                  <li key={s.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-medium text-ink">
                      {i + 1}
                    </span>
                    <h3 className="mt-8 font-display text-2xl font-medium">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">{s.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ——— Formations (professionnels) ——— */}
        <section id="formations" className="pb-24 md:pb-32">
          <div className={section}>
            <div className="grid gap-3 lg:grid-cols-[1.1fr_1fr]">
              <div className="relative overflow-hidden rounded-2xl bg-ink p-8 text-white md:p-10">
                <div className="mesh-4 absolute -bottom-32 -right-32 h-80 w-80 rounded-full opacity-50 blur-3xl" aria-hidden="true" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs uppercase tracking-wide">
                    <GraduationCap size={14} /> Espace professionnels
                  </span>
                  <h2 className="mt-8 font-display text-4xl font-medium leading-[1.05] md:text-5xl">{training.title}</h2>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">{training.intro}</p>
                  <Link
                    href="/formations"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs font-medium uppercase tracking-wide text-ink hover:bg-accent-soft"
                  >
                    Découvrir les formations <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {training.modules.map((m) => (
                  <div key={m.title} className="rounded-2xl bg-sand p-6">
                    <h3 className="font-display text-lg font-medium leading-snug">{m.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ——— Rendez-vous ——— */}
        <section id="rendez-vous" className="px-2 md:px-3">
          <div className="rounded-[1.75rem] bg-sand py-20 md:py-28">
            <div className={section}>
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <SectionTitle
                  title={
                    <>
                      Choisissez
                      <br />
                      <span className="text-accent-deep">votre créneau</span>
                    </>
                  }
                />
                <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
                  Sélectionnez le motif, le jour et l&apos;heure : le cabinet vous confirme le rendez-vous
                  sous 24 h ouvrées.
                </p>
              </div>
              <div className="mt-12">
                <BookingCalendar />
              </div>
            </div>
          </div>
        </section>

        {/* ——— FAQ ——— */}
        <section id="faq" className="py-24 md:py-32">
          <div className={`${section} grid gap-12 lg:grid-cols-[1fr_1.5fr]`}>
            <div>
              <SectionTitle title="Questions fréquentes" />
              <p className="mt-5 text-sm leading-relaxed text-ink-soft">
                Une autre question ? Le cabinet vous répond au{" "}
                <a href={`tel:${practice.phoneHref}`} className="whitespace-nowrap font-medium text-ink underline decoration-accent underline-offset-4">
                  {practice.phone}
                </a>
                .
              </p>
            </div>
            <div className="space-y-2">
              {faq.map((item) => (
                <details key={item.q} className="group rounded-2xl bg-sand px-6 py-5 transition-colors open:bg-accent-soft/40">
                  <summary className="flex cursor-pointer items-center justify-between gap-6 font-medium">
                    {item.q}
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white">
                      <Plus size={16} className="faq-icon transition-transform" />
                    </span>
                  </summary>
                  <p className="mt-3 pr-10 text-sm leading-relaxed text-ink-soft">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ——— Cabinet ——— */}
        <section id="cabinet" className="pb-24 md:pb-32">
          <div className={section}>
            <SectionTitle
              title={
                <>
                  Vous accueillir
                  <br />
                  <span className="text-accent-deep">au cœur de Casablanca</span>
                </>
              }
            />
            <div className="mt-14 grid gap-3 lg:grid-cols-[1.3fr_1fr_1fr]">
              <div className="relative min-h-72 overflow-hidden rounded-2xl">
                <Photo src={image("cabinet.jpg")} alt="Le cabinet" fallback={3} sizes="(min-width:1024px) 40vw, 100vw" />
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/60 bg-white/75 p-5 backdrop-blur-md">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <MapPin size={16} className="text-accent-deep" /> {practice.addressLine1}, {practice.addressLine2}
                  </p>
                  <a
                    href={practice.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-ink-soft underline underline-offset-4"
                  >
                    Itinéraire <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>

              <div className="rounded-2xl bg-sand p-6">
                <Clock size={20} className="text-accent-deep" />
                <h3 className="mt-5 font-display text-2xl font-medium">Horaires</h3>
                <dl className="mt-4 space-y-3">
                  {practice.hours.map((h) => (
                    <div key={h.day} className="flex justify-between gap-4 border-b border-line pb-3 text-sm">
                      <dt className="text-ink-soft">{h.day}</dt>
                      <dd className="font-medium">{h.time}</dd>
                    </div>
                  ))}
                </dl>
                <ul className="mt-5 space-y-1 text-xs text-muted">
                  {practice.access.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col rounded-2xl bg-ink p-6 text-white">
                <h3 className="font-display text-2xl font-medium">Prendre rendez-vous</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  Réservez en ligne ou contactez le secrétariat.
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
                <Link
                  href={practice.bookingUrl}
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-white py-3.5 text-xs font-medium uppercase tracking-wide text-ink hover:bg-accent-soft"
                >
                  <CalendarDays size={14} /> Réserver en ligne
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
