import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDate, type Article } from "@/content/journal";

export function ArticleCard({ article, index }: { article: Article; index: number }) {
  return (
    <Link
      href={`/journal/${article.slug}`}
      className="group flex flex-col rounded-3xl border border-line bg-porcelain p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(42,32,29,0.4)]"
    >
      <div className="flex items-center justify-between text-xs">
        <span className="eyebrow">{article.category}</span>
        <span className="font-display text-sm italic text-muted">N° {String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="mt-6 font-display text-2xl leading-snug">{article.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{article.excerpt}</p>
      <div className="mt-6 flex items-center justify-between border-t border-line pt-5 text-xs text-muted">
        <span>
          {formatDate(article.date)} · {article.readingTime}
        </span>
        <ArrowUpRight size={16} className="text-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
