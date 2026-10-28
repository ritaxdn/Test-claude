import React from "react";
import { Composition } from "remotion";
import { CelluliftPromo } from "./CelluliftPromo";
import { CelluliftLogo } from "./CelluliftLogo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Focused animated logo reveal — premium, cinematic write-in */}
      <Composition
        id="CelluliftLogo"
        component={CelluliftLogo}
        durationInFrames={170}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CelluliftLogo-Vertical"
        component={CelluliftLogo}
        durationInFrames={170}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Full promo (logo scene + pillars + CTA) */}
      <Composition
        id="CelluliftPromo"
        component={CelluliftPromo}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CelluliftPromo-Vertical"
        component={CelluliftPromo}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
