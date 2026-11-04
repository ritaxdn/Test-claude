import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/PublicShell";
import { catalogItem, syllabus, fmtDuration } from "@/lib/catalog";
import { fmtPrice, professionLabel } from "@/lib/professions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await catalogItem((await params).slug);
  return p ? { title: p.title, description: p.tagline ?? p.summary ?? undefined } : { title: "Formation introuvable" };
}

export default async function Fiche({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[a-z0-9-]{2,80}$/.test(slug)) notFound();
  const p = await catalogItem(slug);
  if (!p) notFound();
  const lessons = await syllabus(p.id);
  const modules = [...new Map(lessons.map((l) => [l.module_position, l.module_title])).entries()];
  const prices = [fmtPrice(p.price_mad, "MAD"), fmtPrice(p.price_eur, "EUR"), fmtPrice(p.price_usd, "USD")].filter(Boolean);
  return (
    <PublicShell>
      <p className="crumbs mono"><a href="/formations">Formations</a> / {p.title}</p>
      <div className="page-head">
        <div><span className="eyebrow">Formation en ligne · {[`${p.lessons} leçon${p.lessons > 1 ? "s" : ""}`, fmtDuration(p.duration_sec)].filter(Boolean).join(" · ")}</span>
          <h1 className="display h1">{p.title}</h1>
          {(p.tagline ?? p.summary) && <p className="muted" style={{ marginTop: 12, maxWidth: 680 }}>{p.tagline ?? p.summary}</p>}</div>
      </div>
      <div className="cols">
        <div className="stack">
          {p.objectives.length > 0 && (
            <section className="glass card stack" style={{ gap: 10 }} aria-labelledby="h-obj">
              <h2 id="h-obj" className="eyebrow">Objectifs pédagogiques</h2>
              <ul className="stack" style={{ gap: 6, margin: 0, paddingLeft: 18 }}>{p.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
            </section>
          )}
          <section className="glass card stack" style={{ gap: 12 }} aria-labelledby="h-prog">
            <h2 id="h-prog" className="eyebrow">Programme</h2>
            {modules.map(([pos, title]) => (
              <div key={pos} className="stack" style={{ gap: 6 }}>
                <b>Module {pos} · {title}</b>
                <div className="list">
                  {lessons.filter((l) => l.module_position === pos).map((l) => (
                    <div key={l.title} className="item small"><span style={{ flex: 1 }}>{l.title}</span><span className="muted">{fmtDuration(l.duration_sec ?? 0) ?? ""}</span></div>
                  ))}
                </div>
              </div>
            ))}
          </section>
          {p.presenters.length > 0 && (
            <section className="glass card stack" style={{ gap: 10 }} aria-labelledby="h-int">
              <h2 id="h-int" className="eyebrow">Intervenants</h2>
              {p.presenters.map((x) => <div key={x.name}><b>{x.name}</b>{x.title && <div className="small muted">{x.title}</div>}</div>)}
            </section>
          )}
        </div>
        <aside className="stack">
          <section className="glass card stack" style={{ gap: 12 }} aria-labelledby="h-acc">
            <h2 id="h-acc" className="eyebrow">Accès</h2>
            <b style={{ fontSize: 22 }}>{prices.length ? prices.join(" · ") : "Tarif communiqué sur demande"}</b>
            <ul className="small stack" style={{ gap: 6, margin: 0, paddingLeft: 18 }}>
              <li>Ouvert aux professionnels : {p.eligible_professions.map(professionLabel).join(", ")}.</li>
              <li>Votre qualification est vérifiée par l&apos;équipe CELLULIFT Academy avant l&apos;accès.</li>
              <li>Paiement par virement, avec une référence unique, après validation de votre demande.</li>
              {p.access_months && <li>Accès en ligne pendant {p.access_months} mois, sur ordinateur et téléphone.</li>}
            </ul>
            {p.audience && <p className="small"><b>Public :</b> {p.audience}</p>}
            {p.prerequisites && <p className="small"><b>Prérequis :</b> {p.prerequisites}</p>}
            <a className="btn solid" href={`/formations/${p.slug}/inscription`}>Demander mon inscription</a>
            <p className="small muted">Une formation en ligne n&apos;habilite pas à pratiquer un acte.</p>
          </section>
        </aside>
      </div>
    </PublicShell>
  );
}
