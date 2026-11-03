import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { T } from "./texts";
import { Caption, clamp, Dot, Iri, Logo, prog, Progress, rise, useTall } from "./ui";

/* ------------------------------------------------------------------ */
/* Mise en page : 16:9 = légende à gauche, interface à droite ;        */
/* 9:16 = légende en haut, interface dessous (recomposée, pas recadrée) */
/* ------------------------------------------------------------------ */

type Box = { left: number; top: number; width: number; height: number; zoom: number };

const useLayout = (wideZoom = 1.6, tallZoom = 1.62, wideUi = false) => {
  const tall = useTall();
  const caption = tall
    ? { left: 90, top: 190, width: 900, size: 76 }
    : { left: 130, top: 0, width: wideUi ? 520 : 600, size: wideUi ? 64 : 74 };
  const ui: Box = tall
    ? { left: 70, top: 560, width: 940, height: 1100, zoom: tallZoom }
    : wideUi
      ? { left: 700, top: 70, width: 1120, height: 940, zoom: wideZoom }
      : { left: 790, top: 70, width: 1010, height: 940, zoom: wideZoom };
  return { tall, caption, ui };
};

/** Conteneur de légende, centré verticalement en 16:9. */
const CaptionBox: React.FC<{ children: React.ReactNode; opacity?: number }> = ({ children, opacity = 1 }) => {
  const { tall, caption } = useLayout();
  return (
    <div
      style={{
        position: "absolute",
        left: caption.left,
        width: caption.width,
        opacity,
        ...(tall ? { top: caption.top } : { top: 0, bottom: 0, display: "flex", alignItems: "center" }),
      }}
    >
      {children}
    </div>
  );
};

/** Zone d'interface : contenu écrit à la taille de l'app puis agrandi avec `zoom` (texte net). */
const UiBox: React.FC<{ children: React.ReactNode; box: Box; align?: "center" | "start"; style?: React.CSSProperties }> = ({ children, box, align = "center", style }) => (
  <div
    style={{
      position: "absolute",
      left: box.left,
      top: box.top,
      width: box.width,
      height: box.height,
      display: "flex",
      flexDirection: "column",
      justifyContent: align === "center" ? "center" : "flex-start",
      ...style,
    }}
  >
    <div style={{ zoom: box.zoom, width: box.width / box.zoom }}>{children}</div>
  </div>
);

