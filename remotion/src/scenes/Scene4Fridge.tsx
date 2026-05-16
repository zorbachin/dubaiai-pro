import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CinematicBg } from "../components/CinematicBg";
import { Numeral } from "../components/Numeral";
import { Caption } from "../components/Caption";
import { theme } from "../theme";

// 1:18–1:35 — Fridge → recipe.
const FridgeItem: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  label: string;
}> = ({ x, y, w, h, color, label }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      background: color,
      borderRadius: 10,
      boxShadow: "inset 0 -10px 20px rgba(0,0,0,0.25)",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      paddingBottom: 6,
      fontFamily: theme.fontMono,
      fontSize: 18,
      color: "rgba(0,0,0,0.55)",
      fontWeight: 700,
      textTransform: "uppercase",
    }}
  >
    {label}
  </div>
);

export const Scene4Fridge: React.FC = () => {
  const frame = useCurrentFrame();

  const rotate = interpolate(frame, [0, 240], [0, 25]);
  const scanY = interpolate(frame % 90, [0, 90], [0, 100]);
  const showRecipe = frame > 260;
  const recipeOpacity = interpolate(frame, [260, 290], [0, 1], {
    extrapolateRight: "clamp",
  });
  const recipeY = interpolate(frame, [260, 300], [40, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <CinematicBg hueA="#05201a" hueB="#000" pan={0.3} />
      <Numeral n={4} label={"Fridge → dinner"} />

      {/* fridge interior, top-down rotating */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "52%",
          transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
          width: 760,
          height: 760,
          background: "linear-gradient(180deg,#e8eef2,#b9c4cb)",
          borderRadius: 16,
          padding: 30,
          boxShadow: "0 60px 120px rgba(0,0,0,0.5), inset 0 0 0 8px #fff",
          overflow: "hidden",
        }}
      >
        <FridgeItem x={30} y={40} w={220} h={120} color="#f5e4a5" label="½ onion" />
        <FridgeItem x={280} y={40} w={180} h={180} color="#d9d4c0" label="3 eggs" />
        <FridgeItem x={490} y={40} w={210} h={150} color="#e8d8d0" label="yogurt?" />
        <FridgeItem x={30} y={200} w={300} h={140} color="#a3c890" label="kale" />
        <FridgeItem x={360} y={250} w={180} h={140} color="#c44" label="hot sauce" />
        <FridgeItem x={570} y={220} w={140} h={200} color="#e8e0c8" label="butter" />
        <FridgeItem x={30} y={380} w={250} h={140} color="#5a3a2a" label="leftover rice" />
        <FridgeItem x={310} y={420} w={200} h={120} color="#f4f0d8" label="parmesan" />
        <FridgeItem x={540} y={450} w={160} h={140} color="#9ec3c0" label="lime" />

        {/* scan line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${scanY}%`,
            height: 4,
            background:
              "linear-gradient(90deg, transparent, rgba(0,255,180,0.9), transparent)",
            boxShadow: "0 0 30px rgba(0,255,180,0.7)",
          }}
        />
      </div>

      {showRecipe && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "10%",
            transform: `translate(-50%, ${recipeY}px)`,
            opacity: recipeOpacity,
            width: "82%",
            background: "rgba(255,255,255,0.96)",
            borderRadius: 22,
            padding: "26px 32px",
            boxShadow: "0 40px 80px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              fontFamily: theme.fontDisplay,
              fontSize: 30,
              color: "#444",
              marginBottom: 4,
            }}
          >
            ✦ Tonight
          </div>
          <div
            style={{
              fontFamily: theme.fontDisplay,
              fontWeight: 900,
              fontSize: 64,
              color: "#0a0a0a",
              lineHeight: 1.05,
              letterSpacing: -1,
            }}
          >
            Crispy Egg Fried Rice
          </div>
          <div
            style={{
              fontFamily: theme.fontMono,
              fontSize: 24,
              color: "#666",
              marginTop: 10,
            }}
          >
            12 min · 1 pan · uses everything above
          </div>
        </div>
      )}

      <Caption
        text="A chef who doesn't judge the yogurt."
        highlight="yogurt"
        position="top"
        size={56}
      />
    </AbsoluteFill>
  );
};
