import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CinematicBg } from "../components/CinematicBg";
import { theme } from "../theme";

// 1:12–1:18 — Mid re-hook: red stamp on a calendar.
export const SceneRehook2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stamp = spring({
    frame: frame - 30,
    fps,
    config: { damping: 7, stiffness: 220 },
  });
  const tilt = interpolate(stamp, [0, 1], [12, -6]);
  const sc = interpolate(stamp, [0, 1], [3, 1]);
  const op = interpolate(stamp, [0, 0.4, 1], [0, 1, 1]);

  return (
    <AbsoluteFill style={{ background: "#0e0c08" }}>
      <CinematicBg hueA="#1a1206" hueB="#0a0805" pan={0.3} />

      {/* calendar grid */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%) rotate(-2deg)",
          width: 880,
          height: 1080,
          background: "#f6efe1",
          padding: 50,
          boxShadow: "0 80px 160px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            fontFamily: theme.fontDisplay,
            fontWeight: 800,
            fontSize: 64,
            color: "#222",
            marginBottom: 24,
          }}
        >
          MAY
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 8,
          }}
        >
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              style={{
                aspectRatio: "1 / 1",
                background: "#fff",
                border: "1px solid #d8cfb8",
                fontFamily: theme.fontMono,
                color: "#777",
                fontSize: 22,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-end",
                padding: 8,
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* stamp */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) rotate(${tilt}deg) scale(${sc})`,
          opacity: op,
          padding: "18px 40px",
          border: `8px solid ${theme.accent}`,
          color: theme.accent,
          fontFamily: theme.fontDisplay,
          fontWeight: 900,
          fontSize: 88,
          letterSpacing: 4,
          background: "rgba(255,255,255,0.08)",
          textShadow: "0 2px 0 rgba(0,0,0,0.2)",
        }}
      >
        NOBODY DOES #4
      </div>
    </AbsoluteFill>
  );
};
