import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";

type Turn = { from: "user" | "bot"; text: string; at: number };

export const BotChat: React.FC<{ turns: Turn[]; width?: number }> = ({
  turns,
  width = 720,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width,
        background: "rgba(15,15,20,0.92)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 22,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 6,
          fontFamily: theme.fontMono,
          color: theme.inkDim,
          fontSize: 18,
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: 6, background: "#30d158" }} />
        bot · live
      </div>
      {turns.map((t, i) => {
        const o = interpolate(frame, [t.at, t.at + 8], [0, 1], {
          extrapolateRight: "clamp",
        });
        const ty = interpolate(frame, [t.at, t.at + 12], [10, 0], {
          extrapolateRight: "clamp",
        });
        const isBot = t.from === "bot";
        return (
          <div
            key={i}
            style={{
              alignSelf: isBot ? "flex-start" : "flex-end",
              maxWidth: "85%",
              padding: "12px 18px",
              borderRadius: 18,
              background: isBot ? "#1c1c24" : "#7c5cff",
              color: isBot ? theme.ink : "#fff",
              fontFamily: theme.fontDisplay,
              fontSize: 24,
              lineHeight: 1.3,
              opacity: o,
              transform: `translateY(${ty}px)`,
            }}
          >
            {t.text}
          </div>
        );
      })}
    </div>
  );
};
