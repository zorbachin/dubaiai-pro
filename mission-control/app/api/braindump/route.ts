// Brain dump -> auto-route. Saves the dump to the vault and sends it to the
// Hermes orchestrator on the VPS, which classifies it to ventures, does safe
// work, and gates the rest. Returns Hermes's short routing confirmation.
import type { NextRequest } from "next/server";
import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getVaultStatus } from "@/lib/vault";
import { logUsage } from "@/lib/cost";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function b64(s: string) {
  return Buffer.from(s, "utf8").toString("base64");
}

function ssh(remoteCmd: string): Promise<string> {
  const host = process.env.VPS_HOST;
  const user = process.env.VPS_USER || "root";
  const keyPath = (process.env.VPS_SSH_KEY || "~/.ssh/zorba_vps").replace(/^~/, process.env.HOME || "");
  if (!host) return Promise.reject(new Error("VPS_HOST not set."));
  return new Promise((resolve, reject) => {
    execFile(
      "ssh",
      ["-i", keyPath, "-o", "StrictHostKeyChecking=no", "-o", "ConnectTimeout=15", `${user}@${host}`, remoteCmd],
      { timeout: 150000, maxBuffer: 1024 * 1024 },
      (err, stdout) => {
        const out = (stdout || "").trim();
        if (out) return resolve(out);
        if (err) return reject(new Error("Hermes did not respond."));
        resolve("Routed. (No text returned.)");
      }
    );
  });
}

export async function POST(req: NextRequest) {
  let text = "";
  try {
    ({ text } = (await req.json()) as { text: string });
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }
  if (!text?.trim()) return Response.json({ ok: false, error: "Empty dump." }, { status: 400 });

  // Persist the raw dump to the vault (best-effort, never blocks routing).
  try {
    const st = await getVaultStatus();
    if (st.connected) {
      await fs.mkdir(st.folder, { recursive: true }).catch(() => {});
      const stamp = new Date().toISOString().replace("T", " ").slice(0, 16);
      await fs.appendFile(path.join(st.folder, "Braindumps.md"), `\n## ${stamp}\n${text}\n`, "utf8");
    }
  } catch {
    /* ignore */
  }

  const prompt =
    "BRAIN DUMP from Zorba. Process it per the braindump/RUFLO protocol: split into atomic items, " +
    "classify each to the right venture, update the venture state, do the highest-leverage NON-gated work now, " +
    "and build an approval card for anything gated (publish/send/spend/deploy/external message). " +
    "Reply with a SHORT confirmation only: what you routed (by venture) and anything that needs my approval. " +
    "Do not ask clarifying questions.\n\nDUMP:\n" + text;

  try {
    const out = await ssh(
      `P=$(echo ${b64(prompt)} | base64 -d); cd ~/.hermes/hermes-agent && .venv/bin/hermes -z "$P" 2>/dev/null`
    );
    void logUsage({ provider: "hermes", model: "hermes", inputText: text, outputText: out, surface: "braindump" });
    return Response.json({ ok: true, reply: out });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : "routing failed" }, { status: 200 });
  }
}
