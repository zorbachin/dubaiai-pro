import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CinematicBg } from "../../components/CinematicBg";
import { Caption } from "../../components/Caption";
import { theme } from "../../theme";

const tasks = [
  "Reply to 47 emails",
  "DM new leads on Instagram",
  "Answer the same 5 customer questions",
  "Sort spreadsheet by hand",
  "Schedule next week's posts",
  "Onboard another customer",
  "Triage support tickets",
  "Follow up. Again.",
  "Reply to 47 emails",
  "Update the CRM",
];

// 0:05–0:15 — Problem: drowning in tasks. Conveyor of to-dos.
export const PromoProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const scrollX = interpolate(frame, [0, 300], [0, -2400]);

  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <CinematicBg hueA="#2a0a0a" hueB="#000" pan={0.4} zoom={1.05} />

      {/* scrolling task ribbon */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: 0,
          right: 0,
          height: 140,
          overflow: "hidden",
          maskImage:
            "linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 26,
            transform: `translateX(${scrollX}px)`,
          }}
        >
          {tasks.concat(tasks).map((t, i) => (
            <div
              key={i}
              style={{
                whiteSpace: "nowrap",
                padding: "26px 36px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 18,
                color: theme.ink,
                fontFamily: theme.fontDisplay,
                fontWeight: 700,
                fontSize: 42,
              }}
            >
              □ {t}
            </div>
          ))}
        </div>
      </div>

      {/* second row, opposite direction */}
      <div
        style={{
          position: "absolute",
          top: "48%",
          left: 0,
          right: 0,
          height: 140,
          overflow: "hidden",
          maskImage:
            "linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 26,
            transform: `translateX(${-scrollX - 800}px)`,
          }}
        >
          {tasks.concat(tasks).map((t, i) => (
            <div
              key={i}
              style={{
                whiteSpace: "nowrap",
                padding: "26px 36px",
                background: "rgba(255,80,80,0.08)",
                border: "1px solid rgba(255,80,80,0.25)",
                borderRadius: 18,
                color: "#ffb4b4",
                fontFamily: theme.fontDisplay,
                fontWeight: 700,
                fontSize: 42,
              }}
            >
              □ {t}
            </div>
          ))}
        </div>
      </div>

      <Caption
        text="Your to-do list is a treadmill."
        highlight="treadmill"
        position="top"
        size={72}
      />
      <Caption
        text="Set up — and walk."
        highlight="walk"
        position="bottom"
        size={72}
      />
    </AbsoluteFill>
  );
};
