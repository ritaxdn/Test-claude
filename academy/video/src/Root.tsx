import React from "react";
import { Composition } from "remotion";
import { Pub } from "./Pub";
import { DURATION, FPS } from "./timeline";

export function Root() {
  return (
    <>
      <Composition id="Pub16x9" component={Pub} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ vertical: false }} />
      <Composition id="Pub9x16" component={Pub} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} defaultProps={{ vertical: true }} />
    </>
  );
}
