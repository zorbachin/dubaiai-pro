"use client";

import { motion } from "framer-motion";
import { SystemMonitor } from "@/components/system-monitor";
import { Orbital } from "@/components/orbital";
import { Sparkline } from "@/components/sparkline";
import { AGENTS } from "@/lib/mock";
import { formatNumber } from "@/lib/utils";
import { PulseDot } from "@/components/pulse-dot";
import { AgentAvatar } from "@/components/agent-avatar";

export default function SystemsPage() {
  return (
    <div className="mx-auto max-w-[1500px] space-y-6 pt-2">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">
          Telemetry
        </div>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-grad-cyan">
          Systems
        </h1>
        <p className="mt-1 text-[15px] text-[color:var(--color-ink-dim)]">
          Live performance across the fleet — latency, throughput, queue depth, errors.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <SystemMonitor />

          <div className="panel overflow-hidden p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold tracking-tight">
                Per-Agent Throughput
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
                last 1h
              </span>
            </div>
            <div className="divide-y divide-white/5">
              {AGENTS.map((a) => {
                const data = Array.from({ length: 24 }, () => Math.random() * 60 + 20);
                return (
                  <div key={a.id} className="grid grid-cols-[1fr_2fr_auto] items-center gap-4 py-3">
                    <div className="flex items-center gap-3">
                      <AgentAvatar agent={a} size={38} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display text-sm font-semibold">{a.name}</span>
                          <PulseDot status={a.status} />
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
                          {a.model}
                        </div>
                      </div>
                    </div>
                    <div className="h-9">
                      <Sparkline data={data} color={a.hueA} height={36} />
                    </div>
                    <div className="text-right">
                      <div className="data-num text-sm font-semibold">{a.providerLabel}</div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
                        provider
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Orbital />
          <div className="panel p-5">
            <h3 className="font-display text-base font-semibold tracking-tight">
              Cost · Today
            </h3>
            <div className="mt-2 font-display text-4xl font-semibold text-grad-cyan data-num">
              $12.84
            </div>
            <div className="mt-1 font-mono text-[11px] text-[color:var(--color-ink-mute)]">
              Opus 4.7 · Sonnet 4.6 · Haiku 4.5
            </div>
            <div className="mt-4 space-y-2">
              {[
                { label: "Opus 4.7", v: 64, c: "#a78bfa" },
                { label: "Sonnet 4.6", v: 28, c: "#22d3ee" },
                { label: "Haiku 4.5", v: 8, c: "#34d399" },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between text-xs">
                    <span className="text-[color:var(--color-ink-dim)]">{row.label}</span>
                    <span className="data-num text-white">{row.v}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${row.v}%` }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{ background: row.c, boxShadow: `0 0 12px ${row.c}` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
