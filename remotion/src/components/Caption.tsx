import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

type Props = {
  text: string;
  highlight?: string;
  position?: "top" | "center" | "bottom";
  size?: number;
};

export const Caption: React.FC<Props> = ({
  text,
  highlight,
  position = "bottom",
  size = 76,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.6 },
  });

  const y =
    position === "top" ? "12%" : position === "center" ? "50%" : "82%";
  const translateY =
    position === "center" ? "-50%" : position === "bottom" ? "0" : "0";

  const parts = highlight
    ? text.split(new RegExp(`(${highlight})`, "i"))
    : [text];

  const opacity = interpolate(frame, [0, 6], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: y,
        transform: `translate(-50%, ${translateY}) scale(${0.92 + enter * 0.08})`,
        width: "86%",
        textAlign: "center",
        opacity,
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "18px 32px",
          background: "rgba(0,0,0,0.78)",
          borderRadius: 18,
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span
          style={{
            fontFamily: theme.fontDisplay,
            fontWeight: 800,
            fontSize: size,
            lineHeight: 1.05,
            letterSpacing: -1,
            color: theme.ink,
          }}
        >
          {parts.map((p, i) =>
            highlight && p.toLowerCase() === highlight.toLowerCase() ? (
              <span key={i} style={{ color: theme.accent2 }}>
                {p}
              </span>
            ) : (
              <span key={i}>{p}</span>
            )
          )}
        </span>
      </div>
    </div>
  );
};
