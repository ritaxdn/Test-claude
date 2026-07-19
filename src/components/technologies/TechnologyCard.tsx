import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HoverFollow } from "@/components/ui/HoverFollow";
import { categories, categoryPlateClass, type Technology } from "@/content/technologies";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function TechnologyCard({
  technology,
  locale,
  readMoreLabel,
  index,
}: {
  technology: Technology;
  locale: Locale;
  readMoreLabel: string;
  index?: number;
}) {
  return (
    <HoverFollow label={readMoreLabel} className="group relative border-b border-hairline">
      <Link
        href={`/${locale}/technologies/${technology.slug}`}
        className={cn(
          "relative grid grid-cols-1 gap-4 px-1 py-9 transition-colors duration-500 md:grid-cols-12 md:items-center md:gap-6 md:px-6",
          "group-hover:text-warm-white"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 -z-10 origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-x-100",
            categoryPlateClass[technology.category]
          )}
        />

        {typeof index === "number" && (
          <span
            className="font-label hidden text-current opacity-50 md:col-span-1 md:block"
            style={{ fontSize: "12px", letterSpacing: "0.1em" }}
          >
            {String(index).padStart(2, "0")}
          </span>
        )}

        <div className="md:col-span-5">
          <span
            className="font-label block text-current opacity-50 md:hidden"
            style={{ fontSize: "11px", letterSpacing: "0.12em" }}
          >
            {categories[technology.category][locale].toUpperCase()}
          </span>
          <h3 className="font-heading mt-1 text-3xl font-light md:mt-0 md:text-4xl">
            {technology.name}
          </h3>
        </div>

        <p className="font-body text-sm font-light leading-relaxed opacity-80 md:col-span-4">
          {technology.tagline[locale]}
        </p>

        <span
          className="font-label hidden text-current opacity-50 md:col-span-1 md:block"
          style={{ fontSize: "11px", letterSpacing: "0.1em" }}
        >
          {categories[technology.category][locale].toUpperCase()}
        </span>

        <div className="flex items-center justify-between md:col-span-1 md:justify-end">
          <div className="flex flex-wrap gap-2 md:hidden">
            {technology.certifications.map((cert) => (
              <span
                key={cert}
                className="font-label border border-current px-2 py-1 opacity-60"
                style={{ fontSize: "9px", letterSpacing: "0.08em" }}
              >
                {cert}
              </span>
            ))}
          </div>
          <ArrowUpRight
            size={20}
            className="shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </div>
      </Link>
    </HoverFollow>
  );
}
