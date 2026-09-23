import type { Metadata } from "next";
import { ArrowUpRight, Check, GraduationCap, Mail, Phone } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { doctor, pillars, practice, training } from "@/content/site";

export const metadata: Metadata = {
  title: "Formations professionnelles",
  description:
    "Formations du Dr Dadoun pour les professionnels de santé : anatomie appliquée, injectables, lasers médicaux et matériel associé.",
};

export default function Formations() {
  const mailto = `mailto:${practice.email}?subject=${encodeURIComponent(training.contactSubject)}`;

  return (
    <>
      <Header />
      <main>
        <section className="p-2 md:p-3">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-ink pb-16 pt-36 text-white md:pb-24 md:pt-44">
            <div className="mesh-4 absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full opacity-50 blur-3xl" aria-hidden="true" />
            <div className="relative mx-auto max-w-6xl px-5 md:px-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs uppercase tracking-wide">
                <GraduationCap size={14} /> {training.audience}
              </span>
              <h1 className="mt-8 max-w-3xl font-display text-5xl font-medium uppercase leading-[0.95] md:text-7xl">
                Apprendre
                <br />
                <span className="text-accent">auprès du {doctor.name}</span>
              </h1>
              <p className="mt-8 max-w-xl leading-relaxed text-white/75">{training.intro}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={mailto}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs font-medium uppercase tracking-wide text-ink hover:bg-accent-soft"
                >
                  <Mail size={14} /> Être informé des sessions
                </a>
                <a
                  href={`tel:${practice.phoneHref}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-xs font-medium uppercase tracking-wide hover:border-white"
                >
                  <Phone size={14} /> {practice.phone}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <h2 className="max-w-xl font-display text-4xl font-medium leading-[1.05] md:text-5xl">
              Transmettre ce qui fait <span className="text-accent-deep">un geste sûr et juste</span>
            </h2>
            <div className="mt-14 grid gap-3 md:grid-cols-3">
              {pillars.map((p) => (
                <div key={p.id} className="rounded-2xl bg-sand p-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-accent-deep">{p.label}</p>
                  <h3 className="mt-3 font-display text-xl font-medium">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.text}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-24 font-display text-4xl font-medium leading-[1.05] md:text-5xl">Les modules</h2>
            <ol className="mt-10 grid gap-3 sm:grid-cols-2">
              {training.modules.map((m, i) => (
                <li key={m.title} className="flex gap-5 rounded-2xl border border-line p-6">
                  <span className="font-display text-3xl font-medium text-accent">0{i + 1}</span>
                  <div>
                    <h3 className="font-display text-xl font-medium">{m.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-3 flex flex-col justify-between gap-6 rounded-2xl bg-sand p-6 md:flex-row md:items-center md:p-8">
              <ul className="flex flex-wrap gap-2">
                {training.promises.map((p) => (
                  <li key={p} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm">
                    <Check size={14} className="text-accent-deep" /> {p}
                  </li>
                ))}
              </ul>
              <a
                href={mailto}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-xs font-medium uppercase tracking-wide text-white hover:bg-accent-deep"
              >
                Demander le programme <ArrowUpRight size={14} />
              </a>
            </div>
            {/* À COMPLÉTER : dates, lieux, tarifs et prérequis des sessions */}
            <p className="mt-6 text-xs text-muted">
              Dates, lieux et modalités des prochaines sessions communiqués sur demande.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
