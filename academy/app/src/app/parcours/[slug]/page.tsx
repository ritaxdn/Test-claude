import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Shell, Progress, pct, fmtDate } from "@/components/Shell";
import { requireUser } from "@/lib/auth";
import { canAccessProgram, programLessons } from "@/lib/access";
import { sql } from "@/lib/db";
import { LessonList, Documents } from "./parts";

export const metadata: Metadata = { title: "Parcours" };

export default async function Parcours({ params }: { params: Promise<{ slug: string }> }) {
  const user = await requireUser();
  const { slug } = await params;
  const [p] = await sql<{ id: string; title: string; summary: string | null; device_name: string | null }[]>`
    select p.id, p.title, p.summary, dm.name as device_name from programs p left join device_models dm on dm.id = p.device_model_id where p.slug = ${slug}`;
  if (!p || !(await canAccessProgram(user.id, p.id))) notFound();
  const lessons = await programLessons(user.id, p.id);
  const docs = await sql<{ id: string; title: string; mime_type: string; lesson_title: string | null }[]>`
    select d.id, d.title, d.mime_type, l.title as lesson_title from documents d left join lessons l on l.id = d.lesson_id where d.program_id = ${p.id} order by d.created_at`;
  const done = lessons.filter((l) => l.completed_at).length;
  const next = lessons.find((l) => !l.completed_at);
  const finished = lessons.length > 0 && done === lessons.length;
  const finishedAt = finished ? lessons.reduce((a, l) => (l.completed_at && (!a || l.completed_at > a) ? l.completed_at : a), null as Date | null) : null;
  return (
    <Shell user={user} active="/tableau-de-bord">
      <p className="crumbs mono"><a href="/tableau-de-bord">Ma formation</a> / {p.device_name ?? "Parcours"}</p>
      <div className="page-head">
        <div style={{ maxWidth: 720 }}>
          <span className="eyebrow">{p.device_name ? `Parcours ${p.device_name}` : "Parcours"}</span>
          <h1 className="display h1">{p.title}</h1>
          {p.summary && <p className="muted" style={{ marginTop: 12 }}>{p.summary}</p>}
        </div>
        {next && <a className="btn solid" href={`/parcours/${slug}/${next.lesson_id}`}>{done ? "Reprendre" : "Commencer"}</a>}
      </div>
      <div className="cols">
        <section className="glass card" aria-labelledby="h-prog">
          <h2 id="h-prog" className="eyebrow" style={{ marginBottom: 6 }}>Programme · {lessons.length} leçons</h2>
          <LessonList slug={slug} lessons={lessons} />
        </section>
        <aside className="stack">
          <section className="glass card stack" style={{ gap: 10 }}>
            <span className="eyebrow">Ma progression</span>
            <Progress value={pct(done, lessons.length)} />
            <p className="small muted">{done} leçon{done > 1 ? "s" : ""} terminée{done > 1 ? "s" : ""} sur {lessons.length}</p>
            {finished && <p className="alert ok">Formation terminée le {fmtDate(finishedAt)}.</p>}
          </section>
          <section className="glass card stack" style={{ gap: 10 }} aria-labelledby="h-docs">
            <h2 id="h-docs" className="eyebrow">Documents</h2>
            <Documents docs={docs} />
          </section>
        </aside>
      </div>
    </Shell>
  );
}
