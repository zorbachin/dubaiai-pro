/**
 * Extract stage: transcript -> validated ExtractedMention[].
 *
 * The LLM is constrained by a JSON schema, but we still validate its output
 * with zod (models drift) and drop low-confidence noise before it can pollute
 * the catalog.
 */
import { z } from "zod";
import type { LlmClient, Logger } from "../contracts";
import type { ExtractedMention, Transcript } from "../types";
import { CATEGORIES } from "../types";
import {
  EXTRACTION_SCHEMA_NAME,
  EXTRACTION_SYSTEM,
  buildExtractionUser,
  extractionSchema,
} from "./prompt";
import { buildMarkedTranscript } from "../transcribe/index";

const mentionSchema = z.object({
  productName: z.string().min(1),
  brand: z.string().min(1),
  category: z.enum(CATEGORIES),
  mentionType: z.enum(["sponsor", "personal", "guest"]),
  quote: z.string().default(""),
  bulletPoints: z.array(z.string()).default([]),
  promoCode: z.string().optional(),
  promoDiscount: z.string().optional(),
  url: z.string().optional(),
  timestampSeconds: z.number().nonnegative().optional(),
  confidence: z.number().min(0).max(1).default(0.5),
});

const envelopeSchema = z.object({ mentions: z.array(z.unknown()).default([]) });

/**
 * Validate and clean a raw LLM response into ExtractedMention[].
 *
 * Mentions are validated individually so a single malformed entry (e.g. an
 * off-vocabulary category) only drops that one item rather than discarding the
 * whole episode's extraction.
 */
export function validateExtraction(raw: unknown, minConfidence: number): ExtractedMention[] {
  const envelope = envelopeSchema.safeParse(raw);
  if (!envelope.success) return [];

  const out: ExtractedMention[] = [];
  for (const item of envelope.data.mentions) {
    const parsed = mentionSchema.safeParse(item);
    if (!parsed.success) continue;
    const m = parsed.data;
    if (m.confidence < minConfidence) continue;
    out.push({ ...m, quote: m.quote.slice(0, 240), bulletPoints: m.bulletPoints.slice(0, 4) });
  }
  return out;
}

/**
 * Run extraction over one transcript.
 * @param minConfidence Mentions below this are discarded (default 0.55).
 */
export async function extractMentions(
  args: {
    podcastName: string;
    episodeTitle: string;
    transcript: Transcript;
  },
  deps: { llm: LlmClient; log: Logger; minConfidence?: number },
): Promise<ExtractedMention[]> {
  const minConfidence = deps.minConfidence ?? 0.55;
  const markedTranscript = buildMarkedTranscript(args.transcript);
  const user = buildExtractionUser({
    podcastName: args.podcastName,
    episodeTitle: args.episodeTitle,
    markedTranscript,
  });

  try {
    const raw = await deps.llm.completeJson<unknown>({
      system: EXTRACTION_SYSTEM,
      user,
      schemaName: EXTRACTION_SCHEMA_NAME,
      schema: extractionSchema,
    });
    const mentions = validateExtraction(raw, minConfidence);
    deps.log.info("extracted mentions", {
      episode: args.episodeTitle,
      count: mentions.length,
    });
    return mentions;
  } catch (err) {
    deps.log.error("extraction failed", {
      episode: args.episodeTitle,
      err: String(err),
    });
    return [];
  }
}
