import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, F } from "../brand";
import { T } from "../content";
import { AppWindow, Btn, display, exitStyle, eyebrow, Glass, Iri, Progress, prog, rise, StepCaption, TopBar, useFormat, FormatCtx } from "../ui/kit";

function Field({ label, filled, total = 12 }: { label: string; filled: number; total?: number }) {
  const { u } = useFormat();
  const n = Math.round(filled * total);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 * u }}>
      <span style={{ fontFamily: F.sans, fontSize: 13 * u, fontWeight: 500 }}>{label}</span>
      <div style={{
        minHeight: 44 * u, padding: `0 ${14 * u}px`, borderRadius: 14 * u, display: "flex", alignItems: "center",
        border: `1px solid ${filled > 0 && filled < 1 ? C.accent : C.line2}`, background: "rgba(255,255,255,0.9)",
        boxShadow: filled > 0 && filled < 1 ? "0 0 0 4px rgba(123,97,255,0.14)" : "none",
        fontSize: 15 * u, letterSpacing: "0.2em", color: C.deep,
      }}>{"•".repeat(n)}</div>
    </div>
  );
}

/** 7–9 s : l'invitation reçue après l'installation (écran /invitation/[token]). */
export function InvitationScene({ dur }: { dur: number }) {
  const f = useCurrentFrame();
  const fmt = useFormat();
  const { v, u } = fmt;
  const press = prog(f, 58, 4) * (1 - prog(f, 62, 6));
  const check = prog(f, 50, 6);
  return (
    <AbsoluteFill>
      <StepCaption text={T.steps.invitation} f={f} start={0} end={dur} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", ...exitStyle(f, dur - 12, 12) }}>
        <div style={{ width: v ? 860 : 680, ...rise(f, 2, 26, 40) }}>
          <Glass pad={32}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 * u }}>
              <span style={eyebrow(u)}>Invitation</span>
              <h2 style={display(26 * u, 118)}>Bienvenue, {T.doctor.name}</h2>
              <p style={{ margin: 0, fontFamily: F.sans, fontSize: 13 * u, color: C.deepSoft, lineHeight: 1.5 }}>
                Choisissez un mot de passe pour <b style={{ color: C.deep }}>{T.doctor.email}</b>. Vous l'utiliserez pour accéder à vos formations.
              </p>
              <Field label="Mot de passe" filled={prog(f, 18, 18)} />
              <Field label="Confirmer le mot de passe" filled={prog(f, 34, 14)} />
              <div style={{ display: "flex", gap: 10 * u, alignItems: "flex-start", fontFamily: F.sans, fontSize: 12 * u, color: C.deepSoft, lineHeight: 1.45 }}>
                <span style={{ width: 16 * u, height: 16 * u, borderRadius: 4 * u, flex: "none", marginTop: 2 * u, border: `1.5px solid ${check ? C.accent : C.line2}`, background: check ? C.accent : "#fff", display: "grid", placeItems: "center" }}>
                  {check > 0 && <svg width={10 * u} height={10 * u} viewBox="0 0 12 12"><path d="M2.5 6.4 L5 8.8 L9.6 3.6" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" /></svg>}
                </span>
                J'accepte les conditions d'utilisation et la politique de confidentialité (loi 09-08).
              </div>
              <Btn solid press={press} style={{ minHeight: 46 * u }}>Créer mon accès</Btn>
            </div>
          </Glass>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function MachineCard() {
  const { u } = useFormat();
  return (
    <Glass>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 * u }}>
        <span style={eyebrow(u)}>{T.machine.family}</span>
        <b style={{ fontFamily: F.sans, fontSize: 18 * u, fontWeight: 600 }}>{T.machine.name}</b>
        <span style={{ fontFamily: F.sans, fontSize: 13 * u, color: C.deepSoft, lineHeight: 1.45 }}>{T.machine.meta}</span>
      </div>
    </Glass>
  );
}

