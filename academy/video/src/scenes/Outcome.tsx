import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, F } from "../brand";
import { T } from "../content";
import { AppWindow, display, DocRow, exitStyle, eyebrow, FormatCtx, Glass, Logo, Progress, prog, rise, StepCaption, TopBar, useFormat, Iri } from "../ui/kit";

function Check({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flex: "none" }}>
      <circle cx="12" cy="12" r="11" fill="none" stroke={color} strokeWidth="1.5" />
      <path d="M7 12.4 L10.4 15.6 L17 8.6" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 18–22 s : documents PDF + progression 33 % → 100 % + « Formation terminée ». */
export function ProgressScene({ dur }: { dur: number }) {
  const f = useCurrentFrame();
  const base = useFormat();
  const { v } = base;
  const u = v ? 1.75 : 1.45;
  const p = interpolate(prog(f, 34, 56), [0, 1], [33, 100]);
  const lessonsDone = p >= 99.5 ? 3 : p >= 66 ? 2 : 1;
  const done = prog(f, 92, 22);
  return (
    <FormatCtx.Provider value={{ ...base, u }}>
      <AbsoluteFill>
        <StepCaption text={T.steps.progress} f={f} start={0} end={dur} />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", ...exitStyle(f, dur - 12, 12) }}>
          <div style={{ display: "flex", flexDirection: v ? "column" : "row", gap: 26 * u, alignItems: v ? "stretch" : "center", width: v ? 940 : 1640 }}>
            <div style={{ width: v ? "100%" : 400 * u, flex: "none", ...rise(f, 4, 26, 40) }}>
              <Glass pad={26}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 * u }}>
                  <span style={eyebrow(u)}>Documents</span>
                  {T.docs.map((d, i) => <DocRow key={d} title={d} style={rise(f, 10 + i * 10, 24, 20)} />)}
                </div>
              </Glass>
            </div>
            <div style={{ flex: 1, minWidth: 0, ...rise(f, 14, 26, 40) }}>
              <Glass pad={32}>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 * u }}>
                  <span style={eyebrow(u)}>Ma progression · {T.program.title}</span>
                  <span style={{ ...display(v ? 190 : 170, 118), fontVariantNumeric: "tabular-nums", lineHeight: 0.9 }}>
                    {p >= 99.5 ? <Iri shift={done}>{Math.round(p)} %</Iri> : `${Math.round(p)} %`}
                  </span>
                  <Progress value={p} showPct={false} height={9} />
                  <p style={{ margin: 0, fontFamily: F.sans, fontSize: 14 * u, color: C.deepSoft }}>{lessonsDone} / {T.lessons.length} leçons</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 * u, opacity: done, transform: `translateY(${(1 - done) * 18}px)`, minHeight: 34 * u }}>
                    <Check size={26 * u} color={C.ok} />
                    <span style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 21 * u, color: C.ok, letterSpacing: "-0.01em" }}>{T.done}</span>
                  </div>
                  <p style={{ margin: 0, fontFamily: F.sans, fontSize: 13 * u, color: C.deepSoft, lineHeight: 1.5, opacity: prog(f, 100, 20) }}>{T.doneNote}</p>
                </div>
              </Glass>
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </FormatCtx.Provider>
  );
}

type Row = (typeof T.admin.rows)[number];

function Status({ row, f }: { row: Row; f: number }) {
  const { u } = useFormat();
  // la ligne mise en évidence passe de « En cours » à « Terminée » pendant le plan
  const flip = "highlight" in row && row.highlight ? prog(f, 84, 10) : 1;
  const label = flip < 0.5 ? "En cours" : row.status;
  const tone = flip < 0.5 ? "plain" : row.tone;
  const color = tone === "ok" ? C.ok : tone === "warn" ? C.warn : C.deepSoft;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7 * u, fontFamily: F.mono, fontSize: 11 * u, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color, whiteSpace: "nowrap" }}>
      {tone === "ok" && <Check size={14 * u} color={C.ok} />}
      {label}
    </span>
  );
}

function rowProgress(row: Row, f: number) {
  if ("highlight" in row && row.highlight) return interpolate(prog(f, 66, 22), [0, 1], [67, 100]);
  return Math.round((row.done / row.total) * 100);
}

