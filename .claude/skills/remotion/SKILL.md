---
name: remotion
description: Build programmatic videos with Remotion and React. Use this whenever the user wants to create, edit, or render a video, animation, motion graphic, promo/explainer clip, or MP4 from React components — or mentions Remotion, `<Composition>`, `useCurrentFrame`, `interpolate`, `spring`, `<Sequence>`, `<Series>`, `<TransitionSeries>`, `<OffthreadVideo>`, `<Audio>`, or `staticFile`. Remotion renders React frame-by-frame into video, so the rules differ from a normal interactive React app.
---

# Remotion

Remotion turns React components into videos. Each frame is rendered
deterministically as a still image, then the stills are stitched into an MP4.
This is fundamentally different from a normal web app:

- **No interactivity.** There is no click, hover, scroll, or state that
  responds to a user. The only input that drives the picture is the current
  frame number.
- **Everything is a pure function of the frame.** The same frame must always
  produce the exact same pixels, or the render will flicker.
- **Time is measured in frames, not seconds.** `seconds = frame / fps`.

## Determinism — the #1 rule

Rendering happens across many parallel workers and frames may be re-rendered.
If output depends on anything non-deterministic, the video breaks.

- ❌ Never use `Math.random()`. ✅ Use Remotion's `random(seed)` — same seed →
  same value every time.
- ❌ Never use `Date.now()`, `new Date()`, or read live/mutating globals.
- ❌ Don't animate from un-seeded or time-based sources.
- ✅ Derive every animated value from `useCurrentFrame()`.

```tsx
import { random } from "remotion";
const jitter = random("particle-3") * 10; // stable across renders
```

## Project structure

A Remotion project registers compositions in a **Root** component, wired up
by `registerRoot` in `src/index.ts`.

```tsx
// src/Root.tsx
import { Composition } from "remotion";
import { MyVideo } from "./MyVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MyVideo"            // unique id, used by the CLI/renderer
      component={MyVideo}
      durationInFrames={150}  // 150 / 30fps = 5 seconds
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ title: "Hello" }}
    />
  );
};
```

```tsx
// src/index.ts
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";
registerRoot(RemotionRoot);
```

Common canvas sizes: `1920×1080` (landscape), `1080×1920` (vertical/reels),
`1080×1080` (square).

## Reading time & the composition config

```tsx
import { useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();                 // 0-indexed frame number
const { fps, durationInFrames, width, height } = useVideoConfig();
const seconds = frame / fps;
```

## Animating: `interpolate`

Map a frame range onto a value range. Always clamp unless you want the value to
keep extrapolating past the endpoints.

```tsx
import { interpolate, useCurrentFrame } from "remotion";

const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
const x = interpolate(frame, [0, 60], [-200, 0], {
  extrapolateRight: "clamp",
});
```

`interpolate` also accepts multi-point ranges and an easing function:

```tsx
import { Easing } from "remotion";
const v = interpolate(frame, [0, 15, 45, 60], [0, 1, 1, 0], {
  easing: Easing.inOut(Easing.ease),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

## Animating: `spring` (physics)

Natural, bouncy motion. `spring()` returns a value that typically eases from 0
to 1. Pass `fps` from `useVideoConfig`.

```tsx
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const scale = spring({
  frame,
  fps,
  config: { damping: 12, mass: 0.6, stiffness: 120 },
});
// often paired with interpolate to remap the 0..1 into a real range:
const entrance = spring({ frame, fps, config: { damping: 200 } });
const y = interpolate(entrance, [0, 1], [80, 0]);
```

## Layering: `AbsoluteFill`

`AbsoluteFill` is a `position:absolute; inset:0` flex box. Stack layers by
ordering them; later children paint on top.

```tsx
import { AbsoluteFill } from "remotion";

<AbsoluteFill style={{ backgroundColor: "#0b0b0f" }}>
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <h1 style={{ color: "white" }}>On top</h1>
  </AbsoluteFill>
</AbsoluteFill>
```

## Timing: `Sequence` and `Series`

`<Sequence>` shifts its children in time. Inside a Sequence, `useCurrentFrame()`
is **rebased to 0** at the sequence's start — so components animate relative to
their own entrance.

```tsx
import { Sequence } from "remotion";

<Sequence from={0} durationInFrames={60}><Intro /></Sequence>
<Sequence from={60} durationInFrames={90}><Body /></Sequence>
```

`<Series>` plays children back-to-back without hand-computing `from` offsets:

```tsx
import { Series } from "remotion";

<Series>
  <Series.Sequence durationInFrames={60}><SceneA /></Series.Sequence>
  <Series.Sequence durationInFrames={90}><SceneB /></Series.Sequence>
</Series>
```

## Transitions: `TransitionSeries`

From `@remotion/transitions`. Sequences overlap by the transition duration.

```tsx
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60}><SceneA /></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 20 })} />
  <TransitionSeries.Sequence durationInFrames={60}><SceneB /></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={slide()} timing={linearTiming({ durationInFrames: 15 })} />
  <TransitionSeries.Sequence durationInFrames={60}><SceneC /></TransitionSeries.Sequence>
</TransitionSeries>
```

## Media: images, video, gif, audio

Reference files in the `public/` folder with `staticFile()`.

```tsx
import { Img, OffthreadVideo, Audio, staticFile } from "remotion";
import { Gif } from "@remotion/gif";

<Img src={staticFile("logo.png")} />
<OffthreadVideo src={staticFile("clip.mp4")} startFrom={30} endAt={120} volume={0.8} />
<Gif src={staticFile("loading.gif")} />
<Audio src={staticFile("music.mp3")} startFrom={0} volume={(f) => interpolate(f, [0, 30], [0, 1], { extrapolateRight: "clamp" })} />
```

- Use `<OffthreadVideo>` (not `<Video>`) for reliable frame-accurate renders.
- `startFrom` / `endAt` trim by frame. `volume` can be a number or a
  `(frame) => number` for fades.
- Always load fonts with `@remotion/fonts` or `@remotion/google-fonts` so text
  metrics are stable during render.

## CLI

```bash
npx remotion studio          # interactive preview at localhost:3000
npx remotion render MyVideo out/video.mp4
npx remotion still MyVideo out/frame.png --frame=42
```

## Checklist before rendering

1. Every animated value derives from `useCurrentFrame()` — no `Math.random`,
   no `Date`.
2. `interpolate` calls clamp their extrapolation unless intentional.
3. `spring` receives `fps` from `useVideoConfig`.
4. `durationInFrames` on the `<Composition>` covers all sequences.
5. Media uses `staticFile()` and `<OffthreadVideo>`; fonts are preloaded.
6. Nothing depends on viewport size, user input, or wall-clock time.
