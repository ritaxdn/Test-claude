"use client";

import { useMemo, useState } from "react";
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

  const filtered = useMemo(
    () => (active === "all" ? technologies : technologies.filter((t) => t.category === active)),
    [active]
  );

  const categoryKeys = Object.keys(categories) as CategoryKey[];

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActive("all")}
          className={cn(
            "font-label rounded-full border px-4 py-2 transition-colors",
            active === "all"
              ? "border-ink bg-ink text-warm-white"
              : "border-light text-ink-soft hover:border-ink hover:text-ink"
          )}
          style={{ fontSize: "11px", letterSpacing: "0.08em" }}
        >
          {allLabel}
        </button>
        {categoryKeys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={cn(
              "font-label rounded-full border px-4 py-2 transition-colors",
              active === key
                ? "border-ink bg-ink text-warm-white"
                : "border-light text-ink-soft hover:border-ink hover:text-ink"
            )}
            style={{ fontSize: "11px", letterSpacing: "0.08em" }}
          >
            {categories[key][locale]}
          </button>
        ))}
      </div>

      <RevealGroup className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tech) => (
          <RevealItem key={tech.slug}>
            <TechnologyCard technology={tech} locale={locale} readMoreLabel={readMoreLabel} />
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
