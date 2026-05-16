import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CinematicBg } from "../../components/CinematicBg";
import { Logo } from "../../components/Logo";
import { theme } from "../../theme";

// 0:15–0:25 — Reveal: drag, drop, ship a bot.
const Block: React.FC<{
  label: string;
  color: string;
  x: number;
  y: number;
  delay: number;
}> = ({ label, color, x, y, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 180 } });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "18px 26px",
        background: color,
        color: "#fff",
        borderRadius: 14,
        fontFamily: theme.fontDisplay,
        fontWeight: 700,
        fontSize: 30,
        boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
        opacity: t,
        transform: `translateY(${(1 - t) * 30}px) scale(${0.9 + t * 0.1})`,
      }}
    >
      {label}
    </div>
  );
};

const Wire: React.FC<{ d: string; delay: number }> = ({ d, delay }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 22], [0, 1], { extrapolateRight: "clamp" });
  return (
    <svg
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <path
        d={d}
        stroke="#7c5cff"
        strokeWidth={4}
        fill="none"
        strokeDasharray="600"
        strokeDashoffset={600 * (1 - t)}
        opacity={0.85}
        filter="drop-shadow(0 0 6px rgba(124,92,255,0.7))"
      />
    </svg>
  );
};

export const PromoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoT = spring({ frame: frame - 6, fps, config: { damping: 11, stiffness: 160 } });

  return (
    <AbsoluteFill style={{ background: "#070710" }}>
      <CinematicBg hueA="#0a0825" hueB="#000" pan={0.4} zoom={1.04} />

      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "50%",
          transform: `translateX(-50%) scale(${0.9 + logoT * 0.1})`,
          opacity: logoT,
        }}
      >
        <Logo size={92} />
      </div>

      {/* node graph */}
      <Block label="Trigger · New message" color="#1f6feb" x={140} y={420} delay={20} />
      <Block label="LLM · Understand intent" color="#7c5cff" x={620} y={300} delay={50} />
      <Block label="Tool · Lookup order" color="#f97316" x={620} y={520} delay={75} />
      <Block label="Action · Reply + log" color="#30d158" x={1180} y={420} delay={105} />
      <Block label="Deploy · Live" color="#ff375f" x={1620} y={420} delay={140} />

      <Wire d="M 470,468 C 560,468 560,360 620,348" delay={40} />
      <Wire d="M 470,468 C 560,468 560,560 620,568" delay={65} />
      <Wire d="M 940,348 C 1080,348 1080,460 1180,468" delay={95} />
      <Wire d="M 940,568 C 1080,568 1080,476 1180,468" delay={95} />
      <Wire d="M 1500,468 C 1560,468 1560,468 1620,468" delay={130} />

      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: theme.fontDisplay,
          fontWeight: 800,
          fontSize: 64,
          color: theme.ink,
          letterSpacing: -2,
          opacity: interpolate(frame, [180, 220], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        Drag. Drop.{" "}
        <span style={{ color: "#7c5cff" }}>Ship a bot.</span>
      </div>
    </AbsoluteFill>
  );
};
