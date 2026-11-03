import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { T } from "./texts";
import { Burst, clamp, Dot, Iri, Logo, prog, Progress, rise, ScanReveal, useTall } from "./ui";

/*
 * Style « lancement produit SaaS » adapté à la charte Nacre & verre :
 * - l'application entière flotte en perspective 3D, floue en arrière-plan ;
 * - l'élément clé « sort » de l'écran vers la caméra, net, en verre ;
 * - un curseur montre les interactions (clics, saisie) ;
 * - mouvements à ressort, rythme plus rapide, titres cinétiques.
 */

/* ------------------------------ Outils ---------------------------------- */

type SpringCfg = { damping: number; stiffness: number; mass: number };
const SPRING: SpringCfg = { damping: 15, stiffness: 120, mass: 0.9 };
const sp = (f: number, start: number, fps: number, config: SpringCfg = SPRING) => spring({ frame: f - start, fps, config });

const useFmt = () => {
  const tall = useTall();
  return {
    tall,
    /** Centre de la scène (px). */
    cy: tall ? 1120 : 610,
    cx: tall ? 540 : 960,
  };
};

/** Titre cinétique : mots qui montent avec un ressort, un mot irisé. */
const Headline: React.FC<{ step: string; title: readonly string[]; iri: string; start?: number }> = ({ step, title, iri, start = 0 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { tall } = useFmt();
  const size = tall ? 74 : 58;
  const lines = tall ? title : [title.join(" ")];
  let k = 0;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: tall ? 210 : 72, textAlign: "center", zIndex: 5 }}>
      <div className="mono" style={{ fontSize: tall ? 20 : 16, letterSpacing: "0.2em", ...rise(f, start, 18) }}>
        <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", marginRight: 12, verticalAlign: "middle", marginTop: -3 }} />
        {step}
      </div>
      <h2 className="display" style={{ fontSize: size, lineHeight: 1.02, marginTop: tall ? 26 : 18 }}>
        {lines.map((line, li) => {
          const words = line.split(" ");
          return (
            <div key={li}>
              {words.map((w, wi) => {
                const p = sp(f, start + 3 + k++ * 2.5, fps, { damping: 14, stiffness: 160, mass: 0.7 });
                const isIri = w.toLowerCase().includes(iri.toLowerCase());
                return (
                  <span key={wi} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: 6 }}>
                    <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 110}%)` }}>{isIri ? <span className="iri">{w}</span> : w}</span>
                    {wi < words.length - 1 ? " " : ""}
                  </span>
                );
              })}
            </div>
          );
        })}
      </h2>
      <div style={{ height: 3, borderRadius: 3, width: 220 * prog(f, start + 10, 26), margin: `${tall ? 22 : 14}px auto 0`, background: "var(--rainbow)" }} />
    </div>
  );
};

/** Fenêtre de l'application, en perspective 3D, qui passe au flou (profondeur de champ). */
const AppWindow: React.FC<{ children: React.ReactNode; start?: number; rx?: number; ry?: number; blurAt?: number; scale?: number; dy?: number }> = ({
  children,
  start = 0,
  rx = 16,
  ry = -14,
  blurAt,
  scale,
  dy = 0,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { tall, cy, cx } = useFmt();
  const p = sp(f, start, fps, { damping: 18, stiffness: 70, mass: 1.1 });
  const blur = blurAt !== undefined ? prog(f, blurAt, 22) : 0;
  const s = scale ?? (tall ? 1.05 : 1.2);
  const drift = f * 0.035;
  return (
    <div
      style={{
        position: "absolute",
        left: cx,
        top: cy + dy,
        width: 1240,
        height: 780,
        transform: `translate(-50%, -50%) perspective(2600px) translateY(${(1 - p) * 420}px) rotateX(${rx + (1 - p) * 28}deg) rotateY(${ry + drift}deg) scale(${s * (0.92 + 0.08 * p)})`,
        opacity: Math.min(1, p * 1.4) * (1 - blur * 0.3),
        filter: blur > 0 ? `blur(${blur * 7}px)` : undefined,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 28,
          overflow: "hidden",
          background: "linear-gradient(160deg, rgba(255,255,255,.9), rgba(246,247,251,.82))",
          border: "1px solid rgba(255,255,255,.95)",
          boxShadow: "0 1px 0 rgba(255,255,255,.9) inset, 0 80px 140px -60px rgba(29,27,38,.35), 0 0 0 1px rgba(29,27,38,.05)",
        }}
      >
        {children}
      </div>
      {/* Halo coloré sous la fenêtre */}
      <div style={{ position: "absolute", left: "8%", right: "8%", bottom: -60, height: 120, background: "linear-gradient(90deg, rgba(0,188,212,.25), rgba(123,97,255,.3), rgba(233,30,140,.22))", filter: "blur(60px)", zIndex: -1 }} />
    </div>
  );
};

/** Élément d'interface qui « sort » de l'écran vers la caméra (ressort + ombre). `z` = agrandissement. */
const Pop: React.FC<{ x: number; y: number; start: number; w: number; z: number; children: React.ReactNode; exit?: number; tilt?: number }> = ({
  x,
  y,
  start,
  w,
  z,
  children,
  exit,
  tilt = 0,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < start) return null;
  const p = sp(f, start, fps, { damping: 13, stiffness: 110, mass: 0.8 });
  const out = exit !== undefined ? prog(f, exit, 12) : 0;
  const float = Math.sin((f - start) / 22) * 4;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) perspective(1800px) translateY(${(1 - p) * 120 + float - out * 60}px) rotateX(${(1 - p) * 30}deg) rotateZ(${tilt * (1 - p)}deg) scale(${0.62 + 0.38 * p - out * 0.06})`,
        opacity: Math.min(1, p * 1.6) * (1 - out),
        zIndex: 3,
      }}
    >
      <div style={{ zoom: z, width: w, filter: "drop-shadow(0 30px 40px rgba(29,27,38,.18)) drop-shadow(0 10px 50px rgba(123,97,255,.18))" }}>{children}</div>
    </div>
  );
};

