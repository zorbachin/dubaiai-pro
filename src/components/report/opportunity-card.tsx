import type { AuditOpportunity } from "@/lib/types";

const PILL_TONE: Record<string, string> = {
  low: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
  medium: "text-gold border-gold/30 bg-gold/10",
  high: "text-orange-300 border-orange-400/30 bg-orange-400/10"
};

export function OpportunityCard({ o, index }: { o: AuditOpportunity; index?: number }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-bold">
          {typeof index === "number" ? <span className="text-muted mr-2">{String(index + 1).padStart(2, "0")}</span> : null}
          {o.title}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          <span className={"pill !px-2 " + (PILL_TONE[o.effort] ?? "")}>Effort: {o.effort}</span>
          <span className={"pill !px-2 " + (PILL_TONE[o.impact] ?? "")}>Impact: {o.impact}</span>
        </div>
      </div>
      <p className="mt-2 text-muted">{o.description}</p>
      {o.estimated_value && (
        <div className="mt-3 text-sm"><span className="h-section">Est. value</span> <span className="ml-2 text-ink">{o.estimated_value}</span></div>
      )}
      {o.tools?.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {o.tools.map((t) => (
            <span key={t} className="pill">{t}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
