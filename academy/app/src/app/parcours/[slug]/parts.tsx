import type { LessonRow } from "@/lib/access";

const mmss = (s: number | null) => (s ? `${Math.floor(s / 60)} min${s % 60 ? ` ${String(s % 60).padStart(2, "0")}` : ""}` : "");

export function LessonList({ slug, lessons, current }: { slug: string; lessons: LessonRow[]; current?: string }) {
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
                <span style={{ flex: 1 }}>{l.seq}. {l.title} <span className="sr">({label})</span></span>
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
