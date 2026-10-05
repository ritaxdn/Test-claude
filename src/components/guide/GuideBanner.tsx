import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { guideCover } from "@/content/guide";

const text = {
  fr: {
    eyebrow: "Guide gratuit",
    title: "Avant d'investir : les 7 questions à se poser.",
    cta: "Recevoir le guide",
  },
  en: {
    eyebrow: "Free guide",
    title: "Before you invest: the 7 questions to ask.",
    cta: "Get the guide",
  },
} as const;

/** Encart vers le guide gratuit (accueil, technologies, fiches machine). */
export function GuideBanner({ locale, className = "" }: { locale: Locale; className?: string }) {
  const t = text[locale];
  return (
    <Link
      href={`/${locale}/guide`}
      className={`glass group flex items-center gap-5 rounded-[1.75rem] p-4 pr-6 transition-transform hover:-translate-y-1 md:gap-7 md:p-5 md:pr-8 ${className}`}
    >
      <Image src={guideCover} alt="" width={640} height={905} sizes="80px" className="w-14 shrink-0 rounded-md shadow-[0_12px_30px_-14px_rgba(29,27,38,.5)] md:w-20" />
      <span className="min-w-0 flex-1">
        <span className="data-label block text-deep-soft">{t.eyebrow}</span>
        <span className="mt-1.5 block font-sans text-base font-medium text-deep md:text-lg">{t.title}</span>
      </span>
      <span className="hidden shrink-0 items-center gap-2 rounded-full bg-deep px-5 py-3 font-sans text-sm text-white sm:inline-flex">
        {t.cta} <ArrowUpRight size={15} className="transition-transform group-hover:rotate-45" />
      </span>
      <ArrowUpRight size={20} className="shrink-0 text-deep sm:hidden" />
    </Link>
  );
}
