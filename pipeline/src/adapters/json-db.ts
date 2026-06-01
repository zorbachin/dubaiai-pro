/**
 * JSON file-based CatalogDb adapter.
 *
 * Reads and writes the catalog as plain JSON files committed to the GitHub
 * repo. The pipeline then runs as a GitHub Actions cron: update JSON → commit
 * → Vercel auto-rebuilds the static site. No database server needed.
 *
 * File layout (all relative to DATA_DIR, default: pipeline/data):
 *   podcasts.json   CatalogPodcast[]
 *   products.json   CatalogProduct[]
 *   episodes.json   ProcessedEpisode[]   (guids only, for dedup)
 *   mentions.json   StoredMention[]
 *   promo_codes.json PromoCode[]
 *
 * On commit the calling workflow runs:
 *   git add pipeline/data && git commit -m "data: pipeline sync [skip ci]" && git push
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import type { CatalogDb, CommitResult } from "../contracts";
import type {
  CatalogPodcast,
  CatalogProduct,
  MentionInsert,
  ProductUpsert,
  WritePlan,
} from "../types";

// ── Stored shapes (superset of the minimal interfaces) ─────────────────────

export interface StoredPodcast extends CatalogPodcast {
  name: string;
}

export interface StoredProduct extends CatalogProduct {
  promoCode?: string;
  promoDiscount?: string;
  websiteUrl?: string;
  affiliateUrl?: string;
  imageUrl?: string;
  crossPodcastCount?: number;
}

export interface ProcessedEpisode {
  guid: string;
  podcastId: string;
  title: string;
  processedAt: string;
}

export interface StoredMention extends MentionInsert {
  id: number;
  createdAt: string;
}

export interface StoredPromoCode {
  id: number;
  productId: string;
  podcastId: string;
  code: string;
  discount?: string;
}

// ── Read / write helpers ──────────────────────────────────────────────────

function readJson<T>(filePath: string, fallback: T): T {
  if (!existsSync(filePath)) return fallback;
  return JSON.parse(readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, data: unknown): void {
  writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

// ── The adapter ────────────────────────────────────────────────────────────

export class JsonCatalogDb implements CatalogDb {
  readonly dir: string;

  constructor(dataDir: string) {
    this.dir = dataDir;
    mkdirSync(dataDir, { recursive: true });
  }

  private path(name: string) {
    return join(this.dir, name);
  }

  async listActivePodcasts(): Promise<CatalogPodcast[]> {
    const all = readJson<StoredPodcast[]>(this.path("podcasts.json"), []);
    return all.filter((p) => p.isActive !== false);
  }

  async getPodcast(id: string): Promise<CatalogPodcast | null> {
    const all = readJson<StoredPodcast[]>(this.path("podcasts.json"), []);
    return all.find((p) => p.id === id) ?? null;
  }

  async listProducts(): Promise<CatalogProduct[]> {
    return readJson<StoredProduct[]>(this.path("products.json"), []);
  }

  async getProcessedEpisodeGuids(podcastId: string): Promise<Set<string>> {
    const all = readJson<ProcessedEpisode[]>(this.path("episodes.json"), []);
    return new Set(all.filter((e) => e.podcastId === podcastId).map((e) => e.guid));
  }

  async commit(plan: WritePlan): Promise<CommitResult> {
    // 1. Mark episode processed.
    const episodes = readJson<ProcessedEpisode[]>(this.path("episodes.json"), []);
    episodes.push({
      guid: plan.episode.guid,
      podcastId: plan.episode.podcastId,
      title: plan.episode.title,
      processedAt: new Date().toISOString(),
    });
    writeJson(this.path("episodes.json"), episodes);

    // 2. Upsert new products.
    const products = readJson<StoredProduct[]>(this.path("products.json"), []);
    const productIndex = new Map(products.map((p, i) => [p.id, i]));
    for (const p of plan.newProducts) {
      const existing = productIndex.get(p.id);
      if (existing !== undefined) {
        products[existing] = { ...products[existing]!, ...p };
      } else {
        products.push({ ...p, crossPodcastCount: 0 });
      }
    }

    // 3. Apply cross-show stat updates.
    for (const stat of plan.statUpdates) {
      const idx = productIndex.get(stat.productId);
      if (idx !== undefined) {
        products[idx]!.crossPodcastCount = stat.crossPodcastCount;
      }
    }
    writeJson(this.path("products.json"), products);

    // 4. Append mentions.
    const mentions = readJson<StoredMention[]>(this.path("mentions.json"), []);
    const nextId = mentions.length > 0 ? Math.max(...mentions.map((m) => m.id)) + 1 : 1;
    let id = nextId;
    for (const m of plan.mentions) {
      mentions.push({ ...m, id: id++, createdAt: new Date().toISOString() });
    }
    writeJson(this.path("mentions.json"), mentions);

    // 5. Upsert promo codes.
    const promoCodes = readJson<StoredPromoCode[]>(this.path("promo_codes.json"), []);
    const nextPromoId = promoCodes.length > 0 ? Math.max(...promoCodes.map((c) => c.id)) + 1 : 1;
    let promoId = nextPromoId;
    for (const c of plan.promoCodes) {
      const existing = promoCodes.find((p) => p.productId === c.productId && p.code === c.code);
      if (!existing) {
        promoCodes.push({ ...c, id: promoId++ });
      }
    }
    writeJson(this.path("promo_codes.json"), promoCodes);

    return {
      newProducts: plan.newProducts.length,
      mentions: plan.mentions.length,
      promoCodes: plan.promoCodes.length,
    };
  }

  // ── Seeding helpers (used by the init-data script) ────────────────────────

  seedPodcasts(podcasts: StoredPodcast[]): void {
    writeJson(this.path("podcasts.json"), podcasts);
  }

  seedProducts(products: StoredProduct[]): void {
    writeJson(this.path("products.json"), products);
  }

  /** Build cross-podcast counts from scratch from the mentions file. */
  recomputeCrossShowCounts(): void {
    const mentions = readJson<StoredMention[]>(this.path("mentions.json"), []);
    const products = readJson<StoredProduct[]>(this.path("products.json"), []);
    const map = new Map<string, Set<string>>();
    for (const m of mentions) {
      const shows = map.get(m.productId) ?? new Set<string>();
      shows.add(m.podcastId);
      map.set(m.productId, shows);
    }
    for (const p of products) {
      p.crossPodcastCount = map.get(p.id)?.size ?? 0;
    }
    writeJson(this.path("products.json"), products);
  }

  /** Stats summary — useful in workflow logs. */
  summary(): Record<string, number> {
    return {
      podcasts: readJson<unknown[]>(this.path("podcasts.json"), []).length,
      products: readJson<unknown[]>(this.path("products.json"), []).length,
      mentions: readJson<unknown[]>(this.path("mentions.json"), []).length,
      episodes: readJson<unknown[]>(this.path("episodes.json"), []).length,
      promoCodes: readJson<unknown[]>(this.path("promo_codes.json"), []).length,
    };
  }
}

/** Build a JsonCatalogDb rooted at a path relative to this file's location. */
export function makeJsonDb(dataDir?: string): JsonCatalogDb {
  const dir = dataDir ?? join(new URL(import.meta.url).pathname, "../../data");
  return new JsonCatalogDb(dir);
}
