"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MAIN_GOAL_LABELS, type MainGoal } from "@/lib/types";

const GOALS: MainGoal[] = [
  "save_time",
  "get_leads",
  "increase_sales",
  "reduce_admin",
  "improve_content",
  "unsure"
];

export function AuditForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      businessName: String(fd.get("businessName") || "").trim(),
      websiteUrl: String(fd.get("websiteUrl") || "").trim(),
      founders: String(fd.get("founders") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      industry: String(fd.get("industry") || "").trim() || undefined,
      contactEmail: String(fd.get("contactEmail") || "").trim(),
      mainGoal: String(fd.get("mainGoal") || "unsure")
    };
    try {
      const res = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong");
      router.push(`/audit/${data.id}/status`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="businessName">Business name *</label>
          <input id="businessName" name="businessName" required className="input" placeholder="Acme Studio" />
        </div>
        <div>
          <label className="label" htmlFor="websiteUrl">Website URL *</label>
          <input id="websiteUrl" name="websiteUrl" required className="input" placeholder="acme.com" />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="founders">Founder names <span className="text-muted">(optional, comma-separated)</span></label>
          <input id="founders" name="founders" className="input" placeholder="Jane Doe, John Smith" />
        </div>
        <div>
          <label className="label" htmlFor="industry">Industry <span className="text-muted">(optional)</span></label>
          <input id="industry" name="industry" className="input" placeholder="Real estate" />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="contactEmail">Your email *</label>
        <input id="contactEmail" name="contactEmail" type="email" required className="input" placeholder="you@company.com" />
      </div>

      <div>
        <label className="label">Main goal *</label>
        <div className="grid gap-2 md:grid-cols-3">
          {GOALS.map((g, i) => (
            <label key={g} className="flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-bg px-3 py-2.5 text-sm hover:border-accent/50">
              <input type="radio" name="mainGoal" value={g} required defaultChecked={i === 0} className="accent-accent" />
              {MAIN_GOAL_LABELS[g]}
            </label>
          ))}
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</div>}

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">
          By submitting, you agree we&apos;ll crawl public pages of the URL and store the result for review.
        </p>
        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
          {submitting ? "Queuing audit…" : "Run audit →"}
        </button>
      </div>
    </form>
  );
}
