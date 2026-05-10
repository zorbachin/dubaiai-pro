import { useCurrentFrame } from "remotion";
import { theme } from "../theme";

export const Typewriter: React.FC<{
  text: string;
  charsPerFrame?: number;
  size?: number;
  color?: string;
  cursor?: boolean;
  style?: React.CSSProperties;
}> = ({
  text,
  charsPerFrame = 0.8,
  size = 64,
  color = theme.ink,
  cursor = true,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const visible = Math.min(text.length, Math.floor(frame * charsPerFrame));
  const showCursor = Math.floor(frame / 8) % 2 === 0;

  return (
    <span
      style={{
        fontFamily: theme.fontMono,
        fontSize: size,
        color,
        letterSpacing: -0.5,
        ...style,
      }}
    >
      {text.slice(0, visible)}
      {cursor && showCursor && (
        <span style={{ color: theme.accent2, marginLeft: 2 }}>▌</span>
      )}
    </span>
  );
};
