"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Radar } from "lucide-react";

type Finding = {
  name: string;
  what: string;
  venture: string;
  leverage: string;
  effort: string;
  cost: string;
  verdict: string;
  why: string;
};
type OsState = { scout?: { generated_at?: string; items?: Finding[] } };

const verdictStyle: Record<string, string> = {
  "adopt now": "chip-emerald",
  test: "chip-amber",
  watch: "",
};

export default function ScoutPage() {
  const [os, setOs] = useState<OsState | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/os").then((r) => r.json()).then(setOs).catch(() => {});
  }, []);

  const items = os?.scout?.items ?? [];
  const verdicts = ["all", "adopt now", "test", "watch"];
  const shown = filter === "all" ? items : items.filter((i) => i.verdict === filter);

  return (
    <div className="mx-auto max-w-[1100px] space-y-5 pt-2">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-gradient-to-br from-violet-400/20 to-cyan-400/20">
          <Radar className="h-5 w-5 text-violet-300" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Automation Scout</h1>
          <p className="text-[13px] text-[color:var(--color-ink-dim)]">
            New builds &amp; automations that actually help — no hype, no maybe.
            {os?.scout?.generated_at ? ` Last scan: ${os.scout.generated_at}` : ""}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {verdicts.map((v) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            className={`rounded-lg border px-3 py-1.5 text-[13px] capitalize transition ${
              filter === v
                ? "border-cyan-400/50 bg-white/[0.06] text-white"
                : "border-white/10 bg-white/[0.02] text-[color:var(--color-ink-dim)] hover:text-white"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {shown.map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="panel p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-base font-semibold tracking-tight text-white">{f.name}</h3>
              <span className={`chip ${verdictStyle[f.verdict] ?? ""} shrink-0`}>{f.verdict}</span>
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[color:var(--color-ink-dim)]">{f.what}</p>

            <div className="mt-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
                Leverage · {f.venture}
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-white/90">{f.leverage}</p>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="chip">effort: {f.effort}</span>
              <span className="chip">{f.cost}</span>
            </div>
            <p className="mt-3 text-[12px] italic leading-relaxed text-[color:var(--color-ink-mute)]">{f.why}</p>
          </motion.div>
        ))}
        {shown.length === 0 && (
          <div className="panel p-6 text-[13px] text-[color:var(--color-ink-dim)]">
            No findings yet. The Scout subagent refreshes this weekly.
          </div>
        )}
      </div>
    </div>
  );
}
