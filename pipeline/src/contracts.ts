/**
 * Injectable boundary interfaces.
 *
 * Every external dependency (network, LLM, Whisper, database) sits behind one
 * of these so the pipeline core is pure and fully testable offline. In
 * production these are implemented by thin adapters over podsupps2's existing
 * `invokeLLM`, `transcribeAudio`, and Drizzle DB (see src/adapters/podsupps.ts).
 */

import type {
  CatalogPodcast,
  CatalogProduct,
  EpisodeCandidate,
  Transcript,
  WritePlan,
} from "./types";

/** Fetches raw text over HTTP (RSS/Atom feeds, caption tracks). */
export interface HttpClient {
  getText(url: string): Promise<string>;
}

/**
 * Chat-completion style LLM with structured JSON output.
 * Mirrors the useful subset of podsupps2's `invokeLLM`.
 */
export interface LlmClient {
  /**
   * @param system  System prompt.
   * @param user    User content (the transcript + instructions).
   * @param schema  JSON schema the model must conform to.
   * @returns Parsed JSON object matching `schema`.
   */
  completeJson<T>(args: {
    system: string;
    user: string;
    schemaName: string;
    schema: Record<string, unknown>;
  }): Promise<T>;
}

/** Speech-to-text. Mirrors podsupps2's `transcribeAudio`. */
export interface Transcriber {
  transcribe(audioUrl: string, opts?: { language?: string }): Promise<Transcript>;
}

/**
 * Catalog persistence. Read methods feed resolution; `commit` applies a
 * WritePlan transactionally and marks the episode processed.
 */
export interface CatalogDb {
  listActivePodcasts(): Promise<CatalogPodcast[]>;
  getPodcast(id: string): Promise<CatalogPodcast | null>;
  listProducts(): Promise<CatalogProduct[]>;
  /** GUIDs of episodes already ingested for a podcast, for dedup. */
  getProcessedEpisodeGuids(podcastId: string): Promise<Set<string>>;
  /** Apply the plan and mark the episode processed. Returns rows written. */
  commit(plan: WritePlan): Promise<CommitResult>;
}

export interface CommitResult {
  newProducts: number;
  mentions: number;
  promoCodes: number;
}

/** Optional structured logger; defaults to console in the CLI. */
export interface Logger {
  info(msg: string, meta?: Record<string, unknown>): void;
  warn(msg: string, meta?: Record<string, unknown>): void;
  error(msg: string, meta?: Record<string, unknown>): void;
}

/** Everything the orchestrator needs, assembled once at the edge. */
export interface PipelineDeps {
  http: HttpClient;
  llm: LlmClient;
  transcriber: Transcriber;
  db: CatalogDb;
  log: Logger;
  /** Drop mentions below this model confidence. Default 0.55. */
  minConfidence?: number;
  /** Resolution similarity threshold for matching existing products. Default 0.82. */
  matchThreshold?: number;
}

/** A trivial fan-out logger used as a default. */
export const consoleLogger: Logger = {
  info: (m, meta) => console.log(`[info] ${m}`, meta ?? ""),
  warn: (m, meta) => console.warn(`[warn] ${m}`, meta ?? ""),
  error: (m, meta) => console.error(`[error] ${m}`, meta ?? ""),
};

export type { EpisodeCandidate };
