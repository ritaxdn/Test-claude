import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Mail } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { getSessions, registrationEnabled, registrationHref } from "@/lib/sessions";
import { MediaSlot } from "@/components/formations/MediaSlot";
import { absolute, breadcrumb, physicianId } from "@/lib/seo";
import { formationsPage as f, getCourse } from "@/content/formations";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return f.courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = getCourse((await params).slug);
  if (!course) return {};
  return {
    title: `Formation ${course.title} pour médecins — Casablanca`,
    description: `${course.summary} Formation réservée aux médecins, dispensée par le Dr Dadoun à Casablanca.`,
    alternates: { canonical: `/formations/${course.slug}` },
    openGraph: { url: `/formations/${course.slug}` },
  };
}

const section = "mx-auto max-w-6xl px-5 md:px-8";
const pill =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-medium uppercase tracking-wide transition-colors";
const requestLink = (demande: string, formation: string) => `/formations?demande=${demande}&formation=${formation}#demande`;

export const revalidate = 300;

export default async function CoursePage({ params }: Props) {
  const course = getCourse((await params).slug);
  if (!course) notFound();

  const index = f.courses.indexOf(course);
  const sessions = (await getSessions()).filter((s) => s.course === course.slug);
  const online = registrationEnabled();
  const others = f.courses.filter((c) => c.slug !== course.slug);
  const details = [
    course.audience && { label: "Public", value: course.audience },
    course.duration && { label: "Durée", value: course.duration },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <Header variant="pro" />
      <main className="pt-32 md:pt-40">
        <section className={`${section} grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end`}>
          <div>
            <Link href="/formations#formations" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
              <ArrowLeft size={16} /> Toutes les formations
            </Link>
            <p className="eyebrow mt-12">Formation {String(index + 1).padStart(2, "0")}</p>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl font-medium uppercase leading-[0.95] md:text-7xl">{course.title}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">{course.summary}</p>
            <p className="mt-4 text-sm text-muted">{f.hero.audience}.</p>
          </div>
          {course.media && (
            <MediaSlot
              video={course.media.video}
              image={course.media.image}
              label={course.media.label}
              className="aspect-[4/5] w-full max-w-sm lg:justify-self-end"
              sizes="(min-width:1024px) 30vw, 100vw"
            />
          )}
        </section>

        <section className={`${section} mt-20 grid gap-14 border-t border-line pt-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20`}>
          <div>
            <h2 className="font-display text-2xl font-medium">Programme</h2>
            {course.objectives && course.objectives.length > 0 ? (
              <ul className="mt-6 border-t border-line">
                {course.objectives.map((o) => (
                  <li key={o} className="border-b border-line py-4 text-[0.95rem]">{o}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
                Le programme détaillé de cette formation — objectifs, contenus, prérequis — vous est
                communiqué sur demande.
              </p>
            )}
            {details.length > 0 && (
              <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                {details.map((d) => (
                  <div key={d.label}>
                    <dt className="text-xs uppercase tracking-[0.14em] text-muted">{d.label}</dt>
                    <dd className="mt-1 font-medium">{d.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div>
            <h2 className="font-display text-2xl font-medium">Prochaines sessions</h2>
            {sessions.length > 0 ? (
              <ul className="mt-6 border-t border-line">
                {sessions.map((s) => (
                  <li key={s.id ?? s.date} className="border-b border-line py-4 text-sm">
                    <p className="flex items-center gap-2 font-medium"><CalendarDays size={14} className="text-accent-deep" /> {s.date}</p>
                    <p className="mt-1 text-ink-soft">{s.place} · {s.format}</p>
                    {s.status === "full" ? (
                      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-muted">Complet</p>
                    ) : (
                      (s.link || (online && s.id)) && (
                        <Link
                          href={registrationHref(s, online)}
                          {...(s.link ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-accent-deep hover:text-ink"
                        >
                          S&apos;inscrire <ArrowRight size={13} />
                        </Link>
                      )
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 leading-relaxed text-ink-soft">{f.sessions.empty}</p>
            )}
            <div className="mt-8 flex flex-col gap-3">
              <Link href={requestLink("programme", course.slug)} className={`${pill} bg-ink text-white hover:bg-accent-deep`}>
                Demander le programme <ArrowUpRight size={14} />
              </Link>
              <Link href="/formations#newsletter" className={`${pill} border border-ink/15 bg-white text-ink hover:border-ink`}>
                <Mail size={14} /> Newsletter : être informé des sessions
              </Link>
            </div>
          </div>
        </section>

        <section className={`${section} mt-28 pb-24 md:pb-32`}>
          <p className="eyebrow">Les autres formations</p>
          <ul className="mt-6 border-t border-line">
            {others.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/formations/${c.slug}`}
                  className="group flex items-center justify-between gap-6 border-b border-line py-6 transition-colors hover:text-accent-deep"
                >
                  <span className="font-display text-2xl font-medium md:text-3xl">{c.title}</span>
                  <ArrowRight size={18} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer variant="pro" />
      <JsonLd data={breadcrumb([{ name: "Accueil", path: "/" }, { name: "Formations", path: "/formations" }, { name: course.title, path: `/formations/${course.slug}` }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: `Formation ${course.title}`,
          description: course.summary,
          url: absolute(`/formations/${course.slug}`),
          provider: { "@id": physicianId },
          audience: { "@type": "Audience", audienceType: "Médecins" },
          inLanguage: "fr",
          ...(sessions.length
            ? { hasCourseInstance: sessions.map((s) => ({
                "@type": "CourseInstance",
                name: s.date,
                location: s.place,
                courseMode: "onsite",
                ...(s.start ? { startDate: s.start } : {}),
              })) }
            : {}),
        }}
      />
    </>
  );
}
