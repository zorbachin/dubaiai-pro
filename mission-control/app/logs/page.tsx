"use client";

import { motion } from "framer-motion";
import { ActivityFeed } from "@/components/activity-feed";

export default function LogsPage() {
  return (
    <div className="mx-auto max-w-[1100px] space-y-6 pt-2">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">
          Stream
        </div>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-grad-cyan">
          Activity
        </h1>
        <p className="mt-1 text-[15px] text-[color:var(--color-ink-dim)]">
          Every move your fleet makes, in real time.
        </p>
      </motion.div>

      <ActivityFeed />
    </div>
  );
}
