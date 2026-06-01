import { describe, it, expect } from "vitest";
import { resolveMentions } from "../src/resolve/resolve";
import type { CatalogProduct, ExtractedMention } from "../src/types";

function mention(partial: Partial<ExtractedMention>): ExtractedMention {
  return {
    productName: "",
    brand: "",
    category: "Supplements",
    mentionType: "sponsor",
    quote: "",
    bulletPoints: [],
    confidence: 0.9,
    ...partial,
  };
}

const catalog: CatalogProduct[] = [
  { id: "ag1-athletic-greens", name: "AG1", brand: "Athletic Greens", category: "Supplements" },
  { id: "eight-sleep-pod", name: "Pod", brand: "Eight Sleep", category: "Sleep" },
];

describe("resolveMentions", () => {
  it("matches an existing product via brand alias", () => {
    const [r] = resolveMentions([mention({ productName: "Athletic Greens", brand: "Athletic Greens" })], catalog);
    expect(r!.kind).toBe("matched");
    if (r!.kind === "matched") expect(r!.productId).toBe("ag1-athletic-greens");
  });

  it("mints a new product for a novel mention", () => {
    const [r] = resolveMentions([mention({ productName: "Magnesium L-Threonate", brand: "Momentous" })], catalog);
    expect(r!.kind).toBe("new");
    if (r!.kind === "new") expect(r!.productId).toBe("momentous-magnesium-l-threonate");
  });

  it("dedupes two novel mentions of the same product within a batch", () => {
    const results = resolveMentions(
      [
        mention({ productName: "Ketone-IQ", brand: "Ketone IQ" }),
        mention({ productName: "Ketone IQ", brand: "Ketone-IQ" }),
      ],
      catalog,
    );
    expect(results).toHaveLength(2);
    expect(results[0]!.productId).toBe(results[1]!.productId);
  });
});
