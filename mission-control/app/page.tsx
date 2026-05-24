"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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

type OsTask = { kind?: string; awaiting?: string; title?: string; venture?: string };
type OsState = { ok: boolean; ventures?: unknown[]; tasks?: OsTask[]; daily_brief?: string };

export default function MissionControl() {
  const [os, setOs] = useState<OsState | null>(null);
  useEffect(() => {
    fetch("/api/os").then((r) => r.json()).then(setOs).catch(() => {});
  }, []);
  const ventures = os?.ventures ?? [];
  const tasks = os?.tasks ?? [];
  const drafts = tasks.filter((t) => t.kind === "draft");
  const awaitingYou = tasks.filter((t) => /you|me/i.test(t.awaiting || ""));
  const topFocus =
    (os?.daily_brief || "")
      .split("\n")
      .find((l) => l.trim().startsWith("- "))
      ?.replace(/^[-\s]+/, "")
      .slice(0, 90) || "";
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
              {os
                ? `${ventures.length} ventures live · ${tasks.length} open tasks · ${awaitingYou.length} awaiting you.${topFocus ? ` Top focus: ${topFocus}` : ""}`
                : "Syncing live state from the always-on VPS…"}
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
          label="Ventures Live"
          value={ventures.length}
          data={[3, 4, 4, 5, 5, 6, 6, 6, 6]}
          color="#22d3ee"
          icon={<Bot className="h-4 w-4" />}
          index={0}
        />
        <StatCard
          label="Open Tasks"
          value={tasks.length}
          data={tasksData}
          color="#a78bfa"
          icon={<Zap className="h-4 w-4" />}
          index={1}
        />
        <StatCard
          label="Drafts Ready"
          value={drafts.length}
          data={tokensData}
          color="#f472b6"
          icon={<Coins className="h-4 w-4" />}
          index={2}
        />
        <StatCard
          label="Awaiting You"
          value={awaitingYou.length}
          data={latencyData}
          color="#34d399"
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
          <CostCard />
        </div>
      </section>
    </div>
  );
}

type Costs = {
  todayUsd?: number;
  totalUsd?: number;
  calls?: number;
  byProvider?: Record<string, { calls: number; costUsd: number }>;
};

function CostCard() {
  const [c, setC] = useState<Costs | null>(null);
  useEffect(() => {
    const load = () => fetch("/api/costs").then((r) => r.json()).then(setC).catch(() => {});
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, []);
  const today = c?.todayUsd ?? 0;
  const total = c?.totalUsd ?? 0;
  const providers = Object.entries(c?.byProvider ?? {});
  return (
    <div className="panel relative overflow-hidden p-5">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-400/30 to-cyan-400/20 blur-3xl" />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
            API Spend
          </div>
          <h3 className="mt-1 font-display text-lg font-semibold tracking-tight">Cost Today</h3>
        </div>
        <span className="chip chip-emerald">{c?.calls ?? 0} calls</span>
      </div>

      <div className="relative mt-4 flex items-baseline gap-2">
        <span className="font-display text-5xl font-semibold tracking-tight text-grad-cyan data-num">
          ${today.toFixed(2)}
        </span>
        <span className="text-[13px] text-[color:var(--color-ink-dim)]">today · ${total.toFixed(2)} total</span>
      </div>

      <div className="relative mt-4 space-y-2">
        {providers.length === 0 && (
          <div className="text-[12px] text-[color:var(--color-ink-mute)]">No API calls logged yet.</div>
        )}
        {providers.map(([name, v]) => (
          <div key={name} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
            <span className="text-[13px] capitalize text-white">{name}</span>
            <span className="font-mono text-[12px] text-[color:var(--color-ink-dim)]">
              {v.calls} · ${v.costUsd.toFixed(3)}
            </span>
          </div>
        ))}
      </div>
      <p className="relative mt-3 text-[11px] text-[color:var(--color-ink-mute)]">
        Estimated from token counts × model rates. Live every 15s.
      </p>
    </div>
  );
}
