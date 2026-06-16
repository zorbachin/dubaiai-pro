import { theme } from "../theme";

export const Logo: React.FC<{ size?: number; subtle?: boolean }> = ({
  size = 64,
  subtle = false,
}) => {
  const dot = size * 0.55;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.22,
        fontFamily: theme.fontDisplay,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: -1.5,
        color: subtle ? theme.inkDim : theme.ink,
        lineHeight: 1,
      }}
    >
      <span
        style={{
          width: dot,
          height: dot,
          borderRadius: dot * 0.32,
          background: `conic-gradient(from 210deg at 50% 50%, #7c5cff, #00d4ff, #30d158, #7c5cff)`,
          boxShadow: subtle
            ? "none"
            : "0 0 40px rgba(124,92,255,0.55), inset 0 0 0 3px #0a0a0a",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: dot * 0.18,
            background: "#0a0a0a",
            borderRadius: dot * 0.22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: dot * 0.45,
            fontWeight: 900,
          }}
        >
          ⌬
        </span>
      </span>
      <span>
        buildyourbot
        <span style={{ color: "#7c5cff" }}>.io</span>
      </span>
    </div>
  );
};
