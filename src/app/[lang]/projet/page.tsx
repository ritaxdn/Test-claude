import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { Pill } from "@/components/system/Cta";
import { ProjectJourney } from "@/components/project/ProjectJourney";
import { isJourneyChoice, journeyMode } from "@/lib/project-journey";

// Page de prévisualisation du parcours « Développons votre projet ensemble ».
// Non indexée, absente du plan du site et non reliée à la navigation tant que le parcours n'est pas validé.
// ?domaine=epilation-laser (etc.) présélectionne le domaine, comme le fera une fiche machine.

const text = {
  fr: {
    meta: "Développons votre projet ensemble",
    eyebrow: "Accompagnement personnalisé",
    title: "Développons votre projet ensemble.",
    subtitle: "Quatre étapes pour nous dire qui vous êtes et ce que vous voulez construire. Un expert CELLULIFT prépare ensuite un échange adapté à votre projet.",
    pillars: ["Technologie", "Expertise", "Formation", "SAV", "Accompagnement"],
    prototype: "Prototype en cours de validation : aucune demande n'est envoyée.",
  },
  en: {
    meta: "Let's build your project together",
    eyebrow: "Personalised support",
    title: "Let's build your project together.",
    subtitle: "Four steps to tell us who you are and what you want to build. A CELLULIFT expert then prepares a conversation suited to your project.",
    pillars: ["Technology", "Expertise", "Training", "After-sales", "Support"],
    prototype: "Prototype under review: no request is sent.",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: text[lang].meta, robots: { index: false, follow: false } };
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ domaine?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { domaine } = await searchParams;
  const c = text[lang];

  return (
    <section className="px-3 pb-20 pt-10 md:px-5 md:pt-14">
      {/* Téléphone : titre → parcours → piliers. Grand écran : titre et piliers à gauche, parcours à droite. */}
      <div className="mx-auto grid max-w-7xl gap-8 px-3 md:px-7 lg:grid-cols-[0.8fr_1.2fr] lg:gap-x-14 lg:gap-y-0">
        <div className="animate-fade-rise opacity-0 lg:col-start-1 lg:row-start-1">
          <Pill className="bg-white/60">{c.eyebrow}</Pill>
          <h1 className="display mt-5 text-balance text-[clamp(2rem,4.2vw,3.6rem)] leading-[1] text-deep">{c.title}</h1>
          <p className="mt-5 max-w-md font-sans text-base leading-relaxed text-deep-soft md:text-lg">{c.subtitle}</p>
        </div>

        <ProjectJourney
          locale={lang}
          defaultDomain={isJourneyChoice("domaine", domaine) ? domaine : undefined}
          className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start"
        />

        <div className="lg:col-start-1 lg:row-start-2 lg:mt-8">
          {/* Les cinq piliers CELLULIFT, en lecture d'instrument */}
          <ol className="max-w-sm border-t border-deep/15">
            {c.pillars.map((p, i) => (
              <li key={p} className="flex items-baseline gap-4 border-b border-deep/15 py-3">
                <span className="data-label w-6 text-deep-soft">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-sans text-sm font-medium text-deep">{p}</span>
              </li>
            ))}
          </ol>
          {journeyMode === "prototype" && (
            <p className="mt-6 inline-flex rounded-full border border-dashed border-deep/30 px-3 py-1.5 font-sans text-xs text-deep-soft">{c.prototype}</p>
          )}
        </div>
      </div>
    </section>
  );
}
