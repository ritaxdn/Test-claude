import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Photo } from "@/components/Photo";
import { image } from "@/lib/images";
import { getUniverse, practice, treatments, universes } from "@/content/site";

type Props = { params: Promise<{ univers: string }> };

export function generateStaticParams() {
  return universes.map((u) => ({ univers: u.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const u = getUniverse((await params).univers);
  if (!u) return {};
  return { title: u.title, description: u.intro };
}

const section = "mx-auto max-w-6xl px-5 md:px-8";
const pill =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-medium uppercase tracking-wide transition-colors";

export default async function UniversePage({ params }: Props) {
  const u = getUniverse((await params).univers);
  if (!u) notFound();

  const index = universes.indexOf(u);
  const categories = treatments.filter((c) => u.categories.includes(c.id));
  const other = universes.find((x) => x.slug !== u.slug);
  // Numérotation continue des actes sur toute la page.
  const offsets = categories.map((_, i) => categories.slice(0, i).reduce((a, c) => a + c.treatments.length, 0));

  return (
    <>
      <Header />
      <main>
        {/* Hero de l'univers */}
        <section className="p-2 md:p-3">
          <div className="relative flex min-h-[560px] flex-col justify-end overflow-hidden rounded-[1.75rem] text-white md:min-h-[640px]">
            <Photo src={image(u.image)} alt={u.title} fallback={index === 0 ? 1 : 2} priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07343c]/85 via-[#07343c]/30 to-[#07343c]/10" />
            <div className={`${section} relative w-full pb-10 pt-36 md:pb-14`}>
              <Link href="/#soins" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
                <ArrowLeft size={16} /> Tous les soins
              </Link>
              <p className="mt-10 text-xs font-medium uppercase tracking-[0.14em] text-white/80">
                {u.tagline}
              </p>
              <h1 className="mt-3 font-display text-5xl font-medium uppercase leading-[0.92] md:text-8xl">{u.title}</h1>
              <div className="mt-6 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <p className="max-w-lg leading-relaxed text-white/85">{u.intro}</p>
                <a href={practice.bookingUrl} className={`${pill} shrink-0 bg-white text-ink hover:bg-accent-soft`}>
                  <CalendarDays size={14} /> Prendre rendez-vous
                </a>
              </div>
            </div>
          </div>
        </section>

        {u.note && (
          <div className={`${section} mt-10`}>
            <p className="flex items-center gap-3 border-b border-line pb-6 text-sm text-ink-soft">
              <ShieldCheck size={18} className="shrink-0 text-accent-deep" /> {u.note}
            </p>
          </div>
        )}

        {/* Les actes */}
        <div className="py-20 md:py-28">
          {categories.map((cat, ci) => (
            <section key={cat.id} className={`${section} grid gap-10 pb-20 last:pb-0 lg:grid-cols-[1fr_2fr] lg:gap-16`}>
              <div className="lg:sticky lg:top-28 lg:self-start">
                <h2 className="font-display text-3xl font-medium uppercase leading-none md:text-4xl">{cat.title}</h2>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">{cat.intro}</p>
              </div>
              <ol className="border-t border-line">
                {cat.treatments.map((t, ti) => {
                  const n = offsets[ci] + ti + 1;
                  return (
                    <li key={t.name} className="grid gap-3 border-b border-line py-8 sm:grid-cols-[3rem_1fr]">
                      <span className="pt-1.5 text-xs font-medium text-muted">{String(n).padStart(2, "0")}</span>
                      <div>
                        <h3 className="font-display text-2xl font-medium md:text-3xl">{t.name}</h3>
                        <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">{t.description}</p>
                        <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                          <div className="flex gap-2">
                            <dt className="text-muted">Durée</dt>
                            <dd className="font-medium">{t.duration}</dd>
                          </div>
                          <div className="flex gap-2">
                            <dt className="text-muted">Suites</dt>
                            <dd className="font-medium">{t.downtime}</dd>
                          </div>
                        </dl>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>

        {/* Rappel + autre univers */}
        <section className={`${section} pb-24 md:pb-32`}>
          <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-2xl bg-ink p-8 text-white md:p-10">
              <h2 className="font-display text-3xl font-medium leading-tight md:text-4xl">Chaque soin commence par une consultation</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
                Le Dr Dadoun vérifie l&apos;indication, vous explique ce que l&apos;on peut attendre — et vous dit
                aussi quand un acte ne vous conviendrait pas.
              </p>
              <a href={practice.bookingUrl} className={`${pill} mt-8 bg-white text-ink hover:bg-accent-soft`}>
                <CalendarDays size={14} /> Prendre rendez-vous
              </a>
            </div>
            {other && (
              <Link
                href={`/soins/${other.slug}`}
                className="group relative flex min-h-64 flex-col justify-end overflow-hidden rounded-2xl text-white"
              >
                <Photo
                  src={image(other.image)}
                  alt={other.title}
                  fallback={index === 0 ? 2 : 1}
                  sizes="(min-width:1024px) 40vw, 100vw"
                  className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07343c]/80 to-transparent" />
                <div className="relative flex items-end justify-between gap-6 p-7">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-white/80">L&apos;autre expertise</p>
                    <p className="mt-2 font-display text-3xl font-medium uppercase">{other.title}</p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
