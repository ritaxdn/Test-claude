import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDate, type Article } from "@/content/journal";

export function ArticleCard({ article, index }: { article: Article; index: number }) {
  return (
    <Link
      href={`/journal/${article.slug}`}
      className="group flex flex-col rounded-2xl bg-sand p-6 transition-colors duration-300 hover:bg-accent-soft/50"
    >
      <div className="flex items-center justify-between text-xs">
        <span className="eyebrow">{article.category}</span>
        <span className="font-display text-sm font-medium text-muted">N° {String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="mt-6 font-display text-2xl font-medium leading-tight">{article.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{article.excerpt}</p>
      <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-5 text-xs text-muted">
        <span>
          {formatDate(article.date)} · {article.readingTime}
        </span>
        <ArrowUpRight size={16} className="text-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
