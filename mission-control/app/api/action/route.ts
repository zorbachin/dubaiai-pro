// Live action bridge — Mac UI -> VPS execution. Currently: gated email send.
// The UI only calls this after Zorba explicitly authorizes a specific message.
import type { NextRequest } from "next/server";
import { execFile } from "node:child_process";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = { type: string; to?: string; subject?: string; body?: string; draftId?: string };

function b64(s: string) {
  return Buffer.from(s ?? "", "utf8").toString("base64");
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
      { timeout: 60000, maxBuffer: 1024 * 1024 },
      (err, stdout, stderr) => (err ? reject(new Error(stderr || err.message)) : resolve(stdout.trim()))
    );
  });
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const PY = "/root/.hermes/hermes-agent/.venv/bin/python /root/.hermes/tools/gmail_send.py";

  try {
    if (body.type === "send_email") {
      if (!body.to || !body.body) return Response.json({ ok: false, error: "to + body required." }, { status: 400 });
      const cmd =
        `B=$(mktemp); echo ${b64(body.body)} | base64 -d > "$B"; ` +
        `TO=$(echo ${b64(body.to)} | base64 -d); SUBJ=$(echo ${b64(body.subject || "")} | base64 -d); ` +
        `${PY} --to "$TO" --subject "$SUBJ" --body-file "$B"; rm -f "$B"`;
      const out = await ssh(cmd);
      const res = JSON.parse(out || "{}");
      return Response.json({ ok: !!res.sent, ...res });
    }
    if (body.type === "send_draft" && body.draftId) {
      const out = await ssh(`${PY} --draft-id ${JSON.stringify(body.draftId)}`);
      const res = JSON.parse(out || "{}");
      return Response.json({ ok: !!res.sent, ...res });
    }
    return Response.json({ ok: false, error: `Unsupported action: ${body.type}` }, { status: 400 });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : "action failed" }, { status: 200 });
  }
}
