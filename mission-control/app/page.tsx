"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ScrollText, Target, Flame, Radar, ArrowRight, ChevronDown, Inbox, FileText } from "lucide-react";

type OsTask = { id: string; kind?: string; awaiting?: string; title: string; venture?: string };
type Morning = { date?: string; parsha?: string; parsha_ref?: string; torah_insight?: string; inspiration?: string };
type Scout = { items?: { name: string; what: string; verdict: string }[] };
type XPulse = { items?: { title: string; why: string; url?: string }[] };
type OsState = { tasks?: OsTask[]; daily_brief?: string; morning?: Morning; scout?: Scout; x_pulse?: XPulse };

const rise = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.55 },
  transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

const lineVar = {
  hidden: { opacity: 0, y: 44, filter: "blur(12px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring" as const, damping: 13, stiffness: 170 } },
};

function CountUp({ to }: { to: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1000;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const delay = setTimeout(() => (raf = requestAnimationFrame(tick)), 500);
    return () => {
      clearTimeout(delay);
      cancelAnimationFrame(raf);
    };
  }, [to]);
  return <span className="data-num">{n}</span>;
}

function Beat({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`flex min-h-full snap-start snap-always flex-col items-center justify-center px-6 py-16 text-center ${className}`}>
      {children}
    </section>
  );
}

