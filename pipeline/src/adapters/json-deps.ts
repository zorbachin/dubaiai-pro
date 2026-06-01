/**
 * Production dependencies wired to the JSON adapter (GitHub-native mode).
 *
 * This is what the GitHub Actions workflow uses. LLM calls go through the
 * Forge/Gemini API; transcription via Whisper; catalog persisted as JSON files.
 *
 * Required env vars:
 *   FORGE_API_KEY   — same key podsupps2 uses for invokeLLM / transcribeAudio
 *   FORGE_API_URL   — same base URL (defaults to podsupps2's BUILT_IN_FORGE_API_URL)
 *   DATA_DIR        — absolute path to the data directory (default: pipeline/data)
 */
import { join } from "path";
import type { HttpClient, LlmClient, PipelineDeps, Transcriber } from "../contracts";
import { consoleLogger } from "../contracts";
import type { Transcript } from "../types";
import { JsonCatalogDb } from "./json-db";

const http: HttpClient = {
  async getText(url: string) {
    const res = await fetch(url, {
      headers: { "user-agent": "PodSupps-CombEngine/0.1 (+https://github.com/podsupps)" },
    });
    if (!res.ok) throw new Error(`GET ${url} -> ${res.status} ${res.statusText}`);
    return res.text();
  },
};

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function makeApiUrl(base: string): string {
  return base.endsWith("/") ? `${base}chat/completions` : `${base}/chat/completions`;
}

const llm: LlmClient = {
  async completeJson<T>({ system, user, schemaName, schema }: { system: string; user: string; schemaName: string; schema: Record<string, unknown> }): Promise<T> {
    const apiKey = requireEnv("FORGE_API_KEY");
    const apiUrl = makeApiUrl(
      process.env["FORGE_API_URL"] ?? "https://forge.manus.ai/v1",
    );
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env["LLM_MODEL"] ?? "gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: schemaName, schema, strict: true },
        },
        max_tokens: 32768,
      }),
    });
    if (!res.ok) throw new Error(`LLM API ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as { choices: { message: { content: string } }[] };
    return JSON.parse(data.choices[0]!.message.content) as T;
  },
};

const transcriber: Transcriber = {
  async transcribe(audioUrl: string, opts): Promise<Transcript> {
    const apiKey = requireEnv("FORGE_API_KEY");
    const apiBase = process.env["FORGE_API_URL"] ?? "https://forge.manus.ai/v1";
    const whisperUrl = apiBase.replace(/\/+$/, "") + "/audio/transcriptions";

    // Download audio
    const audioRes = await fetch(audioUrl);
    if (!audioRes.ok) throw new Error(`audio download failed: ${audioRes.status}`);
    const blob = await audioRes.blob();

    // 16 MB guard
    if (blob.size > 16 * 1024 * 1024) throw new Error("audio > 16 MB; chunk before transcribing");

    const form = new FormData();
    form.append("file", blob, "audio.mp3");
    form.append("model", "whisper-1");
    form.append("response_format", "verbose_json");
    if (opts?.language) form.append("language", opts.language);

    const res = await fetch(whisperUrl, {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}` },
      body: form,
    });
    if (!res.ok) throw new Error(`Whisper ${res.status}: ${await res.text()}`);
    const data = (await res.json()) as {
      text: string;
      language: string;
      segments: { start: number; end: number; text: string }[];
    };
    return {
      text: data.text,
      segments: data.segments ?? [],
      source: "whisper",
      language: data.language,
    };
  },
};

/** Build deps for the GitHub Actions / CLI environment using JSON file storage. */
export function buildJsonDeps(dataDir?: string): PipelineDeps {
  const dir =
    dataDir ??
    process.env["DATA_DIR"] ??
    join(new URL(import.meta.url).pathname, "../../../data");
  const db = new JsonCatalogDb(dir);
  return { http, llm, transcriber, db, log: consoleLogger, minConfidence: 0.55, matchThreshold: 0.82 };
}
