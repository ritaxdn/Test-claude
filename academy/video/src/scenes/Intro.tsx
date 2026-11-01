import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C } from "../brand";
import { T } from "../content";
import { display, exitStyle, Iri, Logo, prog, rise, useFormat } from "../ui/kit";

/** 0–3 s : logo CELLULIFT, la ligne ECG se dessine (1,8 s), « Academy » apparaît. */
export function LogoScene({ dur }: { dur: number }) {
  const f = useCurrentFrame();
  const { v } = useFormat();
  const draw = prog(f, 8, 54);
  const scale = interpolate(f, [0, dur], [1, 1.035]);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", ...exitStyle(f, dur - 14) }}>
      <div style={{ transform: `scale(${scale})`, opacity: prog(f, 0, 18) }}>
        <Logo size={v ? 96 : 118} tag={T.logoTag} draw={draw} tagOpacity={prog(f, 50, 22)} id="ecg-intro" />
      </div>
    </AbsoluteFill>
  );
}

/** 3–7 s : accroche, un mot en dégradé irisé. */
export function HookScene({ dur }: { dur: number }) {
  const f = useCurrentFrame();
  const { v, u } = useFormat();
  const size = v ? 104 : 108;
  const stretch = v ? 106 : 118;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: v ? "0 70px" : "0 120px", ...exitStyle(f, dur - 15) }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: v ? "flex-start" : "center", gap: v ? 40 : 28, maxWidth: v ? 940 : 1600 }}>
        <h1 style={{ ...display(size, stretch), textAlign: v ? "left" : "center", ...rise(f, 4, 26, 30) }}>{T.hook.line1}</h1>
        <h1 style={{ ...display(size, stretch), textAlign: v ? "left" : "center", ...rise(f, 22, 26, 30) }}>
          {T.hook.before}<Iri shift={prog(f, 26, 70)}>{T.hook.iri}</Iri>{T.hook.after}
        </h1>
        <span style={{ height: 1.5, width: (v ? 200 : 240) * prog(f, 38, 40), background: C.rainbow, marginTop: 12 * u, alignSelf: v ? "flex-start" : "center" }} />
      </div>
    </AbsoluteFill>
  );
}
