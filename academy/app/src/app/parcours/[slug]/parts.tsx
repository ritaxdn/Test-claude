import type { LessonRow } from "@/lib/access";

const mmss = (s: number | null) => (s ? `${Math.floor(s / 60)} min${s % 60 ? ` ${String(s % 60).padStart(2, "0")}` : ""}` : "");

const initials = (name: string) => name.replace(/^Dr\.?\s+/i, "").split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export function Presenter({ name, title }: { name: string; title: string | null }) {
  return (
    <div className="row" style={{ marginTop: 14 }}>
      <span className="avatar" aria-hidden="true">{initials(name)}</span>
      <div><span className="small muted">Présenté par</span><div style={{ fontWeight: 600 }}>{name}</div>{title && <div className="small muted">{title}</div>}</div>
    </div>
  );
}

export function Presenters({ lessons }: { lessons: LessonRow[] }) {
  const list = [...new Map(lessons.filter((l) => l.presenter_name).map((l) => [l.presenter_name!, l.presenter_title])).entries()];
  if (!list.length) return null;
  return (
    <section className="glass card stack" style={{ gap: 12 }} aria-labelledby="h-pres">
      <h2 id="h-pres" className="eyebrow">{list.length > 1 ? "Intervenants" : "Intervenant"}</h2>
      {list.map(([name, title]) => (
        <div key={name} className="row"><span className="avatar" aria-hidden="true">{initials(name)}</span><div><b className="small">{name}</b>{title && <div className="small muted">{title}</div>}</div></div>
      ))}
    </section>
  );
}

export function LessonList({ slug, lessons, current, showPresenter }: { slug: string; lessons: LessonRow[]; current?: string; showPresenter?: boolean }) {
  const modules = [...new Map(lessons.map((l) => [l.module_id, { title: l.module_title, pos: l.module_position }])).entries()];
  const firstOpen = lessons.find((l) => !l.completed_at)?.lesson_id;
  return (
    <div className="stack" style={{ gap: 4 }}>
      {modules.map(([id, m]) => (
        <div key={id}>
          <p className="mono" style={{ margin: "14px 6px 4px" }}>Module {m.pos} · {m.title}</p>
          {lessons.filter((l) => l.module_id === id).map((l) => {
            const state = l.completed_at ? "done" : l.lesson_id === firstOpen ? "cur" : "lock";
            const label = state === "done" ? "terminée" : state === "cur" ? "à suivre" : "verrouillée";
            const inner = (
              <>
                <span className={`dot ${state}`} aria-hidden="true">{state === "done" ? "✓" : ""}</span>
                <span style={{ flex: 1 }}>{l.seq}. {l.title} <span className="sr">({label})</span>{showPresenter && l.presenter_name && <span className="small muted" style={{ display: "block" }}>{l.presenter_name}</span>}</span>
                <span className="mono">{mmss(l.duration_sec)}</span>
              </>
            );
            return l.unlocked ? (
              <a key={l.lesson_id} className="lesson" href={`/parcours/${slug}/${l.lesson_id}`} aria-current={current === l.lesson_id ? "page" : undefined}>{inner}</a>
            ) : (
              <div key={l.lesson_id} className="lesson locked" title="Terminez la leçon précédente pour ouvrir celle-ci">{inner}</div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function Documents({ docs }: { docs: { id: string; title: string; mime_type: string; lesson_title: string | null }[] }) {
  if (!docs.length) return <p className="small muted">Aucun document pour ce parcours.</p>;
  return (
    <div className="stack" style={{ gap: 8 }}>
      {docs.map((d) => (
        <a key={d.id} className="doc" href={`/api/documents/${d.id}`} target="_blank" rel="noopener">
          <span className="ic">{d.mime_type.includes("pdf") ? "PDF" : "DOC"}</span>
          <span style={{ minWidth: 0 }}><b className="small">{d.title}</b>{d.lesson_title && <span className="small muted" style={{ display: "block" }}>Leçon : {d.lesson_title}</span>}</span>
        </a>
      ))}
    </div>
  );
}
