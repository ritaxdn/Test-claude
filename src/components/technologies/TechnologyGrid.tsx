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

  const filterButton = (key: CategoryKey | "all", label: string) => (
    <button
      key={key}
      type="button"
      onClick={() => setActive(key)}
      className={cn(
        "font-label block border-l-2 py-2 pl-4 text-left transition-colors",
        active === key
          ? "border-ink text-ink"
          : "border-transparent text-muted hover:border-light hover:text-ink-soft"
      )}
      style={{ fontSize: "12px", letterSpacing: "0.1em" }}
    >
      {label.toUpperCase()}
    </button>
  );

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-6">
      <div className="flex flex-row flex-wrap gap-x-6 gap-y-2 md:col-span-2 md:flex-col md:gap-0 md:border-l md:border-hairline">
        {filterButton("all", allLabel)}
        {categoryKeys.map((key) => filterButton(key, categories[key][locale]))}
      </div>

      <div className="md:col-span-10">
        <RevealGroup className="border-t border-hairline">
          {filtered.map((tech, i) => (
            <RevealItem key={tech.slug}>
              <TechnologyCard
                technology={tech}
                locale={locale}
                readMoreLabel={readMoreLabel}
                index={i + 1}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </div>
  );
}
