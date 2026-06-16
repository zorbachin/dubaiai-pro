"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "./animated-counter";
import { Sparkline } from "./sparkline";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  decimals = 0,
  suffix,
  prefix,
  delta,
  data,
  color = "#22d3ee",
  icon,
  index = 0,
}: {
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  delta?: string;
  data: number[];
  color?: string;
  icon?: ReactNode;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="panel group relative overflow-hidden p-5"
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-50 blur-2xl transition group-hover:opacity-80"
        style={{ background: `radial-gradient(circle, ${color}55, transparent 70%)` }}
      />
      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-2">
          {icon && (
            <span
              className="grid h-8 w-8 place-items-center rounded-lg border border-white/10"
              style={{ background: `${color}18`, color }}
            >
              {icon}
            </span>
          )}
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
            {label}
          </div>
        </div>
        {delta && (
          <div className="flex items-center gap-1 rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
            <ArrowUpRight className="h-3 w-3" />
            {delta}
          </div>
        )}
      </div>
      <div className="relative mt-4 text-[34px] font-semibold leading-none tracking-tight text-grad-cyan">
        <AnimatedCounter value={value} decimals={decimals} suffix={suffix} prefix={prefix} />
      </div>
      <div className="relative -mb-1 mt-3">
        <Sparkline data={data} color={color} height={42} />
      </div>
    </motion.div>
  );
}
