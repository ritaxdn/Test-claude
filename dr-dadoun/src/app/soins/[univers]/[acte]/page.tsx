import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Phone, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { actPath, acts, doctor, getAct, practice, steps, type Act } from "@/content/site";
import { concernsForAct } from "@/content/concerns";
import { absolute, breadcrumb, clinicId, physicianId } from "@/lib/seo";

type Props = { params: Promise<{ univers: string; acte: string }> };

export function generateStaticParams() {
  return acts.map((a) => ({ univers: a.universe.slug, acte: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { univers, acte } = await params;
  const a = getAct(univers, acte);
  if (!a) return {};
  return {
    title: `${a.name} à Casablanca`,
    description: `${a.description} Au cabinet du ${doctor.name}, médecin esthétique et lasériste à ${practice.city}, sur rendez-vous.`,
    alternates: { canonical: actPath(a) },
    openGraph: { url: actPath(a), title: `${a.name} à Casablanca · ${doctor.name}` },
  };
}

// Questions générées à partir des informations de l'acte (rien d'autre n'est ajouté).
const questions = (a: Act) => [
  {
    q: `${a.name} : combien de temps dure la séance ?`,
    a: `Durée indicative : ${a.duration.toLowerCase()}. Elle vous est confirmée lors de la consultation.`,
  },
  {
    q: `${a.name} : quelles sont les suites ?`,
    a: `${a.downtime}. Je vous explique les consignes à suivre après le soin.`,
  },
  {
    q: `${a.name} : faut-il une consultation avant ?`,
    a: "Oui. Chaque soin commence par une consultation : je vérifie l'indication, je vous explique ce que l'on peut attendre, et je vous dis aussi quand un acte ne vous conviendrait pas.",
  },
  {
    q: `${a.name} à Casablanca : où consulter ?`,
    a: `Au cabinet, ${practice.addressLine1}, ${practice.addressLine2}. Sur rendez-vous : ${practice.hours
      .filter((h) => h.time !== "Fermé")
      .map((h) => `${h.day.toLowerCase()} ${h.time}`)
      .join(", ")}. Téléphone : ${practice.phone}.`,
  },
];

const section = "mx-auto max-w-6xl px-5 md:px-8";
const pill =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-medium uppercase tracking-wide transition-colors";

export default async function ActPage({ params }: Props) {
  const { univers, acte } = await params;
  const a = getAct(univers, acte);
  if (!a) notFound();

  const u = a.universe;
  const forConcerns = concernsForAct(a.slug);
  const related = acts.filter((x) => x.universe.slug === u.slug && x.slug !== a.slug);
  const qa = questions(a);
  const url = absolute(actPath(a));

  return (
    <>
      <Header />
      <main>
        {/* En-tête de l'acte */}
        <section className="p-2 md:p-3">
          <div className={`relative overflow-hidden rounded-[1.75rem] ${u.slug === "visage-peau" ? "mesh-1" : "mesh-2"}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#07343c]/80 via-[#07343c]/35 to-[#07343c]/10" />
            <div className={`${section} relative pb-10 pt-32 text-white md:pb-14 md:pt-40`}>
              <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-2 text-sm text-white/80">
                <Link href={`/soins/${u.slug}`} className="inline-flex items-center gap-2 hover:text-white">
                  <ArrowLeft size={16} /> {u.title}
                </Link>
                <span aria-hidden="true">/</span>
                <span>{a.category.title}</span>
              </nav>
              <p className="mt-10 text-xs font-medium uppercase tracking-[0.14em] text-white/80">
                {a.category.title} · {practice.city}
              </p>
              <h1 className="mt-3 font-display text-5xl font-medium leading-[0.95] md:text-7xl">
                {a.name} <span className="block text-white/70 md:inline">à {practice.city}</span>
              </h1>
              <div className="mt-6 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <p className="max-w-xl text-lg leading-relaxed text-white/90">{a.description}</p>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                  <a href={practice.bookingUrl} className={`${pill} bg-white text-ink hover:bg-accent-soft`}>
                    <CalendarDays size={14} /> Prendre rendez-vous
                  </a>
                  <a href={`tel:${practice.phoneHref}`} className={`${pill} border border-white/40 text-white hover:bg-white/10`}>
                    <Phone size={14} /> {practice.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Repères */}
        <section className={`${section} mt-10`}>
          <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
            {[
              { k: "Durée", v: a.duration },
              { k: "Suites", v: a.downtime },
              { k: "Avant le soin", v: "Consultation médicale" },
            ].map((f) => (
              <div key={f.k} className="bg-white p-6">
                <dt className="text-xs uppercase tracking-[0.14em] text-muted">{f.k}</dt>
                <dd className="mt-2 font-display text-xl font-medium">{f.v}</dd>
              </div>
            ))}
          </dl>
          {u.note && (
            <p className="mt-6 flex items-center gap-3 text-sm text-ink-soft">
              <ShieldCheck size={18} className="shrink-0 text-accent-deep" /> {u.note}
            </p>
          )}
          {forConcerns.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm text-muted">Pour quelle préoccupation ?</span>
              {forConcerns.map((c) => (
                <Link
                  key={c.slug}
                  href={`/preoccupations/${c.slug}`}
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm transition-colors hover:border-ink/30 hover:text-accent-deep"
                >
                  {c.title}
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Déroulement */}
        <section className={`${section} grid gap-10 py-20 md:py-28 lg:grid-cols-[1fr_2fr] lg:gap-16`}>
          <div>
            <h2 className="font-display text-3xl font-medium uppercase leading-none md:text-4xl">Comment se déroule le soin</h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              Je réalise moi-même chaque soin, au cabinet, après une consultation.
            </p>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-line bg-white p-6">
                <span className="text-xs font-medium text-muted">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-xl font-medium">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Questions */}
        <section className="bg-sand/60 py-20 md:py-28">
          <div className={`${section} grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16`}>
            <h2 className="font-display text-3xl font-medium uppercase leading-none md:text-4xl">Vos questions</h2>
            <div className="border-t border-line">
              {qa.map((f) => (
                <details key={f.q} className="group border-b border-line py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-xl font-medium">
                    {f.q}
                    <span className="text-2xl text-muted transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Autres soins + rendez-vous */}
        <section className={`${section} py-20 md:py-28`}>
          <div className="grid gap-3 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-2xl border border-line bg-white p-8 md:p-10">
              <h2 className="font-display text-2xl font-medium">Autres soins · {u.title}</h2>
              <ul className="mt-6 border-t border-line">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={actPath(r)} className="group flex items-center justify-between gap-4 border-b border-line py-4 hover:text-accent-deep">
                      <span className="font-medium">{r.name}</span>
                      <ArrowRight size={16} className="shrink-0 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={`/soins/${u.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
                Voir toute l&apos;expertise {u.title} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="flex flex-col justify-between rounded-2xl bg-ink p-8 text-white md:p-10">
              <div>
                <h2 className="font-display text-3xl font-medium leading-tight md:text-4xl">
                  Parlons de votre projet en consultation
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
                  {practice.addressLine1}, {practice.addressLine2}.
                </p>
              </div>
              <a href={practice.bookingUrl} className={`${pill} mt-8 self-start bg-white text-ink hover:bg-accent-soft`}>
                <CalendarDays size={14} /> Prendre rendez-vous
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd
        data={breadcrumb([
          { name: "Accueil", path: "/" },
          { name: u.title, path: `/soins/${u.slug}` },
          { name: a.name, path: actPath(a) },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          name: `${a.name} à Casablanca`,
          url,
          inLanguage: "fr-MA",
          isPartOf: { "@id": absolute("/#site") },
          publisher: { "@id": clinicId },
          reviewedBy: { "@id": physicianId },
          mainEntity: {
            "@type": "MedicalProcedure",
            "@id": `${url}#acte`,
            name: a.name,
            description: a.description,
            howPerformed: `Durée : ${a.duration}. Suites : ${a.downtime}. Après consultation médicale.`,
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: qa.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </>
  );
}