/** Curseur : se déplace entre des points clés [image, x, y] et clique aux images `clicks`. */
const Cursor: React.FC<{ keys: [number, number, number][]; clicks?: number[] }> = ({ keys, clicks = [] }) => {
  const f = useCurrentFrame();
  const { tall } = useFmt();
  if (f < keys[0][0]) return null;
  let x = keys[keys.length - 1][1];
  let y = keys[keys.length - 1][2];
  for (let i = 0; i < keys.length - 1; i++) {
    const [f0, x0, y0] = keys[i];
    const [f1, x1, y1] = keys[i + 1];
    if (f >= f0 && f <= f1) {
      const t = prog(f, f0, f1 - f0);
      x = x0 + (x1 - x0) * t;
      y = y0 + (y1 - y0) * t;
      break;
    }
  }
  let press = 1;
  let ring: { r: number; o: number } | null = null;
  for (const c of clicks) {
    const d = f - c;
    if (d >= 0 && d < 16) {
      press = d < 4 ? 1 - 0.18 * (d / 4) : 0.82 + 0.18 * Math.min(1, (d - 4) / 6);
      ring = { r: 10 + d * 4.5, o: 1 - d / 16 };
    }
  }
  const s = tall ? 1.35 : 1.15;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 10, opacity: prog(f, keys[0][0], 8) }}>
      {ring && <div style={{ position: "absolute", left: -ring.r, top: -ring.r, width: ring.r * 2, height: ring.r * 2, borderRadius: "50%", border: "2.5px solid rgba(123,97,255,.8)", opacity: ring.o }} />}
      <svg width={40 * s} height={46 * s} viewBox="0 0 40 46" style={{ transform: `scale(${press})`, transformOrigin: "4px 4px", filter: "drop-shadow(0 8px 14px rgba(29,27,38,.3))", marginLeft: -4, marginTop: -4 }}>
        <path d="M5 4 L5 36 L13.5 28.5 L19.5 42 L25.5 39.5 L19.5 26.5 L31 26 Z" fill="#fff" stroke="#1d1b26" strokeWidth="2.6" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** Fondu d'entrée / sortie de chaque plan. */
export const SceneFade: React.FC<{ children: React.ReactNode; out?: boolean }> = ({ children, out = true }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = prog(f, 0, 10);
  const outP = out ? interpolate(f, [durationInFrames - 10, durationInFrames], [0, 1], clamp) : 0;
  return <AbsoluteFill style={{ opacity: inP * (1 - outP), transform: `scale(${1 + outP * 0.04})`, filter: outP > 0 ? `blur(${outP * 8}px)` : undefined }}>{children}</AbsoluteFill>;
};

/* ------------------------ Écrans de l'application ------------------------ */

