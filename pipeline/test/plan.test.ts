import { describe, it, expect } from "vitest";
import { buildWritePlan, planIsEmpty } from "../src/write/plan";
import type { EpisodeCandidate, ResolvedMention } from "../src/types";

const episode: EpisodeCandidate = {
  podcastId: "huberman",
  guid: "yt:abc",
  title: "Sleep Toolkit",
};

function resolved(): ResolvedMention[] {
  return [
    {
      kind: "matched",
      productId: "ag1-athletic-greens",
      score: 1,
      mention: {
        productName: "AG1",
        brand: "Athletic Greens",
        category: "Supplements",
        mentionType: "sponsor",
        quote: "brought to you by AG1",
        bulletPoints: ["greens"],
        promoCode: "HUBERMAN",
        promoDiscount: "free vit D",
        timestampSeconds: 30,
        confidence: 0.98,
      },
    },
    {
      kind: "new",
      productId: "eight-sleep-pod",
      mention: {
        productName: "Pod",
        brand: "Eight Sleep",
        category: "Sleep",
        mentionType: "personal",
        quote: "I use the pod nightly",
        bulletPoints: ["temp control"],
        confidence: 0.9,
      },
    },
  ];
}

describe("buildWritePlan", () => {
  it("creates new products only for novel mentions", () => {
    const plan = buildWritePlan(episode, resolved());
    expect(plan.newProducts.map((p) => p.id)).toEqual(["eight-sleep-pod"]);
    expect(plan.mentions).toHaveLength(2);
  });

  it("captures promo codes and attaches them to the podcast", () => {
    const plan = buildWritePlan(episode, resolved());
    expect(plan.promoCodes).toEqual([
      { productId: "ag1-athletic-greens", podcastId: "huberman", code: "HUBERMAN", discount: "free vit D" },
    ]);
  });

  it("recomputes cross-show counts from prior state", () => {
    // AG1 was already mentioned on JRE; Huberman makes it 2 shows.
    const prior = new Map([["ag1-athletic-greens", new Set(["jre"])]]);
    const plan = buildWritePlan(episode, resolved(), prior);
    const ag1 = plan.statUpdates.find((s) => s.productId === "ag1-athletic-greens");
    expect(ag1?.crossPodcastCount).toBe(2);
  });

  it("planIsEmpty detects no-op plans", () => {
    const empty = buildWritePlan(episode, []);
    expect(planIsEmpty(empty)).toBe(true);
  });
});
