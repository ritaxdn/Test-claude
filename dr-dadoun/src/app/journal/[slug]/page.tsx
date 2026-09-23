import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { articles, formatDate, getArticle } from "@/content/journal";
import { doctor, practice } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { type: "article", title: article.title, description: article.excerpt },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();

  const others = articles.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <>
      <Header />
      <main className="pb-24 pt-32 md:pt-40">
        <article className="mx-auto max-w-3xl px-5 md:px-8">
          <Link href="/journal" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
            <ArrowLeft size={16} /> Tous les articles
          </Link>
          <p className="eyebrow mt-10">{article.category}</p>
          <h1 className="mt-4 font-display font-medium text-4xl leading-[1.1] md:text-5xl">{article.title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">{article.excerpt}</p>
          <p className="mt-6 text-sm text-muted">
            Par {doctor.name} · {formatDate(article.date)} · Lecture {article.readingTime}
          </p>

          <aside className="mt-10 rounded-3xl bg-sand p-7">
            <p className="eyebrow">L&apos;essentiel</p>
            <ul className="mt-4 space-y-3">
              {article.takeaways.map((t) => (
                <li key={t} className="flex gap-3 text-sm leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </aside>

          <div className="mt-12 space-y-10">
            {article.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="font-display text-3xl font-medium">{s.heading}</h2>
                {s.paragraphs.map((p) => (
                  <p key={p.slice(0, 32)} className="mt-4 text-[1.05rem] leading-[1.8] text-ink-soft">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <p className="mt-12 border-t border-line pt-6 text-xs leading-relaxed text-muted">
            Cet article a une vocation informative et ne remplace pas une consultation médicale.
          </p>

          <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink p-8 text-porcelain sm:flex-row sm:items-center">
            <div>
              <p className="font-display text-2xl">Une question sur votre situation ?</p>
              <p className="mt-1 text-sm text-porcelain/70">Parlons-en lors d&apos;une consultation.</p>
            </div>
            <Link
              href={practice.bookingUrl}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-porcelain px-6 py-3 text-sm font-medium text-ink hover:bg-accent-soft"
            >
              Prendre rendez-vous <ArrowUpRight size={16} />
            </Link>
          </div>
        </article>

        <section className="mx-auto mt-24 max-w-6xl px-5 md:px-8">
          <p className="eyebrow">À lire aussi</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {others.map((a) => (
              <ArticleCard key={a.slug} article={a} index={articles.indexOf(a)} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
