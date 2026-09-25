import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Phone, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { DoctorByline } from "@/components/DoctorByline";
import { Reassurance } from "@/components/Reassurance";
import { actPath, doctor, practice, universes } from "@/content/site";
import { concernActs, concerns, getConcern } from "@/content/concerns";
import { absolute, breadcrumb, clinicId, physicianId } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return concerns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getConcern((await params).slug);
  if (!c) return {};
  const names = concernActs(c).map((a) => a.name);
  return {
    title: `${c.title} : quel traitement à Casablanca ?`,
    description: `${c.intro} Consultation avec le ${doctor.name}, médecin esthétique à ${practice.city} : ${names.join(", ")}.`,
    alternates: { canonical: `/preoccupations/${c.slug}` },
    openGraph: { url: `/preoccupations/${c.slug}` },
  };
}

const section = "mx-auto max-w-6xl px-5 md:px-8";
const pill =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-medium uppercase tracking-wide transition-colors";

export default async function ConcernPage({ params }: Props) {
  const c = getConcern((await params).slug);
  if (!c) notFound();

  const options = concernActs(c);
  const others = concerns.filter((x) => x.group === c.group && x.slug !== c.slug);
  const note = c.group === "intime" ? universes.find((u) => u.slug === "gynecologie-esthetique")?.note : undefined;
  const url = absolute(`/preoccupations/${c.slug}`);

  return (
    <>
      <Header />
      <main>
        {/* En-tête */}
        <section className="p-2 md:p-3">
          <div className={`relative overflow-hidden rounded-[1.75rem] ${c.group === "visage" ? "mesh-3" : "mesh-5"}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#07343c]/80 via-[#07343c]/35 to-[#07343c]/10" />
            <div className={`${section} relative pb-10 pt-32 text-white md:pb-14 md:pt-40`}>
              <Link href="/#preoccupations" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
                <ArrowLeft size={16} /> Toutes les préoccupations
              </Link>
              <p className="mt-10 text-xs font-medium uppercase tracking-[0.14em] text-white/80">
                Votre préoccupation · {practice.city}
              </p>
              <h1 className="mt-3 font-display text-4xl sm:text-5xl font-medium leading-[0.95] md:text-7xl">{c.title}</h1>
              <div className="mt-6 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <p className="max-w-xl text-lg leading-relaxed text-white/90">{c.intro}</p>
                <a href={practice.bookingUrl} className={`${pill} shrink-0 bg-white text-ink hover:bg-accent-soft`}>
                  <CalendarDays size={14} /> Prendre rendez-vous
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Ce que j'évalue */}
        <section className={`${section} grid gap-10 py-20 md:py-28 lg:grid-cols-[1fr_2fr] lg:gap-16`}>
          <div>
            <h2 className="font-display text-3xl font-medium uppercase leading-none md:text-4xl">D&apos;abord, comprendre</h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              Il n&apos;existe pas de traitement unique pour une même préoccupation. En consultation, j&apos;évalue :
            </p>
          </div>
          <div>
            <ul className="border-t border-line">
              {c.assess.map((a) => (
                <li key={a} className="flex items-start gap-3 border-b border-line py-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-deep">
                    <Check size={13} strokeWidth={2.5} />
                  </span>
                  {a}
                </li>
              ))}
            </ul>
            {note && (
              <p className="mt-6 flex items-center gap-3 text-sm text-ink-soft">
                <ShieldCheck size={18} className="shrink-0 text-accent-deep" /> {note}
              </p>
            )}
          </div>
        </section>

        {/* Options */}
        <section className="bg-sand/60 py-20 md:py-28">
          <div className={`${section} grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16`}>
            <div>
              <h2 className="font-display text-3xl font-medium uppercase leading-none md:text-4xl">Les solutions possibles</h2>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
                Selon ce que révèle la consultation, un ou plusieurs de ces soins peuvent être indiqués.
              </p>
            </div>
            <ul className="grid gap-3">
              {options.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={actPath(a)}
                    className="group flex items-center justify-between gap-6 rounded-2xl border border-line bg-white p-6 transition-colors hover:border-ink/25 md:p-8"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-muted">{a.category.title}</p>
                      <h3 className="mt-2 font-display text-2xl font-medium md:text-3xl">{a.name}</h3>
                      <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-soft">{a.why}</p>
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRight size={16} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Quand la réponse est ailleurs + rendez-vous */}
        <section className={`${section} py-20 md:py-28`}>
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white p-8 md:p-10">
              <h2 className="font-display text-2xl font-medium md:text-3xl">Parfois, la bonne réponse est ailleurs</h2>
              <p className="mt-4 leading-relaxed text-ink-soft">{c.elsewhere}</p>
            </div>
            <div className="flex flex-col justify-between rounded-2xl bg-ink p-8 text-white md:p-10">
              <div>
                <h2 className="text-balance font-display text-2xl font-medium md:text-3xl">Tout commence par une consultation</h2>
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
          <div className="mt-3">
            <DoctorByline />
          </div>

          {others.length > 0 && (
            <div className="mt-20">
              <p className="eyebrow">Autres préoccupations</p>
              <ul className="mt-6 grid gap-x-8 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link
                      href={`/preoccupations/${o.slug}`}
                      className="group flex items-center justify-between gap-4 border-b border-line py-5 hover:text-accent-deep"
                    >
                      <span className="font-medium">{o.title}</span>
                      <ArrowRight size={16} className="shrink-0 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>
      <Footer />
      <JsonLd
        data={breadcrumb([
          { name: "Accueil", path: "/" },
          { name: "Votre préoccupation", path: "/#preoccupations" },
          { name: c.title, path: `/preoccupations/${c.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          name: `${c.title} : quel traitement à Casablanca ?`,
          url,
          inLanguage: "fr-MA",
          isPartOf: { "@id": absolute("/#site") },
          publisher: { "@id": clinicId },
          reviewedBy: { "@id": physicianId },
          about: { "@type": "MedicalCondition", name: c.title, description: c.intro },
          mentions: options.map((a) => ({ "@type": "MedicalProcedure", "@id": `${absolute(actPath(a))}#acte`, name: a.name })),
        }}
      />
    </>
  );
}
