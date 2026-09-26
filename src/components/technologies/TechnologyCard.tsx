import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories, type Technology } from "@/content/technologies";
import type { Locale } from "@/lib/i18n/config";

export function TechnologyCard({ technology, locale }: { technology: Technology; locale: Locale; readMoreLabel?: string }) {
  return (
    <Link
      href={`/${locale}/technologies/${technology.slug}`}
      className="glass group flex h-full items-center justify-between gap-4 rounded-[1.5rem] p-5 transition-transform duration-300 hover:-translate-y-0.5"
    >
      {technology.images?.[0] && (
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl">
          <Image src={technology.images[0]} alt="" fill sizes="56px" className="object-cover" />
        </span>
      )}
      <span className="mr-auto">
        <span className="data-label block text-deep-soft">{categories[technology.category][locale]}</span>
        <span className="display mt-2 block text-lg text-deep">{technology.name}</span>
        {technology.tagline && <span className="mt-1 block font-sans text-sm text-deep-soft">{technology.tagline[locale]}</span>}
      </span>
      <span className="glass-strong flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-deep transition-transform duration-300 group-hover:rotate-45">
        <ArrowUpRight size={15} strokeWidth={1.75} />
      </span>
    </Link>
  );
}
