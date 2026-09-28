"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { TechnologyCard } from "@/components/technologies/TechnologyCard";
import { categories, technologies, type CategoryKey } from "@/content/technologies";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function TechnologyGrid({
  locale,
  readMoreLabel,
}: {
  locale: Locale;
  readMoreLabel: string;
}) {
  // Pas de filtre « Toutes » : une gamme est toujours sélectionnée (la première par défaut).
  const [active, setActive] = useState<CategoryKey>(Object.keys(categories)[0] as CategoryKey);
  const [query, setQuery] = useState("");
  const t = locale === "fr"
    ? { search: "Rechercher une technologie", clear: "Effacer", none: "Aucune technologie ne correspond à votre recherche.", results: "résultats" }
    : { search: "Search a technology", clear: "Clear", none: "No technology matches your search.", results: "results" };

  // Arrivée depuis une carte « univers » de l'accueil : /technologies#lasers
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && hash in categories) setActive(hash as CategoryKey); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  // Recherche insensible aux accents, à la casse et aux apostrophes (« frac cov » trouve « FRAC’COV 4 »).
  const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9+]/g, "");
  const filtered = useMemo(() => {
    const q = norm(query);
    return technologies.filter(
      (tech) =>
        // Une recherche porte sur toutes les gammes ; sans recherche, on affiche la gamme sélectionnée.
        q ? norm(tech.name).includes(q) || norm(categories[tech.category][locale]).includes(q) : tech.category === active
    );
  }, [active, query, locale]);

  const categoryKeys = Object.keys(categories) as CategoryKey[];

  return (
    <div>
      <div className="relative mb-4 max-w-md">
        <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-deep-soft" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.search}
          aria-label={t.search}
          className="glass-soft w-full rounded-full py-3 pl-11 pr-11 font-sans text-sm text-deep placeholder:text-deep-soft/80 focus:bg-white focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label={t.clear}
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-deep-soft hover:text-deep"
          >
            <X size={15} />
          </button>
        )}
      </div>
      <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 sm:mx-0 sm:flex-wrap sm:px-0">
        {categoryKeys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setActive(key);
              setQuery("");
            }}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full px-4 py-2 font-sans text-sm transition-colors",
              active === key && !query
                ? "glass-strong text-deep"
                : "glass-soft text-deep-soft hover:text-deep"
            )}
            
          >
            {categories[key][locale]}
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">{filtered.length} {t.results}</p>
      {filtered.length === 0 && <p className="mt-8 font-sans text-sm text-deep-soft">{t.none}</p>}
      <RevealGroup key={active + query} className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tech) => (
          <RevealItem key={tech.slug}>
            <TechnologyCard technology={tech} locale={locale} readMoreLabel={readMoreLabel} />
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
