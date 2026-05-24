"use client";

import { useEffect, useState } from "react";
import { Command, Search, Bell, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export function Topbar() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="sticky top-0 z-30 flex items-center gap-4 border-b border-[color:var(--color-border)] bg-[color:var(--color-bg)]/40 px-6 py-3 backdrop-blur-xl lg:px-10">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
        <span className="hidden md:inline">SECTOR</span>
        <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[color:var(--color-ink-dim)]">
          /ops/prime
        </span>
      </div>

      <div className="relative ml-2 hidden flex-1 max-w-xl md:flex">
        <div className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 transition focus-within:border-cyan-400/40 focus-within:bg-white/[0.05]">
          <Search className="h-4 w-4 text-[color:var(--color-ink-mute)]" />
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[color:var(--color-ink-mute)]"
            placeholder="Search agents, threads, tasks…"
          />
          <kbd className="flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-[color:var(--color-ink-mute)]">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Telemetry label="LAT" value="48ms" tone="emerald" />
        <Telemetry label="TOK/S" value="12.4k" tone="cyan" />
        <Telemetry label="CTX" value="63%" tone="violet" />

        <div className="hidden h-8 w-px bg-white/10 sm:block" />

        <button className="relative grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-[color:var(--color-ink-dim)] transition hover:text-white">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]" />
        </button>

        <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-xs text-[color:var(--color-ink-dim)] sm:flex">
          <Cpu className="h-3.5 w-3.5 text-cyan-300" />
          <span className="tabular-nums">{now ? now.toLocaleTimeString([], { hour12: false }) : "--:--:--"}</span>
          <span className="text-[color:var(--color-ink-mute)]">UTC</span>
        </div>
      </div>
    </div>
  );
}

function Telemetry({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "cyan" | "violet" | "emerald";
}) {
  const tones: Record<string, string> = {
    cyan: "text-cyan-300",
    violet: "text-violet-300",
    emerald: "text-emerald-300",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 md:flex"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
        {label}
      </span>
      <span className={`data-num text-sm font-semibold ${tones[tone]}`}>{value}</span>
    </motion.div>
  );
}
