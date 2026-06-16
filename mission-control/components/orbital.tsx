"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AGENTS } from "@/lib/mock";
import { AgentAvatar } from "./agent-avatar";

export function Orbital() {
  const orbits = [
    { r: 90, dur: 28, agents: AGENTS.slice(0, 2) },
    { r: 144, dur: 40, agents: AGENTS.slice(2, 4) },
    { r: 198, dur: 56, agents: AGENTS.slice(4, 6) },
  ];

  return (
    <div className="panel relative aspect-[5/4] overflow-hidden p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
            Fleet Topology
          </div>
          <h3 className="mt-1 font-display text-lg font-semibold tracking-tight">
            Agent Constellation
          </h3>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="chip chip-cyan">Live</span>
          <span className="font-mono text-[10px] text-[color:var(--color-ink-mute)]">
            6 agents · 3 orbits
          </span>
        </div>
      </div>

      <div className="absolute inset-0 grid place-items-center">
        <div className="relative h-[440px] w-[440px] max-w-full">
          {orbits.map((o, idx) => (
            <div
              key={idx}
              className="absolute left-1/2 top-1/2 rounded-full border border-dashed"
              style={{
                width: o.r * 2,
                height: o.r * 2,
                marginLeft: -o.r,
                marginTop: -o.r,
                borderColor: "rgba(160,160,240,0.10)",
              }}
            />
          ))}

          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <div className="relative h-[72px] w-[72px]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 blur-xl opacity-70" />
              <div className="relative grid h-[72px] w-[72px] place-items-center rounded-full border border-white/20 bg-gradient-to-br from-white/10 to-white/0 backdrop-blur-md">
                <div className="font-display text-[15px] font-bold tracking-tight text-grad-cyan">
                  CL·
                </div>
              </div>
            </div>
          </motion.div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-14 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
            Claude · Core
          </div>

          {orbits.map((o) =>
            o.agents.map((a, i) => {
              const offset = (360 / o.agents.length) * i;
              return (
                <motion.div
                  key={a.id}
                  className="absolute left-1/2 top-1/2"
                  initial={{ rotate: offset }}
                  animate={{ rotate: offset + 360 }}
                  transition={{ duration: o.dur, repeat: Infinity, ease: "linear" }}
                  style={{ width: 0, height: 0 }}
                >
                  <div style={{ transform: `translate(${o.r}px, 0)` }}>
                    <motion.div
                      initial={{ rotate: -offset }}
                      animate={{ rotate: -offset - 360 }}
                      transition={{ duration: o.dur, repeat: Infinity, ease: "linear" }}
                      className="-translate-x-1/2 -translate-y-1/2"
                    >
                      <Link href={`/agents/${a.id}`} className="block">
                        <motion.div whileHover={{ scale: 1.1 }} className="transition">
                          <AgentAvatar agent={a} size={46} />
                          <div className="mt-1 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--color-ink-dim)]">
                            {a.name}
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })
          )}

          <motion.div
            className="absolute left-1/2 top-1/2 h-[1px] origin-left"
            style={{
              width: 220,
              background: "linear-gradient(to right, rgba(0,229,255,0.6), transparent)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
}
