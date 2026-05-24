"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Send,
  Sparkles,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Paperclip,
  Square,
} from "lucide-react";
import { AGENTS, getAgent } from "@/lib/mock";
import type { Agent, Message } from "@/lib/types";
import { AgentAvatar } from "./agent-avatar";
import { PulseDot } from "./pulse-dot";

type Props = {
  agentId: string;
  fillHeight?: boolean;
};

export function ChatPanel({ agentId, fillHeight = true }: Props) {
  const agent = getAgent(agentId) ?? AGENTS[0];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Reset thread when agent changes
  useEffect(() => {
    setMessages([]);
    setInput("");
    setError(null);
  }, [agentId]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  // Auto-resize textarea
  useEffect(() => {
    const t = textareaRef.current;
    if (!t) return;
    t.style.height = "auto";
    t.style.height = Math.min(t.scrollHeight, 200) + "px";
  }, [input]);

  async function send(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    if (!text || streaming) return;
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setStreaming(true);
    setError(null);

    const assistantId = crypto.randomUUID();
    setMessages((m) => [
      ...m,
      { id: assistantId, role: "assistant", content: "", timestamp: Date.now(), agentId: agent.id },
    ]);

    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ac.signal,
        body: JSON.stringify({
          systemPrompt: agent.systemPrompt,
          model: agent.model,
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(j.error || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let full = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const evt = JSON.parse(payload);
            if (evt.delta) {
              full += evt.delta;
              setMessages((m) =>
                m.map((x) => (x.id === assistantId ? { ...x, content: full } : x))
              );
            }
          } catch {
            /* ignore */
          }
        }
      }
    } catch (e: unknown) {
      if ((e as Error)?.name === "AbortError") return;
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setError(msg);
      setMessages((m) =>
        m.map((x) =>
          x.id === assistantId
            ? {
                ...x,
                content:
                  "I couldn't reach the model. Add `ANTHROPIC_API_KEY` to `mission-control/.env.local`, then restart `npm run dev`.",
              }
            : x
        )
      );
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function stop() {
    abortRef.current?.abort();
    setStreaming(false);
  }

  async function regenerate() {
    if (streaming) return;
    // Drop trailing assistant message and re-send last user
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    setMessages((m) => {
      const next = [...m];
      while (next.length && next[next.length - 1].role === "assistant") next.pop();
      return next;
    });
    setTimeout(() => send(lastUser.content), 0);
  }

  const groups = useMemo(() => groupMessages(messages), [messages]);
  const lastAssistantId = useMemo(
    () => [...messages].reverse().find((m) => m.role === "assistant")?.id,
    [messages]
  );

  return (
    <div
      className={`panel relative flex flex-col overflow-hidden ${
        fillHeight ? "h-[calc(100vh-148px)]" : "h-[560px]"
      }`}
    >
      <Header agent={agent} streaming={streaming} />

      <div
        ref={scrollRef}
        className="relative flex-1 overflow-y-auto px-4 py-5 md:px-6"
      >
        {messages.length === 0 ? (
          <EmptyState agent={agent} onPick={(p) => send(p)} />
        ) : (
          groups.map((g, gi) => (
            <div key={gi} className="mb-6">
              {g.daySeparator && <DaySeparator label={g.daySeparator} />}
              {g.role === "user" ? (
                <UserGroup messages={g.messages} />
              ) : (
                <AssistantGroup
                  agent={agent}
                  messages={g.messages}
                  streaming={streaming && g.messages[g.messages.length - 1].id === lastAssistantId}
                  onRegenerate={regenerate}
                  isLast={gi === groups.length - 1}
                />
              )}
            </div>
          ))
        )}

        {error && (
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs text-rose-200">
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </div>
        )}
      </div>

      <Composer
        input={input}
        setInput={setInput}
        textareaRef={textareaRef}
        streaming={streaming}
        onSend={() => send()}
        onStop={stop}
        agent={agent}
      />
    </div>
  );
}

function Header({ agent, streaming }: { agent: Agent; streaming: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/5 px-5 py-3.5">
      <div className="flex items-center gap-3">
        <AgentAvatar agent={agent} size={40} />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-[15px] font-semibold tracking-tight">
              {agent.name}
            </span>
            <PulseDot status={agent.status} />
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[color:var(--color-ink-dim)]">
            <span>{agent.role}</span>
            <span className="text-[color:var(--color-ink-mute)]">·</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)]">
              {agent.model}
            </span>
            {streaming && (
              <>
                <span className="text-[color:var(--color-ink-mute)]">·</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300">
                  typing
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="hidden items-center gap-1.5 sm:flex">
        <span className="chip chip-cyan">Streaming</span>
        <span className="chip">E2E</span>
      </div>
    </div>
  );
}

function EmptyState({ agent, onPick }: { agent: Agent; onPick: (p: string) => void }) {
  return (
    <div className="grid h-full place-items-center">
      <div className="max-w-md text-center">
        <div className="mx-auto">
          <AgentAvatar agent={agent} size={96} />
        </div>
        <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-grad-cyan">
          {agent.name}
        </h3>
        <p className="mt-1.5 text-sm text-[color:var(--color-ink-dim)]">{agent.tagline}</p>
        <div className="mt-6 grid grid-cols-1 gap-2">
          {agent.starters.map((s, i) => (
            <motion.button
              key={s}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onPick(s)}
              className="group rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[color:var(--color-ink)]">{s}</span>
                <span className="text-[color:var(--color-ink-mute)] transition group-hover:text-white">
                  →
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DaySeparator({ label }: { label: string }) {
  return (
    <div className="my-3 flex items-center gap-3">
      <div className="h-px flex-1 bg-white/5" />
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
        {label}
      </span>
      <div className="h-px flex-1 bg-white/5" />
    </div>
  );
}

function UserGroup({ messages }: { messages: Message[] }) {
  return (
    <div className="flex flex-col items-end gap-1">
      {messages.map((m) => (
        <motion.div
          key={m.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="group flex max-w-[80%] flex-col items-end"
        >
          <div className="rounded-2xl rounded-tr-md border border-cyan-400/30 bg-gradient-to-br from-cyan-400/18 to-violet-500/14 px-4 py-2.5 text-[14px] leading-relaxed text-white shadow-[0_8px_24px_rgba(0,229,255,0.08)]">
            {m.content}
          </div>
          <div className="mt-1 px-1 font-mono text-[10px] text-[color:var(--color-ink-mute)] opacity-0 transition group-hover:opacity-100">
            {timeLabel(m.timestamp)} · sent
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function AssistantGroup({
  agent,
  messages,
  streaming,
  onRegenerate,
  isLast,
}: {
  agent: Agent;
  messages: Message[];
  streaming: boolean;
  onRegenerate: () => void;
  isLast: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="pt-1">
        <AgentAvatar agent={agent} size={36} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-baseline gap-2">
          <span className="font-display text-[13px] font-semibold tracking-tight">
            {agent.name}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
            {timeLabel(messages[0].timestamp)}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {messages.map((m, i) => {
            const isStreamingTip = streaming && i === messages.length - 1;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="group/msg relative max-w-[88%] rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.035] px-4 py-3 text-[14px] leading-relaxed text-[color:var(--color-ink)]"
              >
                {m.content ? (
                  <span className="whitespace-pre-wrap">
                    {m.content}
                    {isStreamingTip && <BlinkingCaret />}
                  </span>
                ) : (
                  <TypingDots />
                )}
                {m.content && (
                  <div className="absolute -top-3 right-2 flex items-center gap-1 opacity-0 transition group-hover/msg:opacity-100">
                    <CopyButton text={m.content} />
                    {isLast && i === messages.length - 1 && !streaming && (
                      <button
                        onClick={onRegenerate}
                        className="grid h-7 w-7 place-items-center rounded-md border border-white/10 bg-[color:var(--color-bg-elevated)] text-[color:var(--color-ink-dim)] backdrop-blur hover:text-white"
                        title="Regenerate"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {
          /* noop */
        }
      }}
      className="grid h-7 w-7 place-items-center rounded-md border border-white/10 bg-[color:var(--color-bg-elevated)] text-[color:var(--color-ink-dim)] backdrop-blur hover:text-white"
      title="Copy"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-300" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

function BlinkingCaret() {
  return (
    <motion.span
      animate={{ opacity: [1, 0.1, 1] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
      className="ml-0.5 inline-block h-[14px] w-[2px] translate-y-[2px] bg-cyan-300 align-middle"
    />
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      {[0, 0.15, 0.3].map((d, i) => (
        <motion.span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-white/60"
          animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: d, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

function Composer({
  input,
  setInput,
  textareaRef,
  streaming,
  onSend,
  onStop,
  agent,
}: {
  input: string;
  setInput: (v: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  streaming: boolean;
  onSend: () => void;
  onStop: () => void;
  agent: Agent;
}) {
  return (
    <div className="border-t border-white/5 px-3 pb-3 pt-2">
      <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2 transition focus-within:border-cyan-400/40 focus-within:bg-white/[0.05]">
        <button
          className="grid h-9 w-9 place-items-center rounded-lg text-[color:var(--color-ink-mute)] transition hover:text-white"
          title="Attach"
        >
          <Paperclip className="h-4 w-4" />
        </button>
        <button
          className="grid h-9 w-9 place-items-center rounded-lg text-[color:var(--color-ink-mute)] transition hover:text-white"
          title="Prompt assist"
        >
          <Sparkles className="h-4 w-4" />
        </button>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder={`Message ${agent.name}…`}
          rows={1}
          className="max-h-48 flex-1 resize-none bg-transparent px-1 py-2 text-[14px] outline-none placeholder:text-[color:var(--color-ink-mute)]"
        />
        {streaming ? (
          <button
            onClick={onStop}
            className="flex items-center gap-2 rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs font-medium text-rose-200 hover:bg-rose-400/20"
          >
            <Square className="h-3.5 w-3.5" />
            Stop
          </button>
        ) : (
          <button
            onClick={onSend}
            disabled={!input.trim()}
            className="grid h-9 w-9 place-items-center rounded-lg border border-cyan-400/40 bg-gradient-to-br from-cyan-400/25 to-violet-500/25 text-white transition hover:from-cyan-400/40 hover:to-violet-500/40 disabled:opacity-40"
            title="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="mt-1.5 flex items-center justify-between px-2 font-mono text-[10px] text-[color:var(--color-ink-mute)]">
        <span>↵ send · ⇧↵ newline · esc stop</span>
        <span className="hidden sm:inline">
          connected · <span className="text-cyan-300/80">{agent.model}</span>
        </span>
      </div>
    </div>
  );
}

type Group = {
  role: "user" | "assistant";
  messages: Message[];
  daySeparator?: string;
};

function groupMessages(messages: Message[]): Group[] {
  const out: Group[] = [];
  let lastDate = "";
  for (const m of messages) {
    const day = dayLabel(m.timestamp);
    const sep = day !== lastDate ? day : undefined;
    lastDate = day;
    const last = out[out.length - 1];
    const role = m.role === "user" ? "user" : "assistant";
    if (last && last.role === role && !sep) {
      last.messages.push(m);
    } else {
      out.push({ role, messages: [m], daySeparator: sep });
    }
  }
  return out;
}

function timeLabel(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function dayLabel(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (sameDay) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}