const TopBar: React.FC<{ admin?: boolean }> = ({ admin }) => (
  <div className="row" style={{ gap: 22, padding: "14px 26px", borderBottom: "1px solid var(--line)", background: "rgba(236,238,243,.6)" }}>
    <div style={{ zoom: 0.62 }}>
      <Logo size={30} draw={1} tag={admin ? "Academy · Admin" : "Academy"} id={admin ? "ecg-top-a" : "ecg-top"} />
    </div>
    <div className="row" style={{ gap: 4 }}>
      {(admin ? ["Médecins", "Parcours", "Présentateurs", "Machines"] : ["Ma formation"]).map((l, i) => (
        <span
          key={l}
          style={{ padding: "8px 14px", borderRadius: 999, fontSize: 14, background: i === 0 ? "#fff" : undefined, boxShadow: i === 0 ? "var(--shadow-sm)" : undefined, color: i === 0 ? "var(--deep)" : "var(--deep-soft)", fontWeight: i === 0 ? 500 : 400 }}
        >
          {l}
        </span>
      ))}
    </div>
    <div className="row" style={{ marginLeft: "auto" }}>
      <span className="small muted">{admin ? "Équipe CELLULIFT" : T.doctor.name}</span>
      <span className="avatar">{admin ? "CA" : T.doctor.initials}</span>
    </div>
  </div>
);

const InviteCard: React.FC<{ dots?: number; ok?: boolean; press?: number; burst?: number }> = ({ dots = 0, ok = false, press = 1, burst }) => (
  <div className="glass stack" style={{ padding: 30, gap: 14, width: 460 }}>
    <span className="eyebrow">Invitation</span>
    <h2 className="display h2">Bienvenue, {T.doctor.name}</h2>
    <p className="muted small">
      Choisissez un mot de passe pour <b>{T.doctor.email}</b>. Vous l'utiliserez pour accéder à vos formations.
    </p>
    <div className="field">
      <label>Mot de passe</label>
      <div className="input" style={{ letterSpacing: "0.25em", borderColor: dots && !ok ? "var(--accent)" : undefined, boxShadow: dots && !ok ? "0 0 0 4px rgba(123,97,255,.14)" : undefined }}>
        {"•".repeat(dots)}
      </div>
    </div>
    <div className="btn solid" style={{ position: "relative", minHeight: 46, transform: `scale(${press})`, background: ok ? "var(--ok)" : undefined, borderColor: ok ? "var(--ok)" : undefined }}>
      {ok ? "✓ Accès créé" : "Créer mon accès"}
      {burst !== undefined && <Burst start={burst} radius={60} rays={14} />}
    </div>
  </div>
);

