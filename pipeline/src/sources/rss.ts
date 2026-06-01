/**
 * RSS (podcast) feed parsing.
 *
 * Podcast RSS is RSS 2.0 with the `itunes:` and `enclosure` extensions. We do a
 * tolerant, dependency-free parse: split on <item>, pull the fields we need.
 * This is intentionally forgiving — real podcast feeds are messy.
 */
import type { EpisodeCandidate } from "../types";

/** Strip CDATA wrappers and decode the handful of XML entities feeds use. */
export function decodeXml(raw: string): string {
  return raw
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();
}

/** Extract the text content of the first `<tag>...</tag>` in `block`. */
function tag(block: string, name: string): string | undefined {
  const re = new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i");
  const m = block.match(re);
  return m ? decodeXml(m[1]!) : undefined;
}

/** Extract an attribute value from a self-closing or open tag. */
function attr(block: string, name: string, a: string): string | undefined {
  const re = new RegExp(`<${name}[^>]*\\b${a}="([^"]*)"`, "i");
  const m = block.match(re);
  return m ? decodeXml(m[1]!) : undefined;
}

/** Parse an iTunes/HH:MM:SS/seconds duration into seconds. */
export function parseDuration(value?: string): number | undefined {
  if (!value) return undefined;
  const v = value.trim();
  if (/^\d+$/.test(v)) return parseInt(v, 10);
  const parts = v.split(":").map((n) => parseInt(n, 10));
  if (parts.some((n) => Number.isNaN(n))) return undefined;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

/**
 * Parse a podcast RSS feed into episode candidates.
 * @param xml      Raw feed body.
 * @param podcastId Catalog podcast id to attribute episodes to.
 */
export function parseRssFeed(xml: string, podcastId: string): EpisodeCandidate[] {
  const items = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  const out: EpisodeCandidate[] = [];

  for (const item of items) {
    const title = tag(item, "title");
    if (!title) continue;

    const guid =
      tag(item, "guid") ??
      attr(item, "enclosure", "url") ??
      tag(item, "link") ??
      title;

    const pubDateRaw = tag(item, "pubDate");
    const pubDate = pubDateRaw ? new Date(pubDateRaw) : undefined;

    out.push({
      podcastId,
      guid: guid.trim(),
      title,
      description: tag(item, "description") ?? tag(item, "itunes:summary"),
      audioUrl: attr(item, "enclosure", "url"),
      durationSeconds: parseDuration(tag(item, "itunes:duration")),
      publishedAt: pubDate && !Number.isNaN(pubDate.getTime()) ? pubDate : undefined,
    });
  }

  return out;
}
