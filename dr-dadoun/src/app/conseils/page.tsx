import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { practice } from "@/content/site";
import { publishedArticles } from "@/content/articles";
import { absolute, breadcrumb } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Conseils de médecine esthétique",
  description:
    "Les réponses du Dr Dadoun, médecin esthétique à Casablanca, aux questions des patients : Botox, acide hyaluronique, fils tenseurs, lasers, qualité de peau.",
  alternates: { canonical: "/conseils" },
  openGraph: { url: "/conseils" },
};

const section = "mx-auto max-w-6xl px-5 md:px-8";

export default function ConseilsPage() {
  const list = publishedArticles();
  if (!list.length) notFound();

  return (
    <>
      <Header />
      <main>
        <section className="p-2 md:p-3">
          <div className="relative overflow-hidden rounded-[1.75rem] mesh-3">
            <div className="absolute inset-0 bg-gradient-to-t from-[#07343c]/80 via-[#07343c]/35 to-[#07343c]/10" />
            <div className={`${section} relative pb-10 pt-32 text-white md:pb-14 md:pt-40`}>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/80">Conseils · {practice.city}</p>
              <h1 className="mt-3 font-display text-4xl sm:text-5xl font-medium leading-[0.95] md:text-7xl">Vos questions, mes réponses</h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90">
                Ce que les patients me demandent le plus souvent en consultation, expliqué simplement.
              </p>
            </div>
          </div>
        </section>

        <section className={`${section} py-20 md:py-28`}>
          <ul className="grid gap-3 md:grid-cols-2">
            {list.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/conseils/${a.slug}`}
                  className="group flex h-full flex-col justify-between gap-6 rounded-2xl border border-line bg-white p-6 transition-colors hover:border-ink/25 md:p-8"
                >
                  <div>
                    <h2 className="text-balance font-display text-2xl font-medium md:text-3xl">{a.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">{a.description}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-accent-deep">
                    Lire <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
      <JsonLd
        data={breadcrumb([
          { name: "Accueil", path: "/" },
          { name: "Conseils", path: "/conseils" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Conseils de médecine esthétique",
          url: absolute("/conseils"),
          inLanguage: "fr-MA",
          isPartOf: { "@id": absolute("/#site") },
          hasPart: list.map((a) => ({ "@type": "MedicalWebPage", name: a.title, url: absolute(`/conseils/${a.slug}`) })),
        }}
      />
    </>
  );
}