const InvitePage: React.FC = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: "100%" }}>
    <section style={{ padding: 44, borderRight: "1px solid var(--line)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ zoom: 0.8 }}>
        <Logo size={30} draw={1} tag="Metamorphosis Technology · Academy" id="ecg-auth" />
      </div>
      <div>
        <span className="eyebrow">academy.cellulift.ma</span>
        <h1 className="display" style={{ fontSize: 44, marginTop: 16 }}>
          La technologie s'acquiert.
          <br />
          <span className="iri">La maîtrise</span> se construit.
        </h1>
        <p className="muted" style={{ marginTop: 18 }}>
          Les parcours de formation de vos technologies CELLULIFT : vidéos, protocoles et suivi de votre progression.
        </p>
      </div>
      <span className="mono">© CELLULIFT · Maroc</span>
    </section>
    <section style={{ display: "grid", placeItems: "center" }}>
      <InviteCard />
    </section>
  </div>
);

const MachineCard: React.FC<{ name?: string; family?: string; detail?: string; photo?: string; scan?: number }> = ({
  name = T.machine.name,
  family = T.machine.family,
  detail = T.machine.detail,
  photo = T.machine.photo,
  scan,
}) => {
  const img = (
    <div style={{ width: 84, height: 84, background: "#0f1114" }}>
      <Img src={staticFile(photo)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" }} />
    </div>
  );
  return (
    <div className="glass card row" style={{ gap: 16, padding: 14 }}>
      <div style={{ width: 84, height: 84, flex: "none", borderRadius: 16, overflow: "hidden" }}>
        {scan !== undefined ? (
          <ScanReveal start={scan} dur={22} radius={16}>
            {img}
          </ScanReveal>
        ) : (
          img
        )}
      </div>
      <div className="stack" style={{ gap: 3 }}>
        <span className="mono">{family}</span>
        <b style={{ fontSize: 18 }}>{name}</b>
        <span className="small muted">{detail}</span>
      </div>
    </div>
  );
};

const ProgramCard: React.FC<{ title?: string; device?: string; press?: number; ring?: number }> = ({ title = T.program.title, device = T.machine.name, press = 1, ring = 0 }) => (
  <article className="glass card stack" style={{ gap: 12 }}>
    <div className="row between">
      <span className="badge rb">Inclus avec votre {device}</span>
      <span className="badge">À commencer</span>
    </div>
    <h3 className="display h2">{title}</h3>
    <p className="small">
      Avec <b>{T.presenter.name}</b>
    </p>
    <Progress value={0} />
    <p className="small muted">0 leçon sur {T.program.lessons.length}</p>
    <div className="row">
      <span className="btn solid" style={{ transform: `scale(${press})`, boxShadow: ring ? `0 0 0 ${ring * 10}px rgba(123,97,255,${0.25 * (1 - ring)})` : undefined }}>
        Commencer · {T.program.lessons[0].title}
      </span>
    </div>
  </article>
);

const DashboardPage: React.FC = () => (
  <>
    <TopBar />
    <div style={{ padding: "28px 34px" }} className="stack">
      <div>
        <span className="eyebrow">Ma formation</span>
        <h1 className="display h1" style={{ marginTop: 8 }}>
          Bonjour, <span className="iri">{T.doctor.name}</span>
        </h1>
      </div>
      <span className="eyebrow">Mes machines</span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <MachineCard />
        <MachineCard name="DERMABRASIF 6G" family="Rajeunissement cutané" detail="N° de série DB6-1187 · installée le 14 oct. 2026" photo="img/dermabrasif-6g.jpg" />
      </div>
      <span className="eyebrow">Mes parcours</span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <ProgramCard />
        <ProgramCard title="DERMABRASIF 6G — Programme opérateur" device="DERMABRASIF 6G" />
      </div>
    </div>
  </>
);

const Player: React.FC<{ t: number }> = ({ t }) => {
  const f = useCurrentFrame();
  const total = 390;
  const cur = Math.round(interpolate(t, [0, 1], [300, total]));
  const mm = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  return (
    <div style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: 18, overflow: "hidden", background: "#0f1114" }}>
      <Img
        src={staticFile(T.machine.photo)}
        style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 38%", transform: `scale(${1.08 + f * 0.0007}) translateX(${-f * 0.05}px)` }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(15,17,20,0) 55%, rgba(15,17,20,.75))" }} />
      {/* Filigrane nominatif (dissuasif, comme dans l'app). */}
      <span className="mono" style={{ position: "absolute", left: 18 + f * 0.3, top: 22 + Math.cos(f / 60) * 10, fontSize: 9, letterSpacing: "0.06em", color: "rgba(255,255,255,.45)", textTransform: "none" }}>
        {T.doctor.name} · {T.doctor.email}
      </span>
      <div className="row" style={{ position: "absolute", left: 16, right: 16, bottom: 12, gap: 10 }}>
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
  );
};

const LessonList: React.FC<{ done: number[]; current: number; bursts?: (number | undefined)[] }> = ({ done, current, bursts = [] }) => (
  <div className="stack" style={{ gap: 2 }}>
    {T.program.lessons.map((l, i) => (
      <div key={l.title} className={`lesson ${i === current ? "current" : ""}`} style={{ color: done[i] > 0 || i === current ? undefined : "var(--muted)" }}>
        <span style={{ position: "relative", display: "inline-flex" }}>
          <Dot done={done[i]} current={i === current} />
          {bursts[i] !== undefined && <Burst start={bursts[i]!} radius={16} rays={8} />}
        </span>
        <span style={{ flex: 1, fontSize: 14 }}>
          {i + 1}. {l.title}
        </span>
        <span className="mono">{l.duration}</span>
      </div>
    ))}
  </div>
);

const Presenter: React.FC = () => (
  <div className="glass row" style={{ padding: "12px 22px 12px 12px", borderRadius: 999, gap: 12 }}>
    <span className="avatar" style={{ width: 42, height: 42 }}>
      {T.presenter.initials}
    </span>
    <div style={{ lineHeight: 1.3 }}>
      <span className="small muted">Présenté par</span>
      <div style={{ fontWeight: 600 }}>{T.presenter.name}</div>
      <div className="small muted">{T.presenter.title}</div>
    </div>
  </div>
);

