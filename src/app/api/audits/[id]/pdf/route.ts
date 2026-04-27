import { NextRequest, NextResponse } from "next/server";
import { requireServiceClient } from "@/lib/supabase/server";
import { renderAuditPdf } from "@/lib/pdf";
import type { AuditReport } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sb = requireServiceClient();
  const { data, error } = await sb
    .from("audits")
    .select("id, business_name, report, status")
    .eq("id", id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data || data.status !== "complete" || !data.report)
    return NextResponse.json({ error: "Audit not ready" }, { status: 404 });

  const buf = await renderAuditPdf(data.report as AuditReport);
  const filename = sanitize(`AI-audit-${data.business_name}.pdf`);
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store"
    }
  });
}

function sanitize(s: string) {
  return s.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 120);
}
