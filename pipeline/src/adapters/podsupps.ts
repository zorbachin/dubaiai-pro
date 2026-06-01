/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PRODUCTION ADAPTER — lives in the podsupps2 repo, not here.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * This file is intentionally EXCLUDED from this package's typecheck (see
 * tsconfig.json `exclude`) because it imports podsupps2-internal modules
 * (`server/_core/llm`, `server/_core/voiceTranscription`, `server/db`).
 *
 * When you lift the pipeline into podsupps2 (see INTEGRATION.md), drop this
 * file at `server/pipeline/adapters/podsupps.ts`, fix the relative import
 * paths, and `buildProductionDeps()` becomes the single wiring point between
 * the engine and the live app.
 *
 * It implements the four boundary interfaces in ../contracts.ts against the
 * real services that already exist in podsupps2:
 *   - LlmClient   -> invokeLLM (gemini-2.5-flash, json_schema response format)
 *   - Transcriber -> transcribeAudio (Whisper)
 *   - CatalogDb   -> Drizzle (podcasts / products / episodes / mentions / promo_codes)
 *   - HttpClient  -> global fetch
 */
// @ts-nocheck — paths resolve inside podsupps2, not in this standalone package.
import { invokeLLM } from "../../../server/_core/llm";
import { transcribeAudio } from "../../../server/_core/voiceTranscription";
import { db } from "../../../server/db";
import { and, eq, inArray, sql } from "drizzle-orm";
import {
  podcasts,
  products,
  episodes,
  mentions as mentionsTable,
  promoCodes as promoCodesTable,
} from "../../../drizzle/schema";

import type {
  CatalogDb,
  HttpClient,
  LlmClient,
  PipelineDeps,
  Transcriber,
  Logger,
} from "../contracts";
import type { Transcript, WritePlan } from "../types";
import { consoleLogger } from "../contracts";

const http: HttpClient = {
  async getText(url: string) {
    const res = await fetch(url, { headers: { "user-agent": "PodSupps-CombEngine/0.1" } });
    if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
    return res.text();
  },
};

const llm: LlmClient = {
  async completeJson({ system, user, schemaName, schema }) {
    const result = await invokeLLM({
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      responseFormat: {
        type: "json_schema",
        json_schema: { name: schemaName, schema, strict: true },
      },
    });
    const content = result?.choices?.[0]?.message?.content ?? "{}";
    return JSON.parse(typeof content === "string" ? content : JSON.stringify(content));
  },
};

const transcriber: Transcriber = {
  async transcribe(audioUrl: string, opts): Promise<Transcript> {
    const res = await transcribeAudio({ audioUrl, language: opts?.language });
    if ("error" in res) throw new Error(`${res.code}: ${res.error}`);
    return {
      text: res.text,
      segments: (res.segments ?? []).map((s) => ({ start: s.start, end: s.end, text: s.text })),
      source: "whisper",
      language: res.language,
    };
  },
};

const catalogDb: CatalogDb = {
  async listActivePodcasts() {
    const rows = await db.select().from(podcasts).where(eq(podcasts.isActive, true));
    return rows.map((p) => ({
      id: p.id,
      name: p.name,
      rssUrl: p.rssUrl,
      youtubeUrl: p.youtubeUrl,
      isActive: p.isActive,
    }));
  },
  async getPodcast(id: string) {
    const [p] = await db.select().from(podcasts).where(eq(podcasts.id, id)).limit(1);
    return p
      ? { id: p.id, name: p.name, rssUrl: p.rssUrl, youtubeUrl: p.youtubeUrl, isActive: p.isActive }
      : null;
  },
  async listProducts() {
    const rows = await db
      .select({ id: products.id, name: products.name, brand: products.brand, category: products.category })
      .from(products);
    return rows;
  },
  async getProcessedEpisodeGuids(podcastId: string) {
    // We store the feed guid in episodes.transcriptUrl-adjacent metadata; here
    // we treat episode.youtubeUrl / audioUrl as the natural guid surface.
    const rows = await db
      .select({ guid: episodes.youtubeUrl, audio: episodes.audioUrl, title: episodes.title })
      .from(episodes)
      .where(and(eq(episodes.podcastId, podcastId), eq(episodes.isProcessed, true)));
    const set = new Set<string>();
    for (const r of rows) {
      if (r.guid) set.add(r.guid.includes("watch?v=") ? `yt:${r.guid.split("v=")[1]}` : r.guid);
      if (r.audio) set.add(r.audio);
      if (r.title) set.add(r.title);
    }
    return set;
  },
  async commit(plan: WritePlan) {
    return db.transaction(async (tx) => {
      // 1. Upsert the episode and mark processed.
      const [ep] = await tx
        .insert(episodes)
        .values({
          podcastId: plan.episode.podcastId,
          title: plan.episode.title,
          description: plan.episode.description,
          audioUrl: plan.episode.audioUrl,
          youtubeUrl: plan.episode.youtubeUrl,
          thumbnailUrl: plan.episode.thumbnailUrl,
          durationSeconds: plan.episode.durationSeconds,
          publishedAt: plan.episode.publishedAt,
          isProcessed: true,
        })
        .$returningId();

      // 2. Insert new products.
      for (const p of plan.newProducts) {
        await tx
          .insert(products)
          .values({
            id: p.id,
            name: p.name,
            brand: p.brand,
            category: p.category,
            promoCode: p.promoCode,
            promoDiscount: p.promoDiscount,
            websiteUrl: p.websiteUrl,
          })
          .onDuplicateKeyUpdate({ set: { updatedAt: sql`now()` } });
      }

      // 3. Insert mentions.
      for (const m of plan.mentions) {
        await tx.insert(mentionsTable).values({
          productId: m.productId,
          podcastId: m.podcastId,
          episodeId: ep?.id,
          episodeTitle: m.episodeTitle,
          timestampSeconds: m.timestampSeconds,
          type: m.type,
          quote: m.quote,
          bulletPoints: m.bulletPoints,
        });
      }

      // 4. Upsert promo codes.
      for (const c of plan.promoCodes) {
        await tx
          .insert(promoCodesTable)
          .values({ productId: c.productId, podcastId: c.podcastId, code: c.code, discount: c.discount, isActive: true })
          .onDuplicateKeyUpdate({ set: { discount: c.discount, isActive: true } });
      }

      // 5. Recompute cross-show counts.
      for (const s of plan.statUpdates) {
        await tx
          .update(products)
          .set({ crossPodcastCount: s.crossPodcastCount })
          .where(eq(products.id, s.productId));
      }

      return {
        newProducts: plan.newProducts.length,
        mentions: plan.mentions.length,
        promoCodes: plan.promoCodes.length,
      };
    });
  },
};

/** The single wiring point. Import this from your cron / tRPC admin procedure. */
export function buildProductionDeps(log: Logger = consoleLogger): PipelineDeps {
  return { http, llm, transcriber, db: catalogDb, log, minConfidence: 0.55, matchThreshold: 0.82 };
}
