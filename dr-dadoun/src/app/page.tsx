import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  Droplets,
  Gem,
  Layers,
  Mail,
  MapPin,
  Mouse,
  Phone,
  Pipette,
  Plus,
  ScanFace,
  Search,
  Sparkles,
  Sun,
  Syringe,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Photo } from "@/components/Photo";
import { Highlights } from "@/components/Highlights";
import { ArticleCard } from "@/components/ArticleCard";
import { BookingCalendar } from "@/components/BookingCalendar";
import { image } from "@/lib/images";
import { articles, expertise } from "@/content/journal";
import {
  about,
  doctor,
  faq,
  hero,
  highlights,
  practice,
  principles,
  steps,
  treatments,
} from "@/content/site";

const treatmentIcons: Record<string, LucideIcon> = {
  "Acide hyaluronique": Syringe,
  "Toxine botulique": ScanFace,
  Skinboosters: Droplets,
  "Peelings médicaux": Layers,
  "Mésothérapie & PRP": Pipette,
  Microneedling: Sparkles,
  "Laser pigmentaire & vasculaire": Sun,
  "Épilation laser": Zap,
  "Radiofréquence & HIFU": Waves,
};

function PillLink({
  href,
  children,
  variant = "dark",
  icon: Icon,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "dark" | "light";
  icon?: LucideIcon;
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-medium uppercase tracking-wide transition-colors ${
        variant === "dark"
          ? "bg-ink text-white hover:bg-accent-deep"
          : "border border-ink/15 bg-white text-ink hover:border-ink"
      }`}
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
  const allTreatments = treatments.flatMap((c) => c.treatments.map((t) => ({ ...t, category: c.title })));

  return (
    <>
      <Header />
      <main id="top">
        {/* ——— Hero ——— */}
        <section className="p-2 md:p-3">
          <div className="relative flex min-h-[640px] flex-col overflow-hidden rounded-[1.75rem] text-white md:min-h-[760px] lg:h-[calc(100svh-1.5rem)]">
            <Photo src={image("hero.jpg")} alt={`${doctor.name}, ${doctor.title.toLowerCase()}`} fallback={0} priority />
            {/* Voile pour la lisibilité du texte blanc */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a5f6d]/60 via-[#0a5f6d]/10 to-[#0a5f6d]/45" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#07515d]/40 to-transparent" />

            <div className={`${section} relative flex w-full flex-1 flex-col pb-8 pt-32 md:pb-10 md:pt-40`}>
              <div className="flex flex-1 flex-col justify-between gap-12 lg:flex-row">
                <div>
                  <p className="rise text-xs font-medium uppercase tracking-wide text-white/90">{hero.eyebrow}</p>
                  <h1 className="rise rise-2 mt-4 font-display text-[2.5rem] font-medium uppercase leading-[0.95] min-[400px]:text-[2.8rem] sm:text-7xl sm:leading-[0.92] lg:text-[5.6rem]">
                    <span className="block">{hero.title[0]}</span>
                    <span className="flex items-center gap-2.5 whitespace-nowrap sm:gap-4">
                      <span className="relative inline-block h-[0.78em] w-[1em] shrink-0 overflow-hidden rounded-lg sm:w-[1.2em] sm:rounded-2xl">
                        <Photo src={image("hero-chip.jpg")} alt="" fallback={5} sizes="160px" />
                      </span>
                      {hero.title[1]}
                    </span>
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

                <dl className="rise rise-4 grid grid-cols-2 gap-x-6 gap-y-7 lg:grid-cols-1 lg:content-start lg:gap-y-8 lg:text-right">
                  {hero.stats.map((s) => (
                    <div key={s.label}>
                      <dt className="font-display text-4xl font-medium md:text-5xl">{s.value}</dt>
                      <dd className="mt-1 text-xs text-white/85">{s.label}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-12 flex items-end justify-between gap-6">
                <p className="max-w-md text-sm leading-relaxed text-white/90">{hero.text}</p>
                <a
                  href="#essentiel"
                  aria-label="Faire défiler"
                  className="hidden h-11 w-20 shrink-0 items-center justify-center rounded-full border border-white/60 transition-colors hover:bg-white/15 md:flex"
                >
                  <Mouse size={16} strokeWidth={1.5} />
                </a>
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
                    Tout ce dont votre peau a besoin
                    <span className="text-accent-deep"> — en un seul lieu.</span>
                  </>
                }
                text="Diagnostic, injections, soins de la peau et lasers : un seul médecin vous accompagne, de la première consultation au suivi, pour un résultat cohérent."
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
                    Une expertise pour
                    <br />
                    chaque indication
                  </>
                }
                text="Chaque soin est précédé d'une consultation médicale afin de vérifier son indication et l'absence de contre-indication."
              />
              <div className="flex flex-wrap gap-3">
                <PillLink href={practice.bookingUrl} icon={CalendarDays}>
                  Prendre rendez-vous
                </PillLink>
                <PillLink href="/journal" variant="light" icon={Search}>
                  Lire le journal
                </PillLink>
              </div>
            </div>

            <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {allTreatments.map((t) => {
                const Icon = treatmentIcons[t.name] ?? Gem;
                return (
                  <details key={t.name} className="group rounded-2xl bg-sand p-2.5 transition-colors open:bg-accent-soft/40">
                    <summary className="flex cursor-pointer items-center gap-4">
                      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white text-accent-deep shadow-[0_6px_20px_-12px_rgba(10,27,33,0.35)]">
                        <Icon size={24} strokeWidth={1.5} />
                      </span>
                      <span className="flex-1">
                        <span className="block text-[0.95rem] font-medium">{t.name}</span>
                        <span className="mt-0.5 block text-xs text-muted">{t.category}</span>
                      </span>
                      <Plus size={18} className="faq-icon mr-3 shrink-0 text-muted transition-transform" />
                    </summary>
                    <div className="px-2.5 pb-3 pt-4 text-sm leading-relaxed text-ink-soft">
                      <p>{t.description}</p>
                      <p className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-white px-3 py-1">Durée : {t.duration}</span>
                        <span className="rounded-full bg-white px-3 py-1">Suites : {t.downtime}</span>
                      </p>
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        </section>

        {/* ——— Le docteur ——— */}
        <section id="docteur" className="px-2 md:px-3">
          <div className="rounded-[1.75rem] bg-sand py-20 md:py-28">
            <div className={`${section} grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20`}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Photo src={image("docteur.jpg")} alt={`Portrait du ${doctor.name}`} fallback={2} sizes="(min-width:1024px) 45vw, 100vw" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-5 py-4 backdrop-blur-md">
                  <div>
                    <p className="font-display text-lg font-semibold uppercase tracking-tight">{doctor.name}</p>
                    <p className="text-xs text-ink-soft">{doctor.title}</p>
                  </div>
                  <span className="rounded-full bg-ink px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-wide text-white">
                    Paris
                  </span>
                </div>
              </div>

              <div>
                <p className="eyebrow">Le Docteur</p>
                <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] md:text-5xl">{about.title}</h2>
                <div className="mt-7 space-y-4 leading-relaxed text-ink-soft">
                  {about.paragraphs.map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                </div>
                <blockquote className="mt-8 border-l-2 border-accent pl-5 font-display text-xl font-medium leading-snug">
                  « {about.quote} »
                </blockquote>
                <ul className="mt-8 grid gap-2 sm:grid-cols-2">
                  {about.credentials.map((c) => (
                    <li key={c} className="rounded-xl bg-white px-4 py-3 text-sm leading-snug text-ink-soft">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ——— Approche ——— */}
        <section id="approche" className="py-24 md:py-32">
          <div className={section}>
            <SectionTitle
              title={
                <>
                  Quatre engagements,
                  <br />
                  <span className="text-accent-deep">à chaque rendez-vous</span>
                </>
              }
            />
            <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {principles.map((p, i) => (
                <div key={p.title} className="flex min-h-64 flex-col justify-between rounded-2xl bg-sand p-6">
                  <span className="font-display text-5xl font-medium text-accent">0{i + 1}</span>
                  <div>
                    <h3 className="font-display text-2xl font-medium">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.text}</p>
                  </div>
                </div>
              ))}
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

        {/* ——— Le savoir ——— */}
        <section id="savoir" className="py-24 md:py-32">
          <div className={section}>
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <SectionTitle
                title={
                  <>
                    Une expertise médicale,
                    <br />
                    <span className="text-accent-deep">partagée avec vous</span>
                  </>
                }
                text="Comprendre avant de traiter : le Dr Dadoun partage son savoir dans le Journal, sans jargon ni promesse excessive."
              />
              <PillLink href="/journal" variant="light" icon={ArrowUpRight}>
                Tous les articles
              </PillLink>
            </div>
            <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {expertise.map((e) => (
                <div key={e.title} className="rounded-2xl border border-line p-6">
                  <h3 className="font-display text-lg font-medium">{e.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{e.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {articles.slice(0, 3).map((a, i) => (
                <ArticleCard key={a.slug} article={a} index={i} />
              ))}
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
                <a href={`tel:${practice.phoneHref}`} className="font-medium text-ink underline decoration-accent underline-offset-4">
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
                  <span className="text-accent-deep">au cœur de Paris</span>
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
