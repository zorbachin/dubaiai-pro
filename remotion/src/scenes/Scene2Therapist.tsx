import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CinematicBg } from "../components/CinematicBg";
import { Numeral } from "../components/Numeral";
import { Caption } from "../components/Caption";
import { theme } from "../theme";

// 0:38–0:55 — Talk to it like a therapist.
export const Scene2Therapist: React.FC = () => {
  const frame = useCurrentFrame();
  const flicker = 0.6 + Math.sin(frame * 0.3) * 0.08 + Math.sin(frame * 0.71) * 0.05;

  const lines = [
    { t: "I keep self-sabotaging.", at: 30 },
    { t: "Ask me three questions.", at: 90 },
    { t: "1. What does winning look like to you?", at: 200 },
    { t: "2. What did you do today that future-you will thank you for?", at: 290 },
    { t: "3. What are you avoiding because it would actually work?", at: 390 },
  ];

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <CinematicBg hueA="#2a1a05" hueB="#0a0505" pan={0.4} />

      {/* candle glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "30%",
          transform: "translate(-50%, -50%)",
          width: 900,
          height: 900,
          background: `radial-gradient(circle, rgba(255,160,60,${flicker * 0.35}) 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      <Numeral n={2} label={"The therapist\nthat doesn't bill"} />

      {/* journal / chat surface */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -42%)",
          width: "82%",
          padding: 40,
          background: "rgba(20,15,10,0.85)",
          border: "1px solid rgba(255,200,120,0.18)",
          borderRadius: 24,
          boxShadow: "0 40px 100px rgba(255,140,40,0.15)",
        }}
      >
        {lines.map((l, i) => {
          const o = interpolate(frame, [l.at, l.at + 14], [0, 1], {
            extrapolateRight: "clamp",
          });
          const ty = interpolate(frame, [l.at, l.at + 16], [16, 0], {
            extrapolateRight: "clamp",
          });
          const isUser = i < 2;
          return (
            <div
              key={i}
              style={{
                opacity: o,
                transform: `translateY(${ty}px)`,
                fontFamily: isUser ? theme.fontMono : theme.fontDisplay,
                color: isUser ? "#ffcb87" : theme.ink,
                fontWeight: isUser ? 500 : 600,
                fontSize: isUser ? 38 : 42,
                margin: "18px 0",
                lineHeight: 1.3,
              }}
            >
              {isUser ? "› " : "✦ "}
              {l.t}
            </div>
          );
        })}
      </div>

      <Caption
        text="It will not text your mom."
        highlight="mom"
        position="bottom"
        size={72}
      />
    </AbsoluteFill>
  );
};
