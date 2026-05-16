"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const STAGES = ["queued", "crawling", "researching", "generating", "complete"] as const;
type Stage = (typeof STAGES)[number] | "failed";

const STAGE_COPY: Record<Stage, string> = {
  queued: "Queueing your audit…",
  crawling: "Reading homepage, about, pricing, blog and contact pages…",
  researching: "Searching the public web for company, founders, press…",
  generating: "Synthesising the report…",
  complete: "Done — opening your report.",
  failed: "Something went wrong."
};

export default function StatusPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<Stage>("queued");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      try {
        const res = await fetch(`/api/audits/${params.id}`, { cache: "no-store" });
        const data = await res.json();
        if (!alive) return;
        setStatus(data.status as Stage);
        setMessage(data.status_message || "");
        if (data.status === "complete") {
          router.replace(`/audit/${params.id}`);
        } else if (data.status === "failed") {
          setError(data.error || "Audit failed.");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Network error");
      }
    };
    tick();
    const id = setInterval(tick, 2500);
    return () => { alive = false; clearInterval(id); };
  }, [params.id, router]);

  const stepIndex = Math.max(0, STAGES.indexOf(status as typeof STAGES[number]));
  const pct = status === "complete" ? 100 : Math.min(95, (stepIndex + 1) * 22);

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <span className="pill-accent">In progress</span>
      <h1 className="mt-3 font-display text-3xl font-bold">Building your AI audit…</h1>
      <p className="mt-2 text-muted">{message || STAGE_COPY[status]}</p>

      <div className="mt-8 card">
        <div className="h-2 w-full overflow-hidden rounded-full bg-bg">
          <div className="h-full bg-accent transition-all duration-500" style={{ width: pct + "%" }} />
        </div>
        <ol className="mt-5 grid gap-2 text-sm">
          {STAGES.slice(0, 4).map((s, i) => {
            const done = i < stepIndex || status === "complete";
            const active = i === stepIndex && status !== "complete";
            return (
              <li key={s} className="flex items-center gap-3">
                <span
                  className={
                    "inline-flex h-5 w-5 items-center justify-center rounded-full border " +
                    (done
                      ? "border-accent bg-accent text-white"
                      : active
                      ? "border-accent text-accent animate-pulse"
                      : "border-line text-muted")
                  }
                >
                  {done ? "✓" : i + 1}
                </span>
                <span className={done || active ? "text-ink" : "text-muted"}>{STAGE_COPY[s]}</span>
              </li>
            );
          })}
        </ol>

        {error && (
          <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}
      </div>

      <p className="mt-6 text-xs text-muted">
        You can leave this page open. The report URL will also be emailed to you when it&apos;s ready.
      </p>
    </div>
  );
}
