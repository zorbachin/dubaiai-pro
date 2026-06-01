/**
 * Extraction prompt + JSON schema.
 *
 * This is the core of the moat: turning a raw transcript into structured,
 * timestamped, classified product mentions — including the *anecdotal* ones
 * ("I've been using this sauna blanket every night") that generic affiliate
 * blogs miss entirely.
 */
import { CATEGORIES } from "../types";

export const EXTRACTION_SCHEMA_NAME = "podcast_mentions";

/** JSON schema handed to the LLM to force well-formed, parseable output. */
export const extractionSchema: Record<string, unknown> = {
  type: "object",
  additionalProperties: false,
  required: ["mentions"],
  properties: {
    mentions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "productName",
          "brand",
          "category",
          "mentionType",
          "quote",
          "bulletPoints",
          "confidence",
        ],
        properties: {
          productName: { type: "string", description: "Specific product, book, restaurant, or service name." },
          brand: { type: "string", description: "Maker/brand/author. Use the product name if there is no separate brand." },
          category: { type: "string", enum: CATEGORIES as unknown as string[] },
          mentionType: {
            type: "string",
            enum: ["sponsor", "personal", "guest"],
            description:
              "sponsor = paid ad read; personal = host genuinely uses/recommends it; guest = a guest brought it up.",
          },
          quote: { type: "string", description: "Short verbatim-ish quote of what was said about it (<= 240 chars)." },
          bulletPoints: {
            type: "array",
            items: { type: "string" },
            description: "1-4 crisp factual points about the claim/benefit mentioned.",
          },
          promoCode: { type: "string" },
          promoDiscount: { type: "string", description: "e.g. '20% off', 'first month free'." },
          url: { type: "string" },
          timestampSeconds: {
            type: "number",
            description: "Seconds from episode start, read from the nearest [mm:ss] marker before the mention.",
          },
          confidence: { type: "number", description: "0..1 — how sure you are this is a real, intentional product mention." },
        },
      },
    },
  },
};

export const EXTRACTION_SYSTEM = `You are a precise product-intelligence extractor for a podcast catalog.
Read the transcript and extract EVERY distinct product, brand, book, restaurant, app, or service that is mentioned.

Capture three kinds of mentions:
- "sponsor": an explicit paid advertisement / ad read (usually has a promo code or URL).
- "personal": the host genuinely uses or recommends something, outside an ad read.
- "guest": a guest is the one who brings it up or recommends it.

Rules:
- Include anecdotal/organic mentions, not just ads. These are the most valuable.
- Use the controlled category list exactly.
- For books use the author as "brand"; for restaurants use the city/area or restaurant group as "brand" if stated, else the restaurant name.
- Extract promo codes and discounts verbatim when present.
- Set timestampSeconds from the nearest [mm:ss] marker that appears just before the mention in the transcript.
- Do NOT invent products. If something is vague ("some greens powder") and never named, skip it.
- confidence reflects how sure you are it's a real, intentional mention (1.0 = explicit ad with code; 0.5 = passing reference).
- Deduplicate within the episode: one entry per product, with the best quote.`;

/** Build the user message: instructions + the marked transcript. */
export function buildExtractionUser(args: {
  podcastName: string;
  episodeTitle: string;
  markedTranscript: string;
}): string {
  return [
    `Podcast: ${args.podcastName}`,
    `Episode: ${args.episodeTitle}`,
    "",
    "Transcript (with [mm:ss] timestamp markers):",
    "---",
    args.markedTranscript,
    "---",
    "Return the structured mentions.",
  ].join("\n");
}
