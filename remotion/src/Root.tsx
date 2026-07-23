import React from "react";
import { Composition } from "remotion";
import { CelluliftPromo } from "./CelluliftPromo";

// 6 seconds at 30fps
const DURATION = 180;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CelluliftPromo"
      component={CelluliftPromo}
      durationInFrames={DURATION}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        title: "Cellulift",
        tagline: "Metamorphosis Technology",
      }}
    />
  );
};
