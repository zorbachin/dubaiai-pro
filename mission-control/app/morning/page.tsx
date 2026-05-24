"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ScrollText, Sunrise, ArrowRight, Target } from "lucide-react";

type Morning = {
  date?: string;
  parsha?: string;
  parsha_ref?: string;
  season?: string;
  torah_insight?: string;
  current_events?: string[];
  inspiration?: string;
};
type OsTask = { kind?: string; awaiting?: string; title: string };
type OsState = { morning?: Morning; tasks?: OsTask[]; daily_brief?: string };

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

export default function MorningPage() {
  const [os, setOs] = useState<OsState | null>(null);
  useEffect(() => {
    fetch("/api/os").then((r) => r.json()).then(setOs).catch(() => {});
  }, []);

  const m = os?.morning ?? {};
  const tasks = os?.tasks ?? [];
  const awaiting = tasks.filter((t) => /you|me/i.test(t.awaiting || "")).length;
  const drafts = tasks.filter((t) => t.kind === "draft").length;
  const focus = (os?.daily_brief || "")
    .split("\n")
    .filter((l) => l.trim().startsWith("- "))
    .map((l) => l.replace(/^[-\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl space-y-16 pb-24 pt-4">
      <motion.section {...reveal} className="text-center">
        <div className="flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-300">
          <Sunrise className="h-4 w-4" /> {m.date || "Today"}
        </div>
        <h1 className="mt-5 font-display text-[38px] font-semibold leading-tight tracking-tight sm:text-[52px]">
          <span className="text-grad-cyan">Good morning, Zorba.</span>
        </h1>
        {m.inspiration && (
          <p className="mx-auto mt-6 max-w-xl text-[19px] font-light leading-relaxed text-white/85 sm:text-[22px]">
            &ldquo;{m.inspiration}&rdquo;
          </p>
        )}
      </motion.section>

      {m.torah_insight && (
        <motion.section {...reveal} className="panel relative overflow-hidden p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-amber-400/20 to-violet-500/15 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-amber-300/90">
              <ScrollText className="h-4 w-4" /> Parshat {m.parsha}
              {m.parsha_ref && <span className="text-[color:var(--color-ink-mute)]">· {m.parsha_ref}</span>}
            </div>
            <p className="mt-4 text-[16px] leading-relaxed text-white/90 sm:text-[17px]">{m.torah_insight}</p>
          </div>
        </motion.section>
      )}

      {Array.isArray(m.current_events) && m.current_events.length > 0 && (
        <motion.section {...reveal}>
          <div className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.26em] text-[color:var(--color-ink-mute)]">
            In the world today
          </div>
          <div className="space-y-3">
            {m.current_events.map((e, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-[15px] leading-relaxed text-white/85">
                {e}
              </div>
            ))}
          </div>
        </motion.section>
      )}

      <motion.section {...reveal} className="panel p-6 sm:p-8">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300">
          <Sparkles className="h-4 w-4" /> Today&apos;s preview
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="chip chip-amber">{awaiting} awaiting you</span>
          <span className="chip chip-emerald">{drafts} drafts ready</span>
        </div>
        {focus.length > 0 && (
          <div className="mt-5 space-y-2.5">
            {focus.map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                <span className="text-[15px] leading-snug text-white/90">{f}</span>
              </div>
            ))}
          </div>
        )}
        <Link
          href="/"
          className="mt-7 inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-gradient-to-br from-cyan-400/25 to-violet-500/20 px-5 py-3 text-[15px] font-medium text-white transition active:scale-95 hover:from-cyan-400/35"
        >
          Enter the OS <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.section>

      {!os && <div className="text-center text-[13px] text-[color:var(--color-ink-dim)]">Loading your morning…</div>}
    </div>
  );
}
