export const Vignette: React.FC<{ strength?: number }> = ({
  strength = 0.7,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);
