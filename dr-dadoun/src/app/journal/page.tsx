import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { articles, expertise } from "@/content/journal";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Le savoir du Dr Dadoun : articles pour comprendre le vieillissement du visage, les injections et les soins de la peau.",
};

export default function Journal() {
  return (
    <>
      <Header />
      <main className="pb-24 pt-32 md:pb-32 md:pt-40">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <p className="eyebrow">Le Journal</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] md:text-6xl">
            Comprendre avant de <em className="text-rose-deep">traiter</em>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Un patient bien informé fait des choix éclairés. Dans ces articles, le Dr Dadoun partage
            son savoir et sa vision de la médecine esthétique — sans jargon, ni promesse excessive.
          </p>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {articles.map((a, i) => (
              <ArticleCard key={a.slug} article={a} index={i} />
            ))}
          </div>

          <section className="mt-24 rounded-3xl bg-ink p-8 text-porcelain md:p-12">
            <p className="eyebrow !text-blush">Domaines d&apos;expertise</p>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {expertise.map((e) => (
                <div key={e.title}>
                  <h2 className="font-display text-2xl">{e.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-porcelain/70">{e.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
