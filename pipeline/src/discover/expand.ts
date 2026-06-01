/**
 * Show-expansion agent.
 *
 * The second half of the original brief: "expand the database to new popular
 * shows." Given candidate shows (from charts, suggestions, or an LLM) and the
 * shows already in the catalog, rank which to onboard next.
 *
 * Scoring is deterministic and explainable (so it can be reviewed in an admin
 * queue) and rewards: large audience, a feed we can actually ingest, and
 * category diversity relative to what we already cover.
 */
import type { CatalogPodcast, ShowCandidate, ShowProposal } from "../types";
import { canonicalBrand, diceSimilarity, slugifyLoose, tokenSet } from "../resolve/normalize";

/** Normalize a possibly-huge listener number into a 0..1 popularity score. */
function popularityScore(weeklyListeners?: number): number {
  if (!weeklyListeners || weeklyListeners <= 0) return 0.2;
  // log10 scaled: 10k -> ~0.4, 100k -> ~0.6, 1M -> ~0.8, 10M -> ~1.0
  return Math.min(1, Math.log10(weeklyListeners) / 7);
}

/** True if a candidate is already in the catalog (by fuzzy name match). */
export function alreadyInCatalog(
  candidate: ShowCandidate,
  catalog: CatalogPodcast[],
  threshold = 0.7,
): boolean {
  const candNorm = slugifyLoose(candidate.name);
  const cand = tokenSet(candidate.name);
  return catalog.some((p) => {
    const pNorm = slugifyLoose(p.name);
    // One name fully contains the other (e.g. "Huberman Lab" ⊂ "Huberman Lab Podcast").
    if (candNorm.includes(pNorm) || pNorm.includes(candNorm)) return true;
    return diceSimilarity(cand, tokenSet(p.name)) >= threshold;
  });
}

/**
 * Rank candidate shows for onboarding.
 * @param existingCategories categories already well-covered, used to reward diversity.
 */
export function rankShows(
  candidates: ShowCandidate[],
  catalog: CatalogPodcast[],
  opts: { existingCategories?: string[]; limit?: number } = {},
): ShowProposal[] {
  const covered = new Set((opts.existingCategories ?? []).map((c) => canonicalBrand(c)));

  const proposals: ShowProposal[] = [];
  for (const c of candidates) {
    if (alreadyInCatalog(c, catalog)) continue;

    const reasons: string[] = [];
    const pop = popularityScore(c.weeklyListeners);
    if (c.weeklyListeners) reasons.push(`~${c.weeklyListeners.toLocaleString()} weekly listeners`);

    const ingestable = Boolean(c.rssUrl || c.youtubeUrl);
    if (ingestable) reasons.push(c.youtubeUrl ? "YouTube feed available" : "RSS feed available");

    const novelCategory = !covered.has(canonicalBrand(c.category));
    if (novelCategory) reasons.push(`expands into ${c.category}`);

    // Weighted blend. Ingestability is a hard-ish gate (no feed => can't run the pipeline).
    const score =
      0.55 * pop +
      0.3 * (ingestable ? 1 : 0) +
      0.15 * (novelCategory ? 1 : 0.4);

    proposals.push({ ...c, score: Math.round(score * 100) / 100, reasons });
  }

  proposals.sort((a, b) => b.score - a.score);
  return typeof opts.limit === "number" ? proposals.slice(0, opts.limit) : proposals;
}
