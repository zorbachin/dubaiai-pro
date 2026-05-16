import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CinematicBg } from "../../components/CinematicBg";
import { theme } from "../../theme";

// 0:42–0:52 — Numbers + speed claim.
const Stat: React.FC<{ n: string; label: string; delay: number; color: string }> = ({
  n,
  label,
  delay,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 160 } });
  return (
    <div
      style={{
        textAlign: "center",
        opacity: t,
        transform: `translateY(${(1 - t) * 30}px)`,
      }}
    >
      <div
        style={{
          fontFamily: theme.fontDisplay,
          fontWeight: 900,
          fontSize: 200,
          color,
          letterSpacing: -6,
          lineHeight: 0.9,
          textShadow: `0 0 60px ${color}55`,
        }}
      >
        {n}
      </div>
      <div
        style={{
          fontFamily: theme.fontMono,
          fontSize: 28,
          color: theme.inkDim,
          letterSpacing: 3,
          marginTop: 12,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const PromoProof: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;

  return (
    <AbsoluteFill style={{ background: "#070710" }}>
      <CinematicBg hueA="#0a1430" hueB="#000" pan={0.3} zoom={1.03} />

      <div
        style={{
          position: "absolute",
          top: isVertical ? "8%" : "12%",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: theme.fontDisplay,
          fontWeight: 800,
          fontSize: isVertical ? 80 : 64,
          color: theme.ink,
          letterSpacing: -2,
          opacity: interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        Idea → live bot.
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          alignItems: "center",
          justifyContent: isVertical ? "center" : "space-evenly",
          gap: isVertical ? 40 : 0,
          padding: isVertical ? "20% 6% 18%" : "0 6%",
        }}
      >
        <Stat n="10 min" label="Avg. time to deploy" delay={20} color="#7c5cff" />
        <Stat n="42k" label="Bots shipped" delay={50} color="#00d4ff" />
        <Stat n="0" label="Lines of code" delay={80} color="#30d158" />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: isVertical ? "6%" : "10%",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: theme.fontDisplay,
          fontWeight: 700,
          fontSize: isVertical ? 48 : 40,
          color: theme.inkDim,
          letterSpacing: -1,
          opacity: interpolate(frame, [180, 220], [0, 1], { extrapolateRight: "clamp" }),
          padding: "0 8%",
        }}
      >
        Or, you know — keep doing it by hand.
      </div>
    </AbsoluteFill>
  );
};