function ProgramCard({ press }: { press: number }) {
  const { u } = useFormat();
  return (
    <Glass>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 * u }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 * u }}>
          <span style={{ ...eyebrow(u), fontSize: 10 * u, color: C.deep, display: "flex", flexDirection: "column", gap: 5 * u }}>
            Inclus avec votre {T.machine.name}
            <span style={{ height: 1.5, width: "100%", background: C.rainbow }} />
          </span>
          <span style={{ ...eyebrow(u), fontSize: 10 * u }}>À commencer</span>
        </div>
        <h3 style={display(21 * u, 118)}>{T.program.title}</h3>
        <p style={{ margin: 0, fontFamily: F.sans, fontSize: 13 * u, color: C.deepSoft, lineHeight: 1.5 }}>{T.program.summary}</p>
        <p style={{ margin: 0, fontFamily: F.sans, fontSize: 13 * u }}>Avec <b>{T.presenter.name}</b></p>
        <Progress value={0} />
        <p style={{ margin: 0, fontFamily: F.sans, fontSize: 13 * u, color: C.deepSoft }}>0 leçon sur {T.lessons.length}</p>
        <div style={{ display: "flex", gap: 10 * u, flexWrap: "wrap" }}>
          <Btn solid press={press}>Commencer · {T.lessons[0].title}</Btn>
        </div>
      </div>
    </Glass>
  );
}

/** 9–12 s : tableau de bord du médecin (/tableau-de-bord) : sa machine + son parcours. */
export function DashboardScene({ dur }: { dur: number }) {
  const f = useCurrentFrame();
  const base = useFormat();
  const { v } = base;
  const u = v ? 1.75 : 1.4;
  const fmt = { ...base, u };
  const tilt = interpolate(prog(f, 0, 30), [0, 1], [7, 0]);
  const press = prog(f, 64, 4) * (1 - prog(f, 68, 6));
  return (
    <FormatCtx.Provider value={fmt}>
      <AbsoluteFill>
        <StepCaption text={T.steps.dashboard} f={f} start={0} end={dur} />
        <AbsoluteFill style={{ perspective: 2200, ...exitStyle(f, dur - 12, 12) }}>
          <AppWindow style={{
            position: "absolute", left: v ? 70 : 150, top: v ? 300 : 190, width: v ? 940 : 1620, height: v ? 1280 : 760,
            transform: `rotateX(${tilt}deg) translateY(${(1 - prog(f, 0, 26)) * 50}px)`, opacity: prog(f, 0, 16), transformOrigin: "50% 0%",
          }}>
            <TopBar user={T.doctor.name} initials={T.doctor.initials} />
            <div style={{ padding: 32 * u, display: "flex", flexDirection: "column", gap: 24 * u }}>
              <div style={rise(f, 6, 24)}>
                <span style={{ ...eyebrow(u), display: "block", marginBottom: 10 * u }}>Ma formation</span>
                <h1 style={display((v ? 30 : 34) * u, 118)}>Bonjour, <Iri shift={prog(f, 10, 50)}>{T.doctor.name}</Iri></h1>
              </div>
              <div style={{ display: "flex", flexDirection: v ? "column" : "row", gap: 22 * u, alignItems: "flex-start" }}>
                <section style={{ width: v ? "100%" : 330 * u, flex: "none", ...rise(f, 16, 26, 36) }}>
                  <h2 style={{ ...eyebrow(u), margin: `0 0 ${12 * u}px` }}>Mes machines</h2>
                  <MachineCard />
                </section>
                <section style={{ flex: 1, minWidth: 0, width: v ? "100%" : undefined, ...rise(f, 28, 26, 36) }}>
                  <h2 style={{ ...eyebrow(u), margin: `0 0 ${12 * u}px` }}>Mes parcours</h2>
                  <ProgramCard press={press} />
                </section>
              </div>
            </div>
          </AppWindow>
        </AbsoluteFill>
      </AbsoluteFill>
    </FormatCtx.Provider>
  );
}
