"use client";

import { useEffect, useMemo, useState } from "react";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { TechnologyCard } from "@/components/technologies/TechnologyCard";
import { categories, technologies, type CategoryKey } from "@/content/technologies";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function TechnologyGrid({
  locale,
  allLabel,
  readMoreLabel,
}: {
  locale: Locale;
  allLabel: string;
  readMoreLabel: string;
}) {
  const [active, setActive] = useState<CategoryKey | "all">("all");

  // Arrivée depuis une carte « univers » de l'accueil : /technologies#lasers
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && hash in categories) setActive(hash as CategoryKey); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const filtered = useMemo(
    () => (active === "all" ? technologies : technologies.filter((t) => t.category === active)),
    [active]
  );

  const categoryKeys = Object.keys(categories) as CategoryKey[];

  return (
    <div>
      <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 sm:mx-0 sm:flex-wrap sm:px-0">
        <button
          type="button"
          onClick={() => setActive("all")}
          className={cn(
            "shrink-0 whitespace-nowrap rounded-full px-4 py-2 font-sans text-sm transition-colors",
              active === "all"
                ? "glass-strong text-deep"
                : "glass-soft text-deep-soft hover:text-deep"
          )}
          
        >
          {allLabel}
        </button>
        {categoryKeys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full px-4 py-2 font-sans text-sm transition-colors",
              active === key
                ? "glass-strong text-deep"
                : "glass-soft text-deep-soft hover:text-deep"
            )}
            
          >
            {categories[key][locale]}
          </button>
        ))}
      </div>

      <RevealGroup className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tech) => (
          <RevealItem key={tech.slug}>
            <TechnologyCard technology={tech} locale={locale} readMoreLabel={readMoreLabel} />
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
