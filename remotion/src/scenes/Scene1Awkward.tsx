import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CinematicBg } from "../components/CinematicBg";
import { Numeral } from "../components/Numeral";
import { PhoneFrame } from "../components/PhoneFrame";
import { ChatBubble } from "../components/ChatBubble";
import { Caption } from "../components/Caption";
import { theme } from "../theme";

// 0:12–0:32 — The awkward text rewrite.
export const Scene1Awkward: React.FC = () => {
  const frame = useCurrentFrame();

  const phoneScale = interpolate(frame, [0, 30], [0.85, 1], {
    extrapolateRight: "clamp",
  });
  const phoneRotate = interpolate(frame, [0, 60], [-3, 0], {
    extrapolateRight: "clamp",
  });

  // After ~12s of dwelling on the cringe, AI rewrites it
  const showRewrite = frame > 360;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <CinematicBg hueA="#1a0a2a" hueB="#000" />
      <Numeral n={1} label={"Draft the\nawkward message"} />

      <div style={{ transform: `rotate(${phoneRotate}deg)` }}>
        <PhoneFrame scale={phoneScale}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg,#fafafa,#ececec)",
              padding: 24,
            }}
          >
            <div
              style={{
                fontFamily: theme.fontDisplay,
                fontSize: 22,
                color: "#999",
                textAlign: "center",
                marginBottom: 18,
              }}
            >
              Draft · 6 days unsent
            </div>

            <ChatBubble
              side="user"
              top={80}
              delay={20}
              text="hey so um about rent this month..."
            />
            <ChatBubble
              side="user"
              top={200}
              delay={70}
              text="i can totally pay it i just"
            />
            <ChatBubble
              side="user"
              top={310}
              delay={130}
              text="never mind"
            />

            {showRewrite && (
              <>
                <div
                  style={{
                    position: "absolute",
                    top: 470,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    fontFamily: theme.fontMono,
                    color: theme.accent,
                    fontSize: 22,
                    fontWeight: 700,
                  }}
                >
                  ✦ rewritten by AI
                </div>
                <ChatBubble
                  side="user"
                  top={530}
                  delay={365}
                  text="Hi — quick heads up: rent will be 3 days late this month. Appreciate your patience."
                />
              </>
            )}
          </div>
        </PhoneFrame>
      </div>

      <Caption
        text='"Make me sound like an adult."'
        highlight="adult"
        position="bottom"
        size={64}
      />
    </AbsoluteFill>
  );
};
