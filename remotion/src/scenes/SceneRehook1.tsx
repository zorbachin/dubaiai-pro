import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Typewriter } from "../components/Typewriter";
import { Grain } from "../components/Grain";
import { theme } from "../theme";

// 0:32–0:38 — Re-hook on black: "this isn't the scary one."
export const SceneRehook1: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = interpolate(frame, [0, 4, 8], [1, 0.3, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#fff",
          opacity: flash,
        }}
      />

      <Grain opacity={0.12} />

      <div
        style={{
          position: "absolute",
          left: "8%",
          top: "44%",
          right: "8%",
        }}
      >
        <Typewriter
          text="this isn't the scary one."
          charsPerFrame={0.9}
          size={92}
          color={theme.ink}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: "8%",
          bottom: "10%",
          fontFamily: theme.fontMono,
          color: theme.inkDim,
          fontSize: 28,
        }}
      >
        [whispered]
      </div>
    </AbsoluteFill>
  );
};
