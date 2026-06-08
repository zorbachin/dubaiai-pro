"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ACTIVITY } from "@/lib/mock";
import type { ActivityEvent } from "@/lib/types";
import { timeAgo } from "@/lib/utils";
import { GitBranch, MessageSquare, ShieldAlert, Wrench, Rocket, Info } from "lucide-react";

const ICONS = {
  task: { icon: GitBranch, color: "#a78bfa" },
  message: { icon: MessageSquare, color: "#22d3ee" },
  tool: { icon: Wrench, color: "#34d399" },
  deploy: { icon: Rocket, color: "#f472b6" },
  warn: { icon: ShieldAlert, color: "#fbbf24" },
  info: { icon: Info, color: "#94a3b8" },
} as const;

const TICKER_SAMPLES = [
  { type: "tool" as const, text: "Vega · ran tests on auth/session.ts · 124 passed" },
  { type: "task" as const, text: "Orion · indexed source bundle #b12-44" },
  { type: "message" as const, text: "Atlas · routed task to Nyx (recon scout)" },
  { type: "info" as const, text: "Halo · scanned PR diff for policy violations" },
  { type: "deploy" as const, text: "Vega · pushed commit 3d85a6a to main" },
];

export function ActivityFeed() {
  const [events, setEvents] = useState<ActivityEvent[]>(ACTIVITY);

  useEffect(() => {
    let n = 1000;
    const i = setInterval(() => {
      const sample = TICKER_SAMPLES[Math.floor(Math.random() * TICKER_SAMPLES.length)];
      const [agentName, ...rest] = sample.text.split(" · ");
      setEvents((prev) => [
        {
          id: `live-${++n}`,
          type: sample.type,
          text: rest.join(" · "),
          agentName,
          timestamp: Date.now(),
        },
        ...prev,
      ].slice(0, 16));
    }, 4200);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="panel relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
          </span>
          <h3 className="font-display text-sm font-semibold tracking-tight">Live Activity</h3>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
          stream · realtime
        </span>
      </div>
      <div className="relative max-h-[420px] overflow-y-auto px-2 py-2">
        <AnimatePresence initial={false}>
          {events.map((e) => {
            const meta = ICONS[e.type as keyof typeof ICONS] ?? ICONS.info;
            const Icon = meta.icon;
            return (
              <motion.div
                key={e.id}
                layout
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/[0.03]"
              >
                <span
                  className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-white/10"
                  style={{ background: `${meta.color}18`, color: meta.color }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    {e.agentName && (
                      <span className="font-display text-[13px] font-semibold tracking-tight">
                        {e.agentName}
                      </span>
                    )}
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)]">
                      {timeAgo(e.timestamp)}
                    </span>
                  </div>
                  <div className="text-[13px] leading-snug text-[color:var(--color-ink-dim)]">
                    {e.text}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
