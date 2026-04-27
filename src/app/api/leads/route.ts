import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const Body = z.object({
  auditId: z.string().uuid().optional(),
  email: z.string().email(),
  name: z.string().max(120).optional(),
  phone: z.string().max(40).optional(),
  message: z.string().max(2000).optional(),
  source: z.string().max(40).optional()
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: "Invalid input", details: String(err) }, { status: 400 });
  }

  const sb = requireServiceClient();
  const { data, error } = await sb
    .from("leads")
    .insert({
      audit_id: body.auditId ?? null,
      email: body.email,
      name: body.name ?? null,
      phone: body.phone ?? null,
      message: body.message ?? null,
      source: body.source ?? "report-cta"
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id, ok: true });
}
