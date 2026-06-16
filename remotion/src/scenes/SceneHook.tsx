import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CinematicBg } from "../components/CinematicBg";
import { Caption } from "../components/Caption";
import { theme } from "../theme";

// 0:00–0:05 — ECU finger over send button, sweat. Punch line.
export const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fingerY = interpolate(frame, [0, 60, 90, 120], [40, -10, -6, -22]);
  const sweat = interpolate(frame, [40, 90], [0, 1], { extrapolateRight: "clamp" });
  const buttonPulse = spring({ frame: frame - 30, fps, config: { damping: 6, stiffness: 120 } });
  const captionStart = frame > 70;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <CinematicBg hueA="#2a0a0a" hueB="#000" pan={0.6} zoom={1.15} />

      {/* simulated ECU send button */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "62%",
          transform: `translate(-50%, -50%) scale(${1 + buttonPulse * 0.05})`,
          width: 520,
          height: 520,
          borderRadius: 260,
          background:
            "radial-gradient(circle at 35% 30%, #1ea7ff 0%, #0a84ff 40%, #024ea2 100%)",
          boxShadow:
            "0 60px 140px rgba(10,132,255,0.45), inset 0 -30px 60px rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontFamily: theme.fontDisplay,
          fontWeight: 800,
          fontSize: 96,
          letterSpacing: -2,
        }}
      >
        SEND
      </div>

      {/* simulated finger silhouette */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: `calc(62% + ${fingerY}px)`,
          transform: "translate(-50%, -100%)",
          width: 280,
          height: 460,
          borderRadius: "55% 45% 50% 50% / 60% 60% 40% 40%",
          background:
            "linear-gradient(180deg, #c98b6b 0%, #8a5a45 70%, #4a2f24 100%)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.55)",
        }}
      />

      {/* sweat drop */}
      <div
        style={{
          position: "absolute",
          left: "52%",
          top: `calc(40% + ${sweat * 120}px)`,
          width: 18,
          height: 28,
          borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          background: "rgba(180,220,255,0.85)",
          opacity: sweat,
          filter: "blur(0.5px)",
          boxShadow: "inset -2px -4px 6px rgba(255,255,255,0.6)",
        }}
      />

      {captionStart && (
        <Caption
          text="You're scared of a website."
          highlight="website"
          position="bottom"
          size={88}
        />
      )}
    </AbsoluteFill>
  );
};
