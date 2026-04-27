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
