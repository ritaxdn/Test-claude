import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Shell, Progress, pct } from "@/components/Shell";
import { Player } from "@/components/Player";
import { requireUser } from "@/lib/auth";
import { lessonForUser } from "@/lib/access";
import { sql } from "@/lib/db";
import { playbackFor } from "@/lib/video";
import { LessonList, Documents } from "../parts";

export const metadata: Metadata = { title: "Leçon" };

export default async function Lecon({ params, searchParams }: { params: Promise<{ slug: string; lessonId: string }>; searchParams: Promise<{ fin?: string }> }) {
  const user = await requireUser();
  const { slug, lessonId } = await params;
  const { fin } = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(lessonId)) notFound();
  const ctx = await lessonForUser(user.id, lessonId);
  if (!ctx || ctx.slug !== slug) notFound();
  if (!ctx.lesson.unlocked) {
    const first = ctx.lessons.find((l) => !l.completed_at);
    redirect(first ? `/parcours/${slug}/${first.lesson_id}` : `/parcours/${slug}`);
  }
  const [p] = await sql<{ title: string; device_name: string | null }[]>`select p.title, dm.name as device_name from programs p left join device_models dm on dm.id = p.device_model_id where p.id = ${ctx.program_id}`;
  const [l] = await sql<{ body: string | null }[]>`select body from lessons where id = ${lessonId}`;
  const docs = await sql<{ id: string; title: string; mime_type: string; lesson_title: string | null }[]>`
    select d.id, d.title, d.mime_type, null::text as lesson_title from documents d where d.program_id = ${ctx.program_id} and (d.lesson_id = ${lessonId} or d.lesson_id is null) order by (d.lesson_id is null), d.created_at`;
  const { lesson, lessons } = ctx;
  const idx = lessons.findIndex((x) => x.lesson_id === lessonId);
  const next = lessons[idx + 1];
  const prev = lessons[idx - 1];
  const done = lessons.filter((x) => x.completed_at).length;
  const allDone = done === lessons.length;
  const stamp = `${user.full_name} · ${user.email} · ${new Date().toISOString().slice(0, 10)}`;
  return (
    <Shell user={user} active="/tableau-de-bord">
      <p className="crumbs mono"><a href="/tableau-de-bord">Ma formation</a> / <a href={`/parcours/${slug}`}>{p.device_name ?? p.title}</a> / Leçon {lesson.seq}</p>
      {fin && allDone && <p className="alert ok" role="status" style={{ marginBottom: 18 }}>Bravo, vous avez terminé le parcours « {p.title} ». CELLULIFT en est informé et vous proposera la suite (atelier pratique, suivi).</p>}
      <div className="cols">
        <div className="stack" style={{ gap: 20 }}>
          <Player
            lessonId={lessonId}
            playback={playbackFor(lessonId, lesson.video_ref, user.id)}
            duration={lesson.duration_sec ?? 0}
            startAt={lesson.position_sec}
            maxReached={lesson.max_position_sec}
            completed={!!lesson.completed_at}
            watermark={stamp}
            nextHref={next ? `/parcours/${slug}/${next.lesson_id}` : null}
          />
          <div>
            <span className="eyebrow">Module {lesson.module_position} · {lesson.module_title} · leçon {lesson.seq} sur {lessons.length}</span>
            <h1 className="display h2" style={{ marginTop: 10 }}>{lesson.title}</h1>
          </div>
          {l?.body && <div className="prose">{l.body.split(/\n\s*\n/).map((para, i) => <p key={i}>{para}</p>)}</div>}
          <div className="row between wrap" style={{ borderTop: "1px solid var(--line)", paddingTop: 16 }}>
            {prev ? <a className="btn" href={`/parcours/${slug}/${prev.lesson_id}`}>Leçon précédente</a> : <span />}
            <a className="btn ghost" href={`/parcours/${slug}`}>Programme du parcours</a>
          </div>
        </div>
        <aside className="stack">
          <section className="glass card stack" style={{ gap: 10 }}>
            <span className="eyebrow">Ma progression</span>
            <Progress value={pct(done, lessons.length)} />
            <p className="small muted">{done} / {lessons.length} leçons</p>
          </section>
          {docs.length > 0 && <section className="glass card stack" style={{ gap: 10 }}><span className="eyebrow">Documents</span><Documents docs={docs} /></section>}
          <section className="glass card" aria-label="Leçons du parcours"><LessonList slug={slug} lessons={lessons} current={lessonId} /></section>
        </aside>
      </div>
    </Shell>
  );
}
