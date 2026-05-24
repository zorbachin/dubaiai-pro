"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PulseDot } from "./pulse-dot";
import { AgentAvatar } from "./agent-avatar";
import type { Agent } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { Play, Pause, ArrowUpRight } from "lucide-react";

export function AgentCard({ agent, index = 0 }: { agent: Agent; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      className="group panel relative overflow-hidden p-5 transition hover:border-white/20"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-50 blur-3xl transition group-hover:opacity-95"
        style={{
          background: `radial-gradient(circle, ${agent.hueA}66, ${agent.hueB}33 50%, transparent 70%)`,
        }}
      />

      {/* Stretched link covers the card */}
      <Link
        href={`/agents/${agent.id}`}
        aria-label={`Open ${agent.name}`}
        className="absolute inset-0 z-0 rounded-[20px] focus-visible:ring-2 focus-visible:ring-cyan-400/60"
      />

      <div className="pointer-events-none relative flex items-start gap-3">
        <AgentAvatar agent={agent} size={48} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-semibold leading-tight">
                {agent.name}
              </h3>
              <PulseDot status={agent.status} />
            </div>
            <ArrowUpRight className="h-4 w-4 -translate-x-1 translate-y-1 text-[color:var(--color-ink-mute)] opacity-0 transition group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
          </div>
          <div className="mt-0.5 truncate text-xs text-[color:var(--color-ink-dim)]">
            {agent.role} ·{" "}
            <span className="text-[color:var(--color-ink-mute)]">{agent.model}</span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none relative mt-3 line-clamp-2 min-h-[36px] text-[13px] leading-relaxed text-[color:var(--color-ink-dim)]">
        {agent.lastActivity}
      </div>

      <div className="pointer-events-none relative mt-4 grid grid-cols-3 gap-2">
        <Stat label="Tasks" value={formatNumber(agent.tasksCompleted)} />
        <Stat label="Success" value={`${agent.successRate}%`} />
        <Stat label="Tokens" value={formatNumber(agent.tokensUsed)} />
      </div>

      <div className="relative mt-4 flex items-center justify-between">
        <div className="pointer-events-none flex flex-wrap items-center gap-1.5">
          {agent.capabilities.slice(0, 3).map((c) => (
            <span key={c} className="chip">
              {c}
            </span>
          ))}
        </div>
        <div className="flex gap-1.5">
          <button
            className="relative z-10 grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-[color:var(--color-ink-dim)] transition hover:bg-white/[0.08] hover:text-white"
            title={agent.status === "paused" ? "Resume" : "Pause"}
          >
            {agent.status === "paused" ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </button>
          <span
            className="pointer-events-none rounded-lg border px-3 py-1.5 text-xs font-medium transition group-hover:brightness-110"
            style={{
              borderColor: `${agent.hueA}55`,
              background: `linear-gradient(135deg, ${agent.hueA}22, ${agent.hueB}22)`,
              color: "white",
            }}
          >
            Open
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-2">
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
        {label}
      </div>
      <div className="data-num mt-0.5 text-[13px] font-semibold text-white">{value}</div>
    </div>
  );
}
