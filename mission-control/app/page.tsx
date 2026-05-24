"use client";

import { motion } from "framer-motion";
import { StatCard } from "@/components/stat-card";
import { AgentCard } from "@/components/agent-card";
import { ActivityFeed } from "@/components/activity-feed";
import { Orbital } from "@/components/orbital";
import { SystemMonitor } from "@/components/system-monitor";
import { AGENTS } from "@/lib/mock";
import { Bot, Zap, Coins, Activity } from "lucide-react";

const tokensData = [38, 42, 47, 51, 58, 62, 55, 64, 71, 76, 72, 80, 84, 88, 92];
const tasksData = [12, 16, 18, 22, 28, 30, 35, 41, 48, 52, 57, 64, 72, 81, 88];
const latencyData = [62, 58, 60, 54, 50, 48, 52, 46, 44, 48, 42, 40, 44, 41, 38];
const successData = [88, 90, 91, 93, 92, 94, 96, 95, 97, 96, 98, 97, 99, 98, 99];

export default function MissionControl() {
  return (
    <div className="mx-auto max-w-[1500px] space-y-6 pt-2">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="panel relative overflow-hidden p-8"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-400/40 to-violet-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-pink-400/20 to-violet-500/20 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              ALL SYSTEMS NOMINAL
            </div>
            <h1 className="mt-3 font-display text-[44px] font-semibold leading-[1.05] tracking-tight">
              <span className="text-grad-cyan">Welcome back, Commander.</span>
            </h1>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-[color:var(--color-ink-dim)]">
              Your fleet of six agents is online and operational. Four tasks are in flight,
              two are queued. The constellation is humming.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-xl border border-cyan-400/40 bg-gradient-to-br from-cyan-400/20 to-violet-500/20 px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_24px_rgba(0,229,255,0.25)] transition hover:from-cyan-400/30 hover:to-violet-500/30">
              + New Mission
            </button>
            <button className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink-dim)] transition hover:bg-white/[0.08] hover:text-white">
              Briefing
            </button>
          </div>
        </div>
      </motion.section>

      {/* KPIs */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active Agents"
          value={6}
          data={[3, 4, 4, 5, 5, 6, 6, 6, 6]}
          color="#22d3ee"
          delta="+2 wk"
          icon={<Bot className="h-4 w-4" />}
          index={0}
        />
        <StatCard
          label="Tasks · 24h"
          value={384}
          data={tasksData}
          color="#a78bfa"
          delta="+24%"
          icon={<Zap className="h-4 w-4" />}
          index={1}
        />
        <StatCard
          label="Tokens · 24h"
          value={1.84}
          decimals={2}
          suffix="M"
          data={tokensData}
          color="#f472b6"
          delta="+12%"
          icon={<Coins className="h-4 w-4" />}
          index={2}
        />
        <StatCard
          label="Avg Latency"
          value={48}
          suffix="ms"
          data={latencyData}
          color="#34d399"
          delta="-18%"
          icon={<Activity className="h-4 w-4" />}
          index={3}
        />
      </section>

      {/* Main grid */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* Agents */}
          <div className="panel relative overflow-hidden p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
                  Fleet
                </div>
                <h2 className="mt-1 font-display text-lg font-semibold tracking-tight">
                  Agent Roster
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="chip chip-emerald">4 online</span>
                <span className="chip chip-amber">1 paused</span>
                <span className="chip">1 idle</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {AGENTS.map((a, i) => (
                <AgentCard key={a.id} agent={a} index={i} />
              ))}
            </div>
          </div>

          {/* System monitor */}
          <SystemMonitor />
        </div>

        <div className="space-y-6">
          <Orbital />
          <ActivityFeed />
          <SuccessCard />
        </div>
      </section>
    </div>
  );
}

function SuccessCard() {
  const value = 97.4;
  return (
    <div className="panel relative overflow-hidden p-5">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-400/30 to-cyan-400/20 blur-3xl" />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
            Fleet Reliability
          </div>
          <h3 className="mt-1 font-display text-lg font-semibold tracking-tight">
            Success Rate
          </h3>
        </div>
        <span className="chip chip-emerald">+2.1% wk</span>
      </div>

      <div className="relative mt-4 flex items-baseline gap-2">
        <span className="font-display text-5xl font-semibold tracking-tight text-grad-cyan data-num">
          {value}%
        </span>
      </div>

      <div className="relative mt-4">
        <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500"
            style={{ boxShadow: "0 0 16px rgba(52, 211, 153, 0.5)" }}
          />
        </div>
      </div>

      <div className="relative mt-4 grid grid-cols-3 gap-2">
        {[
          { label: "Approved", v: "1,184" },
          { label: "Reviewed", v: "32" },
          { label: "Rejected", v: "8" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-2">
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
              {s.label}
            </div>
            <div className="data-num mt-0.5 text-[13px] font-semibold">{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
