"use client";

import { useId } from "react";
import type { Agent, AgentGlyph } from "@/lib/types";

export function AgentAvatar({
  agent,
  size = 44,
  glow = true,
  className = "",
}: {
  agent: Pick<Agent, "glyph" | "hueA" | "hueB">;
  size?: number;
  glow?: boolean;
  className?: string;
}) {
  const radius = Math.round(size * 0.28);
  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden border border-white/15 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: `linear-gradient(135deg, ${agent.hueA}33, ${agent.hueB}1a 60%, rgba(255,255,255,0.02))`,
        boxShadow: glow ? `0 0 ${size * 0.6}px ${agent.hueA}33, 0 1px 0 rgba(255,255,255,0.08) inset` : undefined,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(120% 80% at 30% 0%, rgba(255,255,255,0.18), transparent 60%)`,
        }}
      />
      <Glyph glyph={agent.glyph} hueA={agent.hueA} hueB={agent.hueB} size={Math.round(size * 0.62)} />
    </div>
  );
}

function Glyph({
  glyph,
  hueA,
  hueB,
  size,
}: {
  glyph: AgentGlyph;
  hueA: string;
  hueB: string;
  size: number;
}) {
  const id = useId().replace(/:/g, "");
  const g1 = `g1-${id}`;
  const g2 = `g2-${id}`;

  const common = (
    <defs>
      <linearGradient id={g1} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor={hueA} />
        <stop offset="1" stopColor={hueB} />
      </linearGradient>
      <radialGradient id={g2} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={hueA} stopOpacity="0.9" />
        <stop offset="1" stopColor={hueB} stopOpacity="0.6" />
      </radialGradient>
    </defs>
  );

  switch (glyph) {
    case "orbit":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {common}
          <ellipse cx="12" cy="12" rx="9" ry="3.4" stroke={hueA} strokeOpacity="0.75" strokeWidth="1.1" transform="rotate(-28 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.4" stroke={hueB} strokeOpacity="0.55" strokeWidth="1.1" transform="rotate(28 12 12)" />
          <circle cx="12" cy="12" r="2.6" fill={`url(#${g2})`} />
          <circle cx="20" cy="6.5" r="1.4" fill={hueA} />
          <circle cx="4.5" cy="17" r="1" fill={hueB} />
        </svg>
      );
    case "prism":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {common}
          <path d="M12 3 L21 12 L12 21 L3 12 Z" stroke={`url(#${g1})`} strokeWidth="1.2" />
          <path d="M12 3 L12 21" stroke={hueA} strokeWidth="1.1" strokeOpacity="0.8" />
          <path d="M3 12 L21 12" stroke={hueB} strokeWidth="1.1" strokeOpacity="0.7" />
          <circle cx="12" cy="12" r="2.4" fill={`url(#${g2})`} />
        </svg>
      );
    case "hex":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {common}
          <path d="M12 3.5 L19 7.5 L19 16.5 L12 20.5 L5 16.5 L5 7.5 Z" stroke={`url(#${g1})`} strokeWidth="1.2" />
          <path d="M12 8 L15.5 10 L15.5 14 L12 16 L8.5 14 L8.5 10 Z" stroke={hueA} strokeOpacity="0.85" strokeWidth="1" fill={`url(#${g2})`} fillOpacity="0.55" />
          <circle cx="12" cy="12" r="1.2" fill="#fff" fillOpacity="0.9" />
        </svg>
      );
    case "wave":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {common}
          <path d="M3 12 Q7 5 12 12 T21 12" stroke={`url(#${g1})`} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M3 15 Q7 8 12 15 T21 15" stroke={hueA} strokeOpacity="0.55" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M3 9 Q7 2 12 9 T21 9" stroke={hueB} strokeOpacity="0.4" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      );
    case "shield":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {common}
          <path d="M12 3 L20 6 V12 C20 17 16 20 12 21 C8 20 4 17 4 12 V6 Z" stroke={`url(#${g1})`} strokeWidth="1.2" fill={`url(#${g2})`} fillOpacity="0.18" />
          <path d="M9 12 L11 14 L15.5 9.5" stroke={hueA} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "eye":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {common}
          <path d="M3 12 C6 7 9 5 12 5 C15 5 18 7 21 12 C18 17 15 19 12 19 C9 19 6 17 3 12 Z" stroke={`url(#${g1})`} strokeWidth="1.2" />
          <circle cx="12" cy="12" r="3.4" stroke={hueA} strokeWidth="1.1" />
          <circle cx="12" cy="12" r="1.4" fill={`url(#${g2})`} />
          <path d="M12 3.5 V5 M12 19 V20.5 M3 12 H4.4 M19.6 12 H21" stroke={hueB} strokeOpacity="0.5" strokeWidth="1" strokeLinecap="round" />
        </svg>
      );
  }
}
