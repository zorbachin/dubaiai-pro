import { describe, it, expect } from "vitest";
import { rankShows, alreadyInCatalog } from "../src/discover/expand";
import type { CatalogPodcast, ShowCandidate } from "../src/types";

const catalog: CatalogPodcast[] = [
  { id: "huberman", name: "Huberman Lab" },
  { id: "jre", name: "The Joe Rogan Experience" },
];

describe("alreadyInCatalog", () => {
  it("detects shows already present by fuzzy name", () => {
    expect(alreadyInCatalog({ name: "Huberman Lab Podcast", category: "Health" }, catalog)).toBe(true);
    expect(alreadyInCatalog({ name: "Acquired", category: "Business" }, catalog)).toBe(false);
  });
});

describe("rankShows", () => {
  const candidates: ShowCandidate[] = [
    { name: "Acquired", category: "Business", weeklyListeners: 1_000_000, youtubeUrl: "https://youtube.com/channel/UC0000000000000000000abc" },
    { name: "Tiny Niche Show", category: "Health", weeklyListeners: 2_000 }, // no feed
    { name: "Huberman Lab", category: "Health", weeklyListeners: 5_000_000 }, // already in catalog
  ];

  it("excludes shows already in the catalog", () => {
    const ranked = rankShows(candidates, catalog);
    expect(ranked.find((r) => r.name === "Huberman Lab")).toBeUndefined();
  });

  it("ranks a large, ingestable, category-expanding show first", () => {
    const ranked = rankShows(candidates, catalog, { existingCategories: ["Health"] });
    expect(ranked[0]!.name).toBe("Acquired");
    expect(ranked[0]!.score).toBeGreaterThan(ranked[1]!.score);
    expect(ranked[0]!.reasons.join(" ")).toMatch(/feed available/);
  });

  it("respects the limit", () => {
    expect(rankShows(candidates, catalog, { limit: 1 })).toHaveLength(1);
  });
});
