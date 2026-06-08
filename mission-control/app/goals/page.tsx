"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Target, Trash2, CircleAlert, Sparkles } from "lucide-react";
import { VoiceInput, VoiceTextarea } from "@/components/voice-field";

type Goal = {
  id: string;
  done: boolean;
  title: string;
  description?: string;
  created?: string;
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "done">("active");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/vault/goals", { cache: "no-store" });
      const json = await res.json();
      if (json.ok) {
        setGoals(json.items);
        setError(null);
      } else {
        setError(json.error ?? "Could not load goals");
        setGoals([]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(async () => {
    const t = title.trim();
    if (!t || adding) return;
    setAdding(true);
    const optimisticId = `pending-${Date.now()}`;
    const optimistic: Goal = {
      id: optimisticId,
      done: false,
      title: t,
      description: description.trim() || undefined,
      created: new Date().toISOString().slice(0, 10),
    };
    setGoals((g) => [...g, optimistic]);
    setTitle("");
    setDescription("");
    try {
      const res = await fetch("/api/vault/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: t, description: description.trim() || undefined }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error ?? "Failed");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save goal");
      setGoals((g) => g.filter((x) => x.id !== optimisticId));
    } finally {
      setAdding(false);
    }
  }, [title, description, adding, load]);

  const toggle = useCallback(
    async (id: string) => {
      setGoals((g) => g.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
      try {
        const res = await fetch("/api/vault/goals", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const json = await res.json();
        if (!json.ok) throw new Error(json.error ?? "Failed");
      } catch {
        // revert
        setGoals((g) => g.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
      }
    },
    []
  );

  const remove = useCallback(
    async (id: string) => {
      const prev = goals;
      setGoals((g) => g.filter((x) => x.id !== id));
      try {
        await fetch(`/api/vault/goals?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      } catch {
        setGoals(prev);
      }
    },
    [goals]
  );

  const filtered = useMemo(() => {
    if (filter === "all") return goals;
    if (filter === "active") return goals.filter((g) => !g.done);
    return goals.filter((g) => g.done);
  }, [goals, filter]);

  const completion = goals.length
    ? Math.round((goals.filter((g) => g.done).length / goals.length) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-[1080px] space-y-6 pt-2">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">
            <Target className="h-3.5 w-3.5" /> Goals
          </div>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-grad-cyan">
            What are we shipping?
          </h1>
          <p className="mt-1 text-[15px] text-[color:var(--color-ink-dim)]">
            Saved as a checkbox task list in your vault: <code className="font-mono text-cyan-200">Agentic OS/Goals.md</code>
          </p>
        </div>
        <div className="flex items-center gap-3 text-right">
          <div>
            <div className="font-display text-3xl font-semibold tracking-tight text-grad-cyan data-num">
              {completion}%
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
              done · {goals.filter((g) => g.done).length} / {goals.length}
            </div>
          </div>
        </div>
      </motion.div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          <CircleAlert className="h-4 w-4" />
          {error}
        </div>
      )}

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="panel relative overflow-hidden p-5"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br from-cyan-400/30 to-violet-500/20 blur-3xl" />
        <div className="relative">
          <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
            <Sparkles className="h-3 w-3 text-cyan-300" />
            New goal
          </div>
          <VoiceInput
            value={title}
            setValue={setTitle}
            placeholder="A clear, specific outcome…"
            autoFocus
            onSubmit={add}
          />
          <div className="mt-3">
            <VoiceTextarea
              value={description}
              setValue={setDescription}
              placeholder="Optional context — why this matters, how you'll know it's done…"
              rows={3}
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
              ↵ to add · mic for voice
            </span>
            <button
              onClick={add}
              disabled={!title.trim() || adding}
              className="flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-gradient-to-br from-cyan-400/20 to-violet-500/20 px-4 py-2 text-sm font-medium text-white shadow-[0_0_24px_rgba(0,229,255,0.25)] transition hover:from-cyan-400/30 hover:to-violet-500/30 disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
              Add goal
            </button>
          </div>
        </div>
      </motion.section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {(["active", "done", "all"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`chip transition ${
                  filter === f ? "border-white/30 !text-white" : ""
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
            {filtered.length} {filtered.length === 1 ? "goal" : "goals"}
          </span>
        </div>

        {loading ? (
          <div className="panel p-6 text-sm text-[color:var(--color-ink-mute)]">Loading…</div>
        ) : filtered.length === 0 ? (
          <EmptyGoals filter={filter} />
        ) : (
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {filtered.map((g) => (
                <GoalRow key={g.id} goal={g} onToggle={toggle} onDelete={remove} />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </section>
    </div>
  );
}

function GoalRow({
  goal,
  onToggle,
  onDelete,
}: {
  goal: Goal;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group panel relative overflow-hidden p-4 transition hover:border-white/20"
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(goal.id)}
          className={`relative grid h-6 w-6 shrink-0 place-items-center rounded-md border transition ${
            goal.done
              ? "border-emerald-400/60 bg-gradient-to-br from-emerald-400/40 to-cyan-400/30 text-white shadow-[0_0_18px_rgba(52,211,153,0.4)]"
              : "border-white/15 bg-white/[0.03] hover:border-cyan-400/40 hover:bg-cyan-400/10"
          }`}
          aria-label={goal.done ? "Mark as not done" : "Mark as done"}
        >
          <AnimatePresence>
            {goal.done && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <div className="min-w-0 flex-1">
          <div
            className={`text-[15px] leading-tight transition ${
              goal.done
                ? "text-[color:var(--color-ink-mute)] line-through"
                : "text-[color:var(--color-ink)]"
            }`}
          >
            {goal.title}
          </div>
          {goal.description && (
            <div className="mt-1 whitespace-pre-wrap text-[13px] leading-relaxed text-[color:var(--color-ink-dim)]">
              {goal.description}
            </div>
          )}
          <div className="mt-1.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
            {goal.created && <span>created {goal.created}</span>}
            <span className="opacity-60">·</span>
            <span>id {goal.id}</span>
          </div>
        </div>

        <button
          onClick={() => onDelete(goal.id)}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-transparent text-[color:var(--color-ink-mute)] opacity-0 transition hover:border-rose-400/30 hover:bg-rose-400/10 hover:text-rose-200 group-hover:opacity-100"
          title="Delete goal"
          aria-label="Delete goal"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.li>
  );
}

function EmptyGoals({ filter }: { filter: "all" | "active" | "done" }) {
  return (
    <div className="panel grid place-items-center p-10 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-400/10 to-violet-500/10">
        <Target className="h-6 w-6 text-cyan-300" />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
        {filter === "done" ? "Nothing closed yet" : "No goals yet"}
      </h3>
      <p className="mt-1 max-w-sm text-[13px] text-[color:var(--color-ink-dim)]">
        {filter === "done"
          ? "Tick a goal above and it lands here."
          : "Add one above. They sync straight into your Obsidian vault as a checkbox task list."}
      </p>
    </div>
  );
}