export default function Scroll() {
  const [os, setOs] = useState<OsState | null>(null);
  const [hour, setHour] = useState(9);

  useEffect(() => {
    setHour(new Date().getHours());
    fetch("/api/os").then((r) => r.json()).then(setOs).catch(() => {});
  }, []);

  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const isMorning = hour < 12;
  const m = os?.morning ?? {};
  const tasks = os?.tasks ?? [];
  const drafts = tasks.filter((t) => t.kind === "draft");
  const awaitingYou = tasks.filter((t) => /you|me/i.test(t.awaiting || ""));
  const focus = (os?.daily_brief || "")
    .split("\n")
    .filter((l) => l.trim().startsWith("- "))
    .map((l) => l.replace(/^[-\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 3);
  const scoutTop = (os?.scout?.items ?? []).filter((i) => i.verdict !== "watch").slice(0, 3);
  const xItems = (os?.x_pulse?.items ?? []).slice(0, 4);

  return (
    <div className="relative -mx-6 -mt-4 lg:-mx-10">
      {/* ambient drifting glow */}
      <motion.div
        aria-hidden
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none fixed left-1/4 top-1/4 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-600/15 blur-[120px]"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none fixed right-1/4 bottom-1/4 h-[380px] w-[380px] rounded-full bg-gradient-to-br from-fuchsia-500/15 to-amber-500/10 blur-[120px]"
      />

      <div className="relative h-[calc(100dvh-58px)] snap-y snap-mandatory overflow-y-auto overflow-x-hidden scroll-smooth">
        {/* 1 — Greeting (cinematic ignition) */}
        <Beat>
          {/* one-time light bloom behind the name */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: [0, 0.6, 0.28], scale: [0.3, 1.5, 1.15] }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.4),rgba(124,58,237,0.2)_45%,transparent_70%)] blur-2xl"
          />
          {/* light sweep across the name */}
          <motion.div
            aria-hidden
            initial={{ x: "-130%", opacity: 0 }}
            animate={{ x: "130%", opacity: [0, 0.7, 0] }}
            transition={{ duration: 1.3, delay: 0.7, ease: "easeInOut" }}
            className="pointer-events-none absolute top-1/2 h-40 w-1/3 -translate-y-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-xl"
          />
          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.16, delayChildren: 0.12 } } }}
            initial="hidden"
            animate="show"
            className="relative"
          >
            <motion.div variants={lineVar} className="font-mono text-[11px] uppercase tracking-[0.4em] text-cyan-300/80">
              {m.date || "Today"}
            </motion.div>
            <h1 className="mt-6 font-display text-[44px] font-semibold leading-[1.04] tracking-tight sm:text-[72px]">
              <motion.span variants={lineVar} className="block text-grad-cyan">{greeting},</motion.span>
              <motion.span variants={lineVar} className="block text-white">Zorba.</motion.span>
            </h1>
            <motion.div variants={lineVar} className="mt-8 font-mono text-[12px] uppercase tracking-[0.25em] text-[color:var(--color-ink-mute)]">
              <CountUp to={awaitingYou.length} /> awaiting · <CountUp to={drafts.length} /> drafts ready
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8"
          >
            <motion.div
              animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="text-[color:var(--color-ink-mute)]"
            >
              <ChevronDown className="h-6 w-6" />
            </motion.div>
          </motion.div>
        </Beat>

        {/* 2 — Inspiration */}
        {m.inspiration && (
          <Beat>
            <motion.p {...rise} className="mx-auto max-w-2xl font-display text-[30px] font-light leading-[1.3] tracking-tight text-white/90 sm:text-[44px]">
              &ldquo;{m.inspiration}&rdquo;
            </motion.p>
          </Beat>
        )}

        {/* 3 — Torah (morning) */}
        {isMorning && m.torah_insight && (
          <Beat>
            <motion.div {...rise} className="mx-auto max-w-2xl">
              <div className="flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-amber-300/90">
                <ScrollText className="h-4 w-4" /> Parshat {m.parsha}
              </div>
              {m.parsha_ref && <div className="mt-1 font-mono text-[10px] tracking-[0.2em] text-[color:var(--color-ink-mute)]">{m.parsha_ref}</div>}
              <p className="mt-7 text-[19px] font-light leading-relaxed text-white/85 sm:text-[24px]">{m.torah_insight}</p>
            </motion.div>
          </Beat>
        )}

        {/* 4 — Today's focus */}
        <Beat>
          <motion.div {...rise} className="mx-auto w-full max-w-xl">
            <div className="flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-300/80">
              <Target className="h-4 w-4" /> Today
            </div>
            <div className="mt-8 space-y-4">
              {focus.length === 0 && <p className="text-[20px] font-light text-white/80">Clear runway. Nothing waiting on you.</p>}
              {focus.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.6 }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className="text-[22px] font-light leading-snug text-white/90 sm:text-[27px]"
                >
                  {f}
                </motion.div>
              ))}
            </div>
            <Link href="/tasks" className="mt-10 inline-flex items-center gap-2 text-[14px] text-cyan-300 transition hover:text-cyan-200">
              See all tasks <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </Beat>

        {/* 5 — Hot on X */}
        {xItems.length > 0 && (
          <Beat>
            <motion.div {...rise} className="mx-auto w-full max-w-xl">
              <div className="flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-rose-300/90">
                <Flame className="h-4 w-4" /> Moving now · for you
              </div>
              <div className="mt-8 space-y-4 text-left">
                {xItems.map((x, i) => (
                  <motion.a
                    key={i}
                    href={x.url || "#"}
                    target={x.url ? "_blank" : undefined}
                    rel="noreferrer"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="block border-l-2 border-rose-400/40 pl-4 transition hover:border-rose-400"
                  >
                    <div className="text-[17px] font-medium leading-snug text-white">{x.title}</div>
                    <div className="mt-1 text-[13px] leading-relaxed text-[color:var(--color-ink-dim)]">{x.why}</div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </Beat>
        )}

        {/* 6 — Build better */}
        {scoutTop.length > 0 && (
          <Beat>
            <motion.div {...rise} className="mx-auto w-full max-w-xl">
              <div className="flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-violet-300/90">
                <Radar className="h-4 w-4" /> Build better
              </div>
              <div className="mt-8 space-y-5 text-left">
                {scoutTop.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[18px] font-medium text-white">{s.name}</span>
                      <span className={`chip ${s.verdict === "adopt now" ? "chip-emerald" : "chip-amber"}`}>{s.verdict}</span>
                    </div>
                    <div className="mt-1 text-[13px] leading-relaxed text-[color:var(--color-ink-dim)]">{s.what}</div>
                  </motion.div>
                ))}
              </div>
              <Link href="/scout" className="mt-9 inline-flex items-center gap-2 text-[14px] text-cyan-300 transition hover:text-cyan-200">
                Open Automation Scout <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </Beat>
        )}

        {/* 7 — Enter */}
        <Beat>
          <motion.div {...rise} className="mx-auto max-w-md">
            <h2 className="font-display text-[34px] font-semibold tracking-tight text-white sm:text-[44px]">Ready when you are.</h2>
            <div className="mt-6 flex items-center justify-center gap-5 text-[13px] text-[color:var(--color-ink-dim)]">
              <span className="inline-flex items-center gap-1.5"><Inbox className="h-4 w-4 text-amber-300" /> {awaitingYou.length} to act</span>
              <span className="inline-flex items-center gap-1.5"><FileText className="h-4 w-4 text-emerald-300" /> {drafts.length} to send</span>
            </div>
            <Link
              href="/tasks"
              className="mt-9 inline-flex items-center gap-2 rounded-2xl border border-cyan-400/40 bg-gradient-to-br from-cyan-400/25 to-violet-500/20 px-7 py-4 text-[16px] font-medium text-white shadow-[0_0_30px_rgba(0,229,255,0.25)] transition active:scale-95 hover:from-cyan-400/35"
            >
              Enter the OS <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </Beat>
      </div>
    </div>
  );
}
