/**
 * Normalization + string similarity for entity resolution.
 *
 * The goal: "AG1", "Athletic Greens", and "AG1 (Athletic Greens)" mentioned on
 * three different shows must collapse to ONE product record so cross-show
 * intelligence ("mentioned on 8 podcasts") is accurate.
 */

/** Curated brand aliases. Maps a noisy form -> canonical brand token. */
export const BRAND_ALIASES: Record<string, string> = {
  "athletic greens": "ag1",
  "ag1 athletic greens": "ag1",
  "drink ag1": "ag1",
  "element": "lmnt",
  "elemental labs": "lmnt",
  "eight sleep pod": "eight sleep",
  "the pod": "eight sleep",
  "whoop strap": "whoop",
  "oura ring": "oura",
  "momentous supplements": "momentous",
  "live momentous": "momentous",
  "betterhelp": "better help",
  "function health": "function",
};

const STOPWORDS = new Set([
  "the", "a", "an", "of", "and", "co", "inc", "llc", "labs", "lab",
  "supplements", "supplement", "nutrition", "official", "brand",
]);

/** Lowercase, strip punctuation, collapse whitespace. */
export function slugifyLoose(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** URL-safe id slug (matches podsupps2's slugify in seed scripts). */
export function slugifyId(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

/** Apply alias folding to a normalized brand string. */
export function canonicalBrand(brand: string): string {
  const norm = slugifyLoose(brand);
  return BRAND_ALIASES[norm] ?? norm;
}

/** Tokenize a normalized string into a meaningful (stopword-free) token set. */
export function tokenSet(value: string): Set<string> {
  return new Set(
    slugifyLoose(value)
      .split(" ")
      .filter((t) => t.length > 1 && !STOPWORDS.has(t)),
  );
}

/** Dice coefficient over two token sets: 2|A∩B| / (|A|+|B|). */
export function diceSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return (2 * inter) / (a.size + b.size);
}

/**
 * A stable canonical key for a product, combining canonical brand + name
 * tokens. Used as a fast exact-match bucket before fuzzy comparison.
 */
export function productKey(brand: string, name: string): string {
  const b = canonicalBrand(brand);
  const nameTokens = [...tokenSet(name)].sort().join(" ");
  // If the name already contains the brand, don't double it.
  return nameTokens.includes(b) ? nameTokens : `${b} ${nameTokens}`.trim();
}

/**
 * Similarity between two (brand,name) pairs in [0,1]. Brand match is weighted
 * because two different products from the same brand should still be close,
 * but a brand mismatch should heavily penalize.
 */
export function productSimilarity(
  a: { brand: string; name: string },
  b: { brand: string; name: string },
): number {
  const brandSim = canonicalBrand(a.brand) === canonicalBrand(b.brand) ? 1 : 0;
  const nameSim = diceSimilarity(
    tokenSet(`${a.brand} ${a.name}`),
    tokenSet(`${b.brand} ${b.name}`),
  );
  return 0.4 * brandSim + 0.6 * nameSim;
}
