import { describe, it, expect } from "vitest";
import { validateExtraction, extractMentions } from "../src/extract/extract";
import { buildMarkedTranscript } from "../src/transcribe/index";
import { consoleLogger, type LlmClient } from "../src/contracts";
import type { Transcript } from "../src/types";

describe("validateExtraction", () => {
  it("drops low-confidence and malformed mentions, clamps fields", () => {
    const raw = {
      mentions: [
        { productName: "AG1", brand: "Athletic Greens", category: "Supplements", mentionType: "sponsor", quote: "x".repeat(500), bulletPoints: ["a", "b", "c", "d", "e", "f"], confidence: 0.95 },
        { productName: "Vague thing", brand: "?", category: "Other", mentionType: "personal", quote: "", bulletPoints: [], confidence: 0.1 },
        { productName: "BadCategory", brand: "X", category: "NotAReal", mentionType: "sponsor", quote: "", bulletPoints: [], confidence: 0.9 },
      ],
    };
    const out = validateExtraction(raw, 0.55);
    expect(out).toHaveLength(1);
    expect(out[0]!.quote.length).toBe(240);
    expect(out[0]!.bulletPoints.length).toBe(4);
  });

  it("returns [] on totally invalid input", () => {
    expect(validateExtraction({ nope: true }, 0.55)).toEqual([]);
    expect(validateExtraction(null, 0.55)).toEqual([]);
  });
});

describe("buildMarkedTranscript", () => {
  it("inserts [mm:ss] markers spaced by interval", () => {
    const t: Transcript = {
      text: "",
      source: "youtube-captions",
      segments: [
        { start: 0, end: 2, text: "intro" },
        { start: 5, end: 7, text: "still early" },
        { start: 40, end: 42, text: "ad read" },
      ],
    };
    const marked = buildMarkedTranscript(t, 30);
    expect(marked).toContain("[0:00] intro");
    expect(marked).toContain("[0:40] ad read");
    // 0:05 is within 30s of the first marker, so it is NOT separately marked.
    expect(marked).not.toContain("[0:05]");
  });
});

describe("extractMentions", () => {
  it("calls the LLM and validates the response", async () => {
    const llm: LlmClient = {
      async completeJson<T>() {
        return {
          mentions: [
            { productName: "LMNT", brand: "LMNT", category: "Nutrition", mentionType: "sponsor", quote: "electrolytes", bulletPoints: ["no sugar"], confidence: 0.97, timestampSeconds: 30 },
          ],
        } as T;
      },
    };
    const transcript: Transcript = { text: "...", source: "youtube-captions", segments: [{ start: 30, end: 35, text: "LMNT ad" }] };
    const out = await extractMentions(
      { podcastName: "Demo", episodeTitle: "Ep 1", transcript },
      { llm, log: consoleLogger },
    );
    expect(out).toHaveLength(1);
    expect(out[0]!.brand).toBe("LMNT");
  });

  it("returns [] when the LLM throws", async () => {
    const llm: LlmClient = { async completeJson() { throw new Error("boom"); } };
    const transcript: Transcript = { text: "x", source: "provided", segments: [] };
    const out = await extractMentions(
      { podcastName: "Demo", episodeTitle: "Ep", transcript },
      { llm, log: consoleLogger },
    );
    expect(out).toEqual([]);
  });
});
