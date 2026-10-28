import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Phone } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { DoctorByline } from "@/components/DoctorByline";
import { Reassurance } from "@/components/Reassurance";
import { actPath, acts, doctor, practice } from "@/content/site";
import { getArticle, publishedArticles } from "@/content/articles";
import { absolute, breadcrumb, clinicId, metaDescription, physicianId } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return publishedArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = getArticle((await params).slug);
  if (!a) return {};
  return {
    title: a.title,
    description: metaDescription(a.description),
    alternates: { canonical: `/conseils/${a.slug}` },
    openGraph: { url: `/conseils/${a.slug}`, type: "article" },
  };
}

const section = "mx-auto max-w-6xl px-5 md:px-8";
const pill =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-medium uppercase tracking-wide transition-colors";

export default async function ArticlePage({ params }: Props) {
  const a = getArticle((await params).slug);
  if (!a) notFound();

  const related = a.related.flatMap((slug) => acts.filter((x) => x.slug === slug));
  const others = publishedArticles().filter((x) => x.slug !== a.slug).slice(0, 4);
  const url = absolute(`/conseils/${a.slug}`);

  return (
    <>
      <Header />
      <main>
        <section className="p-2 md:p-3">
          <div className="relative overflow-hidden rounded-[1.75rem] mesh-3">
            <div className="absolute inset-0 bg-gradient-to-t from-[#07343c]/80 via-[#07343c]/35 to-[#07343c]/10" />
            <div className={`${section} relative pb-10 pt-32 text-white md:pb-14 md:pt-40`}>
              <Link href="/conseils" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
                <ArrowLeft size={16} /> Tous les conseils
              </Link>
              <p className="mt-10 text-xs font-medium uppercase tracking-[0.14em] text-white/80">Conseils · {practice.city}</p>
              <h1 className="mt-3 max-w-4xl text-balance font-display text-4xl font-medium leading-[0.98] sm:text-5xl md:text-6xl">
                {a.title}
              </h1>
            </div>
          </div>
        </section>

        <article className={`${section} grid gap-12 py-16 md:py-24 lg:grid-cols-[2fr_1fr] lg:gap-16`}>
          <div className="max-w-2xl">
            <p className="text-xl leading-relaxed">{a.intro}</p>
            {a.sections.map((s) => (
              <section key={s.title} className="mt-12">
                <h2 className="font-display text-2xl font-medium md:text-3xl">{s.title}</h2>
                {s.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)} className="mt-4 leading-relaxed text-ink-soft">
                    {p}
                  </p>
                ))}
                {s.list && (
                  <ul className="mt-5 space-y-3">
                    {s.list.map((li) => (
                      <li key={li} className="flex items-start gap-3 leading-relaxed">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-deep">
                          <Check size={13} strokeWidth={2.5} />
                        </span>
                        {li}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <section className="mt-16">
              <h2 className="font-display text-2xl font-medium md:text-3xl">Questions fréquentes</h2>
              <dl className="mt-6 border-t border-line">
                {a.faq.map((f) => (
                  <div key={f.q} className="border-b border-line py-5">
                    <dt className="font-medium">{f.q}</dt>
                    <dd className="mt-2 leading-relaxed text-ink-soft">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <p className="mt-10 text-sm text-muted">
              {a.validated ? (
                <>
                  Article relu par le{" "}
                  <Link href={doctor.path} className="underline underline-offset-4 hover:text-ink">{doctor.fullName}</Link>
                  {a.reviewed &&
                    ` · ${new Date(a.reviewed).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`}
                  . Ces informations ne remplacent pas une consultation.
                </>
              ) : (
                <span className="rounded-full bg-accent-soft px-3 py-1 text-accent-deep">Brouillon · en attente de validation médicale</span>
              )}
            </p>
          </div>

          <aside className="space-y-3 lg:sticky lg:top-28 lg:self-start">
            {related.length > 0 && (
              <div className="rounded-2xl border border-line bg-white p-6 md:p-8">
                <p className="eyebrow">Soins liés</p>
                <ul className="mt-4 border-t border-line">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={actPath(r)}
                        className="group flex items-center justify-between gap-4 border-b border-line py-4 hover:text-accent-deep"
                      >
                        <span className="font-medium">{r.seoName ?? r.name}</span>
                        <ArrowRight size={16} className="shrink-0 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="rounded-2xl bg-ink p-6 text-white md:p-8">
              <p className="font-display text-xl font-medium">Une question sur votre situation ?</p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">Chaque soin commence par une consultation.</p>
              <div className="mt-6 flex flex-col gap-2">
                <a href={practice.bookingUrl} className={`${pill} bg-white text-ink hover:bg-accent-soft`}>
                  <CalendarDays size={14} /> Prendre rendez-vous
                </a>
                <a href={`tel:${practice.phoneHref}`} className={`${pill} border border-white/30 text-white hover:bg-white/10`}>
                  <Phone size={14} /> {practice.phone}
                </a>
              </div>
              <Reassurance tone="dark" />
            </div>
          </aside>
        </article>

        <section className={`${section} pb-20 md:pb-28`}>
          <DoctorByline />
          {others.length > 0 && (
            <div className="mt-20">
              <p className="eyebrow">Autres conseils</p>
              <ul className="mt-6 grid gap-x-8 border-t border-line sm:grid-cols-2">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link
                      href={`/conseils/${o.slug}`}
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
          { name: "Conseils", path: "/conseils" },
          { name: a.title, path: `/conseils/${a.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          headline: a.title,
          name: a.title,
          description: a.description,
          url,
          inLanguage: "fr-MA",
          isPartOf: { "@id": absolute("/#site") },
          publisher: { "@id": clinicId },
          ...(a.validated ? { author: { "@id": physicianId }, reviewedBy: { "@id": physicianId } } : {}),
          ...(a.reviewed ? { lastReviewed: a.reviewed, dateModified: a.reviewed } : {}),
          mentions: related.map((r) => ({ "@type": "MedicalProcedure", "@id": `${absolute(actPath(r))}#acte`, name: r.name })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: a.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </>
  );
}
