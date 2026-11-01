import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import "../styles.css";
import { C, F } from "../brand";
import { MUSIC_FILE, T } from "../content";
import { DocRow, display, EASE, EcgLine, eyebrow, FormatCtx, Glass, Iri, LessonDot, Pearl, prog, Progress, useFormat, type Format } from "../ui/kit";
import { Counter, DotGrid, KineticText, Orbs, Rings, ScanWipe, TypeOn, Viewfinder } from "./motion";
import { useFonts } from "../fonts";
import { TEASER } from "./teaserContent";

/* Découpage (images, 30 i/s)
   0–60      ligne ECG pleine largeur + « Avant-première »
   60–204    trois mots, chacun sur un fragment d'interface flou
   204–282   montage rapide de fragments nets
   282–300   voile nacré
   300–372   révélation du nom
   372–450   promesse, appel, adresse                              */

/* ---------- fragments d'interface (recadrés, jamais l'écran entier) ---------- */
function FragPlayer() {
  const f = useCurrentFrame();
  const { u } = useFormat();
  return (
    <div style={{ width: 640 * u, aspectRatio: "16 / 9", borderRadius: 22 * u, overflow: "hidden", position: "relative", background: C.player }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(45% 60% at ${30 + f * 0.2}% 40%, rgba(167,151,255,0.45), transparent 70%), radial-gradient(40% 55% at 70% 62%, rgba(127,227,240,0.3), transparent 70%), #121419` }} />
      <div style={{ position: "absolute", left: "4%", right: "4%", bottom: "8%", display: "flex", gap: 14 * u, alignItems: "center" }}>
        <span style={{ fontFamily: F.mono, fontSize: 11 * u, color: "rgba(236,235,231,0.8)" }}>03:12 / 09:00</span>
        <div style={{ flex: 1, height: 3 * u, background: "rgba(255,255,255,0.18)", borderRadius: 3 * u }}>
          <div style={{ width: `${30 + f * 0.6}%`, height: "100%", background: "rgba(255,255,255,0.85)", borderRadius: 3 * u }} />
        </div>
      </div>
    </div>
  );
}
function FragDocs() {
  const { u } = useFormat();
  return <Glass style={{ width: 420 * u }}><div style={{ display: "flex", flexDirection: "column", gap: 10 * u }}><span style={eyebrow(u)}>Documents</span>{T.docs.map((d) => <DocRow key={d} title={d} />)}</div></Glass>;
}
function FragProgress({ from = 20, to = 70, local = 0 }: { from?: number; to?: number; local?: number }) {
  const f = useCurrentFrame() - local;
  const { u } = useFormat();
  const p = interpolate(prog(f, 0, 40), [0, 1], [from, to]);
  return <Glass style={{ width: 420 * u }}><div style={{ display: "flex", flexDirection: "column", gap: 10 * u }}><span style={eyebrow(u)}>Ma progression</span><Progress value={p} /></div></Glass>;
}
function FragLessons() {
  const f = useCurrentFrame();
  const { u } = useFormat();
  return (
    <Glass style={{ width: 420 * u }}>
      {T.lessons.map((l, i) => (
        <div key={l.seq} style={{ display: "flex", alignItems: "center", gap: 12 * u, padding: `${10 * u}px ${4 * u}px`, fontFamily: F.sans, fontSize: 14 * u, color: i === 2 ? C.muted : C.deep }}>
          <LessonDot state={i < 2 ? "done" : "lock"} fill={prog(f, i * 5, 12)} />
          <span style={{ flex: 1 }}>{l.seq}. {l.title}</span>
        </div>
      ))}
    </Glass>
  );
}
function FragHello() {
  const { u } = useFormat();
  return <h1 style={{ ...display(40 * u, 118), whiteSpace: "nowrap" }}>Bonjour, <Iri shift={0.8}>{T.doctor.name}</Iri></h1>;
}
function FragDone() {
  const { u } = useFormat();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 * u }}>
      <svg width={34 * u} height={34 * u} viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="none" stroke={C.ok} strokeWidth="1.5" /><path d="M7 12.4 L10.4 15.6 L17 8.6" fill="none" stroke={C.ok} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 30 * u, color: C.ok, whiteSpace: "nowrap" }}>{T.done}</span>
    </div>
  );
}

