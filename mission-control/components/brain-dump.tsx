"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, X, Send, Loader2, CheckCircle2 } from "lucide-react";
import { MicButton } from "./voice-field";

export function BrainDump() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [reply, setReply] = useState<string | null>(null);

  async function send() {
    if (!text.trim() || busy) return;
    setBusy(true);
    setReply(null);
    try {
      const r = await fetch("/api/braindump", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const j = await r.json();
      setReply(j.ok ? j.reply : `Couldn't route: ${j.error || "error"}`);
      if (j.ok) setText("");
    } catch (e) {
      setReply(`Couldn't route: ${e instanceof Error ? e.message : "error"}`);
    } finally {
      setBusy(false);
    }
  }

  // Chat pages already have a composer — don't overlap their send button.
  if (pathname?.startsWith("/chat") || pathname?.startsWith("/agents/")) return null;

  return (
    <>
      {/* Floating trigger — on every page */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Brain dump"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-cyan-400/40 bg-gradient-to-br from-cyan-400/25 to-violet-500/25 px-4 py-3 text-sm font-medium text-white shadow-[0_0_28px_rgba(0,229,255,0.3)] backdrop-blur-xl transition active:scale-95 hover:from-cyan-400/35"
      >
        <Brain className="h-5 w-5" />
        <span className="hidden sm:inline">Brain dump</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-3xl border border-white/12 bg-[color:var(--color-bg)]/95 p-4 shadow-2xl backdrop-blur-2xl sm:inset-x-auto sm:right-5 sm:w-[460px]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-xl border border-white/15 bg-gradient-to-br from-cyan-400/20 to-violet-500/20">
                    <Brain className="h-4 w-4 text-cyan-300" />
                  </div>
                  <div className="font-display text-[15px] font-semibold tracking-tight">Brain dump</div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-[color:var(--color-ink-dim)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] focus-within:border-cyan-400/40">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") send();
                  }}
                  rows={4}
                  autoFocus
                  placeholder="Talk or type. Dump anything — it routes itself to the right venture."
                  className="w-full resize-none bg-transparent px-4 py-3 text-[15px] leading-relaxed text-white outline-none placeholder:text-[color:var(--color-ink-mute)]"
                />
                <div className="flex items-center justify-between gap-2 px-3 pb-3">
                  <MicButton setValue={setText} size="md" label="Talk" />
                  <button
                    onClick={send}
                    disabled={busy || !text.trim()}
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-gradient-to-br from-cyan-400/25 to-violet-500/20 px-4 py-2.5 text-sm font-medium text-white transition active:scale-95 hover:from-cyan-400/35 disabled:opacity-40"
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {busy ? "Routing…" : "Route it"}
                  </button>
                </div>
              </div>

              {reply && (
                <div className="mt-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-3">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Routed by Hermes
                  </div>
                  <p className="mt-1.5 whitespace-pre-wrap text-[13px] leading-relaxed text-white/90">{reply}</p>
                </div>
              )}
              <p className="mt-2 px-1 text-[11px] text-[color:var(--color-ink-mute)]">
                Saved to your vault &amp; routed to the brain. ⌘/Ctrl+Enter to send.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
