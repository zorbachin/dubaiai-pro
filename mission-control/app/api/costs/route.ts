import { NextResponse } from "next/server";
import { summary } from "@/lib/cost";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true, ...(await summary()) });
}
