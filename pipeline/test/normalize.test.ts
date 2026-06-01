import { describe, it, expect } from "vitest";
import {
  canonicalBrand,
  diceSimilarity,
  productKey,
  productSimilarity,
  slugifyId,
  tokenSet,
} from "../src/resolve/normalize";

describe("canonicalBrand", () => {
  it("folds known aliases", () => {
    expect(canonicalBrand("Athletic Greens")).toBe("ag1");
    expect(canonicalBrand("AG1")).toBe("ag1");
    expect(canonicalBrand("Element")).toBe("lmnt");
    expect(canonicalBrand("Whoop Strap")).toBe("whoop");
  });
});

describe("slugifyId", () => {
  it("produces url-safe slugs", () => {
    expect(slugifyId("AG1 (Athletic Greens)")).toBe("ag1-athletic-greens");
    expect(slugifyId("Eight Sleep — Pod 4")).toBe("eight-sleep-pod-4");
  });
});

describe("diceSimilarity", () => {
  it("is 1 for identical token sets and 0 for disjoint", () => {
    expect(diceSimilarity(tokenSet("eight sleep pod"), tokenSet("eight sleep pod"))).toBe(1);
    expect(diceSimilarity(tokenSet("ag1 greens"), tokenSet("whoop band"))).toBe(0);
  });
});

describe("productSimilarity / productKey", () => {
  it("treats AG1 and Athletic Greens as the same product", () => {
    const a = { brand: "AG1", name: "AG1" };
    const b = { brand: "Athletic Greens", name: "Athletic Greens" };
    expect(canonicalBrand(a.brand)).toBe(canonicalBrand(b.brand));
    expect(productSimilarity(a, b)).toBeGreaterThanOrEqual(0.4);
  });

  it("separates different products from the same brand", () => {
    const sim = productSimilarity(
      { brand: "Momentous", name: "Creatine" },
      { brand: "Momentous", name: "Magnesium Threonate" },
    );
    expect(sim).toBeLessThan(0.82);
  });

  it("productKey is stable regardless of word order", () => {
    expect(productKey("Eight Sleep", "Pod Cover")).toBe(productKey("Eight Sleep", "Cover Pod"));
  });
});
