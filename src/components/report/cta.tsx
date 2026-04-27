"use client";

import { useState } from "react";

export function ReportCTA({ auditId, businessName }: { auditId: string; businessName: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditId,
          email: String(fd.get("email") || ""),
          name: String(fd.get("name") || ""),
          message: String(fd.get("message") || "")
        })
      });
      if (!res.ok) throw new Error((await res.json())?.error || "Failed");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="card border-accent/40 bg-accent/5">
        <h3 className="font-display text-xl font-bold">Got it — we&apos;ll reach out within 24 hours.</h3>
        <p className="mt-1 text-muted">
          We&apos;ll send a tailored implementation plan for {businessName} based on this audit and book a 20-minute call to walk you through it.
        </p>
      </div>
    );
  }

  return (
    <div className="card border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="pill-gold">Suggested next step</span>
          <h3 className="mt-3 font-display text-2xl font-bold">Request the implementation plan.</h3>
          <p className="mt-1 text-muted">
            We&apos;ll turn this audit into a fixed-price 30-day sprint for {businessName} — scoped, priced, and shippable.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-5 grid gap-3 md:grid-cols-2">
        <input name="name" placeholder="Your name" className="input" required />
        <input name="email" type="email" placeholder="Email" className="input" required />
        <textarea
          name="message"
          placeholder="Anything you'd like us to focus on? (optional)"
          rows={3}
          className="input md:col-span-2"
        />
        {error && <div className="md:col-span-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</div>}
        <div className="flex items-center justify-between md:col-span-2">
          <p className="text-xs text-muted">No spam — we reply by hand.</p>
          <button disabled={submitting} className="btn-primary">
            {submitting ? "Sending…" : "Request Implementation Plan →"}
          </button>
        </div>
      </form>
    </div>
  );
}
