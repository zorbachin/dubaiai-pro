"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

export function AnimatedCounter({
  value,
  decimals = 0,
  suffix = "",
  prefix = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) =>
    v.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );

  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [mv, value]);

  return (
    <span className="data-num inline-flex items-baseline">
      {prefix && <span className="text-[color:var(--color-ink-mute)] mr-0.5">{prefix}</span>}
      <motion.span>{rounded}</motion.span>
      {suffix && <span className="ml-1 text-sm text-[color:var(--color-ink-mute)]">{suffix}</span>}
    </span>
  );
}