/** Cadre qui grossit, dérive et fait la mise au point sur un fragment. */
function Lens({ children, dur, zoom = [1.9, 2.3], blur = [14, 9], drift = [40, -40], rot = 0 }: { children: React.ReactNode; dur: number; zoom?: [number, number]; blur?: [number, number]; drift?: [number, number]; rot?: number }) {
  const f = useCurrentFrame();
  const t = f / dur;
  const s = interpolate(t, [0, 1], zoom);
  const b = interpolate(t, [0, 1], blur);
  const x = interpolate(t, [0, 1], drift);
  const a = prog(f, 0, 8) * (1 - prog(f, dur - 8, 8));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: a }}>
      <div style={{ transform: `translateX(${x}px) scale(${s}) rotate(${rot}deg)`, filter: b > 0.2 ? `blur(${b}px)` : undefined }}>{children}</div>
    </AbsoluteFill>
  );
}

/* ---------- plans ---------- */
function Intro() {
  const f = useCurrentFrame();
  const { v, W } = useFormat();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Sequence from={30}><Rings count={2} gap={6} max={0.7} /></Sequence>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: v ? 48 : 36, opacity: 1 - prog(f, 50, 10) }}>
        <EcgLine width={W * 0.86} draw={prog(f, 4, 44)} stroke={0.9} id="ecg-t1" />
        <div style={{ ...eyebrow(v ? 1.9 : 1.6), color: C.deep, letterSpacing: "0.32em" }}>
          <TypeOn text={TEASER.kicker.toUpperCase()} start={18} cps={0.9} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

function Beat({ text, frag, dur, index }: { text: string; frag: React.ReactNode; dur: number; index: number }) {
  const f = useCurrentFrame();
  const { v } = useFormat();
  return (
    <AbsoluteFill>
      <Lens dur={dur} zoom={v ? [2.0, 2.4] : [1.7, 2.05]} blur={[16, 10]}>{frag}</Lens>
      <AbsoluteFill style={{ background: "radial-gradient(70% 45% at 50% 50%, rgba(236,238,243,0.82), rgba(236,238,243,0.35) 70%, transparent)" }} />
      <Counter index={index} total={TEASER.beats.length} local={f} dur={dur} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: v ? "0 70px" : 0 }}>
        <KineticText text={text} start={2} exit={dur - 12} size={v ? 118 : 132} stretch={v ? 104 : 118} stagger={0.9} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function Montage({ dur }: { dur: number }) {
  const f = useCurrentFrame();
  const { v, u } = useFormat();
  const shots: [React.ReactNode, number, number, number][] = [
    // fragment, échelle, largeur et hauteur du cadre de visée (px à l'échelle 1)
    [<FragHello key="h" />, v ? 0.78 : 1.6, v ? 980 : 1700, v ? 150 : 170],
    [<FragLessons key="l" />, v ? 1.25 : 1.8, v ? 950 : 1150, v ? 340 : 400],
    [<FragDone key="d" />, v ? 1.55 : 2.3, v ? 900 : 1000, v ? 160 : 180],
    [<FragProgress key="p" from={67} to={100} local={3 * 19} />, v ? 1.25 : 1.9, v ? 950 : 1200, v ? 240 : 260],
  ];
  const len = Math.floor(dur / shots.length);
  const i = Math.min(shots.length - 1, Math.floor(f / len));
  const lf = f - i * len;
  const [node, scale, fw, fh] = shots[i];
  const s = scale * interpolate(lf, [0, len], [1.08, 1]);
  return (
    <AbsoluteFill>
      <DotGrid opacity={0.55} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `scale(${s})`, filter: lf < 3 ? `blur(${(3 - lf) * 3}px)` : undefined }}>{node}</div>
      </AbsoluteFill>
      <Viewfinder w={fw} h={fh} label={`${String(i + 1).padStart(2, "0")} / ${String(shots.length).padStart(2, "0")} · APERÇU`} local={lf} />
      {/* filet arc-en-ciel qui file à chaque coupe */}
      <div style={{ position: "absolute", left: 0, top: v ? "70%" : "78%", height: 1.5, width: `${prog(lf, 0, len, EASE) * 100}%`, background: C.rainbow, opacity: 0.8 }} />
      <span style={{ position: "absolute", right: v ? 70 : 96, top: v ? "71.2%" : "79.5%", fontFamily: F.mono, fontSize: 11 * u, letterSpacing: "0.14em", color: C.deepSoft, fontVariantNumeric: "tabular-nums" }}>
        {String(Math.round(prog(f, 0, dur, EASE) * 100)).padStart(3, "0")} %
      </span>
    </AbsoluteFill>
  );
}

function Veil({ dur }: { dur: number }) {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: C.pearl, opacity: interpolate(f, [0, dur * 0.4, dur], [0, 1, 1]) }} />;
}

