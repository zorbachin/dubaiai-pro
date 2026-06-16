"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { AGENTS } from "@/lib/mock";
import { AgentCard } from "@/components/agent-card";
import { Plus, Filter, Search } from "lucide-react";
import type { AgentStatus } from "@/lib/types";

const FILTERS: Array<{ id: AgentStatus | "all"; label: string; tone: string }> = [
  { id: "all", label: "All", tone: "" },
  { id: "active", label: "Active", tone: "chip-emerald" },
  { id: "thinking", label: "Thinking", tone: "chip-cyan" },
  { id: "idle", label: "Idle", tone: "" },
  { id: "paused", label: "Paused", tone: "chip-amber" },
];

export default function AgentsPage() {
  const [filter, setFilter] = useState<AgentStatus | "all">("all");
  const [q, setQ] = useState("");

  const agents = AGENTS.filter(
    (a) =>
      (filter === "all" || a.status === filter) &&
      (q.trim() === "" || (a.name + a.role).toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-[1500px] space-y-6 pt-2">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">
            Fleet
          </div>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-grad-cyan">
            Agents
          </h1>
          <p className="mt-1 text-[15px] text-[color:var(--color-ink-dim)]">
            Each agent runs its own system prompt, model, and tool surface. Compose them
            into missions.
          </p>
        </div>
      </motion.div>

      <div className="panel flex flex-wrap items-center gap-3 p-4">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 focus-within:border-cyan-400/40">
          <Search className="h-4 w-4 text-[color:var(--color-ink-mute)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search agents…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[color:var(--color-ink-mute)]"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="mr-1 h-4 w-4 text-[color:var(--color-ink-mute)]" />
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`chip transition ${filter === f.id ? `${f.tone} !text-white border-white/30` : ""}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {agents.map((a, i) => (
          <AgentCard key={a.id} agent={a} index={i} />
        ))}
        <NewAgentCard />
      </div>
    </div>
  );
}

function NewAgentCard() {
  return (
    <motion.button
      whileHover={{ y: -3, scale: 1.005 }}
      className="group panel grid min-h-[260px] place-items-center overflow-hidden border-dashed p-6 text-left"
    >
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-gradient-to-br from-cyan-400/10 to-violet-500/10 transition group-hover:border-cyan-400/40">
          <Plus className="h-6 w-6 text-[color:var(--color-ink-dim)] transition group-hover:rotate-90 group-hover:text-white" />
        </div>
        <div className="mt-4 font-display text-base font-semibold tracking-tight">
          Spawn a new agent
        </div>
        <div className="mt-1 text-xs text-[color:var(--color-ink-dim)]">
          Define a role, system prompt, and tools.
        </div>
      </div>
    </motion.button>
  );
}
