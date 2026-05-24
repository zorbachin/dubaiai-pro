"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookText, CircleAlert, NotebookPen, Plus, Smile, ChevronRight } from "lucide-react";
import { VoiceInput, VoiceTextarea } from "@/components/voice-field";

type JournalDay = {
  date: string;
  file: string;
  preview: string;
  entries: number;
};

type JournalEntry = { time: string; title?: string; body: string };

const today = () => new Date().toISOString().slice(0, 10);

export default function JournalPage() {
  const [days, setDays] = useState<JournalDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDate, setOpenDate] = useState<string | null>(null);
  const [openEntries, setOpenEntries] = useState<JournalEntry[]>([]);
  const [openLoading, setOpenLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState<string | null>(null);

  const loadDays = useCallback(async () => {
    try {
      const res = await fetch("/api/vault/journal", { cache: "no-store" });
      const json = await res.json();
      if (json.ok) {
        setDays(json.items);
        setError(null);
      } else {
        setError(json.error ?? "Could not load journal");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDays();
  }, [loadDays]);

  const loadDay = useCallback(async (date: string) => {
    setOpenLoading(true);
    try {
      const res = await fetch(`/api/vault/journal?date=${encodeURIComponent(date)}`, {
        cache: "no-store",
      });
      const json = await res.json();
      setOpenEntries(json.ok ? json.entries : []);
    } finally {
      setOpenLoading(false);
    }
  }, []);

  useEffect(() => {
    if (openDate) loadDay(openDate);
  }, [openDate, loadDay]);

  const save = useCallback(async () => {
    const b = body.trim();
    if (!b || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/vault/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: b,
          title: title.trim() || undefined,
          mood: mood.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error ?? "Failed");
      setSavedFlash(json.file ?? "Saved");
      setBody("");
      setTitle("");
      setMood("");
      await loadDays();
      if (openDate === today()) loadDay(today());
      setTimeout(() => setSavedFlash(null), 2400);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save entry");
    } finally {
      setSaving(false);
    }
  }, [body, title, mood, saving, loadDays, openDate, loadDay]);

  const todaysDay = days.find((d) => d.date === today());

  return (
    <div className="mx-auto max-w-[1100px] space-y-6 pt-2">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">
          <BookText className="h-3.5 w-3.5" /> Journal
        </div>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-grad-cyan">
          Today, in your own words.
        </h1>
        <p className="mt-1 text-[15px] text-[color:var(--color-ink-dim)]">
          One file per day in <code className="font-mono text-cyan-200">Agentic OS/Journal/{today()}.md</code>
        </p>
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
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br from-violet-400/30 to-cyan-400/20 blur-3xl" />
        <div className="relative">
          <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
            <NotebookPen className="h-3 w-3 text-violet-300" />
            New entry · {today()}
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px]">
            <VoiceInput
              value={title}
              setValue={setTitle}
              placeholder="Title (optional) — what is this moment about?"
            />
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 transition focus-within:border-cyan-400/40">
              <Smile className="h-4 w-4 text-[color:var(--color-ink-mute)]" />
              <input
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="Mood"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-[color:var(--color-ink-mute)]"
              />
            </div>
          </div>
          <div className="mt-3">
            <VoiceTextarea
              value={body}
              setValue={setBody}
              placeholder="Write freely, or click the mic and just talk…"
              rows={7}
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
              {savedFlash ? (
                <span className="text-emerald-300">saved → {savedFlash}</span>
              ) : (
                "appends to today's file · mic for voice"
              )}
            </div>
            <button
              onClick={save}
              disabled={!body.trim() || saving}
              className="flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-gradient-to-br from-cyan-400/20 to-violet-500/20 px-4 py-2 text-sm font-medium text-white shadow-[0_0_24px_rgba(0,229,255,0.25)] transition hover:from-cyan-400/30 hover:to-violet-500/30 disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
              {saving ? "Saving…" : "Add entry"}
            </button>
          </div>
        </div>
      </motion.section>

      {todaysDay && todaysDay.entries > 0 && (
        <section className="panel p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--color-ink-mute)]">
                Today
              </div>
              <div className="font-display text-base font-semibold tracking-tight">
                {today()} · {todaysDay.entries} {todaysDay.entries === 1 ? "entry" : "entries"}
              </div>
            </div>
            <button
              onClick={() => setOpenDate(openDate === today() ? null : today())}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-[color:var(--color-ink-dim)] hover:bg-white/[0.08] hover:text-white"
            >
              {openDate === today() ? "Hide" : "Expand"}
            </button>
          </div>
          <AnimatePresence>
            {openDate === today() && (
              <DayDetail loading={openLoading} entries={openEntries} />
            )}
          </AnimatePresence>
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold tracking-tight">Past days</h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
            {days.filter((d) => d.date !== today()).length} entries
          </span>
        </div>
        {loading ? (
          <div className="panel p-6 text-sm text-[color:var(--color-ink-mute)]">Loading…</div>
        ) : days.filter((d) => d.date !== today()).length === 0 ? (
          <div className="panel grid place-items-center p-10 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-violet-400/10 to-cyan-400/10">
              <BookText className="h-6 w-6 text-violet-300" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
              No past entries
            </h3>
            <p className="mt-1 max-w-sm text-[13px] text-[color:var(--color-ink-dim)]">
              Write your first entry above. Past days appear here once today rolls over.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {days
              .filter((d) => d.date !== today())
              .map((d) => (
                <DayRow
                  key={d.date}
                  day={d}
                  expanded={openDate === d.date}
                  entries={openDate === d.date ? openEntries : []}
                  loading={openDate === d.date && openLoading}
                  onToggle={() => setOpenDate((cur) => (cur === d.date ? null : d.date))}
                />
              ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function DayRow({
  day,
  expanded,
  entries,
  loading,
  onToggle,
}: {
  day: JournalDay;
  expanded: boolean;
  entries: JournalEntry[];
  loading: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.li
      layout
      className="panel overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-white/[0.02]"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-semibold tracking-tight">{day.date}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-mute)]">
              {day.entries} {day.entries === 1 ? "entry" : "entries"}
            </span>
          </div>
          {day.preview && (
            <div className="mt-1 line-clamp-1 text-[13px] text-[color:var(--color-ink-dim)]">
              {day.preview}
            </div>
          )}
        </div>
        <ChevronRight
          className={`h-4 w-4 shrink-0 text-[color:var(--color-ink-mute)] transition ${
            expanded ? "rotate-90" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {expanded && (
          <div className="border-t border-white/5 px-4 py-3">
            <DayDetail loading={loading} entries={entries} />
          </div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

function DayDetail({ loading, entries }: { loading: boolean; entries: JournalEntry[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
    >
      {loading ? (
        <div className="py-2 text-sm text-[color:var(--color-ink-mute)]">Loading…</div>
      ) : entries.length === 0 ? (
        <div className="py-2 text-sm text-[color:var(--color-ink-mute)]">No entries.</div>
      ) : (
        <div className="space-y-3 py-1">
          {entries.map((e, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <div className="mb-1 flex items-baseline gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300">
                  {e.time}
                </span>
                {e.title && (
                  <span className="font-display text-sm font-semibold tracking-tight">
                    {e.title}
                  </span>
                )}
              </div>
              <div className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-[color:var(--color-ink)]">
                {e.body}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
