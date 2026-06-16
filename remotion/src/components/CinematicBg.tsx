import { interpolate, useCurrentFrame } from "remotion";
import { Grain } from "./Grain";
import { Vignette } from "./Vignette";

// Procedural cinematic backdrop — animated gradient + light leaks + grain.
// Used when no real footage is provided. Replace the wrapper with <Video>/<Img>
// pointing at /public assets to swap in real b-roll.
export const CinematicBg: React.FC<{
  hueA?: string;
  hueB?: string;
  pan?: number;
  zoom?: number;
}> = ({ hueA = "#1a0b2e", hueB = "#0a0a0a", pan = 1, zoom = 1.1 }) => {
  const frame = useCurrentFrame();
  const tx = interpolate(frame, [0, 300], [0, 80 * pan]);
  const ty = interpolate(frame, [0, 300], [0, -40 * pan]);
  const sc = interpolate(frame, [0, 300], [zoom, zoom + 0.08]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: -120,
          transform: `translate(${tx}px, ${ty}px) scale(${sc})`,
          background: `radial-gradient(60% 80% at 30% 30%, ${hueA} 0%, transparent 60%), radial-gradient(60% 80% at 70% 70%, ${hueB} 0%, #050505 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(120deg, rgba(255,150,80,0.08) 0%, transparent 35%, rgba(80,150,255,0.06) 65%, transparent 100%)",
        }}
      />
      <Grain opacity={0.06} />
      <Vignette strength={0.65} />
    </div>
  );
};
