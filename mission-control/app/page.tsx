"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { StatCard } from "@/components/stat-card";
import { ActivityFeed } from "@/components/activity-feed";
import { Orbital } from "@/components/orbital";
import { Bot, Zap, FileText, Inbox, ChevronRight, Target } from "lucide-react";

const sparkA = [3, 4, 4, 5, 5, 6, 6, 6, 6];
const sparkB = [12, 16, 18, 22, 28, 30, 35, 41, 48, 52, 57, 64];
const sparkC = [38, 42, 47, 51, 58, 62, 55, 64, 71, 76];
const sparkD = [62, 58, 60, 54, 50, 48, 52, 46, 44, 48];

type OsTask = { id: string; kind?: string; awaiting?: string; title: string; venture?: string; client?: string };
type OsVenture = { id: string; name: string; status?: string; awaiting?: string; next_action?: string };
type OsState = { ok: boolean; ventures?: OsVenture[]; tasks?: OsTask[]; daily_brief?: string };

export default function MissionControl() {
  const [os, setOs] = useState<OsState | null>(null);
  const [view, setView] = useState<"today" | "venture">("today");

  useEffect(() => {
    fetch("/api/os").then((r) => r.json()).then(setOs).catch(() => {});
  }, []);

  const ventures = os?.ventures ?? [];
  const tasks = os?.tasks ?? [];
  const drafts = tasks.filter((t) => t.kind === "draft");
  const awaitingYou = tasks.filter((t) => /you|me/i.test(t.awaiting || ""));
  const focus = (os?.daily_brief || "")
    .split("\n")
    .filter((l) => l.trim().startsWith("- "))
    .map((l) => l.replace(/^[-\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-[1500px] space-y-5 pt-1">
      {/* Hero — compact */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="panel relative overflow-hidden p-5 sm:p-6"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-cyan-400/25 to-violet-500/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            Live
          </div>
          <h1 className="mt-2 font-display text-[28px] font-semibold leading-tight tracking-tight sm:text-[36px]">
            <span className="text-grad-cyan">Good to see you, Zorba.</span>
          </h1>
          <p className="mt-1.5 text-[14px] leading-relaxed text-[color:var(--color-ink-dim)]">
            {os
              ? `${ventures.length} ventures · ${awaitingYou.length} awaiting you · ${drafts.length} drafts ready`
              : "Syncing live state from your VPS…"}
          </p>
        </div>
      </motion.section>

      {/* KPIs — 2-up on mobile */}
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Ventures" value={ventures.length} data={sparkA} color="#22d3ee" icon={<Bot className="h-4 w-4" />} index={0} />
        <StatCard label="Open Tasks" value={tasks.length} data={sparkB} color="#a78bfa" icon={<Zap className="h-4 w-4" />} index={1} />
        <StatCard label="Drafts Ready" value={drafts.length} data={sparkC} color="#f472b6" icon={<FileText className="h-4 w-4" />} index={2} />
        <StatCard label="Awaiting You" value={awaitingYou.length} data={sparkD} color="#34d399" icon={<Inbox className="h-4 w-4" />} index={3} />
      </section>

      {/* Toggle — the operator control */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 sm:max-w-xs">
        <Toggle active={view === "today"} onClick={() => setView("today")}>Today</Toggle>
        <Toggle active={view === "venture"} onClick={() => setView("venture")}>By Venture</Toggle>
      </div>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-3 xl:col-span-2">
          {view === "today" ? (
            <TodayView focus={focus} awaitingYou={awaitingYou} drafts={drafts} loading={!os} />
          ) : (
            <VentureView ventures={ventures} tasks={tasks} loading={!os} />
          )}
        </div>

        {/* Desktop-only ambient panels (beauty, not fluff in the way) */}
        <div className="hidden space-y-5 xl:block">
          <Orbital />
          <CostCard />
          <ActivityFeed />
        </div>
      </section>

      {/* Cost on mobile too — it's real and useful */}
      <div className="xl:hidden">
        <CostCard />
      </div>
    </div>
  );
}

function Toggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-2.5 text-[14px] font-medium transition ${
        active
          ? "bg-gradient-to-br from-cyan-400/25 to-violet-500/20 text-white shadow-[0_0_18px_rgba(0,229,255,0.18)]"
          : "text-[color:var(--color-ink-dim)] hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function TaskRow({ title, sub, badge, badgeTone }: { title: string; sub?: string; badge?: string; badgeTone?: string }) {
  return (
    <Link
      href="/tasks"
      className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 transition active:scale-[0.99] hover:border-cyan-400/40 hover:bg-white/[0.06]"
    >
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-medium leading-snug text-white">{title}</div>
        {sub && <div className="mt-0.5 truncate text-[12px] text-[color:var(--color-ink-dim)]">{sub}</div>}
      </div>
      {badge && <span className={`chip ${badgeTone ?? ""} shrink-0`}>{badge}</span>}
      <ChevronRight className="h-5 w-5 shrink-0 text-[color:var(--color-ink-mute)] transition group-hover:text-cyan-300" />
    </Link>
  );
}

function Section({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1 pt-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">{title}</span>
        {typeof count === "number" && <span className="chip">{count}</span>}
      </div>
      {children}
    </div>
  );
}

function TodayView({ focus, awaitingYou, drafts, loading }: { focus: string[]; awaitingYou: OsTask[]; drafts: OsTask[]; loading: boolean }) {
  if (loading) return <div className="panel p-6 text-[13px] text-[color:var(--color-ink-dim)]">Loading today…</div>;
  const empty = focus.length === 0 && awaitingYou.length === 0 && drafts.length === 0;
  return (
    <div className="space-y-4">
      {focus.length > 0 && (
        <Section title="Today's focus">
          {focus.map((f, i) => (
            <div key={i} className="flex items-start gap-3 rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/[0.06] to-transparent px-4 py-3.5">
              <Target className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
              <span className="text-[14px] leading-snug text-white/90">{f}</span>
            </div>
          ))}
        </Section>
      )}
      {awaitingYou.length > 0 && (
        <Section title="Waiting on you" count={awaitingYou.length}>
          {awaitingYou.map((t) => (
            <TaskRow key={t.id} title={t.title} sub={t.client || t.venture} badge="act" badgeTone="chip-amber" />
          ))}
        </Section>
      )}
      {drafts.length > 0 && (
        <Section title="Drafts ready to send" count={drafts.length}>
          {drafts.map((t) => (
            <TaskRow key={t.id} title={t.title} sub={t.venture} badge="review" badgeTone="chip-emerald" />
          ))}
        </Section>
      )}
      {empty && <div className="panel p-6 text-[14px] text-[color:var(--color-ink-dim)]">Nothing waiting on you. Clear runway.</div>}
    </div>
  );
}

function VentureView({ ventures, tasks, loading }: { ventures: OsVenture[]; tasks: OsTask[]; loading: boolean }) {
  if (loading) return <div className="panel p-6 text-[13px] text-[color:var(--color-ink-dim)]">Loading ventures…</div>;
  return (
    <div className="space-y-4">
      {ventures.map((v) => {
        const vt = tasks.filter((t) => t.venture === v.id);
        return (
          <div key={v.id} className="panel p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-base font-semibold tracking-tight text-white">{v.name}</h3>
              {v.status && <span className="chip">{v.status}</span>}
            </div>
            {v.next_action && <p className="mt-1.5 text-[13px] leading-relaxed text-[color:var(--color-ink-dim)]">Next: {v.next_action}</p>}
            <div className="mt-3 space-y-2">
              {vt.length === 0 && <div className="text-[12px] text-[color:var(--color-ink-mute)]">No open tasks.</div>}
              {vt.map((t) => (
                <TaskRow key={t.id} title={t.title} sub={t.client} badge={t.kind === "draft" ? "review" : "act"} badgeTone={t.kind === "draft" ? "chip-emerald" : "chip-amber"} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

type Costs = { todayUsd?: number; totalUsd?: number; calls?: number; byProvider?: Record<string, { calls: number; costUsd: number }> };

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
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-400/25 to-cyan-400/15 blur-3xl" />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">API Spend</div>
          <h3 className="mt-1 font-display text-lg font-semibold tracking-tight">Cost Today</h3>
        </div>
        <span className="chip chip-emerald">{c?.calls ?? 0} calls</span>
      </div>
      <div className="relative mt-3 flex items-baseline gap-2">
        <span className="font-display text-4xl font-semibold tracking-tight text-grad-cyan data-num">${today.toFixed(2)}</span>
        <span className="text-[12px] text-[color:var(--color-ink-dim)]">today · ${total.toFixed(2)} total</span>
      </div>
      <div className="relative mt-3 space-y-1.5">
        {providers.length === 0 && <div className="text-[12px] text-[color:var(--color-ink-mute)]">No API calls logged yet.</div>}
        {providers.map(([name, v]) => (
          <div key={name} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5">
            <span className="text-[12px] capitalize text-white">{name}</span>
            <span className="font-mono text-[11px] text-[color:var(--color-ink-dim)]">{v.calls} · ${v.costUsd.toFixed(3)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
