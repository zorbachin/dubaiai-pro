import type { NextRequest } from "next/server";
import { appendChatMessage } from "@/lib/vault";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (
      typeof body?.agentId !== "string" ||
      typeof body?.agentName !== "string" ||
      typeof body?.model !== "string" ||
      (body?.role !== "user" && body?.role !== "assistant") ||
      typeof body?.content !== "string" ||
      body.content.trim().length === 0
    ) {
      return Response.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }
    const result = await appendChatMessage(body);
    return Response.json(result);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed";
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}
