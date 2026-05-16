import {
  AbsoluteFill,
  Series,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CinematicBg } from "../../components/CinematicBg";
import { BotChat } from "../../components/BotChat";
import { theme } from "../../theme";

// 0:25–0:42 — Three demos: support, lead capture, ops.
// Total 510 frames; each card holds 170 frames.
const CARD_FRAMES = 170;

const DEMOS = [
  {
    badge: "CUSTOMER SUPPORT",
    color: "#7c5cff",
    metric: "92% solved without a human",
    turns: [
      { from: "user" as const, text: "Where's my order #4188?", at: 20 },
      { from: "bot" as const, text: "It shipped Tuesday. Out for delivery today by 6pm.", at: 50 },
      { from: "user" as const, text: "Can you change the address?", at: 90 },
      { from: "bot" as const, text: "Done. New address confirmed. Receipt emailed.", at: 120 },
    ],
  },
  {
    badge: "LEAD CAPTURE",
    color: "#00d4ff",
    metric: "3.4× more booked calls",
    turns: [
      { from: "bot" as const, text: "Hey 👋 looking for a quote, a demo, or just nosy?", at: 20 },
      { from: "user" as const, text: "demo", at: 50 },
      { from: "bot" as const, text: "Cool. What's your team size?", at: 75 },
      { from: "user" as const, text: "around 30", at: 100 },
      { from: "bot" as const, text: "Booked you for Thursday 2pm. Invite sent.", at: 125 },
    ],
  },
  {
    badge: "INTERNAL OPS",
    color: "#30d158",
    metric: "11 hours/week back",
    turns: [
      { from: "user" as const, text: "/standup", at: 20 },
      { from: "bot" as const, text: "Pulling 7 PRs, 3 blockers, 2 incidents…", at: 45 },
      { from: "bot" as const, text: "Posted to #eng. Tagged Maya on the auth blocker.", at: 90 },
      { from: "user" as const, text: "thanks", at: 125 },
      { from: "bot" as const, text: "np. coffee on you.", at: 145 },
    ],
  },
];

const Card: React.FC<{ idx: number }> = ({ idx }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = DEMOS[idx];
  const enter = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 180 } });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 80,
          padding: "0 8%",
          opacity: enter,
          transform: `translateY(${(1 - enter) * 30}px)`,
        }}
      >
        <div style={{ flex: 1, maxWidth: 760 }}>
          <div
            style={{
              display: "inline-block",
              padding: "10px 18px",
              background: `${d.color}22`,
              color: d.color,
              border: `1.5px solid ${d.color}77`,
              borderRadius: 10,
              fontFamily: theme.fontMono,
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: 2,
              marginBottom: 28,
            }}
          >
            USE CASE · 0{idx + 1}
          </div>
          <div
            style={{
              fontFamily: theme.fontDisplay,
              fontWeight: 900,
              fontSize: 88,
              color: theme.ink,
              lineHeight: 1.02,
              letterSpacing: -3,
              marginBottom: 24,
            }}
          >
            {d.badge}
          </div>
          <div
            style={{
              fontFamily: theme.fontDisplay,
              fontWeight: 700,
              fontSize: 48,
              color: d.color,
              letterSpacing: -1,
            }}
          >
            {d.metric}
          </div>
        </div>
        <div>
          <BotChat turns={d.turns} width={780} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ProgressDots: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(2, Math.floor(frame / CARD_FRAMES));
  return (
    <div
      style={{
        position: "absolute",
        top: "6%",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 14,
        zIndex: 10,
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: i === idx ? 64 : 18,
            height: 8,
            borderRadius: 4,
            background:
              i === idx
                ? DEMOS[idx].color
                : i < idx
                  ? "rgba(255,255,255,0.5)"
                  : "rgba(255,255,255,0.18)",
          }}
        />
      ))}
    </div>
  );
};

export const PromoDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#06060c" }}>
      <CinematicBg hueA="#0a0830" hueB="#000" pan={0.4} zoom={1.04} />
      <ProgressDots />
      <Series>
        {DEMOS.map((_, i) => (
          <Series.Sequence key={i} durationInFrames={CARD_FRAMES}>
            <Card idx={i} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
