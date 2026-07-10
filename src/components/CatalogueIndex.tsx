"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { getProductsByCategory } from "@/lib/data/products";
import { TechDiagram } from "@/components/illustrations/TechDiagram";

export function CatalogueIndex() {
  const [activeSlug, setActiveSlug] = useState(categories[0].slug);
  const active = categories.find((category) => category.slug === activeSlug) ?? categories[0];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
      <ol className="divide-y divide-border border-y border-border">
        {categories.map((category, index) => {
          const count = getProductsByCategory(category.slug).length;
          const isActive = category.slug === activeSlug;
          return (
            <li key={category.slug}>
              <Link
                href={`/catalogue/${category.slug}`}
                onMouseEnter={() => setActiveSlug(category.slug)}
                onFocus={() => setActiveSlug(category.slug)}
                className="group flex items-center gap-5 py-6"
              >
                <span
                  className={`font-display text-lg transition-colors duration-fast ${
                    isActive ? "text-bronze-dark" : "text-graphite-soft"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <p
                    className={`font-display text-xl transition-colors duration-fast md:text-2xl ${
                      isActive ? "text-ink" : "text-ink-soft"
                    }`}
                  >
                    {category.name}
                  </p>
                  <p className="mt-1 text-sm text-graphite">{category.shortDescription}</p>
                </div>
                <span className="hidden shrink-0 text-xs font-medium tracking-wide text-graphite-soft sm:inline">
                  {count} machine{count > 1 ? "s" : ""}
                </span>
                <ArrowUpRight
                  className={`h-5 w-5 shrink-0 transition-all duration-fast ${
                    isActive ? "translate-x-0.5 -translate-y-0.5 text-bronze-dark" : "text-graphite-soft"
                  }`}
                  aria-hidden
                />
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
        <div className="border border-border bg-paper-alt p-10">
          <TechDiagram motif={active.motif} className="mx-auto w-full max-w-[280px]" />
          <p className="mt-6 font-display text-2xl text-ink">{active.name}</p>
          <p className="mt-3 text-sm leading-relaxed text-graphite">{active.narrative}</p>
          <div className="mt-6 flex items-baseline gap-2 border-t border-border pt-6">
            <span className="font-display text-2xl text-bronze-dark">{active.stat.value}</span>
            <span className="text-xs text-graphite-soft">{active.stat.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
