import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireServiceClient } from "@/lib/supabase/server";
import { normaliseUrl } from "@/lib/utils";
import { flags } from "@/lib/env";
import { inngest } from "@/lib/inngest/client";
import { runAudit } from "@/lib/pipeline";
import type { MainGoal } from "@/lib/types";

export const runtime = "nodejs";

const Body = z.object({
  businessName: z.string().min(1).max(200),
  websiteUrl: z.string().min(3).max(500),
  founders: z.array(z.string()).max(10).optional(),
  industry: z.string().max(120).optional(),
  contactEmail: z.string().email(),
  mainGoal: z.enum([
    "save_time",
    "get_leads",
    "increase_sales",
    "reduce_admin",
    "improve_content",
    "unsure"
  ])
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: "Invalid input", details: String(err) }, { status: 400 });
  }

  const url = normaliseUrl(body.websiteUrl);
  if (!url) return NextResponse.json({ error: "Invalid website URL" }, { status: 400 });

  const sb = requireServiceClient();

  // Upsert company
  const { data: company } = await sb
    .from("companies")
    .upsert(
      {
        name: body.businessName,
        website_url: url,
        industry: body.industry || null,
        founders: body.founders?.length ? body.founders : null
      },
      { onConflict: "website_url" }
    )
    .select("id")
    .single();

  // Create audit
  const { data: audit, error } = await sb
    .from("audits")
    .insert({
      company_id: company?.id ?? null,
      business_name: body.businessName,
      website_url: url,
      founders: body.founders?.length ? body.founders : null,
      industry: body.industry || null,
      contact_email: body.contactEmail,
      main_goal: body.mainGoal,
      status: "queued",
      status_message: "Queued."
    })
    .select("id")
    .single();

  if (error || !audit) {
    return NextResponse.json({ error: error?.message || "Failed to create audit" }, { status: 500 });
  }

  const eventPayload = {
    auditId: audit.id,
    businessName: body.businessName,
    websiteUrl: url,
    founders: body.founders,
    industry: body.industry,
    contactEmail: body.contactEmail,
    mainGoal: body.mainGoal as MainGoal
  };

  if (flags.hasInngest) {
    await inngest.send({ name: "audit/requested", data: eventPayload });
  } else {
    // Dev/local fallback: run the pipeline in the background of this request.
    // Don't await — return the id immediately so the UI can poll.
    runAudit(eventPayload).catch((err) => console.error("[pipeline] failed:", err));
  }

  return NextResponse.json({ id: audit.id });
}
