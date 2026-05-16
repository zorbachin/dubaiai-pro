import { Composition } from "remotion";
import { Video, DURATION_FRAMES } from "./Video";
import { Promo, PROMO_DURATION } from "./Promo";
import { FPS } from "./theme";

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

      {/* buildyourbot.io 60s YouTube promo (16:9 master + 9:16 short) */}
      <Composition
        id="Promo"
        component={Promo}
        durationInFrames={PROMO_DURATION}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ audio: false }}
      />
      <Composition
        id="PromoShort"
        component={Promo}
        durationInFrames={PROMO_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ audio: false }}
      />
    </>
  );
};
