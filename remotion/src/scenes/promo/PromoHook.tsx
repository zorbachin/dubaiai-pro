import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CinematicBg } from "../../components/CinematicBg";
import { theme } from "../../theme";

// 0:00–0:05 — Hook. "You don't need to learn to code."
export const PromoHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;

  const lineA = spring({ frame: frame - 4, fps, config: { damping: 12, stiffness: 180 } });
  const lineB = spring({ frame: frame - 50, fps, config: { damping: 12, stiffness: 180 } });
  const strike = interpolate(frame, [70, 95], [0, 1], { extrapolateRight: "clamp" });

  const sizeA = isVertical ? 96 : 140;
  const sizeB = isVertical ? 130 : 160;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <CinematicBg hueA="#1a0830" hueB="#000" pan={0.6} zoom={1.08} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: "0 8%",
        }}
      >
        <div
          style={{
            position: "relative",
            fontFamily: theme.fontDisplay,
            fontWeight: 900,
            fontSize: sizeA,
            color: theme.ink,
            letterSpacing: -4,
            lineHeight: 1,
            textAlign: "center",
            opacity: lineA,
            transform: `translateY(${(1 - lineA) * 30}px)`,
          }}
        >
          You don't need to{" "}
          <span style={{ position: "relative", color: "#ff6b6b" }}>
            learn to code
            <span
              style={{
                position: "absolute",
                left: 0,
                top: "55%",
                height: 10,
                background: "#ff6b6b",
                width: `${strike * 100}%`,
                transformOrigin: "left",
                borderRadius: 5,
              }}
            />
          </span>
          .
        </div>

        <div
          style={{
            fontFamily: theme.fontDisplay,
            fontWeight: 900,
            fontSize: sizeB,
            background: "linear-gradient(120deg, #7c5cff 0%, #00d4ff 60%, #30d158 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            letterSpacing: -5,
            lineHeight: 1,
            textAlign: "center",
            opacity: lineB,
            transform: `translateY(${(1 - lineB) * 40}px) scale(${0.96 + lineB * 0.04})`,
            textShadow: "0 30px 80px rgba(124,92,255,0.35)",
          }}
        >
          You need a bot.
        </div>
      </div>
    </AbsoluteFill>
  );
};
