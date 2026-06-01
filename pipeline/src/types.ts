/**
 * Domain types for the PodSupps Comb Engine.
 *
 * The catalog-facing shapes (Podcast, Product, Episode, Mention, PromoCode)
 * deliberately mirror the Drizzle schema in podsupps2 (`drizzle/schema.ts`) so
 * the write layer can persist them with no translation. Only the fields the
 * pipeline reads or writes are modelled here.
 */

export type MentionType = "sponsor" | "personal" | "guest";

/**
 * Controlled category vocabulary. The extractor is constrained to these so the
 * catalog stays cleanly faceted instead of accumulating free-text categories.
 */
export const CATEGORIES = [
  "Supplements",
  "Nutrition",
  "Sleep",
  "Fitness",
  "Wearables",
  "Skincare",
  "Nootropics",
  "Food & Beverage",
  "Books",
  "Restaurants",
  "Software & Apps",
  "Home & Lifestyle",
  "Finance",
  "Apparel",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

// ── Catalog snapshot (read side) ─────────────────────────────────────────────

/** A product already in the catalog, as needed for entity resolution. */
export interface CatalogProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
}

/** Minimal podcast record the pipeline needs to poll and attribute mentions. */
export interface CatalogPodcast {
  id: string;
  name: string;
  rssUrl?: string | null;
  youtubeUrl?: string | null;
  isActive?: boolean | null;
}

// ── Episode discovery ────────────────────────────────────────────────────────

/**
 * An episode discovered from a feed, before it has been processed. Maps onto
 * the `episodes` table on write.
 */
export interface EpisodeCandidate {
  podcastId: string;
  /** Stable per-source identifier (RSS guid or YouTube videoId) used for dedup. */
  guid: string;
  title: string;
  description?: string;
  audioUrl?: string;
  youtubeUrl?: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  publishedAt?: Date;
}

// ── Transcription ─────────────────────────────────────────────────────────────

export interface TranscriptSegment {
  /** Seconds from episode start. */
  start: number;
  end: number;
  text: string;
}

export interface Transcript {
  text: string;
  segments: TranscriptSegment[];
  /** Where the transcript came from — useful for quality scoring / cost tracking. */
  source: "youtube-captions" | "whisper" | "provided";
  language?: string;
}

// ── Extraction (LLM output) ───────────────────────────────────────────────────

/**
 * A single product/brand mention as extracted from a transcript by the LLM.
 * This is the validated, structured output of the extract stage.
 */
export interface ExtractedMention {
  productName: string;
  brand: string;
  category: Category;
  mentionType: MentionType;
  /** Short verbatim-ish quote of what was said. */
  quote: string;
  bulletPoints: string[];
  promoCode?: string;
  promoDiscount?: string;
  url?: string;
  /** Best-effort timestamp in seconds, derived from the transcript markers. */
  timestampSeconds?: number;
  /** Model self-reported confidence, 0..1. Low-confidence mentions are dropped. */
  confidence: number;
}

// ── Resolution ────────────────────────────────────────────────────────────────

/**
 * The result of resolving an ExtractedMention against the existing catalog.
 * Either it matched an existing product, or it is novel and a new product
 * record should be created.
 */
export type ResolvedMention =
  | { kind: "matched"; productId: string; mention: ExtractedMention; score: number }
  | { kind: "new"; productId: string; mention: ExtractedMention };

// ── Write plan ────────────────────────────────────────────────────────────────

export interface ProductUpsert {
  id: string;
  name: string;
  brand: string;
  category: string;
  promoCode?: string;
  promoDiscount?: string;
  websiteUrl?: string;
}

export interface MentionInsert {
  productId: string;
  podcastId: string;
  episodeGuid: string;
  episodeTitle: string;
  timestampSeconds?: number;
  type: MentionType;
  quote: string;
  bulletPoints: string[];
}

export interface PromoCodeUpsert {
  productId: string;
  podcastId: string;
  code: string;
  discount?: string;
}

/** Per-product cross-show counts to recompute after a write. */
export interface StatUpdate {
  productId: string;
  crossPodcastCount: number;
}

/**
 * A fully-described, side-effect-free description of everything that should be
 * written for one processed episode. Building this as a plain value (rather
 * than issuing writes inline) keeps the core logic pure and unit-testable.
 */
export interface WritePlan {
  episode: EpisodeCandidate;
  newProducts: ProductUpsert[];
  mentions: MentionInsert[];
  promoCodes: PromoCodeUpsert[];
  statUpdates: StatUpdate[];
}

// ── Show discovery / expansion ────────────────────────────────────────────────

export interface ShowCandidate {
  name: string;
  category: string;
  /** Approximate audience size; higher is better. Free-text from charts is fine. */
  weeklyListeners?: number;
  rssUrl?: string;
  youtubeUrl?: string;
}

export interface ShowProposal extends ShowCandidate {
  /** 0..1 priority score for adding this show next. */
  score: number;
  reasons: string[];
}
