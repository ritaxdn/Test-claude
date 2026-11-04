import type { Metadata } from "next";
import { PublicShell } from "@/components/PublicShell";
import { catalog, fmtDuration } from "@/lib/catalog";
import { fmtPrice } from "@/lib/professions";

export const metadata: Metadata = { title: "Formations", description: "Formations en ligne en médecine esthétique, conçues et présentées par les experts de CELLULIFT Academy." };
export const dynamic = "force-dynamic";

export default async function Formations() {
  const items = await catalog();
  return (
    <PublicShell>
      <div className="page-head">
        <div><span className="eyebrow">LIFT by CELLULIFT Academy</span><h1 className="display h1">Les <span className="iri">formations</span></h1>
          <p className="muted" style={{ marginTop: 12, maxWidth: 640 }}>Des parcours structurés, présentés par des praticiens, avec leurs protocoles. Ouverts aux professionnels éligibles, après vérification de la qualification.</p></div>
      </div>
      {items.length === 0 ? (
        <div className="glass card stack" style={{ gap: 8 }}>
          <b>Catalogue en préparation</b>
          <p className="muted">Les premières formations seront annoncées ici. Aucune inscription n&apos;est ouverte pour l&apos;instant.</p>
        </div>
      ) : (
        <div className="grid g2">
          {items.map((p) => {
            const price = fmtPrice(p.price_mad, "MAD") ?? fmtPrice(p.price_eur, "EUR") ?? fmtPrice(p.price_usd, "USD");
            return (
              <article key={p.id} className="glass card stack">
                <span className="eyebrow">Formation en ligne</span>
                <h2 className="display h2"><a href={`/formations/${p.slug}`} style={{ textDecoration: "none" }}>{p.title}</a></h2>
                {(p.tagline ?? p.summary) && <p className="muted small">{p.tagline ?? p.summary}</p>}
                <p className="small">{[`${p.lessons} leçon${p.lessons > 1 ? "s" : ""}`, fmtDuration(p.duration_sec), p.presenters.length ? `avec ${p.presenters.map((x) => x.name).join(", ")}` : null].filter(Boolean).join(" · ")}</p>
                <div className="row between wrap">
                  <b>{price ?? "Tarif communiqué sur demande"}</b>
                  <a className="btn solid" href={`/formations/${p.slug}`}>Découvrir la formation</a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </PublicShell>
  );
}
