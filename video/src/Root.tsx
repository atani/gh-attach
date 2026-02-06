import React from "react";
import { Composition } from "remotion";
import { GhAttachDemo } from "./GhAttachDemo";

export const Root: React.FC = () => {
  return (
    <Composition
      id="GhAttachDemo"
      component={GhAttachDemo}
      durationInFrames={450}
      fps={30}
      width={1280}
      height={720}
    />
  );
};
