import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CinematicBg } from "../../components/CinematicBg";
import { Logo } from "../../components/Logo";
import { theme } from "../../theme";

// 0:15–0:25 — Reveal: drag, drop, ship a bot.
// Layout adapts: horizontal flow (16:9) vs vertical flow (9:16).
const Block: React.FC<{
  label: string;
  color: string;
  x: number;
  y: number;
  delay: number;
  size?: number;
}> = ({ label, color, x, y, delay, size = 30 }) => {
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
        fontSize: size,
        boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
        opacity: t,
        transform: `translateY(${(1 - t) * 30}px) scale(${0.9 + t * 0.1})`,
        whiteSpace: "nowrap",
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
        strokeDasharray="800"
        strokeDashoffset={800 * (1 - t)}
        opacity={0.85}
        filter="drop-shadow(0 0 6px rgba(124,92,255,0.7))"
      />
    </svg>
  );
};

export const PromoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;

  const logoT = spring({ frame: frame - 6, fps, config: { damping: 11, stiffness: 160 } });

  // Horizontal node graph for 16:9 (1920×1080)
  const horizontal = (
    <>
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
    </>
  );

  // Vertical node graph for 9:16 (1080×1920) — top→bottom flow with a fork in the middle
  const vertical = (
    <>
      <Block label="Trigger · New message" color="#1f6feb" x={290} y={520} delay={20} size={32} />
      <Block label="LLM · Understand" color="#7c5cff" x={90} y={820} delay={50} size={28} />
      <Block label="Tool · Lookup" color="#f97316" x={620} y={820} delay={75} size={28} />
      <Block label="Action · Reply + log" color="#30d158" x={290} y={1120} delay={105} size={32} />
      <Block label="Deploy · Live" color="#ff375f" x={350} y={1420} delay={140} size={32} />

      <Wire d="M 540,610 C 540,720 260,760 260,820" delay={40} />
      <Wire d="M 540,610 C 540,720 820,760 820,820" delay={65} />
      <Wire d="M 260,900 C 260,1020 540,1080 540,1180" delay={95} />
      <Wire d="M 820,900 C 820,1020 540,1080 540,1180" delay={95} />
      <Wire d="M 540,1240 C 540,1340 540,1340 540,1420" delay={130} />
    </>
  );

  return (
    <AbsoluteFill style={{ background: "#070710" }}>
      <CinematicBg hueA="#0a0825" hueB="#000" pan={0.4} zoom={1.04} />

      <div
        style={{
          position: "absolute",
          top: isVertical ? "5%" : "8%",
          left: "50%",
          transform: `translateX(-50%) scale(${0.9 + logoT * 0.1})`,
          opacity: logoT,
        }}
      >
        <Logo size={isVertical ? 72 : 92} />
      </div>

      {isVertical ? vertical : horizontal}

      <div
        style={{
          position: "absolute",
          bottom: isVertical ? "8%" : "12%",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: theme.fontDisplay,
          fontWeight: 800,
          fontSize: isVertical ? 72 : 64,
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
