import React from "react";
import { Composition } from "remotion";
import { Pub } from "./Pub";
import { DURATION, FPS } from "./timeline";
import { Teaser } from "./teaser/Teaser";
import { TEASER_DURATION } from "./teaser/teaserContent";

export function Root() {
  return (
    <>
      <Composition id="Pub16x9" component={Pub} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ vertical: false }} />
      <Composition id="Pub9x16" component={Pub} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} defaultProps={{ vertical: true }} />
      <Composition id="Teaser9x16" component={Teaser} durationInFrames={TEASER_DURATION} fps={FPS} width={1080} height={1920} defaultProps={{ vertical: true }} />
      <Composition id="Teaser16x9" component={Teaser} durationInFrames={TEASER_DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ vertical: false }} />
    </>
  );
}
