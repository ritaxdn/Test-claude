import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, F } from "../brand";
import { T } from "../content";
import { AppWindow, Avatar, display, exitStyle, eyebrow, FormatCtx, Glass, LessonDot, Progress, prog, rise, StepCaption, TopBar, useFormat } from "../ui/kit";

/** Lecteur vidéo (globals.css .player) avec le filigrane du médecin. */
function Player({ f }: { f: number }) {
  const { u } = useFormat();
  const watched = interpolate(f, [22, 128], [0.04, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const secs = Math.round(watched * 540);
  const t = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
  const wmX = interpolate(f, [0, 190], [30, 44]);
  const wmY = interpolate(f, [0, 190], [58, 74]);
  const lesson = T.lessons[T.currentLesson - 1];
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: 22 * u, overflow: "hidden", background: C.player, boxShadow: `0 ${40 * u}px ${80 * u}px -${40 * u}px rgba(29,27,38,0.6)` }}>
      {/* image de la leçon (illustration abstraite : lumière douce, pas de visage ni de patient) */}
      <div style={{ position: "absolute", inset: 0, background: [
        `radial-gradient(45% 60% at ${30 + f * 0.08}% 40%, rgba(167,151,255,0.38), transparent 70%)`,
        `radial-gradient(40% 55% at ${72 - f * 0.05}% 62%, rgba(127,227,240,0.26), transparent 70%)`,
        "linear-gradient(160deg, #1a1c22, #0f1114)",
      ].join(",") }} />
      <div style={{ position: "absolute", left: "7%", top: "12%", display: "flex", flexDirection: "column", gap: 10 * u, color: "#ecebe7", opacity: 1 - prog(f, 70, 20) }}>
        <span style={{ ...eyebrow(u), color: "rgba(236,235,231,0.7)" }}>{T.machine.name} · Leçon {lesson.seq}</span>
        <span style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 24 * u, letterSpacing: "-0.01em", maxWidth: "70%" }}>{lesson.title}</span>
      </div>
      <span style={{ position: "absolute", left: `${wmX}%`, top: `${wmY}%`, fontFamily: F.mono, fontSize: 11 * u, letterSpacing: "0.06em", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
        {T.doctor.name} · {T.doctor.email} · 2026-10-31
      </span>
      <div style={{ position: "absolute", left: "4%", right: "4%", bottom: "6%", display: "flex", alignItems: "center", gap: 14 * u }}>
        <span style={{ fontFamily: F.mono, fontSize: 11 * u, color: "rgba(236,235,231,0.8)", fontVariantNumeric: "tabular-nums" }}>{t} / 09:00</span>
        <div style={{ flex: 1, height: 3 * u, borderRadius: 3 * u, background: "rgba(255,255,255,0.18)", overflow: "hidden" }}>
          <div style={{ width: `${watched * 100}%`, height: "100%", background: "rgba(255,255,255,0.85)" }} />
        </div>
      </div>
    </div>
  );
}

