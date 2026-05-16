import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CinematicBg } from "../../components/CinematicBg";
import { Logo } from "../../components/Logo";
import { theme } from "../../theme";

// 0:52–1:00 — Logo + URL + CTA.
export const PromoCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoT = spring({ frame: frame - 4, fps, config: { damping: 11, stiffness: 160 } });
  const urlT = spring({ frame: frame - 36, fps, config: { damping: 12, stiffness: 180 } });
  const ctaT = spring({ frame: frame - 80, fps, config: { damping: 8, stiffness: 220 } });

  const ringPulse = (frame % 60) / 60;
  const ringScale = 1 + ringPulse * 0.6;
  const ringOpacity = 1 - ringPulse;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <CinematicBg hueA="#1a0830" hueB="#000" pan={0.3} zoom={1.04} />

      {/* glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 1200,
          height: 1200,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(124,92,255,0.35) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
        }}
      >
        <div
          style={{
            opacity: logoT,
            transform: `scale(${0.8 + logoT * 0.2})`,
          }}
        >
          <Logo size={130} />
        </div>

        <div
          style={{
            position: "relative",
            opacity: urlT,
            transform: `translateY(${(1 - urlT) * 24}px)`,
            padding: "20px 48px",
            border: "2px solid rgba(124,92,255,0.6)",
            borderRadius: 18,
            fontFamily: theme.fontMono,
            fontSize: 56,
            fontWeight: 700,
            color: theme.ink,
            letterSpacing: -1,
            background: "rgba(124,92,255,0.08)",
            backdropFilter: "blur(10px)",
          }}
        >
          buildyourbot.io
          {/* pulse ring */}
          <div
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: 22,
              border: "2px solid rgba(124,92,255,0.6)",
              transform: `scale(${ringScale})`,
              opacity: ringOpacity,
              pointerEvents: "none",
            }}
          />
        </div>

        <div
          style={{
            fontFamily: theme.fontDisplay,
            fontWeight: 900,
            fontSize: 120,
            background: "linear-gradient(120deg, #7c5cff 0%, #00d4ff 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            letterSpacing: -4,
            opacity: ctaT,
            transform: `scale(${0.9 + ctaT * 0.1})`,
            textShadow: "0 20px 80px rgba(124,92,255,0.4)",
          }}
        >
          Build yours.
        </div>

        <div
          style={{
            fontFamily: theme.fontMono,
            fontSize: 26,
            color: theme.inkDim,
            letterSpacing: 3,
            marginTop: -10,
            opacity: interpolate(frame, [110, 140], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          FREE TO START · NO CARD · 10 MINUTES
        </div>
      </div>
    </AbsoluteFill>
  );
};
