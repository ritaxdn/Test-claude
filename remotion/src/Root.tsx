import React from "react";
import { Composition } from "remotion";
import { CelluliftPromo } from "./CelluliftPromo";
import { CelluliftLogo } from "./CelluliftLogo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Focused animated logo reveal — 4s loop */}
      <Composition
        id="CelluliftLogo"
        component={CelluliftLogo}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Full 6s promo (logo scene + pillars + CTA) */}
      <Composition
        id="CelluliftPromo"
        component={CelluliftPromo}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
