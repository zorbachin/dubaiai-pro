import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CinematicBg } from "../components/CinematicBg";
import { Numeral } from "../components/Numeral";
import { Caption } from "../components/Caption";
import { theme } from "../theme";

// 0:55–1:12 — Photo glow-up: garbage selfie → pro headshot.
// Procedural "before/after" head silhouettes with progressive lighting.
const Head: React.FC<{ stage: 0 | 1 | 2 | 3 }> = ({ stage }) => {
  const palettes = [
    {
      bg: "#3a3530",
      key: "rgba(255,255,255,0.05)",
      skin: "#a47865",
      shirt: "#2a2a2a",
      ring: "transparent",
    },
    {
      bg: "#2a2a2a",
      key: "rgba(255,255,255,0.18)",
      skin: "#b88770",
      shirt: "#2a2a2a",
      ring: "rgba(255,255,255,0.06)",
    },
    {
      bg: "linear-gradient(135deg,#2c3142,#171922)",
      key: "rgba(255,220,180,0.25)",
      skin: "#c69376",
      shirt: "#1a2235",
      ring: "rgba(255,220,180,0.18)",
    },
    {
      bg: "linear-gradient(135deg,#1c2540,#0a0d18)",
      key: "rgba(255,210,160,0.45)",
      skin: "#d4a07e",
      shirt: "#0c1430",
      ring: "rgba(255,210,160,0.35)",
    },
  ];
  const p = palettes[stage];

  return (
    <div
      style={{
        position: "relative",
        width: 720,
        height: 880,
        borderRadius: 28,
        overflow: "hidden",
        background: p.bg,
        boxShadow: `0 0 0 6px ${p.ring}, 0 60px 120px rgba(0,0,0,0.55)`,
      }}
    >
      {/* key light */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(60% 60% at 30% 30%, ${p.key}, transparent 70%)`,
        }}
      />
      {/* shoulders */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 760,
          height: 360,
          borderRadius: "50% 50% 0 0 / 80% 80% 0 0",
          background: p.shirt,
        }}
      />
      {/* head */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 200,
          transform: "translateX(-50%)",
          width: 360,
          height: 440,
          borderRadius: "50% 50% 46% 46% / 60% 60% 40% 40%",
          background: p.skin,
          boxShadow: "inset -40px -30px 80px rgba(0,0,0,0.35), inset 40px 20px 60px rgba(255,255,255,0.05)",
        }}
      />
    </div>
  );
};

export const Scene3Photos: React.FC = () => {
  const frame = useCurrentFrame();

  // Four stages over the duration; each stage holds ~95 frames.
  const stage =
    frame < 70 ? 0 : frame < 200 ? 1 : frame < 340 ? 2 : 3;

  const flash = (boundary: number) => {
    const d = frame - boundary;
    return d >= 0 && d < 5 ? 1 - d / 5 : 0;
  };

  const flashOpacity = Math.max(flash(70), flash(200), flash(340));

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <CinematicBg hueA="#0a1a2a" hueB="#000" pan={0.4} zoom={1.05} />
      <Numeral n={3} label={"Pro headshots,\nfor free"} />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "52%",
          transform: `translate(-50%, -50%) scale(${interpolate(
            frame,
            [0, 30],
            [0.92, 1],
            { extrapolateRight: "clamp" }
          )})`,
        }}
      >
        <Head stage={stage as 0 | 1 | 2 | 3} />
      </div>

      {/* tag */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "23%",
          transform: "translateX(-50%)",
          padding: "10px 22px",
          background: stage === 3 ? theme.good : "rgba(255,255,255,0.08)",
          color: stage === 3 ? "#000" : theme.inkDim,
          fontFamily: theme.fontMono,
          fontWeight: 700,
          fontSize: 28,
          borderRadius: 10,
          letterSpacing: 1,
        }}
      >
        {["RAW", "BG REMOVED", "RELIT", "LINKEDIN-READY"][stage]}
      </div>

      {/* hard flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#fff",
          opacity: flashOpacity * 0.8,
          pointerEvents: "none",
        }}
      />

      <Caption
        text="Free. Now."
        highlight="Free"
        position="bottom"
        size={86}
      />
    </AbsoluteFill>
  );
};
