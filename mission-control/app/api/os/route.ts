// Real OS state for the UI — reads the structured os-state.json that the VPS
// mirror renders into the git-synced Obsidian vault. No mock data.
import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getVaultStatus } from "@/lib/vault";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const status = await getVaultStatus();
  if (!status.connected) {
    return NextResponse.json(
      { ok: false, error: status.reason, hint: status.hint ?? null },
      { status: 200 }
    );
  }
  const file = path.join(status.vaultPath, "_zorba_os", "os-state.json");
  try {
    const raw = await fs.readFile(file, "utf8");
    const state = JSON.parse(raw);
    return NextResponse.json({ ok: true, vaultPath: status.vaultPath, ...state });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error:
          "os-state.json not found yet — the VPS mirror hasn't synced. It refreshes every 30 min.",
        vaultPath: status.vaultPath,
      },
      { status: 200 }
    );
  }
}