function LessonList({ f }: { f: number }) {
  const { u } = useFormat();
  // leçon 1 déjà terminée (la coche se remplit), leçon 2 terminée pendant le plan, leçon 3 s'ouvre.
  const fill1 = prog(f, 34, 20);
  const fill2 = prog(f, 128, 20);
  const open3 = prog(f, 146, 10);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 * u }}>
      {T.modules.map((m) => (
        <div key={m.pos}>
          <p style={{ ...eyebrow(u), margin: `${14 * u}px ${6 * u}px ${4 * u}px` }}>Module {m.pos} · {m.title}</p>
          {T.lessons.filter((l) => l.module === m.pos).map((l) => {
            const state = l.seq === 1 ? "done" : l.seq === 2 ? (fill2 > 0 ? "done" : "cur") : open3 > 0.5 ? "cur" : "lock";
            const fill = l.seq === 1 ? fill1 : l.seq === 2 ? fill2 : 1;
            const current = l.seq === T.currentLesson;
            const locked = state === "lock";
            return (
              <div key={l.seq} style={{
                display: "flex", alignItems: "center", gap: 12 * u, padding: `${12 * u}px ${6 * u}px`, borderRadius: 12 * u,
                background: current ? "#fff" : "transparent", boxShadow: current ? C.shadowSm : "none",
                color: locked ? C.muted : C.deep, fontFamily: F.sans, fontSize: 14 * u,
              }}>
                <LessonDot state={state as "done" | "cur" | "lock"} fill={fill} />
                <span style={{ flex: 1 }}>{l.seq}. {l.title}</span>
                <span style={{ fontFamily: F.mono, fontSize: 11 * u, color: C.deepSoft, letterSpacing: "0.08em" }}>{l.dur}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function ProgressCard({ f }: { f: number }) {
  const { u } = useFormat();
  const p = interpolate(prog(f, 128, 24), [0, 1], [33, 67]);
  return (
    <Glass>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 * u }}>
        <span style={eyebrow(u)}>Ma progression</span>
        <Progress value={p} />
        <p style={{ margin: 0, fontFamily: F.sans, fontSize: 13 * u, color: C.deepSoft }}>{p > 50 ? 2 : 1} / {T.lessons.length} leçons</p>
      </div>
    </Glass>
  );
}

function Presenter() {
  const { u } = useFormat();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 * u, marginTop: 14 * u }}>
      <Avatar initials={T.presenter.initials} />
      <div style={{ fontFamily: F.sans, display: "flex", flexDirection: "column", gap: 1 * u }}>
        <span style={{ fontSize: 13 * u, color: C.deepSoft }}>Présenté par</span>
        <span style={{ fontSize: 15 * u, fontWeight: 600 }}>{T.presenter.name}</span>
        <span style={{ fontSize: 13 * u, color: C.deepSoft }}>{T.presenter.title}</span>
      </div>
    </div>
  );
}

/** 12–18 s : page leçon (/parcours/[slug]/[lessonId]). */
export function LessonScene({ dur }: { dur: number }) {
  const f = useCurrentFrame();
  const base = useFormat();
  const { v } = base;
  const u = v ? 1.6 : 1.22;
  const lesson = T.lessons[T.currentLesson - 1];
  const zoom = interpolate(prog(f, 8, 90), [0, 1], [1, v ? 1.035 : 1.1]);
  // origine du zoom : centre approximatif du lecteur dans la fenêtre
  const origin = v ? "50% 22%" : "36% 36%";
  return (
    <FormatCtx.Provider value={{ ...base, u }}>
      <AbsoluteFill>
        <StepCaption text={T.steps.lesson} f={f} start={0} end={dur} />
        <AbsoluteFill style={exitStyle(f, dur - 12, 12)}>
          <AppWindow style={{
            position: "absolute", left: v ? 70 : 200, top: v ? 250 : 140, width: v ? 940 : 1520, height: v ? 1540 : 905,
            opacity: prog(f, 0, 16), transform: `translateY(${(1 - prog(f, 0, 24)) * 40}px) scale(${zoom})`, transformOrigin: origin,
          }}>
            <TopBar user={T.doctor.name} initials={T.doctor.initials} />
            <div style={{ padding: `${24 * u}px ${32 * u}px` }}>
              <p style={{ ...eyebrow(u), margin: `0 0 ${12 * u}px` }}>Ma formation / {T.machine.name} / Leçon {lesson.seq}</p>
              <div style={{ display: v ? "flex" : "grid", flexDirection: "column", gridTemplateColumns: `minmax(0,1fr) ${340 * u}px`, gap: 22 * u, alignItems: "start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 * u, minWidth: 0 }}>
                  <div style={rise(f, 6, 26, 30)}><Player f={f} /></div>
                  <div style={rise(f, 14, 26, 24)}>
                    <span style={eyebrow(u)}>Module 1 · {T.modules[0].title} · leçon {lesson.seq} sur {T.lessons.length}</span>
                    <h1 style={{ ...display(24 * u, 118), marginTop: 10 * u }}>{lesson.title}</h1>
                    <Presenter />
                  </div>
                </div>
                <aside style={{ display: "flex", flexDirection: "column", gap: 16 * u, ...rise(f, 20, 28, 30) }}>
                  <ProgressCard f={f} />
                  <Glass><LessonList f={f} /></Glass>
                </aside>
              </div>
            </div>
          </AppWindow>
        </AbsoluteFill>
      </AbsoluteFill>
    </FormatCtx.Provider>
  );
}
