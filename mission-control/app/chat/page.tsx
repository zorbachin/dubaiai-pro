"use client";

import { motion } from "framer-motion";
import { ChatPanel } from "@/components/chat-panel";
import { AGENTS } from "@/lib/mock";
import { useMemo, useState } from "react";
import { PulseDot } from "@/components/pulse-dot";
import { AgentAvatar } from "@/components/agent-avatar";
import { Search } from "lucide-react";

export default function ChatPage() {
  const [agentId, setAgentId] = useState<string>(AGENTS[0].id);
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () =>
      AGENTS.filter(
        (a) =>
          q.trim() === "" ||
          (a.name + a.role + a.tagline).toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  );

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 pt-2">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">
            Direct Link
          </div>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-grad-cyan">
            Chat
          </h1>
          <p className="mt-1 text-[15px] text-[color:var(--color-ink-dim)]">
            Pick an agent. Each one keeps its own model, persona, and context.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">
        <ConversationsSidebar
          q={q}
          setQ={setQ}
          agents={filtered}
          selectedId={agentId}
          onSelect={setAgentId}
        />
        <ChatPanel key={agentId} agentId={agentId} fillHeight />
      </div>
    </div>
  );
}

function ConversationsSidebar({
  q,
  setQ,
  agents,
  selectedId,
  onSelect,
}: {
  q: string;
  setQ: (v: string) => void;
  agents: typeof AGENTS;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="panel flex max-h-[calc(100vh-148px)] flex-col overflow-hidden">
      <div className="border-b border-white/5 p-3">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 focus-within:border-cyan-400/40">
          <Search className="h-4 w-4 text-[color:var(--color-ink-mute)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search agents…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[color:var(--color-ink-mute)]"
          />
          {q && (
            <button
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)] hover:text-white"
              onClick={() => setQ("")}
            >
              clear
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
          Conversations
        </div>
        {agents.map((a) => {
          const active = a.id === selectedId;
          return (
            <motion.button
              key={a.id}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelect(a.id)}
              className={`relative flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                active
                  ? "border border-white/15 bg-gradient-to-r from-white/[0.07] via-white/[0.04] to-transparent"
                  : "border border-transparent hover:bg-white/[0.03]"
              }`}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full"
                  style={{ background: `linear-gradient(180deg, ${a.hueA}, ${a.hueB})`, boxShadow: `0 0 10px ${a.hueA}` }}
                />
              )}
              <AgentAvatar agent={a} size={40} glow={active} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-display text-sm font-semibold">
                      {a.name}
                    </span>
                    <PulseDot status={a.status} />
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
                    {a.model.includes("opus") ? "Opus" : a.model.includes("sonnet") ? "Sonnet" : "Haiku"}
                  </span>
                </div>
                <div className="mt-0.5 truncate text-[12px] text-[color:var(--color-ink-dim)]">
                  {a.tagline}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
      <div className="border-t border-white/5 p-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
            Tip
          </div>
          <div className="mt-1 text-xs text-[color:var(--color-ink-dim)]">
            Each chat sends its agent's system prompt. Customize in the agent's detail page.
          </div>
        </div>
      </div>
    </div>
  );
}
