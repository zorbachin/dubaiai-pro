import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const Numeral: React.FC<{ n: number; label: string }> = ({
  n,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 8, stiffness: 220 } });
  const slide = spring({
    frame: frame - 4,
    fps,
    config: { damping: 14, stiffness: 160 },
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "8%",
        left: "6%",
        display: "flex",
        alignItems: "center",
        gap: 24,
      }}
    >
      <div
        style={{
          fontFamily: theme.fontDisplay,
          fontWeight: 900,
          fontSize: 220,
          lineHeight: 0.85,
          color: theme.accent,
          transform: `scale(${0.4 + pop * 0.6})`,
          textShadow: "0 0 60px rgba(255,59,48,0.6)",
        }}
      >
        {n}
      </div>
      <div
        style={{
          fontFamily: theme.fontDisplay,
          fontWeight: 700,
          fontSize: 44,
          color: theme.ink,
          letterSpacing: -1,
          maxWidth: 520,
          transform: `translateX(${(1 - slide) * -40}px)`,
          opacity: slide,
        }}
      >
        {label}
      </div>
    </div>
  );
};
