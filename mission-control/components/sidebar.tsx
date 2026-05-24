"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  Activity,
  ScrollText,
  ListChecks,
  Radar,
  Sunrise,
  Sparkles,
  Target,
  BookText,
} from "lucide-react";
import { AGENTS } from "@/lib/mock";
import { AgentAvatar } from "./agent-avatar";
import { PulseDot } from "./pulse-dot";

const nav = [
  { href: "/morning", label: "Morning", icon: Sunrise, hint: "Start here" },
  { href: "/", label: "Mission Control", icon: LayoutDashboard, hint: "Overview" },
  { href: "/tasks", label: "Tasks", icon: ListChecks, hint: "Do" },
  { href: "/agents", label: "Agents", icon: Bot, hint: "Fleet" },
  { href: "/chat", label: "Chat", icon: MessageSquare, hint: "Direct" },
  { href: "/scout", label: "Scout", icon: Radar, hint: "New builds" },
  { href: "/goals", label: "Goals", icon: Target, hint: "Track" },
  { href: "/journal", label: "Journal", icon: BookText, hint: "Daily" },
  { href: "/systems", label: "Systems", icon: Activity, hint: "Monitor" },
  { href: "/logs", label: "Activity", icon: ScrollText, hint: "Stream" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 z-20 hidden h-screen w-[268px] shrink-0 flex-col border-r border-[color:var(--color-border)] px-5 py-7 lg:flex">
      <Link href="/" className="group flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 blur-md opacity-70 group-hover:opacity-100 transition" />
          <div className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-gradient-to-br from-white/10 to-white/0">
            <Sparkles className="h-5 w-5 text-white" strokeWidth={2.4} />
          </div>
        </div>
        <div className="leading-tight">
          <div className="font-display text-[17px] font-semibold tracking-tight">
            Mission Control
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
            Claude · Command OS
          </div>
        </div>
      </Link>

      <div className="mt-9 px-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
        Navigation
      </div>
      <nav className="mt-3 flex flex-col gap-1">
        {nav.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition"
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl border border-white/10 bg-gradient-to-r from-white/[0.08] via-white/[0.04] to-transparent"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span
                className={`relative z-10 grid h-7 w-7 place-items-center rounded-lg transition ${
                  active
                    ? "bg-gradient-to-br from-cyan-400/30 to-violet-500/30 text-white"
                    : "text-[color:var(--color-ink-dim)] group-hover:text-white"
                }`}
              >
                <Icon className="h-[15px] w-[15px]" strokeWidth={2.2} />
              </span>
              <span
                className={`relative z-10 flex-1 font-medium tracking-tight ${
                  active ? "text-white" : "text-[color:var(--color-ink-dim)] group-hover:text-white"
                }`}
              >
                {item.label}
              </span>
              <span className="relative z-10 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)]">
                {item.hint}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-7 flex items-center justify-between px-1">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
          Agents
        </div>
        <Link
          href="/agents"
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300/80 hover:text-white"
        >
          all →
        </Link>
      </div>
      <div className="mt-2 flex flex-col gap-1">
        {AGENTS.map((a) => {
          const active = pathname === `/agents/${a.id}`;
          return (
            <Link
              key={a.id}
              href={`/agents/${a.id}`}
              className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition ${
                active
                  ? "bg-white/[0.06]"
                  : "hover:bg-white/[0.03]"
              }`}
            >
              <AgentAvatar agent={a} size={28} glow={false} />
              <span className="flex-1 truncate text-[13px] font-medium text-[color:var(--color-ink)]">
                {a.name}
              </span>
              <PulseDot status={a.status} />
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-6">
        <div className="panel relative overflow-hidden p-4">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-cyan-400/30 to-violet-500/30 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300/90">
                System Online
              </span>
            </div>
            <div className="mt-2 font-display text-sm font-medium">Claude · Multi-model</div>
            <div className="font-mono text-[11px] text-[color:var(--color-ink-mute)]">
              48ms · 12,492 tok/s
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
