import { inngest } from "./client";
import { runAudit } from "../pipeline";
import { requireServiceClient } from "../supabase/server";

export const runAuditFn = inngest.createFunction(
  { id: "run-audit", name: "Run AI audit pipeline", retries: 2 },
  { event: "audit/requested" },
  async ({ event, step }) => {
    const data = event.data;

    await step.run("mark-crawling", async () => {
      const sb = requireServiceClient();
      await sb
        .from("audits")
        .update({ status: "crawling", status_message: "Crawling website…" })
        .eq("id", data.auditId);
    });

    await step.run("run-pipeline", async () => {
      await runAudit({
        auditId: data.auditId,
        businessName: data.businessName,
        websiteUrl: data.websiteUrl,
        founders: data.founders,
        industry: data.industry,
        contactEmail: data.contactEmail,
        mainGoal: data.mainGoal
      });
    });

    return { auditId: data.auditId, ok: true };
  }
);

export const functions = [runAuditFn];
