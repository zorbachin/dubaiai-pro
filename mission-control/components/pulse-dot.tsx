"use client";

import type { AgentStatus } from "@/lib/types";

const colors: Record<AgentStatus, { ring: string; dot: string; label: string }> = {
  active: { ring: "bg-emerald-400", dot: "bg-emerald-400", label: "Active" },
  thinking: { ring: "bg-cyan-300", dot: "bg-cyan-300", label: "Thinking" },
  idle: { ring: "bg-slate-400", dot: "bg-slate-300", label: "Idle" },
  paused: { ring: "bg-amber-300", dot: "bg-amber-300", label: "Paused" },
  error: { ring: "bg-rose-400", dot: "bg-rose-400", label: "Error" },
};

export function PulseDot({ status, withLabel = false }: { status: AgentStatus; withLabel?: boolean }) {
  const c = colors[status];
  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative inline-flex h-2 w-2">
        {(status === "active" || status === "thinking") && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${c.ring} opacity-60`} />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${c.dot}`} />
      </span>
      {withLabel && (
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-dim)]">
          {c.label}
        </span>
      )}
    </span>
  );
}
