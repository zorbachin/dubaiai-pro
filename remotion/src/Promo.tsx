import {
  AbsoluteFill,
  Audio,
  Sequence,
  Series,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

import { FPS } from "./theme";
import { PromoHook } from "./scenes/promo/PromoHook";
import { PromoProblem } from "./scenes/promo/PromoProblem";
import { PromoReveal } from "./scenes/promo/PromoReveal";
import { PromoDemo } from "./scenes/promo/PromoDemo";
import { PromoProof } from "./scenes/promo/PromoProof";
import { PromoCTA } from "./scenes/promo/PromoCTA";

loadInter();
loadJetBrains();

const S = (sec: number) => Math.round(sec * FPS);

const SCENES = [
  { name: "hook", from: 0, to: 5, Comp: PromoHook },
  { name: "problem", from: 5, to: 15, Comp: PromoProblem },
  { name: "reveal", from: 15, to: 25, Comp: PromoReveal },
  { name: "demo", from: 25, to: 42, Comp: PromoDemo },
  { name: "proof", from: 42, to: 52, Comp: PromoProof },
  { name: "cta", from: 52, to: 60, Comp: PromoCTA },
] as const;

export const PROMO_DURATION = S(60);

const Transition: React.FC<{ at: number; durationFrames?: number; tint?: string }> = ({
  at,
  durationFrames = 8,
  tint = "rgba(255,255,255,0.95)",
}) => {
  const frame = useCurrentFrame();
  const local = frame - at;
  if (local < -1 || local > durationFrames) return null;
  const o = interpolate(local, [0, durationFrames * 0.4, durationFrames], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blur = interpolate(local, [0, durationFrames / 2, durationFrames], [0, 14, 0]);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(90deg, transparent 0%, ${tint} 50%, transparent 100%)`,
        opacity: o,
        filter: `blur(${blur}px)`,
        pointerEvents: "none",
      }}
    />
  );
};

type Props = { audio?: boolean };

export const Promo: React.FC<Props> = ({ audio = false }) => {
  const { fps } = useVideoConfig();
  const voUrl = audio ? staticFile("audio/promo-voiceover.mp3") : null;
  const musicUrl = audio ? staticFile("audio/promo-music.mp3") : null;

  // Music: fade in, hold, drop briefly under CTA voice, swell at end.
  const musicVolume = (frame: number) => {
    const t = frame / fps;
    if (t < 1) return interpolate(t, [0, 1], [0, 0.65]);
    if (t < 52) return 0.65;
    if (t < 53.5) return interpolate(t, [52, 53.5], [0.65, 0.25]);
    if (t < 58) return 0.25;
    return interpolate(t, [58, 60], [0.25, 0.85]);
  };

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Series>
        {SCENES.map(({ name, from, to, Comp }) => (
          <Series.Sequence key={name} durationInFrames={S(to - from)}>
            <Comp />
          </Series.Sequence>
        ))}
      </Series>

      {SCENES.slice(1).map((s) => (
        <Transition key={`t-${s.name}`} at={S(s.from) - 4} durationFrames={8} />
      ))}

      {voUrl && (
        <Sequence from={0} durationInFrames={PROMO_DURATION}>
          <Audio src={voUrl} />
        </Sequence>
      )}
      {musicUrl && (
        <Sequence from={0} durationInFrames={PROMO_DURATION}>
          <Audio src={musicUrl} volume={(f) => musicVolume(f)} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