const LessonPage: React.FC = () => (
  <>
    <TopBar />
    <div style={{ padding: "22px 34px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 22 }}>
      <div className="stack">
        <span className="mono">Ma formation / {T.machine.name} / Leçon 1</span>
        <Player t={0} />
        <h1 className="display h2">{T.program.lessons[0].title}</h1>
      </div>
      <div className="stack">
        <div className="glass card">
          <span className="eyebrow">Ma progression</span>
          <div style={{ marginTop: 10 }}>
            <Progress value={0} />
          </div>
        </div>
        <div className="glass card">
          <LessonList done={[0, 0, 0]} current={0} />
        </div>
      </div>
    </div>
  </>
);

type Row = { name: string; email: string; machine: string; program: string; pct: number; done: string; status: string; cls: string; highlight?: boolean };
const ADMIN_ROWS: Row[] = [
  ...T.admin.rows,
  { name: "Dr Hind Berrada", email: "h.berrada@exemple.ma", machine: "LA QUEEN", program: "LA QUEEN — Programme opérateur", pct: 67, done: "2 / 3", status: "En cours", cls: "" },
  { name: "Dr Omar Lahlou", email: "o.lahlou@exemple.ma", machine: "SEVENWAVES", program: "SEVENWAVES — Programme opérateur", pct: 100, done: "4 / 4", status: "Terminée", cls: "ok" },
];

const AdminRowCard: React.FC<{ r: Row }> = ({ r }) => (
  <div className="glass stack" style={{ padding: 20, gap: 12, borderRadius: 24, background: "linear-gradient(145deg, rgba(255,255,255,.97), rgba(255,255,255,.82))" }}>
    <div className="row between">
      <div className="row">
        <span className="avatar">{T.doctor.initials}</span>
        <div>
          <b>{r.name}</b>
          <div className="small muted">{r.email}</div>
        </div>
      </div>
      <span className={`badge ${r.cls}`} style={{ position: "relative" }}>
        {r.status}
        <Burst start={44} radius={46} rays={10} />
      </span>
    </div>
    <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
      <span className="badge rb">{r.machine}</span>
      <span className="muted">→</span>
      <span className="small">{r.program}</span>
    </div>
    <Progress value={r.pct} height={7} />
    <span className="small muted">{r.done} leçons</span>
  </div>
);

const AdminPage: React.FC = () => (
  <>
    <TopBar admin />
    <div style={{ padding: "24px 34px" }} className="stack">
      <div>
        <span className="eyebrow">{T.admin.eyebrow}</span>
        <h1 className="display h1" style={{ marginTop: 6 }}>
          Médecins
        </h1>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {T.admin.kpis.map((k) => (
          <div key={k.label} className="glass card kpi" style={{ padding: 16 }}>
            <span className="eyebrow">{k.label}</span>
            <div className="v">{k.value}</div>
          </div>
        ))}
      </div>
      <section className="glass" style={{ padding: 0 }}>
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
            {ADMIN_ROWS.map((r) => (
              <tr key={r.name}>
                <td>
                  <b>{r.name}</b>
                  <div className="small muted">{r.email}</div>
                </td>
                <td className="small">{r.machine}</td>
                <td className="small">{r.program}</td>
                <td style={{ minWidth: 150 }}>
                  <Progress value={r.pct} />
                </td>
                <td>
                  <span className={`badge ${r.cls}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  </>
);

/* -------------------------------- Plans ---------------------------------- */

export const SceneLogo: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tall = useTall();
  const p = sp(f, 0, fps, { damping: 16, stiffness: 90, mass: 1 });
  const size = tall ? 112 : 128;
  return (
    <SceneFade>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: Math.min(1, p * 1.5), transform: `scale(${0.85 + 0.15 * p})`, filter: `blur(${Math.max(0, 1 - p) * 10}px)` }}>
          <Logo size={size} draw={prog(f, 6, 48)} id="ecg-intro" />
        </div>
        <div className="display" style={{ fontSize: 60, letterSpacing: "0.32em", marginRight: "-0.32em", marginTop: 34, ...rise(f, 34, 22) }}>
          <span className="iri">{T.logoTag}</span>
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
};

export const SceneHook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tall = useTall();
  const size = tall ? 100 : 118;
  const swap = prog(f, 34, 14);
  const words = (text: readonly string[], start: number, iri?: string) =>
    text
      .join(" ")
      .split(" ")
      .map((w, i) => {
        const p = sp(f, start + i * 3, fps, { damping: 13, stiffness: 170, mass: 0.7 });
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", padding: "0 0.12em 0.08em" }}>
            <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 110}%)` }}>{iri && w.toLowerCase() === iri ? <span className="iri">{w}</span> : w}</span>
          </span>
        );
      });
  const style: React.CSSProperties = { position: "absolute", fontSize: size, lineHeight: 1, textAlign: "center", width: tall ? 940 : 1500 };
  return (
    <SceneFade>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <h1 className="display" style={{ ...style, opacity: 1 - swap, transform: `translateY(${-swap * 80}px)`, filter: `blur(${swap * 8}px)` }}>
          {words(T.hook.line1, 0)}
        </h1>
        {f >= 36 && (
          <h1 className="display" style={style}>
            {words(T.hook.line2, 38, T.hook.iri)}
          </h1>
        )}
      </AbsoluteFill>
    </SceneFade>
  );
};

/** 01 — Invitation : la fenêtre arrive en 3D, la carte d'invitation sort, le curseur crée l'accès. */
export const SceneInvite: React.FC = () => {
  const f = useCurrentFrame();
  const { tall, cx, cy } = useFmt();
  const dots = Math.floor(interpolate(f, [48, 70], [0, 12], clamp));
  const ok = f >= 92;
  const press = interpolate(f, [88, 92, 98], [1, 0.94, 1], clamp);
  const z = tall ? 1.85 : 1.55;
  const py = tall ? cy - 20 : cy + 20;
  // Positions (px) du champ et du bouton dans la carte agrandie.
  const field = { x: cx + 120, y: py + 95 * z * 0.75 };
  const btn = { x: cx + 40, y: py + 160 * z * 0.75 };
  return (
    <SceneFade>
      <AppWindow start={0} rx={14} ry={-16} blurAt={18}>
        <InvitePage />
      </AppWindow>
      <Headline {...T.captions.invite} start={4} />
      <Pop x={cx} y={py} start={18} w={460} z={z}>
        <InviteCard dots={dots} ok={ok} press={press} burst={92} />
      </Pop>
      <Cursor
        keys={[
          [34, cx + (tall ? 380 : 520), py + (tall ? 520 : 380)],
          [46, field.x, field.y],
          [76, field.x, field.y],
          [86, btn.x, btn.y],
        ]}
        clicks={[46, 88]}
      />
    </SceneFade>
  );
};

/** 02 — Tableau de bord : la fenêtre tourne, la machine puis le parcours sortent, clic sur « Commencer ». */
export const SceneDashboard: React.FC = () => {
  const f = useCurrentFrame();
  const { tall, cx, cy } = useFmt();
  const press = interpolate(f, [96, 100, 106], [1, 0.94, 1], clamp);
  const ring = f >= 100 ? prog(f, 100, 20) : 0;
  const m = tall ? { x: cx, y: cy - 330 } : { x: cx - 330, y: cy - 90 };
  const pr = tall ? { x: cx, y: cy + 170 } : { x: cx + 320, y: cy + 80 };
  const btn = tall ? { x: cx - 120, y: pr.y + 225 } : { x: pr.x - 110, y: pr.y + 200 };
  return (
    <SceneFade>
      <AppWindow start={0} rx={12} ry={14} blurAt={20}>
        <DashboardPage />
      </AppWindow>
      <Headline {...T.captions.dashboard} start={4} />
      <Pop x={m.x} y={m.y} start={22} w={tall ? 500 : 420} tilt={-6} z={tall ? 1.8 : 1.55}>
        <MachineCard scan={30} />
      </Pop>
      <Pop x={pr.x} y={pr.y} start={40} w={tall ? 520 : 440} tilt={6} z={tall ? 1.75 : 1.5}>
        <ProgramCard press={press} ring={ring} />
      </Pop>
      <Cursor
        keys={[
          [70, cx + (tall ? 420 : 700), cy + (tall ? 700 : 420)],
          [94, btn.x, btn.y],
        ]}
        clicks={[97]}
      />
    </SceneFade>
  );
};

/** 03 — Leçon : le lecteur sort de la page, l'intervenant et la liste flottent autour, la leçon se coche. */
export const SceneLesson: React.FC = () => {
  const f = useCurrentFrame();
  const { tall, cx, cy } = useFmt();
  const watch = interpolate(f, [16, 104], [0, 1], clamp);
  const check = prog(f, 108, 16);
  const player = tall ? { x: cx, y: cy - 230 } : { x: cx - 190, y: cy - 20 };
  const list = tall ? { x: cx, y: cy + 400 } : { x: cx + 520, y: cy + 170 };
  const pres = tall ? { x: cx, y: cy + 150 } : { x: cx - 330, y: cy + 340 };
  return (
    <SceneFade>
      <AppWindow start={0} rx={14} ry={-12} blurAt={12} scale={tall ? 1.05 : 1.15}>
        <LessonPage />
      </AppWindow>
      <Headline {...T.captions.lesson} start={4} />
      <Pop x={player.x} y={player.y} start={10} w={tall ? 540 : 600} z={tall ? 1.75 : 1.45}>
        <div style={{ borderRadius: 24, padding: 6, background: "rgba(255,255,255,.7)", border: "1px solid rgba(255,255,255,.95)" }}>
          <ScanReveal start={16} dur={30} radius={18}>
            <Player t={watch} />
          </ScanReveal>
        </div>
      </Pop>
      <Pop x={pres.x} y={pres.y} start={34} w={tall ? 430 : 380} z={tall ? 1.75 : 1.45}>
        <Presenter />
      </Pop>
      <Pop x={list.x} y={list.y} start={50} w={tall ? 520 : 380} z={tall ? 1.6 : 1.4} tilt={5}>
        <section className="glass card" style={{ padding: 14 }}>
          <div className="row between" style={{ padding: "2px 8px 8px" }}>
            <span className="eyebrow">Leçons du parcours</span>
            <span className="pct">{Math.round(check * 33)} %</span>
          </div>
          <LessonList done={[check, 0, 0]} current={check > 0.5 ? 1 : 0} bursts={[110]} />
        </section>
      </Pop>
    </SceneFade>
  );
};

/** 04 — PDF et progression : les fiches sortent du dossier, la barre se remplit, badge « Formation terminée ». */
export const SceneProgress: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { tall, cx, cy } = useFmt();
  const c2 = prog(f, 40, 16);
  const c3 = prog(f, 66, 16);
  const value = 33 + (c2 + c3) * 33.5;
  const done = c3 > 0.5 ? 3 : c2 > 0.5 ? 2 : 1;
  const badge = sp(f, 84, fps, { damping: 9, stiffness: 160, mass: 0.6 });
  const folder = tall ? { x: cx, y: cy - 300 } : { x: cx - 420, y: cy + 40 };
  const card = tall ? { x: cx, y: cy + 330 } : { x: cx + 330, y: cy + 40 };
  return (
    <SceneFade>
      <Headline {...T.captions.progress} start={2} />
      {/* Dossier « Protocoles » : les fiches PDF en sortent */}
      <Pop x={folder.x} y={folder.y} start={4} w={360} z={tall ? 1.8 : 1.5}>
        <div style={{ position: "relative", height: 300 }}>
          <div style={{ position: "absolute", left: 18, right: 18, top: 0, height: 210, borderRadius: 22, background: "linear-gradient(135deg, #a797ff, #7b61ff 60%, #e91e8c)", opacity: 0.9 }} />
          {T.program.documents.map((d, i) => {
            const p = sp(f, 14 + i * 7, fps, { damping: 12, stiffness: 120, mass: 0.7 });
            return (
              <div
                key={d}
                className="doc"
                style={{ position: "absolute", left: 36 + i * 14, right: 36 - i * 14, top: 30 - p * (i ? 26 : 104), background: "#fff", transform: `rotate(${(i ? 4 : -5) * p}deg)`, boxShadow: "var(--shadow-sm)" }}
              >
                <span className="ic">PDF</span>
                <span style={{ minWidth: 0 }}>
                  <b className="small">{d}</b>
                  <span className="small muted" style={{ display: "block" }}>
                    {T.machine.name} · PDF
                  </span>
                </span>
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 200,
              borderRadius: 24,
              background: "linear-gradient(160deg, rgba(255,255,255,.78), rgba(214,206,255,.6))",
              border: "1px solid rgba(255,255,255,.95)",
              backdropFilter: "blur(14px)",
              boxShadow: "0 1px 0 rgba(255,255,255,.9) inset",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <span className="eyebrow">Documents</span>
            <b className="display" style={{ fontSize: 26, marginTop: 8 }}>
              Protocoles
            </b>
            <span className="small muted">
              {T.program.documents.length} fiches PDF · {T.machine.name}
            </span>
          </div>
        </div>
      </Pop>
      <Pop x={card.x} y={card.y} start={12} w={tall ? 520 : 460} z={tall ? 1.7 : 1.5}>
        <section className="glass card stack" style={{ gap: 12 }}>
          <div className="row between">
            <span className="eyebrow">Ma progression</span>
            <span className="badge ok" style={{ position: "relative", height: 32, padding: "0 14px", fontSize: 12, opacity: Math.min(1, badge * 2), transform: `scale(${0.5 + 0.5 * badge})` }}>
              Formation terminée
              <Burst start={86} radius={70} rays={14} />
            </span>
          </div>
          <div className="display" style={{ fontSize: 68, fontStretch: "112%", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
            {Math.round(value)}
            <span style={{ fontSize: 32, marginLeft: 6 }}>%</span>
          </div>
          <div className="progress" style={{ height: 9 }}>
            <i style={{ width: `${value}%` }} />
          </div>
          <p className="small muted">
            {done} / {T.program.lessons.length} leçons · {T.program.title}
          </p>
          <LessonList done={[1, c2, c3]} current={c3 > 0.5 ? -1 : c2 > 0.5 ? 2 : 1} bursts={[undefined, 42, 68]} />
        </section>
      </Pop>
      <Cursor
        keys={[
          [24, folder.x + (tall ? 300 : 260), folder.y + (tall ? 330 : 300)],
          [40, folder.x + 40, folder.y - (tall ? 60 : 50)],
        ]}
        clicks={[42]}
      />
    </SceneFade>
  );
};

/** 05 — Suivi CELLULIFT : le tableau admin en 3D, la ligne du médecin sort vers la caméra. */
export const SceneAdmin: React.FC = () => {
  const { tall, cx, cy } = useFmt();
  const salma = ADMIN_ROWS.find((r) => r.highlight) ?? ADMIN_ROWS[0];
  const row = tall ? { x: cx, y: cy + 170 } : { x: cx + 140, y: cy + 130 };
  return (
    <SceneFade>
      <AppWindow start={0} rx={18} ry={-10} blurAt={34} scale={tall ? 1.0 : 1.18} dy={tall ? -120 : 0}>
        <AdminPage />
      </AppWindow>
      <Headline {...T.captions.admin} start={4} />
      <Pop x={row.x} y={row.y} start={34} w={520} z={tall ? 1.75 : 1.5} tilt={-4}>
        <AdminRowCard r={salma} />
      </Pop>
      <Cursor
        keys={[
          [20, cx + (tall ? 300 : 600), cy + (tall ? 600 : 380)],
          [44, row.x + (tall ? 200 : 170), row.y + (tall ? 70 : 60)],
          [80, row.x + (tall ? 190 : 160), row.y + (tall ? 78 : 66)],
        ]}
      />
    </SceneFade>
  );
};

export const SceneSignature: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const tall = useTall();
  const S = T.signature;
  const size = tall ? 70 : 78;
  const end = interpolate(f, [durationInFrames - 12, durationInFrames], [1, 0], clamp);
  const p = sp(f, 0, fps, { damping: 16, stiffness: 100, mass: 1 });
  return (
    <SceneFade out={false}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", opacity: end, padding: 60 }}>
        <div style={{ transform: `scale(${0.85 + 0.15 * p})`, opacity: Math.min(1, p * 1.5) }}>
          <Logo size={tall ? 64 : 58} draw={prog(f, 2, 44)} tag={T.logoTag} id="ecg-end" />
        </div>
        <h2 className="display" style={{ fontSize: size, lineHeight: 1, marginTop: tall ? 90 : 60 }}>
          <div style={rise(f, 10, 22, 30)}>{S.line1}</div>
          <div style={{ ...rise(f, 16, 22, 30), marginTop: 6 }}>
            <Iri text={S.line2} iri={S.iri} />
          </div>
        </h2>
        <div style={{ height: 2, width: (tall ? 720 : 1000) * prog(f, 26, 36), background: "var(--rainbow)", opacity: 0.8, margin: `${tall ? 64 : 48}px 0 ${tall ? 40 : 30}px` }} />
        <div className="mono" style={{ fontSize: tall ? 34 : 28, letterSpacing: "0.18em", color: "var(--deep)", textTransform: "none", ...rise(f, 34, 22) }}>
          {S.url}
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
};
