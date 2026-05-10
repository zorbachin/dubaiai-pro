import { Composition } from "remotion";
import { Video, FPS, DURATION_FRAMES } from "./Video";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Video"
        component={Video}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ aspect: "9:16" as const, audio: false }}
      />
      <Composition
        id="VideoLandscape"
        component={Video}
        durationInFrames={DURATION_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ aspect: "16:9" as const, audio: false }}
      />
    </>
  );
};
