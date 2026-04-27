import OpenAI from "openai";
import { env, flags } from "./env";
import type { AuditReport, CrawledPage, ResearchHit } from "./types";
import { buildMockReport } from "./mock-report";
import { getDomain, truncate } from "./utils";

let _client: OpenAI | null = null;
function client(): OpenAI | null {
  if (!flags.hasOpenAI) return null;
  if (_client) return _client;
  _client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  return _client;
}

const SYSTEM_PROMPT = `You are an AI implementation consultant writing audits for small-to-mid businesses.

Your job: given (a) a structured crawl of the company's website and (b) a small dossier of public web mentions, produce a *consultative, honest, sales-oriented* AI-readiness audit as JSON.

NON-NEGOTIABLE RULES:
- Never invent private or unverifiable facts (no fake revenue, headcount, funding, customers).
- Every concrete claim about the company should map back to a URL in the provided crawl/research. If you can't, mark it as 'unknowns'.
- Where the data is thin, say so plainly in the relevant field — do not pad with generalities.
- Tone: direct, founder-to-founder, useful first. No marketing fluff. No emoji.
- Recommendations must be specific enough that the founder can imagine shipping them this month.
- The 'outbound_email_copy' should read like a human peer wrote it — short, no superlatives, no "I hope this finds you well".
- 'AI_readiness_score' is an integer 0-100. 0 = no digital presence, 100 = AI is core to product.

Return STRICT JSON conforming to the provided schema. No prose outside the JSON.`;

const SCHEMA_HINT = `{
  "company_summary": "string",
  "founder_research": "string",
  "mission_positioning": "string",
  "website_observations": ["string"],
  "current_tech_stack": ["string"],
  "likely_business_model": "string",
  "AI_readiness_score": 0,
  "AI_readiness_explanation": "string",
  "top_automation_opportunities": [
    { "title": "string", "description": "string", "effort": "low|medium|high", "impact": "low|medium|high", "estimated_value": "string", "tools": ["string"] }
  ],
  "quick_wins": [
    { "title": "string", "description": "string", "effort": "low|medium|high", "impact": "low|medium|high" }
  ],
  "implementation_roadmap": [
    { "week": "string", "goal": "string", "steps": ["string"] }
  ],
  "estimated_value": {
    "range_low_usd": 0,
    "range_high_usd": 0,
    "rationale": "string"
  },
  "recommended_offer": "string",
  "outbound_email_copy": "string",
  "unknowns": ["string"],
  "citations": [{"label": "string", "url": "string"}]
}`;

interface GenerateInput {
  businessName: string;
  websiteUrl: string;
  founders?: string[];
  industry?: string;
  mainGoal: string;
  pages: CrawledPage[];
  research: ResearchHit[];
}

function buildUserPrompt(input: GenerateInput): string {
  const pages = input.pages
    .map(
      (p, i) =>
        `--- Page ${i + 1}: ${p.url} ---
Title: ${p.title || "(none)"}
Description: ${p.description || "(none)"}
Tech hints: ${p.techHints.join(", ") || "(none detected)"}
Headings:
${p.headings.slice(0, 12).map((h) => "  • " + h).join("\n") || "  (none)"}
CTAs: ${p.ctas.slice(0, 8).join(" | ") || "(none)"}
Forms: ${p.forms}
Visible text (truncated):
${truncate(p.textPreview, 1500)}`
    )
    .join("\n\n");

  const research = input.research
    .map(
      (r, i) =>
        `[${i + 1}] (${r.kind}) ${r.title || r.url}
${r.url}
${r.snippet ? truncate(r.snippet, 240) : ""}`
    )
    .join("\n\n");

  return `BUSINESS: ${input.businessName}
WEBSITE: ${input.websiteUrl}
INDUSTRY: ${input.industry || "(not provided)"}
FOUNDERS: ${input.founders?.length ? input.founders.join(", ") : "(not provided)"}
STATED GOAL: ${input.mainGoal}

=== WEBSITE CRAWL ===
${pages || "(no pages were successfully crawled — the site may be down, behind auth, or JS-rendered)"}

=== PUBLIC WEB RESEARCH ===
${research || "(no public mentions retrieved; do not invent)"}

=== TASK ===
Produce the audit JSON for "${input.businessName}". Use the crawl and research above as your only ground truth. Cite specific URLs in 'citations'. List anything you couldn't verify in 'unknowns'. JSON shape:
${SCHEMA_HINT}`;
}

