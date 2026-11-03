import React from "react";
import { Composition } from "remotion";
import { Ad, DURATION, FPS } from "./Ad";

export const Root: React.FC = () => (
  <>
    <Composition id="Academy16x9" component={Ad} width={1920} height={1080} fps={FPS} durationInFrames={DURATION} />
    <Composition id="Academy9x16" component={Ad} width={1080} height={1920} fps={FPS} durationInFrames={DURATION} />
  </>
);
