"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sunrise, ScrollText, Target, ChevronRight, Radar, Flame, ArrowRight, Inbox, FileText } from "lucide-react";

type OsTask = { id: string; kind?: string; awaiting?: string; title: string; venture?: string; client?: string };
type OsVenture = { id: string; name: string; status?: string; next_action?: string };
type Morning = { date?: string; parsha?: string; parsha_ref?: string; torah_insight?: string; current_events?: string[]; inspiration?: string };
type Scout = { items?: { name: string; what: string; venture: string; verdict: string }[] };
type XPulse = { items?: { title: string; why: string; url?: string; venture?: string }[] };
type OsState = {
  ventures?: OsVenture[];
  tasks?: OsTask[];
  daily_brief?: string;
  morning?: Morning;
  scout?: Scout;
  x_pulse?: XPulse;
};

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

export default function Scroll() {
  const [os, setOs] = useState<OsState | null>(null);
  const [view, setView] = useState<"today" | "venture">("today");
  const [hour, setHour] = useState(9);

  useEffect(() => {
    setHour(new Date().getHours());
    fetch("/api/os").then((r) => r.json()).then(setOs).catch(() => {});
  }, []);

  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const isMorning = hour < 12;

  const m = os?.morning ?? {};
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
  const scoutTop = (os?.scout?.items ?? []).filter((i) => i.verdict !== "watch").slice(0, 3);
  const xItems = os?.x_pulse?.items ?? [];

  return (
    <div className="mx-auto max-w-2xl space-y-12 pb-28 pt-1">
      {/* Greeting + inspiration */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
        <div className="flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300">
          <Sunrise className="h-4 w-4" /> {m.date || "Today"}
        </div>
        <h1 className="mt-4 font-display text-[32px] font-semibold leading-tight tracking-tight sm:text-[44px]">
          <span className="text-grad-cyan">{greeting}, Zorba.</span>
        </h1>
        {m.inspiration && (
          <p className="mx-auto mt-4 max-w-lg text-[17px] font-light leading-relaxed text-white/85 sm:text-[20px]">
            &ldquo;{m.inspiration}&rdquo;
          </p>
        )}
        <p className="mt-4 text-[13px] text-[color:var(--color-ink-dim)]">
          {awaitingYou.length} awaiting you · {drafts.length} drafts ready · {ventures.length} ventures
        </p>
      </motion.section>

      {/* Torah — emphasized in the morning */}
      {isMorning && m.torah_insight && (
        <motion.section {...reveal} className="panel relative overflow-hidden p-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-amber-400/20 to-violet-500/15 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-amber-300/90">
              <ScrollText className="h-4 w-4" /> Parshat {m.parsha}
              {m.parsha_ref && <span className="text-[color:var(--color-ink-mute)]">· {m.parsha_ref}</span>}
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-white/90">{m.torah_insight}</p>
          </div>
        </motion.section>
      )}

      {/* Right now — tasks */}
      <motion.section {...reveal}>
        <SectionHead icon={<Target className="h-4 w-4 text-cyan-300" />} title="Right now" />
        <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 sm:max-w-xs">
          <Toggle active={view === "today"} onClick={() => setView("today")}>Today</Toggle>
          <Toggle active={view === "venture"} onClick={() => setView("venture")}>By Venture</Toggle>
        </div>
        <div className="mt-3">
          {view === "today" ? (
            <TodayView focus={focus} awaitingYou={awaitingYou} drafts={drafts} loading={!os} />
          ) : (
            <VentureView ventures={ventures} tasks={tasks} loading={!os} />
          )}
        </div>
      </motion.section>

      {/* Hot on X */}
      {xItems.length > 0 && (
        <motion.section {...reveal}>
          <SectionHead icon={<Flame className="h-4 w-4 text-rose-300" />} title="Hot on X · relevant to you" />
          <div className="mt-3 space-y-2.5">
            {xItems.map((x, i) => (
              <a
                key={i}
                href={x.url || "#"}
                target={x.url ? "_blank" : undefined}
                rel="noreferrer"
                className="block rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 transition hover:border-rose-400/40 hover:bg-white/[0.06]"
              >
                <div className="text-[14px] font-medium leading-snug text-white">{x.title}</div>
                <div className="mt-1 text-[12px] leading-relaxed text-[color:var(--color-ink-dim)]">{x.why}</div>
              </a>
            ))}
          </div>
        </motion.section>
      )}

      {/* Build better — scout */}
      {scoutTop.length > 0 && (
        <motion.section {...reveal}>
          <SectionHead icon={<Radar className="h-4 w-4 text-violet-300" />} title="Build better" right={<Link href="/scout" className="text-[12px] text-cyan-300">all →</Link>} />
          <div className="mt-3 space-y-2.5">
            {scoutTop.map((s, i) => (
              <Link key={i} href="/scout" className="block rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 transition hover:border-violet-400/40 hover:bg-white/[0.06]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[14px] font-medium text-white">{s.name}</span>
                  <span className={`chip ${s.verdict === "adopt now" ? "chip-emerald" : "chip-amber"}`}>{s.verdict}</span>
                </div>
                <div className="mt-1 text-[12px] leading-relaxed text-[color:var(--color-ink-dim)]">{s.what}</div>
              </Link>
            ))}
          </div>
        </motion.section>
      )}

      <motion.section {...reveal}>
        <CostCard />
      </motion.section>
    </div>
  );
}

function SectionHead({ icon, title, right }: { icon: React.ReactNode; title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
        {icon} {title}
      </div>
      {right}
    </div>
  );
}

function Toggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-2.5 text-[14px] font-medium transition ${
        active ? "bg-gradient-to-br from-cyan-400/25 to-violet-500/20 text-white shadow-[0_0_18px_rgba(0,229,255,0.18)]" : "text-[color:var(--color-ink-dim)] hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function TaskRow({ title, sub, badge, badgeTone }: { title: string; sub?: string; badge?: string; badgeTone?: string }) {
  return (
    <Link href="/tasks" className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 transition active:scale-[0.99] hover:border-cyan-400/40 hover:bg-white/[0.06]">
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-medium leading-snug text-white">{title}</div>
        {sub && <div className="mt-0.5 truncate text-[12px] text-[color:var(--color-ink-dim)]">{sub}</div>}
      </div>
      {badge && <span className={`chip ${badgeTone ?? ""} shrink-0`}>{badge}</span>}
      <ChevronRight className="h-5 w-5 shrink-0 text-[color:var(--color-ink-mute)] transition group-hover:text-cyan-300" />
    </Link>
  );
}

function TodayView({ focus, awaitingYou, drafts, loading }: { focus: string[]; awaitingYou: OsTask[]; drafts: OsTask[]; loading: boolean }) {
  if (loading) return <div className="panel p-6 text-[13px] text-[color:var(--color-ink-dim)]">Loading…</div>;
  const empty = focus.length === 0 && awaitingYou.length === 0 && drafts.length === 0;
  return (
    <div className="space-y-4">
      {focus.length > 0 && (
        <div className="space-y-2">
          {focus.map((f, i) => (
            <div key={i} className="flex items-start gap-3 rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/[0.06] to-transparent px-4 py-3.5">
              <Target className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
              <span className="text-[14px] leading-snug text-white/90">{f}</span>
            </div>
          ))}
        </div>
      )}
      {awaitingYou.map((t) => (
        <TaskRow key={t.id} title={t.title} sub={t.client || t.venture} badge="act" badgeTone="chip-amber" />
      ))}
      {drafts.map((t) => (
        <TaskRow key={t.id} title={t.title} sub={t.venture} badge="review" badgeTone="chip-emerald" />
      ))}
      {empty && <div className="panel p-6 text-[14px] text-[color:var(--color-ink-dim)]">Nothing waiting on you. Clear runway.</div>}
    </div>
  );
}

function VentureView({ ventures, tasks, loading }: { ventures: OsVenture[]; tasks: OsTask[]; loading: boolean }) {
  if (loading) return <div className="panel p-6 text-[13px] text-[color:var(--color-ink-dim)]">Loading…</div>;
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
      <div className="relative flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">API spend</div>
        <span className="chip chip-emerald">{c?.calls ?? 0} calls</span>
      </div>
      <div className="relative mt-2 flex items-baseline gap-2">
        <span className="font-display text-3xl font-semibold tracking-tight text-grad-cyan data-num">${today.toFixed(2)}</span>
        <span className="text-[12px] text-[color:var(--color-ink-dim)]">today · ${total.toFixed(2)} total</span>
      </div>
      {providers.length > 0 && (
        <div className="relative mt-3 flex flex-wrap gap-2">
          {providers.map(([name, v]) => (
            <span key={name} className="chip capitalize">{name} ${v.costUsd.toFixed(3)}</span>
          ))}
        </div>
      )}
    </div>
  );
}