export async function generateAudit(input: GenerateInput): Promise<AuditReport> {
  const c = client();
  if (!c) {
    return {
      ...buildMockReport({
        businessName: input.businessName,
        websiteUrl: input.websiteUrl,
        founders: input.founders,
        industry: input.industry
      }),
      citations: dedupeCitations([
        ...input.pages.map((p) => ({ label: getDomain(p.url) + new URL(p.url).pathname, url: p.url })),
        ...input.research.slice(0, 8).map((r) => ({ label: r.title || r.url, url: r.url }))
      ])
    };
  }

  try {
    const completion = await c.chat.completions.create({
      model: env.OPENAI_MODEL,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(input) }
      ]
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);

    const report: AuditReport = {
      generated_at: new Date().toISOString(),
      business_name: input.businessName,
      website_url: input.websiteUrl,
      company_summary: str(parsed.company_summary),
      founder_research: str(parsed.founder_research),
      mission_positioning: str(parsed.mission_positioning),
      website_observations: arr(parsed.website_observations),
      current_tech_stack: arr(parsed.current_tech_stack),
      likely_business_model: str(parsed.likely_business_model),
      AI_readiness_score: clamp(int(parsed.AI_readiness_score), 0, 100),
      AI_readiness_explanation: str(parsed.AI_readiness_explanation),
      top_automation_opportunities: (parsed.top_automation_opportunities || []).slice(0, 7),
      quick_wins: (parsed.quick_wins || []).slice(0, 5),
      implementation_roadmap: (parsed.implementation_roadmap || []).slice(0, 6),
      estimated_value: {
        range_low_usd: int(parsed.estimated_value?.range_low_usd),
        range_high_usd: int(parsed.estimated_value?.range_high_usd),
        rationale: str(parsed.estimated_value?.rationale)
      },
      recommended_offer: str(parsed.recommended_offer),
      outbound_email_copy: str(parsed.outbound_email_copy),
      unknowns: arr(parsed.unknowns),
      citations: dedupeCitations(parsed.citations || [])
    };

    // Always make sure we have *some* citations.
    if (report.citations.length === 0) {
      report.citations = [
        ...input.pages.map((p) => ({ label: getDomain(p.url) + new URL(p.url).pathname, url: p.url })),
        ...input.research.slice(0, 6).map((r) => ({ label: r.title || r.url, url: r.url }))
      ];
    }

    return report;
  } catch (err) {
    console.error("[openai] generateAudit failed, falling back to mock:", err);
    return {
      ...buildMockReport({
        businessName: input.businessName,
        websiteUrl: input.websiteUrl,
        founders: input.founders,
        industry: input.industry
      }),
      unknowns: [
        "Audit generation fell back to a baseline template (model call failed). Re-run with valid OPENAI_API_KEY for a tailored report."
      ]
    };
  }
}

// --- helpers ---
function str(v: unknown): string { return typeof v === "string" ? v : ""; }
function arr(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x) => typeof x === "string");
}
function int(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? Math.round(n) : 0;
}
function clamp(n: number, lo: number, hi: number) { return Math.min(hi, Math.max(lo, n)); }
function dedupeCitations(list: { label?: string; url?: string }[]): { label: string; url: string }[] {
  const seen = new Set<string>();
  const out: { label: string; url: string }[] = [];
  for (const c of list) {
    const url = (c.url || "").trim();
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push({ label: (c.label || url).trim(), url });
  }
  return out.slice(0, 25);
}
