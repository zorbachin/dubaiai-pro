// End-to-end audit pipeline: crawl → research → generate → persist → email.
// Called from the Inngest function, AND directly from the API route as a
// fallback when Inngest isn't configured (so the dev experience still works).

import { crawlSite } from "./crawler";
import { gatherResearch } from "./research";
import { generateAudit } from "./openai";
import { sendAuditEmail } from "./resend";
import { requireServiceClient } from "./supabase/server";
import type { MainGoal, AuditReport } from "./types";

export interface RunAuditInput {
  auditId: string;
  businessName: string;
  websiteUrl: string;
  founders?: string[];
  industry?: string;
  contactEmail: string;
  mainGoal: MainGoal;
  skipEmail?: boolean;     // case-study seeds shouldn't trigger sends
}

export async function runAudit(input: RunAuditInput): Promise<AuditReport> {
  const sb = requireServiceClient();

  async function setStatus(status: string, message?: string) {
    await sb
      .from("audits")
      .update({ status, status_message: message ?? null })
      .eq("id", input.auditId);
  }

  try {
    // 1. Crawl
    await setStatus("crawling", "Reading homepage, about, pricing, blog, contact…");
    const pages = await crawlSite(input.websiteUrl);

    // Persist crawl as sources
    if (pages.length) {
      await sb.from("sources").insert(
        pages.map((p) => ({
          audit_id: input.auditId,
          kind: "crawl",
          title: p.title || null,
          url: p.url,
          snippet: p.description || null
        }))
      );
    }

    // 2. Research
    await setStatus("researching", "Searching public web for company, founders, press…");
    const research = await gatherResearch({
      businessName: input.businessName,
      websiteUrl: input.websiteUrl,
      founders: input.founders,
      industry: input.industry
    });
    if (research.length) {
      await sb.from("sources").insert(
        research.map((r) => ({
          audit_id: input.auditId,
          kind: r.kind,
          title: r.title || null,
          url: r.url,
          snippet: r.snippet || null
        }))
      );
    }

    // 3. Generate
    await setStatus("generating", "Synthesising the audit…");
    const report = await generateAudit({
      businessName: input.businessName,
      websiteUrl: input.websiteUrl,
      founders: input.founders,
      industry: input.industry,
      mainGoal: input.mainGoal,
      pages,
      research
    });

    // 4. Persist
    await sb
      .from("audits")
      .update({
        report,
        ai_readiness_score: report.AI_readiness_score,
        status: "complete",
        status_message: "Done.",
        completed_at: new Date().toISOString()
      })
      .eq("id", input.auditId);

    await persistReportSections(input.auditId, report);

    // 5. Email
    if (!input.skipEmail && input.contactEmail) {
      await sendAuditEmail({
        toUser: input.contactEmail,
        auditId: input.auditId,
        report
      });
    }

    return report;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await sb
      .from("audits")
      .update({
        status: "failed",
        status_message: "Audit failed.",
        error: message
      })
      .eq("id", input.auditId);
    throw err;
  }
}

async function persistReportSections(auditId: string, report: AuditReport) {
  const sb = requireServiceClient();
  // wipe then insert (idempotent re-runs)
  await sb.from("report_sections").delete().eq("audit_id", auditId);

  const sections: { key: string; title: string; content: unknown; order_idx: number }[] = [
    { key: "executive_summary", title: "Executive summary", content: { text: report.company_summary }, order_idx: 0 },
    { key: "what_business_does", title: "What the business appears to do", content: { text: report.likely_business_model, mission: report.mission_positioning }, order_idx: 1 },
    { key: "tech_maturity", title: "Current digital / tech maturity", content: { stack: report.current_tech_stack, observations: report.website_observations }, order_idx: 2 },
    { key: "ai_readiness", title: "AI readiness score", content: { score: report.AI_readiness_score, explanation: report.AI_readiness_explanation }, order_idx: 3 },
    { key: "top_opportunities", title: "Top 5 AI implementation opportunities", content: { items: report.top_automation_opportunities }, order_idx: 4 },
    { key: "quick_wins", title: "3 quick wins", content: { items: report.quick_wins }, order_idx: 5 },
    { key: "roadmap", title: "30-day roadmap", content: { items: report.implementation_roadmap }, order_idx: 6 },
    { key: "estimated_value", title: "Estimated ROI range", content: report.estimated_value, order_idx: 7 },
    { key: "next_step", title: "Suggested next step", content: { text: report.recommended_offer }, order_idx: 8 }
  ];

  await sb.from("report_sections").insert(
    sections.map((s) => ({ audit_id: auditId, ...s, content: s.content as object }))
  );
}
