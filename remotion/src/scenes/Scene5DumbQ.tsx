import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CinematicBg } from "../components/CinematicBg";
import { Numeral } from "../components/Numeral";
import { Caption } from "../components/Caption";
import { Typewriter } from "../components/Typewriter";
import { theme } from "../theme";

// 1:35–1:50 — The dumb question. 2 AM. Lean into the bit.
export const Scene5DumbQ: React.FC = () => {
  const frame = useCurrentFrame();

  const glow = 0.55 + Math.sin(frame * 0.15) * 0.05;
  const dollyZoom = interpolate(frame, [0, 450], [1, 1.18]);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <CinematicBg hueA="#0a1230" hueB="#000" pan={0.2} zoom={1.05} />

      <Numeral n={5} label={"The question\nyou'd never Google"} />

      {/* face silhouette in the dark */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "55%",
          transform: `translate(-50%, -50%) scale(${dollyZoom})`,
          width: 720,
          height: 900,
          borderRadius: "50% 50% 46% 46% / 60% 60% 40% 40%",
          background: "#0a0a14",
          boxShadow: `0 0 200px rgba(120,180,255,${glow * 0.5})`,
        }}
      />

      {/* phone screen glow on face */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "62%",
          transform: "translate(-50%, -50%)",
          width: 440,
          height: 280,
          background: "rgba(180,210,255,0.75)",
          borderRadius: 20,
          filter: "blur(60px)",
          opacity: glow,
        }}
      />

      {/* clock */}
      <div
        style={{
          position: "absolute",
          right: "8%",
          top: "10%",
          fontFamily: theme.fontMono,
          color: "rgba(255,255,255,0.5)",
          fontSize: 36,
          letterSpacing: 4,
        }}
      >
        02:14
      </div>

      {/* typed question */}
      <div
        style={{
          position: "absolute",
          left: "10%",
          right: "10%",
          top: "78%",
          padding: "20px 26px",
          background: "rgba(0,0,0,0.7)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 14,
          minHeight: 80,
        }}
      >
        <Typewriter
          text="is it normal that..."
          charsPerFrame={0.55}
          size={56}
          color={theme.ink}
        />
      </div>

      <Caption
        text="Nobody's watching. Nobody ever was."
        position="bottom"
        highlight="Nobody"
        size={56}
      />
    </AbsoluteFill>
  );
};
