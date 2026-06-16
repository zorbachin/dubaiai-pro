import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CinematicBg } from "../components/CinematicBg";
import { Caption } from "../components/Caption";
import { theme } from "../theme";

// 0:05–0:12 — Setup. "Five things you've been avoiding."
export const SceneSetup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slots = [0, 1, 2, 3, 4];

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <CinematicBg hueA="#0a0a2a" hueB="#000" pan={1.2} zoom={1.05} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          alignItems: "center",
          justifyContent: "center",
          padding: "12% 8%",
        }}
      >
        <div
          style={{
            fontFamily: theme.fontDisplay,
            fontWeight: 900,
            fontSize: 320,
            color: theme.accent,
            lineHeight: 0.85,
            textShadow: "0 20px 80px rgba(255,59,48,0.4)",
            transform: `scale(${spring({
              frame: frame - 6,
              fps,
              config: { damping: 9, stiffness: 140 },
            })})`,
          }}
        >
          5
        </div>
        <div
          style={{
            display: "flex",
            gap: 18,
            marginTop: 40,
          }}
        >
          {slots.map((i) => {
            const t = spring({
              frame: frame - 30 - i * 8,
              fps,
              config: { damping: 12, stiffness: 180 },
            });
            return (
              <div
                key={i}
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: 22,
                  background: "rgba(255,255,255,0.06)",
                  border: "2px solid rgba(255,255,255,0.18)",
                  transform: `translateY(${(1 - t) * 60}px) scale(${0.8 + t * 0.2})`,
                  opacity: t,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: theme.fontDisplay,
                  fontWeight: 900,
                  fontSize: 64,
                  color: theme.inkDim,
                }}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>

      <Caption
        text="Easier than ordering coffee."
        highlight="coffee"
        position="bottom"
        size={70}
      />
    </AbsoluteFill>
  );
};
