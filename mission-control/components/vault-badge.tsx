"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudOff, FolderOpen } from "lucide-react";

type Status =
  | { connected: true; vaultPath: string; folder: string; folderRelative: string }
  | { connected: false; reason: string; hint?: string }
  | null;

export function VaultBadge() {
  const [status, setStatus] = useState<Status>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetch("/api/vault/status", { cache: "no-store" });
        const json = await res.json();
        if (!cancelled) setStatus(json);
      } catch {
        if (!cancelled) setStatus({ connected: false, reason: "Could not reach server." });
      }
    };
    tick();
    const i = setInterval(tick, 12000);
    return () => {
      cancelled = true;
      clearInterval(i);
    };
  }, []);

  const connected = status?.connected === true;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        title={connected ? "Vault connected" : "Vault disconnected"}
        className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition ${
          connected
            ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200/90 hover:bg-emerald-400/15"
            : "border-rose-400/30 bg-rose-400/10 text-rose-200/90 hover:bg-rose-400/15"
        }`}
      >
        {connected ? <FolderOpen className="h-3.5 w-3.5" /> : <CloudOff className="h-3.5 w-3.5" />}
        <span className="hidden md:inline">{connected ? "Vault synced" : "Vault offline"}</span>
      </button>
      <AnimatePresence>
        {open && status && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full z-40 mt-2 w-80 rounded-xl border border-white/10 bg-[color:var(--color-bg-elevated)]/95 p-4 shadow-[0_24px_64px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            {status.connected ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="relative inline-flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300">
                    Obsidian connected
                  </span>
                </div>
                <div className="mt-2 text-[13px] text-[color:var(--color-ink)]">
                  Auto-saving to <span className="font-mono text-cyan-200">{status.folderRelative}</span>
                </div>
                <div className="mt-1 break-all font-mono text-[11px] text-[color:var(--color-ink-mute)]">
                  {status.folder}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Chats", sub: "daily · per agent" },
                    { label: "Goals", sub: "checkbox list" },
                    { label: "Journal", sub: "one file / day" },
                  ].map((b) => (
                    <div
                      key={b.label}
                      className="rounded-lg border border-white/10 bg-white/[0.03] py-2"
                    >
                      <div className="text-[11px] font-medium text-white">{b.label}</div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--color-ink-mute)]">
                        {b.sub}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-rose-300">
                    Vault offline
                  </span>
                </div>
                <div className="mt-2 text-[13px] text-[color:var(--color-ink)]">
                  {status.reason}
                </div>
                {status.hint && (
                  <div className="mt-2 break-all rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 font-mono text-[11px] text-[color:var(--color-ink-dim)]">
                    {status.hint}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
