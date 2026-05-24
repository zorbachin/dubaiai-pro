"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Send, Mail, ListChecks, Loader2 } from "lucide-react";

type Task = {
  id: string;
  venture: string;
  title: string;
  kind?: string;
  awaiting?: string;
  draft?: string | null;
  client?: string;
};
type OsState = { ok: boolean; tasks?: Task[]; generated_at?: string; error?: string };

export default function TasksPage() {
  const [os, setOs] = useState<OsState | null>(null);
  const [sel, setSel] = useState<Task | null>(null);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/os").then((r) => r.json()).then(setOs).catch(() => {});
  }, []);

  function open(t: Task) {
    setSel(t);
    setResult(null);
    setSubject(t.title.slice(0, 120));
    setBodyText(t.draft || `${t.title}\n\n(No draft yet — ask Hermes in Chat to draft this, or write it here.)`);
    setTo("");
  }

  async function authorizeSend() {
    if (!to.trim()) {
      setResult("Add a recipient email first.");
      return;
    }
    setSending(true);
    setResult(null);
    try {
      const r = await fetch("/api/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "send_email", to, subject, body: bodyText }),
      });
      const j = await r.json();
      setResult(j.ok ? `Sent to ${to} ✓` : `Failed: ${j.error || "unknown"}`);
    } catch (e) {
      setResult(`Failed: ${e instanceof Error ? e.message : "error"}`);
    } finally {
      setSending(false);
    }
  }

  const tasks = os?.tasks ?? [];
  const drafts = tasks.filter((t) => t.kind === "draft");
  const actions = tasks.filter((t) => t.kind !== "draft");

  return (
    <div className="mx-auto max-w-[1500px] space-y-5 pt-2">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-gradient-to-br from-cyan-400/20 to-violet-500/20">
          <ListChecks className="h-5 w-5 text-cyan-300" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-[13px] text-[color:var(--color-ink-dim)]">
            {os ? `${tasks.length} live · ${drafts.length} drafts ready to review` : "Loading real tasks…"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        {/* List */}
        <div className="space-y-3">
          {drafts.length > 0 && (
            <div className="px-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
              Drafts ready · review & send
            </div>
          )}
          {drafts.map((t, i) => (
            <TaskRow key={t.id} t={t} i={i} active={sel?.id === t.id} onClick={() => open(t)} ready />
          ))}
          <div className="px-1 pt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
            Next actions
          </div>
          {actions.map((t, i) => (
            <TaskRow key={t.id} t={t} i={i} active={sel?.id === t.id} onClick={() => open(t)} />
          ))}
          {tasks.length === 0 && os && (
            <div className="panel p-5 text-[13px] text-[color:var(--color-ink-dim)]">
              No tasks in the current sync. The VPS refreshes every 30 min.
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          {!sel ? (
            <div className="panel grid min-h-[300px] place-items-center p-8 text-center text-[14px] text-[color:var(--color-ink-dim)]">
              Tap a task to see the breakdown and the draft — then review, annotate, and authorize.
            </div>
          ) : (
            <motion.div
              key={sel.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="panel p-5"
            >
              <div className="flex items-center gap-2">
                <span className="chip">{sel.venture}</span>
                {sel.kind === "draft" && <span className="chip chip-emerald">draft ready</span>}
                {sel.awaiting && <span className="chip chip-amber">awaiting {sel.awaiting}</span>}
              </div>
              <h2 className="mt-3 font-display text-lg font-semibold tracking-tight">{sel.title}</h2>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
                    To
                  </span>
                  <input
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="recipient@email.com"
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
                    Subject
                  </span>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
                  />
                </label>
              </div>

              <label className="mt-3 block">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
                  Draft · edit / annotate before sending
                </span>
                <textarea
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  rows={12}
                  className="mt-1 w-full resize-y rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-[13px] leading-relaxed text-white outline-none focus:border-cyan-400/50"
                />
              </label>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={authorizeSend}
                  disabled={sending}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_24px_rgba(52,211,153,0.25)] transition hover:from-emerald-400/30 disabled:opacity-50"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {sending ? "Sending…" : "Authorize & Send"}
                </button>
                {result && (
                  <span
                    className={`inline-flex items-center gap-1.5 text-[13px] ${
                      result.includes("✓") ? "text-emerald-300" : "text-amber-300"
                    }`}
                  >
                    {result.includes("✓") ? <CheckCircle2 className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                    {result}
                  </span>
                )}
              </div>
              <p className="mt-3 text-[11px] text-[color:var(--color-ink-mute)]">
                Nothing sends until you click Authorize. The send runs live on your VPS.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskRow({
  t,
  i,
  active,
  onClick,
  ready,
}: {
  t: Task;
  i: number;
  active: boolean;
  onClick: () => void;
  ready?: boolean;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.03 }}
      onClick={onClick}
      className={`panel w-full p-4 text-left transition ${
        active ? "border-cyan-400/50 shadow-[0_0_20px_rgba(0,229,255,0.18)]" : "hover:border-white/20"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="chip">{t.venture}</span>
        {ready ? (
          <span className="chip chip-emerald">draft</span>
        ) : t.awaiting ? (
          <span className="chip chip-amber">awaiting {t.awaiting}</span>
        ) : null}
      </div>
      <div className="mt-2 text-[14px] font-medium leading-snug text-white">{t.title}</div>
      {t.client && <div className="mt-1 text-[12px] text-[color:var(--color-ink-dim)]">{t.client}</div>}
    </motion.button>
  );
}
