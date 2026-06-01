/**
 * Transcription stage.
 *
 * Strategy (cheapest first):
 *   1. YouTube timed-text captions — free, already timestamped.
 *   2. Whisper via the Transcriber adapter — for audio-only shows.
 *
 * The output is always a {text, segments} Transcript. `buildMarkedTranscript`
 * then renders it with inline [mm:ss] markers so the extractor can attribute
 * each mention to a real timestamp (which powers the player deep-links).
 */
import type { HttpClient, Transcriber, Logger } from "../contracts";
import type { EpisodeCandidate, Transcript, TranscriptSegment } from "../types";
import { decodeXml } from "../sources/rss";

/** Parse YouTube's timedtext XML (`<text start="12.3" dur="2.1">hi</text>`). */
export function parseTimedText(xml: string): TranscriptSegment[] {
  const nodes = xml.match(/<text[^>]*>[\s\S]*?<\/text>/gi) ?? [];
  const segments: TranscriptSegment[] = [];
  for (const node of nodes) {
    const start = parseFloat(node.match(/\bstart="([\d.]+)"/i)?.[1] ?? "NaN");
    const dur = parseFloat(node.match(/\bdur="([\d.]+)"/i)?.[1] ?? "0");
    const text = decodeXml(node.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    if (Number.isNaN(start) || !text) continue;
    segments.push({ start, end: start + (Number.isNaN(dur) ? 0 : dur), text });
  }
  return segments;
}

/** Format seconds as M:SS or H:MM:SS. */
export function formatTimestamp(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  return (h > 0 ? `${h}:` : "") + `${mm}:${String(sec).padStart(2, "0")}`;
}

/**
 * Render a transcript with periodic [mm:ss] markers so the LLM can cite
 * timestamps. A marker is emitted at most every `everySeconds` of content to
 * keep the prompt compact on long episodes.
 */
export function buildMarkedTranscript(t: Transcript, everySeconds = 30): string {
  if (t.segments.length === 0) return t.text;
  const lines: string[] = [];
  let nextMark = 0;
  for (const seg of t.segments) {
    if (seg.start >= nextMark) {
      lines.push(`[${formatTimestamp(seg.start)}] ${seg.text}`);
      nextMark = seg.start + everySeconds;
    } else {
      lines.push(seg.text);
    }
  }
  return lines.join("\n");
}

async function fetchYoutubeCaptions(
  http: HttpClient,
  videoId: string,
  log: Logger,
): Promise<Transcript | null> {
  const url = `https://www.youtube.com/api/timedtext?lang=en&v=${videoId}`;
  try {
    const xml = await http.getText(url);
    const segments = parseTimedText(xml);
    if (segments.length === 0) return null;
    return {
      text: segments.map((s) => s.text).join(" "),
      segments,
      source: "youtube-captions",
      language: "en",
    };
  } catch (err) {
    log.warn("youtube captions fetch failed", { videoId, err: String(err) });
    return null;
  }
}

/**
 * Obtain a transcript for an episode using the cheapest viable source.
 * Returns null if no transcript could be produced (caller skips the episode).
 */
export async function getTranscript(
  candidate: EpisodeCandidate,
  deps: { http: HttpClient; transcriber: Transcriber; log: Logger },
): Promise<Transcript | null> {
  if (candidate.youtubeId) {
    const captions = await fetchYoutubeCaptions(deps.http, candidate.youtubeId, deps.log);
    if (captions) return captions;
    deps.log.info("no youtube captions; falling back to whisper", {
      guid: candidate.guid,
    });
  }

  if (candidate.audioUrl) {
    try {
      return await deps.transcriber.transcribe(candidate.audioUrl, { language: "en" });
    } catch (err) {
      deps.log.error("whisper transcription failed", {
        guid: candidate.guid,
        err: String(err),
      });
      return null;
    }
  }

  deps.log.warn("no transcript source available", { guid: candidate.guid });
  return null;
}