/** 22–26 s : vue admin (/admin) : médecin → machine → parcours → progression → statut. */
export function AdminScene({ dur }: { dur: number }) {
  const f = useCurrentFrame();
  const base = useFormat();
  const { v } = base;
  const u = v ? 1.6 : 1.3;
  const scroll = interpolate(prog(f, 40, 50), [0, 1], [0, v ? 150 : 150]);
  const hl = prog(f, 58, 18);
  const th: React.CSSProperties = { ...eyebrow(u), fontSize: 10 * u, textAlign: "left", padding: `${12 * u}px ${14 * u}px`, borderBottom: `1px solid ${C.line}`, whiteSpace: "nowrap", fontWeight: 500 };
  const td: React.CSSProperties = { padding: `${13 * u}px ${14 * u}px`, borderBottom: `1px solid ${C.line}`, fontFamily: F.sans, fontSize: 13 * u, verticalAlign: "middle" };
  return (
    <FormatCtx.Provider value={{ ...base, u }}>
      <AbsoluteFill>
        <StepCaption text={T.steps.admin} f={f} start={0} end={dur} />
        <AbsoluteFill style={exitStyle(f, dur - 12, 12)}>
          <AppWindow style={{
            position: "absolute", left: v ? 70 : 160, top: v ? 250 : 160, width: v ? 940 : 1600, height: v ? 1580 : 860,
            opacity: prog(f, 0, 16), transform: `translateY(${(1 - prog(f, 0, 24)) * 40}px)`,
          }}>
            <TopBar admin user="Équipe CELLULIFT" initials="CL" />
            <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            <div style={{ padding: 32 * u, transform: `translateY(${-scroll}px)` }}>
              <div style={{ marginBottom: 24 * u, ...rise(f, 6, 24) }}>
                <span style={{ ...eyebrow(u), display: "block", marginBottom: 10 * u }}>{T.admin.eyebrow}</span>
                <h1 style={display(34 * u, 118)}>{T.admin.title}</h1>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: v ? "1fr 1fr" : "repeat(4, minmax(0,1fr))", gap: 18 * u, marginBottom: 22 * u }}>
                {T.admin.kpis.map((k, i) => (
                  <div key={k.label} style={rise(f, 10 + i * 4, 24, 24)}>
                    <Glass>
                      <span style={eyebrow(u)}>{k.label}</span>
                      <div style={{ fontFamily: F.display, fontStretch: "112%", fontWeight: 500, fontSize: 32 * u, letterSpacing: "-0.03em", lineHeight: 1, marginTop: 10 * u, fontVariantNumeric: "tabular-nums" }}>{k.value}</div>
                      <p style={{ margin: `${6 * u}px 0 0`, fontFamily: F.sans, fontSize: 12 * u, color: C.deepSoft, minHeight: 16 * u }}>{k.hint}</p>
                    </Glass>
                  </div>
                ))}
              </div>
              <div style={rise(f, 22, 26, 30)}>
                <Glass pad={0}>
                  {v ? (
                    <div>
                      {T.admin.rows.map((r, i) => {
                        const isHl = "highlight" in r && r.highlight;
                        return (
                          <div key={r.name} style={{
                            padding: `${18 * u}px ${20 * u}px`, borderTop: i ? `1px solid ${C.line}` : "none", display: "flex", flexDirection: "column", gap: 8 * u,
                            background: isHl ? `rgba(255,255,255,${hl})` : "transparent", boxShadow: isHl && hl > 0 ? C.shadowSm : "none",
                            borderRadius: isHl ? 18 * u : 0, ...rise(f, 26 + i * 4, 22, 16),
                          }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 * u }}>
                              <b style={{ fontFamily: F.sans, fontSize: 15 * u, fontWeight: 600 }}>{r.name}</b>
                              <Status row={r} f={f} />
                            </div>
                            <span style={{ fontFamily: F.sans, fontSize: 13 * u, color: C.deepSoft }}>{r.program}</span>
                            <Progress value={rowProgress(r, f)} />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr>{["Médecin", "Machine", "Parcours assigné", "Progression", "Statut", "Dernière activité"].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
                      <tbody>
                        {T.admin.rows.map((r, i) => {
                          const isHl = "highlight" in r && r.highlight;
                          const p = rowProgress(r, f);
                          return (
                            <tr key={r.name} style={{ background: isHl ? `rgba(255,255,255,${hl * 0.95})` : "transparent", boxShadow: isHl && hl > 0 ? C.shadowSm : "none", ...rise(f, 26 + i * 4, 22, 16) }}>
                              <td style={td}><b style={{ fontWeight: 600 }}>{r.name}</b><div style={{ fontSize: 12 * u, color: C.deepSoft }}>{r.email}</div></td>
                              <td style={td}>{r.machine}</td>
                              <td style={td}>{r.program}</td>
                              <td style={{ ...td, minWidth: 190 * u }}><Progress value={p} /><span style={{ fontSize: 12 * u, color: C.deepSoft }}>{p >= 99.5 ? r.total : isHl ? 2 : r.done} / {r.total} leçons</span></td>
                              <td style={td}><Status row={r} f={f} /></td>
                              <td style={{ ...td, color: C.deepSoft }}>{r.last}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </Glass>
              </div>
            </div>
            </div>
          </AppWindow>
        </AbsoluteFill>
      </AbsoluteFill>
    </FormatCtx.Provider>
  );
}

/** 26–30 s : signature + academy.cellulift.ma, ligne de signal qui s'étire, fondu final. */
export function SignatureScene({ dur }: { dur: number }) {
  const f = useCurrentFrame();
  const { v } = useFormat();
  const out = 1 - prog(f, dur - 16, 16);
  const size = v ? 92 : 86;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: out, padding: v ? "0 70px" : 0 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: v ? 70 : 54 }}>
        <div style={rise(f, 0, 24, 20)}>
          <Logo size={v ? 64 : 58} tag={T.logoTag} draw={prog(f, 4, 50)} tagOpacity={prog(f, 30, 20)} id="ecg-sign" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: v ? 22 : 16 }}>
          <h2 style={{ ...display(size, v ? 104 : 118), textAlign: "center", ...rise(f, 14, 26, 26) }}>{T.signature.line1}</h2>
          <h2 style={{ ...display(size, v ? 104 : 118), textAlign: "center", ...rise(f, 26, 26, 26) }}><Iri shift={prog(f, 30, 60)}>{T.signature.iri}</Iri>{T.signature.after}</h2>
        </div>
        <span style={{ height: 2, width: (v ? 760 : 1100) * prog(f, 40, 50), background: C.rainbow }} />
        <span style={{ fontFamily: F.mono, fontSize: v ? 34 : 28, letterSpacing: "0.14em", color: C.deep, ...rise(f, 56, 24, 14) }}>{T.signature.url}</span>
      </div>
    </AbsoluteFill>
  );
}
