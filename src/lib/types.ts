// Shared types for the audit pipeline.

export type MainGoal =
  | "save_time"
  | "get_leads"
  | "increase_sales"
  | "reduce_admin"
  | "improve_content"
  | "unsure";

export const MAIN_GOAL_LABELS: Record<MainGoal, string> = {
  save_time: "Save time",
  get_leads: "Get leads",
  increase_sales: "Increase sales",
  reduce_admin: "Reduce admin",
  improve_content: "Improve content",
  unsure: "Not sure yet"
};

export type AuditStatus =
  | "queued"
  | "crawling"
  | "researching"
  | "generating"
  | "complete"
  | "failed";

export interface CrawledPage {
  url: string;
  status: number;
  title?: string;
  description?: string;
  headings: string[];
  textPreview: string;       // truncated visible text
  ctas: string[];
  forms: number;
  links: { href: string; text: string }[];
  techHints: string[];       // detected from HTML
}

export interface ResearchHit {
  kind: "crawl" | "search" | "press" | "social" | "review" | "other";
  title?: string;
  url: string;
  snippet?: string;
}

export interface AuditOpportunity {
  title: string;
  description: string;
  effort: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  estimated_value?: string;
  tools?: string[];
}

export interface RoadmapItem {
  week: string;              // "Week 1", "Week 2-3", etc.
  goal: string;
  steps: string[];
}

export interface CompanyClassification {
  industry: string;          // e.g. "Real estate brokerage"
  business_model: string;    // e.g. "Service-based, retainer + commission"
  customer_type: string;     // e.g. "B2C: high-net-worth investors in MENA"
  bottlenecks: string[];     // suspected operational bottlenecks
}

export const AI_READINESS_WEIGHTS = {
  website_clarity: 15,
  lead_capture: 15,
  sales_automation: 20,
  support_admin_automation: 15,
  content_seo: 15,
  tech_stack_readiness: 10,
  urgency_signals: 10
} as const;

export type AIReadinessKey = keyof typeof AI_READINESS_WEIGHTS;

export interface AIReadinessCategory {
  score: number;             // 0..max
  max: number;               // weight
  rationale: string;
}

export type AIReadinessBreakdown = Record<AIReadinessKey, AIReadinessCategory>;

export const AI_READINESS_LABELS: Record<AIReadinessKey, string> = {
  website_clarity: "Website clarity",
  lead_capture: "Lead capture",
  sales_automation: "Sales automation potential",
  support_admin_automation: "Support / admin automation potential",
  content_seo: "Content / SEO opportunity",
  tech_stack_readiness: "Tech stack readiness",
  urgency_signals: "Founder / business urgency signals"
};

export interface AuditReport {
  generated_at: string;
  business_name: string;
  website_url: string;

  company_summary: string;
  founder_research: string;
  mission_positioning: string;
  website_observations: string[];
  current_tech_stack: string[];
  likely_business_model: string;

  classification: CompanyClassification;

  AI_readiness_score: number;       // sum of breakdown sub-scores; 0-100
  AI_readiness_explanation: string;
  ai_readiness_breakdown: AIReadinessBreakdown;

  top_automation_opportunities: AuditOpportunity[];
  quick_wins: AuditOpportunity[];
  implementation_roadmap: RoadmapItem[];

  estimated_value: {
    range_low_usd: number;
    range_high_usd: number;
    rationale: string;
  };

  recommended_offer: string;        // suggested next step / offer
  outbound_email_copy: string;      // ready-to-send sales email

  unknowns: string[];               // things explicitly not verified
  citations: { label: string; url: string }[];
}

export interface AuditRow {
  id: string;
  business_name: string;
  website_url: string;
  contact_email: string;
  founders: string[] | null;
  industry: string | null;
  main_goal: MainGoal;
  status: AuditStatus;
  status_message: string | null;
  ai_readiness_score: number | null;
  report: AuditReport | null;
  error: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}
