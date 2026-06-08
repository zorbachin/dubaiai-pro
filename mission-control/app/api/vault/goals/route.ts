import type { NextRequest } from "next/server";
import { addGoal, deleteGoal, listGoals, toggleGoal } from "@/lib/vault";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const result = await listGoals();
  return Response.json(result);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (typeof body?.title !== "string" || body.title.trim().length === 0) {
      return Response.json({ ok: false, error: "Title required" }, { status: 400 });
    }
    const result = await addGoal({
      title: body.title,
      description: typeof body.description === "string" ? body.description : undefined,
    });
    return Response.json(result);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed";
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (typeof body?.id !== "string") {
      return Response.json({ ok: false, error: "id required" }, { status: 400 });
    }
    const result = await toggleGoal(body.id);
    return Response.json(result);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed";
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ ok: false, error: "id required" }, { status: 400 });
  const result = await deleteGoal(id);
  return Response.json(result);
}
