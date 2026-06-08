import Anthropic from "@anthropic-ai/sdk";
import type { NextRequest } from "next/server";
import { execFile } from "node:child_process";
import { logUsage } from "@/lib/cost";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Msg = { role: "user" | "assistant" | "system"; content: string };
type Body = { provider?: string; systemPrompt?: string; model?: string; messages: Msg[] };

const enc = new TextEncoder();
function sse(text: string) {
  return enc.encode(`data: ${JSON.stringify({ delta: text })}\n\n`);
}
const DONE = enc.encode("data: [DONE]\n\n");

function detectProvider(provider?: string, model?: string): string {
  if (provider) return provider.toLowerCase();
  const m = (model || "").toLowerCase();
  if (m.startsWith("gemini")) return "gemini";
  if (m.startsWith("gpt") || m.startsWith("o1") || m.startsWith("o3") || m.includes("codex")) return "openai";
  if (m.startsWith("hermes")) return "hermes";
  return "anthropic";
}

function oneShot(
  meta: { provider: string; model: string; inputText: string },
  producer: () => Promise<string>
): Response {
  const stream = new ReadableStream({
    async start(c) {
      try {
        const text = await producer();
        c.enqueue(sse(text));
        void logUsage({ provider: meta.provider, model: meta.model, inputText: meta.inputText, outputText: text });
      } catch (e) {
        c.enqueue(sse(`\n\n[error] ${e instanceof Error ? e.message : "failed"}`));
      }
      c.enqueue(DONE);
      c.close();
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" },
  });
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const msgs = (body.messages || []).filter((m) => m.content?.trim());
  if (msgs.length === 0) return Response.json({ error: "No messages provided." }, { status: 400 });

  const provider = detectProvider(body.provider, body.model);
  const sys = body.systemPrompt;
  const inputText = (sys || "") + "\n" + msgs.map((m) => m.content).join("\n");

  // ---- Anthropic (Claude) — native streaming ----
  if (provider === "anthropic") {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return Response.json({ error: "Missing ANTHROPIC_API_KEY." }, { status: 500 });
    const model = body.model || process.env.ANTHROPIC_MODEL || "claude-opus-4-7";
    const client = new Anthropic({ apiKey });
    const cmsgs = msgs.filter((m) => m.role === "user" || m.role === "assistant") as { role: "user" | "assistant"; content: string }[];
    const stream = new ReadableStream({
      async start(c) {
        let full = "";
        try {
          const r = await client.messages.stream({ model, max_tokens: 2048, system: sys, messages: cmsgs });
          for await (const ev of r) {
            if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") {
              full += ev.delta.text;
              c.enqueue(sse(ev.delta.text));
            }
          }
          void logUsage({ provider: "anthropic", model, inputText, outputText: full });
        } catch (e) {
          c.enqueue(sse(`\n\n[error] ${e instanceof Error ? e.message : "stream failed"}`));
        }
        c.enqueue(DONE);
        c.close();
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" },
    });
  }

  // ---- Gemini (REST) ----
  if (provider === "gemini") {
    const gmodel = body.model && body.model.startsWith("gemini") ? body.model : "gemini-2.5-flash";
    return oneShot({ provider: "gemini", model: gmodel, inputText }, async () => {
      const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
      if (!key) throw new Error("Missing GEMINI_API_KEY.");
      const contents = msgs
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
      const payload: Record<string, unknown> = { contents };
      if (sys) payload.systemInstruction = { parts: [{ text: sys }] };
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${gmodel}:generateContent?key=${key}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
      );
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error?.message || `Gemini HTTP ${res.status}`);
      return (j?.candidates?.[0]?.content?.parts || []).map((p: { text?: string }) => p.text || "").join("") || "[no response]";
    });
  }

  // ---- OpenAI / Codex (REST) ----
  if (provider === "openai") {
    const omodel = body.model && !body.model.startsWith("claude") ? body.model : "gpt-4o";
    return oneShot({ provider: "openai", model: omodel, inputText }, async () => {
      const key = process.env.OPENAI_API_KEY;
      if (!key || key === "sk-...") throw new Error("Missing OPENAI_API_KEY in .env.local.");
      const oaMsgs = sys ? [{ role: "system", content: sys }, ...msgs] : msgs;
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({ model: omodel, messages: oaMsgs, max_tokens: 2048 }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error?.message || `OpenAI HTTP ${res.status}`);
      return j?.choices?.[0]?.message?.content || "[no response]";
    });
  }

  // ---- Hermes (the VPS orchestrator brain) via SSH ----
  if (provider === "hermes") {
    return oneShot({ provider: "hermes", model: "hermes", inputText }, async () => {
      const host = process.env.VPS_HOST;
      const user = process.env.VPS_USER || "root";
      const keyPath = (process.env.VPS_SSH_KEY || "~/.ssh/zorba_vps").replace(/^~/, process.env.HOME || "");
      if (!host) throw new Error("VPS_HOST not set in .env.local.");
      const prompt = msgs[msgs.length - 1].content;
      return await new Promise<string>((resolve, reject) => {
        execFile(
          "ssh",
          ["-i", keyPath, "-o", "StrictHostKeyChecking=no", "-o", "ConnectTimeout=15", `${user}@${host}`,
            `cd ~/.hermes/hermes-agent && .venv/bin/hermes -z ${JSON.stringify(prompt)} 2>/dev/null`],
          { timeout: 120000, maxBuffer: 1024 * 1024 },
          (err, stdout) => {
            const out = (stdout || "").trim();
            if (out) return resolve(out);
            if (err) return reject(new Error("Hermes did not return output."));
            resolve("[Hermes reachable but returned no text.]");
          }
        );
      });
    });
  }

  return Response.json({ error: `Unknown provider: ${provider}` }, { status: 400 });
}