/** Fondu d'entrée / sortie de chaque plan. */
export const SceneFade: React.FC<{ children: React.ReactNode; out?: boolean }> = ({ children, out = true }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = prog(f, 0, 14);
  const outP = out ? interpolate(f, [durationInFrames - 12, durationInFrames], [0, 1], clamp) : 0;
  return (
    <AbsoluteFill style={{ opacity: inP * (1 - outP), filter: outP > 0 ? `blur(${outP * 6}px)` : undefined, transform: `translateY(${-outP * 18}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

/** Petit logo permanent pendant les plans d'interface. */
export const CornerLogo: React.FC = () => {
  const tall = useTall();
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", ...(tall ? { left: 0, right: 0, top: 96, display: "flex", justifyContent: "center" } : { left: 130, top: 64 }), opacity: prog(f, 0, 20) }}>
      <Logo size={tall ? 30 : 26} draw={1} tag={T.logoTag} id="ecg-corner" />
    </div>
  );
};

/* --------------------------------- 0–3 s --------------------------------- */

export const SceneLogo: React.FC = () => {
  const f = useCurrentFrame();
  const tall = useTall();
  const word = prog(f, 0, 30);
  const draw = prog(f, 8, 54); // ≈ 1,8 s
  const size = tall ? 112 : 128;
  return (
    <SceneFade>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: word, transform: `translateY(${(1 - word) * 20}px)` }}>
          <Logo size={size} draw={draw} id="ecg-intro" spacing={0.22 + (1 - word) * 0.08} />
        </div>
        <div
          className="display"
          style={{ fontSize: tall ? 64 : 64, letterSpacing: "0.3em", marginRight: "-0.3em", marginTop: tall ? 36 : 34, ...rise(f, 44, 26) }}
        >
          <span className="iri" style={{ backgroundSize: "200% 100%", backgroundPosition: `${100 - prog(f, 44, 40) * 100}% 0` }}>
            {T.logoTag}
          </span>
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
};

/* --------------------------------- 3–7 s --------------------------------- */

export const SceneHook: React.FC = () => {
  const f = useCurrentFrame();
  const tall = useTall();
  const size = tall ? 96 : 104;
  const lines = [
    { t: T.hook.line1[0], s: 0 },
    { t: T.hook.line1[1], s: 6 },
    { t: T.hook.line2[0], s: 40 },
    { t: T.hook.line2[1], s: 46 },
  ];
  const signal = prog(f, 30, 40);
  return (
    <SceneFade>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: tall ? 80 : 120 }}>
        <h1 className="display" style={{ fontSize: size, lineHeight: 0.98, textAlign: "center" }}>
          {lines.slice(0, 2).map((l) => (
            <div key={l.t} style={{ ...rise(f, l.s + 4, 26, 30), color: f > 40 ? "var(--deep-soft)" : undefined, transition: "none" }}>
              {l.t}
            </div>
          ))}
        </h1>
        <div style={{ height: 2, width: (tall ? 600 : 760) * signal, background: "var(--rainbow)", opacity: 0.75, margin: `${size * 0.42}px 0` }} />
        <h1 className="display" style={{ fontSize: size, lineHeight: 0.98, textAlign: "center" }}>
          {lines.slice(2).map((l) => (
            <div key={l.t} style={rise(f, l.s + 4, 26, 30)}>
              <Iri text={l.t} iri={T.hook.iri} />
            </div>
          ))}
        </h1>
      </AbsoluteFill>
    </SceneFade>
  );
};

/* --------------------------------- 7–12 s -------------------------------- */

const InviteCard: React.FC = () => {
  const f = useCurrentFrame();
  const dots = Math.floor(interpolate(f, [22, 46], [0, 12], clamp));
  const press = interpolate(f, [52, 56, 62], [1, 0.95, 1], clamp);
  const ok = f > 56;
  return (
    <div className="glass stack" style={{ padding: 30, gap: 14, maxWidth: 470, margin: "0 auto" }}>
      <span className="eyebrow">Invitation</span>
      <h2 className="display h2">Bienvenue, {T.doctor.name}</h2>
      <p className="muted small">
        Choisissez un mot de passe pour <b>{T.doctor.email}</b>. Vous l'utiliserez pour accéder à vos formations.
      </p>
      <div className="field">
        <label>Mot de passe</label>
        <div className="input" style={{ borderColor: dots > 0 && !ok ? "var(--accent)" : undefined, boxShadow: dots > 0 && !ok ? "0 0 0 4px rgba(123,97,255,.14)" : undefined, letterSpacing: "0.25em" }}>
          {"•".repeat(dots)}
          {!ok && f % 30 < 16 && <span style={{ width: 1.5, height: 20, background: "var(--deep)", marginLeft: 2 }} />}
        </div>
      </div>
      <div className="btn solid" style={{ minHeight: 46, transform: `scale(${press})`, background: ok ? "var(--ok)" : undefined, borderColor: ok ? "var(--ok)" : undefined }}>
        {ok ? "✓ Accès créé" : "Créer mon accès"}
      </div>
    </div>
  );
};

const MachineCard: React.FC = () => (
  <div className="glass card row" style={{ gap: 18, padding: 16 }}>
    <div style={{ width: 92, height: 92, borderRadius: 18, overflow: "hidden", flex: "none", background: "#0f1114" }}>
      <Img src={staticFile(T.machine.photo)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" }} />
    </div>
    <div className="stack" style={{ gap: 4 }}>
      <span className="mono">{T.machine.family}</span>
      <b style={{ fontSize: 19 }}>{T.machine.name}</b>
      <span className="small muted">{T.machine.detail}</span>
    </div>
  </div>
);

const ProgramCard: React.FC<{ pulse: number }> = ({ pulse }) => (
  <article className="glass card stack" style={{ gap: 14 }}>
    <div className="row between">
      <span className="badge rb">Inclus avec votre {T.machine.name}</span>
      <span className="badge">À commencer</span>
    </div>
    <h3 className="display h2">{T.program.title}</h3>
    <p className="small">
      Avec <b>{T.presenter.name}</b>
    </p>
    <Progress value={0} />
    <p className="small muted">0 leçon sur {T.program.lessons.length}</p>
    <div className="row">
      <span className="btn solid" style={{ boxShadow: `0 0 0 ${pulse * 8}px rgba(123,97,255,${0.22 * (1 - pulse)})` }}>
        Commencer · {T.program.lessons[0].title}
      </span>
    </div>
  </article>
);

export const SceneDashboard: React.FC = () => {
  const f = useCurrentFrame();
  const { ui, caption } = useLayout(1.62, 1.62);
  const c = T.captions;
  const swap = prog(f, 66, 14);
  const inviteOut = prog(f, 64, 18);
  const pulse = ((f - 120) % 26) / 26;
  return (
    <SceneFade>
      <CornerLogo />
      <CaptionBox opacity={1 - swap}>
        <Caption {...c.invite} size={caption.size} start={2} />
      </CaptionBox>
      {f > 66 && (
        <CaptionBox>
          <Caption {...c.dashboard} size={caption.size} start={72} />
        </CaptionBox>
      )}
      <UiBox box={ui}>
        <div style={{ position: "relative" }}>
          {f < 84 && (
            <div style={{ position: "absolute", left: 0, right: 0, top: "50%", ...rise(f, 4, 26, 30), opacity: prog(f, 4, 26) * (1 - inviteOut), transform: `translateY(calc(-50% + ${(1 - prog(f, 4, 26)) * 30 - inviteOut * 40}px)) scale(${1 - inviteOut * 0.04})` }}>
              <InviteCard />
            </div>
          )}
          <div className="stack" style={{ gap: 14, visibility: f > 70 ? "visible" : "hidden" }}>
            <div style={rise(f, 74, 26)}>
              <span className="eyebrow">Ma formation</span>
              <h1 className="display h1" style={{ marginTop: 8, fontSize: 34 }}>
                Bonjour, <span className="iri">{T.doctor.name}</span>
              </h1>
            </div>
            <span className="eyebrow" style={{ ...rise(f, 80, 20), marginTop: 6 }}>
              Mes machines
            </span>
            <div style={{ ...rise(f, 82, 28, 34), transform: `${rise(f, 82, 28, 34).transform} scale(${0.97 + 0.03 * prog(f, 82, 28)})` }}>
              <MachineCard />
            </div>
            <span className="eyebrow" style={{ ...rise(f, 92, 20), marginTop: 6 }}>
              Mes parcours
            </span>
            <div style={{ ...rise(f, 94, 30, 40), transform: `${rise(f, 94, 30, 40).transform} scale(${0.96 + 0.04 * prog(f, 94, 30)})` }}>
              <ProgramCard pulse={f > 120 ? pulse : 0} />
            </div>
          </div>
        </div>
      </UiBox>
    </SceneFade>
  );
};

/* -------------------------------- 12–18 s -------------------------------- */

const Player: React.FC<{ t: number }> = ({ t }) => {
  const f = useCurrentFrame();
  const total = 390; // 6 min 30
  const cur = Math.round(interpolate(t, [0, 1], [318, total]));
  const mm = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  return (
    <div style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: 22, overflow: "hidden", background: "#0f1114", boxShadow: "0 40px 80px -40px rgba(29,27,38,.6)" }}>
      <Img
        src={staticFile(T.machine.photo)}
        style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 38%", transform: `scale(${1.08 + f * 0.0006}) translateX(${-f * 0.05}px)` }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(15,17,20,0) 55%, rgba(15,17,20,.75))" }} />
      {/* Filigrane nominatif (dissuasif, comme dans l'app). */}
      <span
        className="mono"
        style={{ position: "absolute", left: 18 + Math.sin(f / 50) * 30 + f * 0.25, top: 26 + Math.cos(f / 60) * 12, fontSize: 9, letterSpacing: "0.06em", color: "rgba(255,255,255,.45)", textTransform: "none" }}
      >
        {T.doctor.name} · {T.doctor.email}
      </span>
      <div style={{ position: "absolute", left: 16, right: 16, bottom: 12, color: "#ecebe7" }}>
        <div className="row" style={{ gap: 10 }}>
          <svg width="14" height="14" viewBox="0 0 14 14">
            <rect x="2" y="1.5" width="3.4" height="11" rx="1" fill="#fff" />
            <rect x="8.6" y="1.5" width="3.4" height="11" rx="1" fill="#fff" />
          </svg>
          <div style={{ flex: 1, height: 4, borderRadius: 4, background: "rgba(255,255,255,.22)", overflow: "hidden" }}>
            <div style={{ width: `${(cur / total) * 100}%`, height: "100%", background: "var(--rainbow)" }} />
          </div>
          <span className="pct" style={{ color: "#ecebe7", fontSize: 11 }}>
            {mm(cur)} / {mm(total)}
          </span>
        </div>
      </div>
    </div>
  );
};

const LessonList: React.FC<{ done: number[]; current: number; withModules?: boolean }> = ({ done, current, withModules = true }) => {
  const L = T.program.lessons;
  return (
    <div className="stack" style={{ gap: 2 }}>
      {L.map((l, i) => (
        <React.Fragment key={l.title}>
          {withModules && (i === 0 || L[i - 1].module !== l.module) && (
            <p className="mono" style={{ margin: "10px 8px 4px" }}>
              {l.module}
            </p>
          )}
          <div className={`lesson ${i === current ? "current" : ""}`} style={{ color: done[i] > 0 || i === current ? undefined : "var(--muted)" }}>
            <Dot done={done[i]} current={i === current} />
            <span style={{ flex: 1, fontSize: 14 }}>
              {i + 1}. {l.title}
            </span>
            <span className="mono">{l.duration}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

const Presenter: React.FC = () => (
  <div className="row" style={{ marginTop: 12 }}>
    <span className="avatar">{T.presenter.initials}</span>
    <div style={{ lineHeight: 1.35 }}>
      <span className="small muted">Présenté par</span>
      <div style={{ fontWeight: 600 }}>{T.presenter.name}</div>
      <div className="small muted">{T.presenter.title}</div>
    </div>
  </div>
);

export const SceneLesson: React.FC = () => {
  const f = useCurrentFrame();
  const { tall, ui, caption } = useLayout(1.42, 1.46, true);
  const watch = interpolate(f, [10, 96], [0, 1], { ...clamp });
  const check1 = prog(f, 98, 18);
  const cam = prog(f, 16, 150);
  const L = T.program.lessons;
  const head = (
    <div style={rise(f, 16, 26)}>
      <span className="eyebrow">{L[0].module} · leçon 1 sur {L.length}</span>
      <h1 className="display h2" style={{ marginTop: 8 }}>
        {L[0].title}
      </h1>
      <Presenter />
    </div>
  );
  const list = (
    <section className="glass card" style={{ padding: tall ? 12 : 14, ...rise(f, tall ? 24 : 14, 28, 36) }}>
      <div className="row between" style={{ padding: "4px 8px 6px" }}>
        <span className="eyebrow">Leçons du parcours</span>
        <span className="pct" style={{ fontSize: 11 }}>{Math.round(check1 * 33)} %</span>
      </div>
      <LessonList done={[check1, 0, 0]} current={check1 > 0.5 ? 1 : 0} withModules={!tall} />
    </section>
  );
  return (
    <SceneFade>
      <CornerLogo />
      <CaptionBox>
        <Caption {...T.captions.lesson} size={caption.size} start={2} />
      </CaptionBox>
      <UiBox box={ui} align={tall ? "start" : "center"}>
        <div style={{ transform: `scale(${1 + cam * (tall ? 0.025 : 0.05)})`, transformOrigin: tall ? "50% 10%" : "30% 30%" }}>
          {tall ? (
            <div className="stack" style={{ gap: 18 }}>
              <div style={rise(f, 6, 30, 40)}>
                <Player t={watch} />
              </div>
              {head}
              {list}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 290px", gap: 20, alignItems: "start" }}>
              <div className="stack" style={{ gap: 18 }}>
                <div style={rise(f, 6, 30, 40)}>
                  <Player t={watch} />
                </div>
                {head}
              </div>
              {list}
            </div>
          )}
        </div>
      </UiBox>
    </SceneFade>
  );
};

/* -------------------------------- 18–22 s -------------------------------- */

export const SceneProgress: React.FC = () => {
  const f = useCurrentFrame();
  const { tall, ui, caption } = useLayout(1.55, 1.62);
  // Le pourcentage avance avec les coches : 33 % → 67 % → 100 %.
  const c2 = prog(f, 30, 18);
  const c3 = prog(f, 60, 18);
  const value = 33 + (c2 + c3) * 33.5;
  const done = Math.round(1 + c2 + c3 > 2.5 ? 3 : 1 + c2 > 1.5 ? 2 : 1);
  const badge = prog(f, 80, 22);
  const docs = (
    <section className="glass card stack" style={{ gap: 10, ...rise(f, 6, 28, 34) }}>
      <span className="eyebrow">Documents</span>
      {T.program.documents.map((d, i) => (
        <div key={d} className="doc" style={rise(f, 12 + i * 6, 24)}>
          <span className="ic">PDF</span>
          <span style={{ flex: 1 }}>
            <b className="small">{d}</b>
            <span className="small muted" style={{ display: "block" }}>
              {T.machine.name} · PDF
            </span>
          </span>
          <svg width="18" height="18" viewBox="0 0 18 18" style={{ opacity: 0.6 }}>
            <path d="M9 3v9m0 0-3.5-3.5M9 12l3.5-3.5M3.5 15h11" stroke="#1d1b26" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ))}
    </section>
  );
  const progress = (
    <section className="glass card stack" style={{ gap: 12, ...rise(f, 12, 28, 34) }}>
      <div className="row between">
        <span className="eyebrow">Ma progression</span>
        <span
          className="badge ok"
          style={{ height: 32, padding: "0 14px", fontSize: 12, opacity: badge, transform: `scale(${0.8 + 0.2 * badge})`, boxShadow: `0 0 0 ${badge * 6}px rgba(17,132,91,${0.12 * (1 - prog(f, 90, 30))})` }}
        >
          Formation terminée
        </span>
      </div>
      <div className="display" style={{ fontSize: 64, fontStretch: "112%", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
        {Math.round(value)}
        <span style={{ fontSize: 30, marginLeft: 6 }}>%</span>
      </div>
      <div className="progress" style={{ height: 8 }}>
        <i style={{ width: `${value}%` }} />
      </div>
      <p className="small muted">
        {done} / {T.program.lessons.length} leçons · {T.program.title}
      </p>
      <LessonList done={[1, c2, c3]} current={c3 > 0.5 ? -1 : c2 > 0.5 ? 2 : 1} withModules={false} />
    </section>
  );
  return (
    <SceneFade>
      <CornerLogo />
      <CaptionBox>
        <Caption {...T.captions.progress} size={caption.size} start={2} />
      </CaptionBox>
      <UiBox box={ui}>
        {tall ? (
          <div className="stack" style={{ gap: 18 }}>
            {progress}
            {docs}
          </div>
        ) : (
          <div className="stack" style={{ gap: 18 }}>
            {progress}
            {docs}
          </div>
        )}
      </UiBox>
    </SceneFade>
  );
};

/* -------------------------------- 22–26 s -------------------------------- */

export const SceneAdmin: React.FC = () => {
  const f = useCurrentFrame();
  const { tall, ui, caption } = useLayout(1.32, 1.6, true);
  const A = T.admin;
  const hl = prog(f, 56, 24);
  const scroll = interpolate(f, [20, 110], [0, 1], { ...clamp, easing: (x) => x });
  const kpis = (
    <div style={{ display: "grid", gridTemplateColumns: tall ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
      {A.kpis.map((k, i) => (
        <div key={k.label} className="glass card kpi" style={{ padding: 16, borderRadius: 20, ...rise(f, 4 + i * 4, 24) }}>
          <span className="eyebrow" style={{ fontSize: 10 }}>
            {k.label}
          </span>
          <div className="v" style={{ fontSize: 28 }}>
            {k.value}
          </div>
        </div>
      ))}
    </div>
  );
  const hlStyle = (on?: boolean): React.CSSProperties =>
    on
      ? {
          background: `rgba(255,255,255,${0.95 * hl})`,
          boxShadow: `0 ${18 * hl}px ${40 * hl}px -24px rgba(29,27,38,${0.35 * hl}), inset 3px 0 0 0 rgba(123,97,255,${hl})`,
          transform: `scale(${1 + 0.015 * hl})`,
          position: "relative",
          zIndex: 2,
        }
      : { opacity: 1 - 0.35 * hl };
  const table = (
    <section className="glass" style={{ padding: 0, ...rise(f, 14, 28, 34) }}>
      <table className="t">
        <thead>
          <tr>
            <th>Médecin</th>
            <th>Machine</th>
            <th>Parcours assigné</th>
            <th>Progression</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {A.rows.map((r, i) => (
            <tr key={r.name} style={{ ...rise(f, 20 + i * 6, 24), ...hlStyle("highlight" in r && r.highlight) }}>
              <td>
                <b>{r.name}</b>
                <div className="small muted">{r.email}</div>
              </td>
              <td className="small" style={{ whiteSpace: "nowrap" }}>{r.machine}</td>
              <td className="small">{r.program}</td>
              <td style={{ minWidth: 140 }}>
                <Progress value={r.pct} />
                <span className="small muted">{r.done} leçons</span>
              </td>
              <td>
                <span className={`badge ${r.cls}`}>{r.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
  const cards = (
    <div className="stack" style={{ gap: 12 }}>
      {A.rows.map((r, i) => (
        <div key={r.name} className="glass card stack" style={{ gap: 8, padding: 16, borderRadius: 20, ...rise(f, 18 + i * 6, 24), ...hlStyle("highlight" in r && r.highlight) }}>
          <div className="row between">
            <div>
              <b>{r.name}</b>
              <div className="small muted">{r.email}</div>
            </div>
            <span className={`badge ${r.cls}`}>{r.status}</span>
          </div>
          <p className="small">
            <span className="mono" style={{ fontSize: 10 }}>{r.machine}</span>
            <span className="muted"> → </span>
            {r.program}
          </p>
          <Progress value={r.pct} />
        </div>
      ))}
    </div>
  );
  return (
    <SceneFade>
      <CornerLogo />
      <CaptionBox>
        <Caption {...T.captions.admin} size={caption.size} start={2} />
      </CaptionBox>
      <UiBox box={ui}>
        <div className="stack" style={{ gap: 14, transform: `translateY(${-scroll * (tall ? 30 : 20)}px)` }}>
          <div style={rise(f, 2, 24)}>
            <span className="eyebrow">{A.eyebrow}</span>
            <h1 className="display h1" style={{ marginTop: 6, fontSize: 34 }}>
              Médecins
            </h1>
          </div>
          {kpis}
          {tall ? cards : table}
        </div>
      </UiBox>
    </SceneFade>
  );
};

/* -------------------------------- 26–30 s -------------------------------- */

export const SceneSignature: React.FC = () => {
  const f = useCurrentFrame();
  const tall = useTall();
  const { durationInFrames } = useVideoConfig();
  const S = T.signature;
  const size = tall ? 70 : 76;
  const line = prog(f, 36, 44);
  const end = interpolate(f, [durationInFrames - 14, durationInFrames], [1, 0], clamp);
  return (
    <SceneFade out={false}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", opacity: end, padding: 60 }}>
        <div style={rise(f, 0, 26)}>
          <Logo size={tall ? 64 : 58} draw={prog(f, 2, 54)} tag={T.logoTag} id="ecg-end" />
        </div>
        <h2 className="display" style={{ fontSize: size, lineHeight: 1, marginTop: tall ? 90 : 64 }}>
          <div style={rise(f, 12, 26, 26)}>{S.line1}</div>
          <div style={{ ...rise(f, 20, 26, 26), marginTop: 6 }}>
            <Iri text={S.line2} iri={S.iri} />
          </div>
        </h2>
        <div style={{ height: 2, width: (tall ? 720 : 1000) * line, background: "var(--rainbow)", opacity: 0.8, margin: `${tall ? 70 : 52}px 0 ${tall ? 44 : 34}px` }} />
        <div className="mono" style={{ fontSize: tall ? 34 : 28, letterSpacing: "0.18em", color: "var(--deep)", textTransform: "none", ...rise(f, 44, 26) }}>
          {S.url}
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
};
