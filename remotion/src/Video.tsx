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
import { SceneHook } from "./scenes/SceneHook";
import { SceneSetup } from "./scenes/SceneSetup";
import { Scene1Awkward } from "./scenes/Scene1Awkward";
import { SceneRehook1 } from "./scenes/SceneRehook1";
import { Scene2Therapist } from "./scenes/Scene2Therapist";
import { Scene3Photos } from "./scenes/Scene3Photos";
import { SceneRehook2 } from "./scenes/SceneRehook2";
import { Scene4Fridge } from "./scenes/Scene4Fridge";
import { Scene5DumbQ } from "./scenes/Scene5DumbQ";
import { SceneCTA } from "./scenes/SceneCTA";

loadInter();
loadJetBrains();

export { FPS };

// Scene timing in seconds → frames @ 30fps
const S = (sec: number) => Math.round(sec * FPS);

const SCENES = [
  { name: "hook", from: 0, to: 5, Comp: SceneHook },
  { name: "setup", from: 5, to: 12, Comp: SceneSetup },
  { name: "awkward", from: 12, to: 32, Comp: Scene1Awkward },
  { name: "rehook1", from: 32, to: 38, Comp: SceneRehook1 },
  { name: "therapist", from: 38, to: 55, Comp: Scene2Therapist },
  { name: "photos", from: 55, to: 72, Comp: Scene3Photos },
  { name: "rehook2", from: 72, to: 78, Comp: SceneRehook2 },
  { name: "fridge", from: 78, to: 95, Comp: Scene4Fridge },
  { name: "dumbq", from: 95, to: 110, Comp: Scene5DumbQ },
  { name: "cta", from: 110, to: 120, Comp: SceneCTA },
] as const;

export const DURATION_FRAMES = S(120);

// Whip-pan / flash transition rendered over the boundary.
const Transition: React.FC<{ at: number; durationFrames?: number }> = ({
  at,
  durationFrames = 8,
}) => {
  const frame = useCurrentFrame();
  const local = frame - at;
  if (local < -1 || local > durationFrames) return null;
  const o = interpolate(local, [0, durationFrames * 0.4, durationFrames], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blur = interpolate(local, [0, durationFrames / 2, durationFrames], [0, 12, 0]);
  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 100%)",
        opacity: o,
        filter: `blur(${blur}px)`,
        pointerEvents: "none",
      }}
    />
  );
};

type Props = { aspect: "9:16" | "16:9"; audio?: boolean };

export const Video: React.FC<Props> = ({ audio = false }) => {
  const { fps } = useVideoConfig();
  const voUrl = audio ? staticFile("audio/voiceover.mp3") : null;
  const musicUrl = audio ? staticFile("audio/music.mp3") : null;

  // Beat drops to silence at 1:50, returns at end
  const musicVolume = (frame: number) => {
    const t = frame / fps;
    if (t < 1) return interpolate(t, [0, 1], [0, 0.7]);
    if (t < 110) return 0.7;
    if (t < 113) return interpolate(t, [110, 113], [0.7, 0]);
    if (t < 117) return 0;
    return interpolate(t, [117, 119], [0, 0.55]);
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

      {/* Whip-pan transitions on each scene boundary */}
      {SCENES.slice(1).map((s) => (
        <Transition key={`t-${s.name}`} at={S(s.from) - 4} durationFrames={8} />
      ))}

      {/* Voiceover (drop file at remotion/public/audio/voiceover.mp3) */}
      {voUrl && (
        <Sequence from={0} durationInFrames={DURATION_FRAMES}>
          <Audio src={voUrl} />
        </Sequence>
      )}

      {/* Music bed with side-chain duck and beat-drop silence near CTA */}
      {musicUrl && (
        <Sequence from={0} durationInFrames={DURATION_FRAMES}>
          <Audio src={musicUrl} volume={(f) => musicVolume(f)} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