function Reveal({ dur }: { dur: number }) {
  const f = useCurrentFrame();
  const { v, W } = useFormat();
  const out = prog(f, dur - 10, 10);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <Sequence from={6}><Rings count={3} gap={7} /></Sequence>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: v ? 34 : 26, transform: `scale(${interpolate(f, [0, dur], [1.04, 1])})` }}>
          <div style={{ lineHeight: 0.85 }}>
            <KineticText text={TEASER.name} start={10} size={v ? 340 : 300} stretch={125} stagger={3} iri />
          </div>
          <EcgLine width={Math.min(W * 0.62, 900)} draw={prog(f, 0, 40)} stroke={1.1} id="ecg-t2" />
          <div style={{ ...eyebrow(v ? 2.1 : 1.8), letterSpacing: "0.28em", color: C.deepSoft }}>
            <TypeOn text={TEASER.by.toUpperCase()} start={30} cps={1.2} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function Outro({ dur }: { dur: number }) {
  const f = useCurrentFrame();
  const { v } = useFormat();
  const fade = 1 - prog(f, dur - 12, 12);
  const r = (s: number) => ({ opacity: prog(f, s, 20), transform: `translateY(${(1 - prog(f, s, 20)) * 22}px)` });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: fade, padding: v ? "0 80px" : 0 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: v ? 40 : 30, textAlign: "center" }}>
        <span style={{ ...display(v ? 64 : 58, 125), ...r(0) }}><Iri shift={1}>{TEASER.name}</Iri> <span style={{ fontFamily: F.mono, fontSize: v ? 22 : 20, letterSpacing: "0.28em", color: C.deepSoft, verticalAlign: "middle" }}>{TEASER.by}</span></span>
        <p style={{ margin: 0, fontFamily: F.sans, fontSize: v ? 40 : 34, color: C.deepSoft, maxWidth: v ? 880 : 1100, lineHeight: 1.3, ...r(6) }}>{TEASER.promise}</p>
        <div style={{ maxWidth: v ? 920 : 1500 }}>
          <KineticText text={TEASER.cta} start={12} size={v ? 92 : 84} stretch={v ? 104 : 118} stagger={0.6} />
        </div>
        <span style={{ height: 2, width: (v ? 640 : 900) * prog(f, 30, 30), background: C.rainbow }} />
        <div style={{ display: "flex", flexDirection: "column", gap: v ? 16 : 12, alignItems: "center" }}>
          <TypeOn text={TEASER.url} start={36} cps={1.3} style={{ fontFamily: F.mono, fontSize: v ? 34 : 28, letterSpacing: "0.14em", color: C.deep }} />
          <span style={{ ...eyebrow(v ? 1.6 : 1.4), letterSpacing: "0.2em", ...r(48) }}>{TEASER.audience}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

export function Teaser({ vertical }: { vertical: boolean }) {
  useFonts();
  const fmt: Format = vertical ? { v: true, u: 1.75, W: 1080, H: 1920 } : { v: false, u: 1.45, W: 1920, H: 1080 };
  const beats = [<FragPlayer key="a" />, <FragDocs key="b" />, <FragProgress key="c" />];
  return (
    <FormatCtx.Provider value={fmt}>
      <AbsoluteFill style={{ background: C.pearl, overflow: "hidden" }}>
        <Pearl />
        <Orbs strength={0.55} />
        <Sequence from={0} durationInFrames={60} name="Ligne ECG"><Intro /></Sequence>
        {TEASER.beats.map((b, i) => (
          <Sequence key={b} from={60 + i * 48} durationInFrames={48} name={`Mot ${i + 1}`}><Beat text={b} frag={beats[i]} dur={48} index={i} /></Sequence>
        ))}
        <Sequence from={204} durationInFrames={78} name="Montage"><Montage dur={78} /></Sequence>
        <Sequence from={276} durationInFrames={30} name="Voile"><Veil dur={30} /></Sequence>
        <Sequence from={300} durationInFrames={72} name="Révélation"><Reveal dur={72} /></Sequence>
        <Sequence from={372} durationInFrames={78} name="Appel"><Outro dur={78} /></Sequence>
        {/* balayages scan aux changements de plan */}
        {[52, 100, 148, 196, 278].map((at) => (
          <Sequence key={at} from={at} durationInFrames={18} name="Balayage"><ScanWipe dur={18} /></Sequence>
        ))}
        {MUSIC_FILE && <Audio src={staticFile(MUSIC_FILE)} />}
      </AbsoluteFill>
    </FormatCtx.Provider>
  );
}
