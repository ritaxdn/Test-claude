import type { Metadata } from "next";
import { Shell, Progress, pct, fmtDate } from "@/components/Shell";
import { requireUser } from "@/lib/auth";
import { myPrograms, programLessons } from "@/lib/access";
import { sql } from "@/lib/db";

export const metadata: Metadata = { title: "Ma formation" };

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ bienvenue?: string }> }) {
  const user = await requireUser();
  const { bienvenue } = await searchParams;
  const machines = await sql<{ id: string; name: string; family: string | null; serial_number: string | null; clinic: string | null; installed_on: Date | null }[]>`
    select o.id, dm.name, dm.family, o.serial_number, o.clinic, o.installed_on from device_ownerships o join device_models dm on dm.id = o.device_model_id
     where o.user_id = ${user.id} and o.revoked_at is null order by o.created_at`;
  const programs = await myPrograms(user.id);
  const next = await Promise.all(programs.map(async (p) => (await programLessons(user.id, p.id)).find((l) => !l.completed_at)));
  const first = user.full_name.startsWith("Dr") ? user.full_name : user.full_name.split(" ")[0];
  return (
    <Shell user={user} active="/tableau-de-bord">
      {bienvenue && <p className="alert ok" role="status" style={{ marginBottom: 20 }}>Votre accès est créé. Bienvenue sur CELLULIFT Academy.</p>}
      <div className="page-head">
        <div><span className="eyebrow">Ma formation</span><h1 className="display h1">Bonjour, <span className="iri">{first}</span></h1></div>
      </div>

      <section aria-labelledby="h-machines" style={{ marginBottom: 30 }}>
        <h2 id="h-machines" className="eyebrow" style={{ marginBottom: 12 }}>Mes machines</h2>
        {machines.length === 0 ? (
          <div className="glass card"><p className="muted">Aucune machine n'est encore liée à votre compte. Votre conseiller CELLULIFT l'ajoutera après l'installation.</p></div>
        ) : (
          <div className="grid g3">
            {machines.map((m) => (
              <div key={m.id} className="glass card stack" style={{ gap: 6 }}>
                <span className="mono">{m.family ?? "Machine"}</span>
                <b style={{ fontSize: 18 }}>{m.name}</b>
                <span className="small muted">{[m.serial_number && `N° de série ${m.serial_number}`, m.clinic, m.installed_on && `installée le ${fmtDate(m.installed_on)}`].filter(Boolean).join(" · ") || "—"}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="h-parcours">
        <h2 id="h-parcours" className="eyebrow" style={{ marginBottom: 12 }}>Mes parcours</h2>
        {programs.length === 0 ? (
          <div className="glass card"><p className="muted">Aucun parcours disponible pour l'instant.</p></div>
        ) : (
          <div className="grid g2">
            {programs.map((p, i) => {
              const v = pct(p.done, p.lessons);
              const n = next[i];
              return (
                <article key={p.id} className="glass card stack">
                  <div className="row between wrap">
                    {p.device_name && <span className="badge rb">Inclus avec votre {p.device_name}</span>}
                    {p.completed ? <span className="badge ok">Formation terminée</span> : v > 0 ? <span className="badge">En cours</span> : <span className="badge">À commencer</span>}
                  </div>
                  <h3 className="display h2">{p.title}</h3>
                  {p.summary && <p className="muted small">{p.summary}</p>}
                  {p.presenters && <p className="small">Avec <b>{p.presenters}</b></p>}
                  <Progress value={v} label={`Progression ${p.title}`} />
                  <p className="small muted">{p.done} leçon{p.done > 1 ? "s" : ""} sur {p.lessons}{p.last_activity ? ` · dernière activité le ${fmtDate(p.last_activity)}` : ""}</p>
                  <div className="row wrap">
                    {p.completed ? (
                      <a className="btn" href={`/parcours/${p.slug}`}>Revoir le parcours</a>
                    ) : n ? (
                      <a className="btn solid" href={`/parcours/${p.slug}/${n.lesson_id}`}>{v ? "Reprendre" : "Commencer"} · {n.title}</a>
                    ) : null}
                    <a className="btn ghost" href={`/parcours/${p.slug}`}>Programme et documents</a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </Shell>
  );
}
