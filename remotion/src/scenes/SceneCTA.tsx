import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CinematicBg } from "../components/CinematicBg";
import { theme } from "../theme";

// 1:50–2:00 — Smash to grid, beat drops out, single deadpan close.
const labels = [
  "AWKWARD\nMESSAGE",
  "THERAPIST\n(NO BILL)",
  "PRO\nHEADSHOT",
  "FRIDGE →\nDINNER",
  "DUMB\nQUESTION",
];

const colors = [
  "#0a84ff",
  "#ff8c42",
  "#30d158",
  "#bf5af2",
  "#ff375f",
];

export const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // beat-drop silence kicks in around frame 90 (3s into the scene)
  const silent = frame > 90;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <CinematicBg hueA="#0a0a14" hueB="#000" pan={0.4} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "repeat(3, 1fr)",
          gap: 24,
          padding: 60,
          paddingTop: 200,
          paddingBottom: 380,
        }}
      >
        {labels.map((label, i) => {
          const t = spring({
            frame: frame - i * 6,
            fps,
            config: { damping: 12, stiffness: 200 },
          });
          return (
            <div
              key={i}
              style={{
                gridColumn: i === 4 ? "span 2" : "span 1",
                background: colors[i],
                borderRadius: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: theme.fontDisplay,
                fontWeight: 900,
                fontSize: 56,
                color: "#fff",
                textAlign: "center",
                whiteSpace: "pre-line",
                lineHeight: 1,
                letterSpacing: -1,
                transform: `translateY(${(1 - t) * 80}px) scale(${0.85 + t * 0.15})`,
                opacity: t,
                boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
              }}
            >
              {label}
            </div>
          );
        })}
      </div>

      {silent && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 140,
          }}
        >
          <div
            style={{
              fontFamily: theme.fontDisplay,
              fontWeight: 900,
              fontSize: 72,
              color: theme.ink,
              textAlign: "center",
              lineHeight: 1.05,
              letterSpacing: -2,
              opacity: interpolate(frame, [90, 110], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            You're doing one
            <br />
            <span style={{ color: theme.accent2 }}>tonight.</span>
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: theme.fontMono,
          fontSize: 28,
          color: theme.inkDim,
          letterSpacing: 4,
          opacity: interpolate(frame, [180, 220], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        FOLLOW · FOR · THE · SCARY · ONES
      </div>
    </AbsoluteFill>
  );
};
