// Cost tracking — logs every API pull with an estimated $ cost.
// Server-only (used from API routes). Ledger is a JSONL file in the app dir.
import { promises as fs } from "node:fs";
import path from "node:path";

const LEDGER = path.join(process.cwd(), ".costs.jsonl");

// Approx USD per 1M tokens {input, output}. Update as pricing changes.
const RATES: Record<string, { in: number; out: number }> = {
  "claude-opus-4-7": { in: 15, out: 75 },
  "claude-sonnet-4-6": { in: 3, out: 15 },
  "gemini-2.5-flash": { in: 0.3, out: 2.5 },
  "gemini-3-flash-preview": { in: 0.3, out: 2.5 },
  "gpt-4o": { in: 2.5, out: 10 },
  hermes: { in: 0.3, out: 2.5 }, // Hermes runs on Gemini flash on the VPS
  default: { in: 1, out: 5 },
};

export type CostEvent = {
  ts: number;
  provider: string;
  model: string;
  inTokens: number;
  outTokens: number;
  costUsd: number;
  surface: string;
};

export function estTokens(text: string): number {
  return Math.ceil((text || "").length / 4);
}

export async function logUsage(p: {
  provider: string;
  model: string;
  inputText: string;
  outputText: string;
  surface?: string;
}): Promise<void> {
  const rate = RATES[p.model] || RATES.default;
  const inTokens = estTokens(p.inputText);
  const outTokens = estTokens(p.outputText);
  const costUsd = (inTokens / 1e6) * rate.in + (outTokens / 1e6) * rate.out;
  const ev: CostEvent = {
    ts: Date.now(),
    provider: p.provider,
    model: p.model,
    inTokens,
    outTokens,
    costUsd: Number(costUsd.toFixed(6)),
    surface: p.surface || "chat",
  };
  try {
    await fs.appendFile(LEDGER, JSON.stringify(ev) + "\n", "utf8");
  } catch {
    /* never block a response on cost logging */
  }
}

export async function readLedger(): Promise<CostEvent[]> {
  try {
    const raw = await fs.readFile(LEDGER, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((l) => JSON.parse(l) as CostEvent);
  } catch {
    return [];
  }
}

export async function summary() {
  const events = await readLedger();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayTs = startOfToday.getTime();
  let total = 0;
  let today = 0;
  let calls = 0;
  const byProvider: Record<string, { calls: number; costUsd: number }> = {};
  for (const e of events) {
    total += e.costUsd;
    calls += 1;
    if (e.ts >= todayTs) today += e.costUsd;
    const bp = (byProvider[e.provider] ||= { calls: 0, costUsd: 0 });
    bp.calls += 1;
    bp.costUsd += e.costUsd;
  }
  return {
    totalUsd: Number(total.toFixed(4)),
    todayUsd: Number(today.toFixed(4)),
    calls,
    byProvider: Object.fromEntries(
      Object.entries(byProvider).map(([k, v]) => [
        k,
        { calls: v.calls, costUsd: Number(v.costUsd.toFixed(4)) },
      ])
    ),
    recent: events.slice(-20).reverse(),
  };
}
