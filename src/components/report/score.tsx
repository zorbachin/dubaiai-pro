import { AI_READINESS_LABELS, type AIReadinessBreakdown, type AIReadinessKey } from "@/lib/types";

export function ScoreBlock({
  score,
  explanation
}: {
  score: number;
  explanation: string;
}) {
  const tone =
    score >= 70 ? "text-emerald-400" : score >= 40 ? "text-gold" : "text-orange-400";
  return (
    <div className="card">
      <div className="h-section">AI readiness score</div>
      <div className="mt-3 flex items-baseline gap-3">
        <div className={`text-6xl font-bold leading-none ${tone}`}>{score}</div>
        <div className="text-muted">/100</div>
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-bg">
        <div
          className="h-full bg-accent"
          style={{ width: Math.min(100, Math.max(0, score)) + "%" }}
        />
      </div>
      <p className="mt-4 text-sm text-muted">{explanation}</p>
    </div>
  );
}

export function ScoreBreakdown({ breakdown }: { breakdown: AIReadinessBreakdown }) {
  const order: AIReadinessKey[] = [
    "website_clarity",
    "lead_capture",
    "sales_automation",
    "support_admin_automation",
    "content_seo",
    "tech_stack_readiness",
    "urgency_signals"
  ];
  return (
    <div className="card">
      <div className="h-section">Score breakdown</div>
      <ul className="mt-4 grid gap-4">
        {order.map((k) => {
          const c = breakdown[k];
          const pct = Math.round((c.score / Math.max(1, c.max)) * 100);
          const tone =
            pct >= 70 ? "bg-emerald-400" : pct >= 40 ? "bg-gold" : "bg-orange-400";
          return (
            <li key={k}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-ink">{AI_READINESS_LABELS[k]}</span>
                <span className="text-xs text-muted">
                  <span className="text-ink font-semibold">{c.score}</span>
                  <span className="text-muted"> / {c.max}</span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-bg">
                <div className={"h-full " + tone} style={{ width: pct + "%" }} />
              </div>
              {c.rationale && <p className="mt-1.5 text-xs text-muted">{c.rationale}</p>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
