import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireServiceClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";

export const runtime = "nodejs";

const COOKIE = "dubaiai_admin";

async function isAuthed(): Promise<boolean> {
  if (!env.ADMIN_PASSWORD) return false;
  const c = await cookies();
  return c.get(COOKIE)?.value === env.ADMIN_PASSWORD;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }
  const { id } = await params;
  const fd = await req.formData();
  const next = String(fd.get("featured") || "") === "true";

  const sb = requireServiceClient();
  const { error } = await sb
    .from("audits")
    .update({
      is_featured: next,
      featured_at: next ? new Date().toISOString() : null
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.redirect(new URL("/admin", req.url), { status: 303 });
}
