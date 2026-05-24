"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Series = { id: string; label: string; color: string; values: number[] };

const seed = (base: number, n = 48): number[] =>
  Array.from({ length: n }, (_, i) => {
    const noise = Math.sin(i * 0.4) * 8 + Math.random() * 14;
    return Math.max(2, Math.min(98, base + noise));
  });

const initial: Series[] = [
  { id: "tok", label: "Tokens / sec", color: "#22d3ee", values: seed(58) },
  { id: "lat", label: "Latency ms", color: "#a78bfa", values: seed(40) },
  { id: "queue", label: "Queue depth", color: "#34d399", values: seed(22) },
  { id: "err", label: "Errors / hr", color: "#fb7185", values: seed(8) },
];

export function SystemMonitor() {
  const [data, setData] = useState<Series[]>(initial);

  useEffect(() => {
    const i = setInterval(() => {
      setData((prev) =>
        prev.map((s) => {
          const last = s.values[s.values.length - 1];
          const next = Math.max(
            2,
            Math.min(98, last + (Math.random() - 0.5) * 18)
          );
          return { ...s, values: [...s.values.slice(1), next] };
        })
      );
    }, 1200);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="panel relative overflow-hidden p-5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      <div className="scan-line opacity-50" />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
            Pulse
          </div>
          <h3 className="mt-1 font-display text-lg font-semibold tracking-tight">
            System Vitals
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip chip-emerald">Healthy</span>
          <span className="font-mono text-[10px] text-[color:var(--color-ink-mute)]">
            5s window
          </span>
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        {data.map((s) => (
          <SeriesCell key={s.id} s={s} />
        ))}
      </div>
    </div>
  );
}

function SeriesCell({ s }: { s: Series }) {
  const last = s.values[s.values.length - 1];
  const max = Math.max(...s.values);
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className="flex items-center justify-between">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
          {s.label}
        </div>
        <motion.div
          key={last.toFixed(0)}
          initial={{ opacity: 0.4, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="data-num text-sm font-semibold"
          style={{ color: s.color }}
        >
          {last.toFixed(0)}
        </motion.div>
      </div>
      <div className="mt-2 flex items-end gap-[2px] h-12">
        {s.values.map((v, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-sm"
            style={{ background: s.color, opacity: 0.25 + (v / max) * 0.75 }}
            initial={false}
            animate={{ height: `${(v / 100) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </div>
    </div>
  );
}
