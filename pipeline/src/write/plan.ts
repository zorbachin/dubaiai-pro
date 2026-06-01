/**
 * Build a side-effect-free WritePlan from resolved mentions for one episode.
 *
 * Keeping this pure means the trickiest business logic — what becomes a new
 * product, which promo codes get recorded, how cross-show counts are
 * recomputed — is fully unit-tested without a database.
 */
import type {
  CatalogProduct,
  EpisodeCandidate,
  MentionInsert,
  ProductUpsert,
  PromoCodeUpsert,
  ResolvedMention,
  StatUpdate,
  WritePlan,
} from "../types";

/**
 * @param episode   the episode being processed
 * @param resolved  mentions already resolved against the catalog
 * @param existing  current catalog, used to recompute cross-show counts. Should
 *                  include podcast attribution if available; here we only need
 *                  ids to seed the count map.
 * @param priorMentions  map of productId -> set of podcastIds that already
 *                  mention it (from the DB), so crossPodcastCount is accurate.
 */
export function buildWritePlan(
  episode: EpisodeCandidate,
  resolved: ResolvedMention[],
  priorMentions: Map<string, Set<string>> = new Map(),
): WritePlan {
  const newProducts: ProductUpsert[] = [];
  const seenNew = new Set<string>();
  const mentions: MentionInsert[] = [];
  const promoCodes: PromoCodeUpsert[] = [];
  const crossShow = new Map<string, Set<string>>();

  // Seed cross-show map from prior DB state.
  for (const [pid, shows] of priorMentions) crossShow.set(pid, new Set(shows));

  for (const r of resolved) {
    const m = r.mention;

    if (r.kind === "new" && !seenNew.has(r.productId)) {
      seenNew.add(r.productId);
      newProducts.push({
        id: r.productId,
        name: m.productName,
        brand: m.brand,
        category: m.category,
        promoCode: m.promoCode,
        promoDiscount: m.promoDiscount,
        websiteUrl: m.url,
      });
    }

    mentions.push({
      productId: r.productId,
      podcastId: episode.podcastId,
      episodeGuid: episode.guid,
      episodeTitle: episode.title,
      timestampSeconds: m.timestampSeconds,
      type: m.mentionType,
      quote: m.quote,
      bulletPoints: m.bulletPoints,
    });

    if (m.promoCode) {
      promoCodes.push({
        productId: r.productId,
        podcastId: episode.podcastId,
        code: m.promoCode,
        discount: m.promoDiscount,
      });
    }

    const shows = crossShow.get(r.productId) ?? new Set<string>();
    shows.add(episode.podcastId);
    crossShow.set(r.productId, shows);
  }

  const statUpdates: StatUpdate[] = [...crossShow.entries()]
    .filter(([pid]) => mentions.some((mn) => mn.productId === pid))
    .map(([productId, shows]) => ({ productId, crossPodcastCount: shows.size }));

  return { episode, newProducts, mentions, promoCodes, statUpdates };
}

/** Convenience: are there any writes at all? Used to skip empty commits. */
export function planIsEmpty(plan: WritePlan): boolean {
  return (
    plan.mentions.length === 0 &&
    plan.newProducts.length === 0 &&
    plan.promoCodes.length === 0
  );
}

export type { CatalogProduct };
