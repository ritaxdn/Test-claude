import fs from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/i18n/config";
import { partners } from "@/content/partners";

const label = { fr: "Nos partenaires", en: "Our partners" } as const;

// Cherche un logo déposé dans public/images/partners/<id>.(svg|png|webp).
function logoFor(id: string) {
  for (const ext of ["svg", "png", "webp"]) {
    const file = `/images/partners/${id}.${ext}`;
    if (fs.existsSync(path.join(process.cwd(), "public", file))) return file;
  }
  return null;
}

/** Bande défilante des partenaires : logos en niveaux de gris, couleur au survol. */
export function PartnersBand({ locale }: { locale: Locale }) {
  const items = partners.map((p) => ({ ...p, logo: logoFor(p.id) }));
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((p) => (
        <li key={p.id} className="flex h-12 items-center px-8 md:px-12">
          {p.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.logo}
              alt={hidden ? "" : p.name}
              className="h-7 w-auto max-w-[9rem] object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 md:h-8"
            />
          ) : (
            <span className="display whitespace-nowrap text-lg text-deep/55 transition-colors duration-300 hover:text-deep md:text-xl">
              {p.name}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label={label[locale]} className="px-3 py-6 md:px-5 md:py-10">
      <p className="data-label mx-auto mb-4 max-w-7xl px-3 text-deep-soft md:px-7">{label[locale]}</p>
      <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className="ticker-track flex w-max group-hover:[animation-play-state:paused]">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
