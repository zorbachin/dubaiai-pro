"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

export function Sparkline({
  data,
  color = "#22d3ee",
  height = 36,
  fill = true,
}: {
  data: number[];
  color?: string;
  height?: number;
  fill?: boolean;
}) {
  const path = useMemo(() => {
    if (data.length === 0) return { line: "", area: "" };
    const w = 200;
    const h = height;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = w / (data.length - 1 || 1);
    const points = data.map((v, i) => [i * step, h - ((v - min) / range) * (h - 4) - 2]);
    const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(" ");
    const area = `${line} L ${w} ${h} L 0 ${h} Z`;
    return { line, area };
  }, [data, height]);

  const id = useMemo(() => `g-${Math.random().toString(36).slice(2, 8)}`, []);

  return (
    <svg viewBox={`0 0 200 ${height}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={path.area} fill={`url(#${id})`} />}
      <motion.path
        d={path.line}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0.4 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
    </svg>
  );
}
