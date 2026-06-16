import { random, useCurrentFrame } from "remotion";

// Cheap film-grain layer rendered with SVG noise. Adds cinematic feel.
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.08 }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2);
  const baseFreq = 0.9 + random(`grain-${seed}`) * 0.15;

  return (
    <svg
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    >
      <filter id={`n-${seed}`}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency={baseFreq}
          numOctaves={2}
          seed={seed}
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#n-${seed})`} />
    </svg>
  );
};
