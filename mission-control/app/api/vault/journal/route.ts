import type { NextRequest } from "next/server";
import { appendJournal, listJournalDays, readJournalDay } from "@/lib/vault";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const date = url.searchParams.get("date");
  if (date) {
    const result = await readJournalDay(date);
    return Response.json(result);
  }
  const result = await listJournalDays();
  return Response.json(result);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (typeof body?.body !== "string" || body.body.trim().length === 0) {
      return Response.json({ ok: false, error: "Entry body required" }, { status: 400 });
    }
    const result = await appendJournal({
      body: body.body,
      title: typeof body.title === "string" ? body.title : undefined,
      mood: typeof body.mood === "string" ? body.mood : undefined,
    });
    return Response.json(result);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed";
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}
