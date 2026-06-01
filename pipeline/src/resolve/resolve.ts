/**
 * Resolve stage: map extracted mentions onto the existing catalog.
 *
 * For each extracted mention we either (a) match an existing product (so the
 * mention attaches to it and cross-show counts grow) or (b) mint a new product
 * id. Resolution also dedupes *within* the same batch so two shows naming the
 * same novel product in one poll create only one new record.
 */
import type { CatalogProduct, ExtractedMention, ResolvedMention } from "../types";
import { productKey, productSimilarity, slugifyId } from "./normalize";

interface Indexed {
  product: CatalogProduct;
  key: string;
}

/** Build an index of the catalog for resolution. */
export function indexCatalog(products: CatalogProduct[]): Indexed[] {
  return products.map((p) => ({ product: p, key: productKey(p.brand, p.name) }));
}

/**
 * Find the best catalog match for a single mention.
 * @returns the matched product + score, or null if nothing clears `threshold`.
 */
export function bestMatch(
  mention: { brand: string; productName: string },
  index: Indexed[],
  threshold: number,
): { product: CatalogProduct; score: number } | null {
  const target = { brand: mention.brand, name: mention.productName };
  const key = productKey(mention.brand, mention.productName);

  let best: { product: CatalogProduct; score: number } | null = null;
  for (const entry of index) {
    // Exact canonical-key hit short-circuits at the top score.
    const score =
      entry.key === key
        ? 1
        : productSimilarity(target, { brand: entry.product.brand, name: entry.product.name });
    if (score >= threshold && (!best || score > best.score)) {
      best = { product: entry.product, score };
    }
  }
  return best;
}

/**
 * Resolve a batch of extracted mentions against the catalog.
 * New products are assigned a deterministic slug id; if two mentions in the
 * batch resolve to the same new id they share it (in-batch dedup).
 *
 * @param threshold similarity required to call something an existing match.
 */
export function resolveMentions(
  mentions: ExtractedMention[],
  catalog: CatalogProduct[],
  threshold = 0.82,
): ResolvedMention[] {
  const index = indexCatalog(catalog);
  const mintedThisBatch = new Map<string, string>(); // canonical key -> new id
  const results: ResolvedMention[] = [];

  for (const mention of mentions) {
    const match = bestMatch(mention, index, threshold);
    if (match) {
      results.push({ kind: "matched", productId: match.product.id, mention, score: match.score });
      continue;
    }

    const key = productKey(mention.brand, mention.productName);
    let id = mintedThisBatch.get(key);
    if (!id) {
      id = slugifyId(`${mention.brand}-${mention.productName}`);
      mintedThisBatch.set(key, id);
      // Newly minted products immediately join the index so later mentions in
      // the same batch match them instead of minting a duplicate.
      index.push({ product: { id, name: mention.productName, brand: mention.brand, category: mention.category }, key });
    }
    results.push({ kind: "new", productId: id, mention });
  }

  return results;
}
