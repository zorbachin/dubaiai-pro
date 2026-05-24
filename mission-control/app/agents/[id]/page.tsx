"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Pause, Play, Settings2, Trash2, Zap, ShieldCheck, Coins, Activity as ActivityIcon } from "lucide-react";
import { AGENTS, ACTIVITY, getAgent } from "@/lib/mock";
import { AgentAvatar } from "@/components/agent-avatar";
import { PulseDot } from "@/components/pulse-dot";
import { ChatPanel } from "@/components/chat-panel";
import { Sparkline } from "@/components/sparkline";
import { AnimatedCounter } from "@/components/animated-counter";
import { timeAgo, formatNumber } from "@/lib/utils";

export default function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const agent = getAgent(id);
  const [prompt, setPrompt] = useState<string | null>(null);
  if (!agent) return notFound();

  const editablePrompt = prompt ?? agent.systemPrompt;
  const recentEvents = ACTIVITY.filter((e) => e.agentId === agent.id);

  const others = AGENTS.filter((a) => a.id !== agent.id);

  return (
    <div className="mx-auto max-w-[1500px] space-y-6 pt-2">
      <div className="flex items-center gap-3 text-sm">
        <Link
          href="/agents"
          className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[color:var(--color-ink-dim)] transition hover:bg-white/[0.06] hover:text-white"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Fleet
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
          /agents/{agent.id}
        </span>
      </div>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="panel relative overflow-hidden p-7"
      >
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${agent.hueA}55, ${agent.hueB}22 50%, transparent 75%)`,
          }}
        />
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <AgentAvatar agent={agent} size={84} />
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">
                <PulseDot status={agent.status} withLabel />
              </div>
              <h1 className="mt-2 font-display text-[44px] font-semibold leading-[1.05] tracking-tight text-grad-cyan">
                {agent.name}
              </h1>
              <p className="mt-1 text-[15px] text-[color:var(--color-ink-dim)]">
                {agent.role} · {agent.tagline}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="chip chip-cyan">{agent.model}</span>
                {agent.capabilities.map((c) => (
                  <span key={c} className="chip">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Link
            href="/chat"
            className="flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-gradient-to-br from-cyan-400/20 to-violet-500/20 px-4 py-2.5 text-sm font-medium text-white transition hover:from-cyan-400/30"
          >
            Open full chat
          </Link>
        </div>
      </motion.section>

      {/* Real info */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Provider", value: agent.providerLabel },
          { label: "Model", value: agent.model },
          { label: "State", value: agent.status },
          { label: "Skills", value: agent.capabilities.join(" · ") },
        ].map((t) => (
          <div key={t.label} className="panel p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
              {t.label}
            </div>
            <div className="mt-1 truncate text-sm font-semibold text-white">{t.value}</div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_460px]">
        <div className="space-y-6">
          {/* System prompt */}
          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
                  Persona
                </div>
                <h3 className="mt-0.5 font-display text-base font-semibold tracking-tight">
                  System Prompt
                </h3>
              </div>
              <span className="chip chip-violet">editable</span>
            </div>
            <div className="p-5">
              <textarea
                value={editablePrompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-[12.5px] leading-relaxed text-[color:var(--color-ink)] outline-none transition focus:border-cyan-400/40"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="font-mono text-[10px] text-[color:var(--color-ink-mute)]">
                  changes are local · wire to your runtime in <code>app/api/chat/route.ts</code>
                </span>
                <button className="rounded-lg border border-cyan-400/40 bg-gradient-to-br from-cyan-400/20 to-violet-500/20 px-4 py-1.5 text-xs font-medium text-white">
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Throughput */}
          <div className="panel overflow-hidden p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
                  Throughput · 24h
                </div>
                <h3 className="mt-0.5 font-display text-base font-semibold tracking-tight">
                  Tokens / hour
                </h3>
              </div>
              <span className="chip chip-emerald">trending up</span>
            </div>
            <div className="mt-4 h-32">
              <Sparkline
                data={Array.from({ length: 60 }, (_, i) => 40 + Math.sin(i / 4) * 20 + Math.random() * 30)}
                color={agent.hueA}
                height={128}
              />
            </div>
          </div>

          {/* Recent activity */}
          <div className="panel overflow-hidden">
            <div className="border-b border-white/5 px-5 py-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
                Trail
              </div>
              <h3 className="mt-0.5 font-display text-base font-semibold tracking-tight">
                Recent Activity
              </h3>
            </div>
            <div className="divide-y divide-white/5">
              {(recentEvents.length ? recentEvents : ACTIVITY.slice(0, 3)).map((e) => (
                <div key={e.id} className="flex items-start gap-3 px-5 py-3">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full" style={{ background: agent.hueA }} />
                  <div className="flex-1 text-[13px] text-[color:var(--color-ink)]">{e.text}</div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)]">
                    {timeAgo(e.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Other agents */}
          <div className="panel overflow-hidden p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold tracking-tight">
                Other agents
              </h3>
              <Link href="/agents" className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300/80 hover:text-white">
                view all →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
              {others.map((a) => (
                <Link
                  key={a.id}
                  href={`/agents/${a.id}`}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-3 transition hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <AgentAvatar agent={a} size={42} />
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium">{a.name}</span>
                    <PulseDot status={a.status} />
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)]">
                    {a.providerLabel}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Chat panel */}
        <div className="xl:sticky xl:top-[80px] xl:self-start">
          <ChatPanel key={agent.id} agentId={agent.id} fillHeight={false} />
        </div>
      </section>
    </div>
  );
}

function Kpi({
  label,
  value,
  decimals = 0,
  suffix,
  icon,
  color,
}: {
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="panel relative overflow-hidden p-5"
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-60 blur-2xl"
        style={{ background: `radial-gradient(circle, ${color}55, transparent 70%)` }}
      />
      <div className="relative flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
        <span className="grid h-7 w-7 place-items-center rounded-lg border border-white/10" style={{ background: `${color}18`, color }}>
          {icon}
        </span>
        {label}
      </div>
      <div className="relative mt-3 text-[28px] font-semibold leading-none tracking-tight">
        <AnimatedCounter value={value} decimals={decimals} suffix={suffix} />
      </div>
    </motion.div>
  );
}
