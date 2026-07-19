import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { categories, type Technology } from "@/content/technologies";
import type { Locale } from "@/lib/i18n/config";

export function TechnologyCard({
  technology,
  locale,
  readMoreLabel,
}: {
  technology: Technology;
  locale: Locale;
  readMoreLabel: string;
}) {
  return (
    <Link
      href={`/${locale}/technologies/${technology.slug}`}
      className="group flex flex-col justify-between border border-hairline bg-warm-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(26,24,20,0.18)]"
    >
      <div>
        <span
          className="font-label text-muted"
          style={{ fontSize: "10px", letterSpacing: "0.15em" }}
        >
          {categories[technology.category][locale].toUpperCase()}
        </span>
        <h3 className="font-heading mt-4 text-2xl font-light text-ink">
          {technology.name}
        </h3>
        <p className="font-body mt-3 text-sm font-light leading-relaxed text-ink-soft">
          {technology.tagline[locale]}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {technology.certifications.map((cert) => (
            <Badge key={cert}>{cert}</Badge>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 font-body text-sm text-ink transition-transform duration-300 group-hover:translate-x-1">
        {readMoreLabel}
        <ArrowUpRight size={16} />
      </div>
    </Link>
  );
}
