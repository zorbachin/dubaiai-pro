import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";

export const ChatBubble: React.FC<{
  text: string;
  side: "user" | "ai";
  delay?: number;
  top: number;
}> = ({ text, side, delay = 0, top }) => {
  const frame = useCurrentFrame();
  const t = frame - delay;
  const opacity = interpolate(t, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const ty = interpolate(t, [0, 12], [16, 0], { extrapolateRight: "clamp" });

  const isUser = side === "user";

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: isUser ? "auto" : 24,
        right: isUser ? 24 : "auto",
        maxWidth: 460,
        padding: "16px 22px",
        background: isUser ? "#0a84ff" : "#e5e5ea",
        color: isUser ? "#fff" : "#111",
        borderRadius: 28,
        borderBottomRightRadius: isUser ? 8 : 28,
        borderBottomLeftRadius: isUser ? 28 : 8,
        fontFamily: theme.fontDisplay,
        fontSize: 28,
        lineHeight: 1.25,
        opacity,
        transform: `translateY(${ty}px)`,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      {text}
    </div>
  );
};
