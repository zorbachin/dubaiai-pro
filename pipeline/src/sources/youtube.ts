/**
 * YouTube channel feed parsing.
 *
 * YouTube publishes a free, key-less Atom feed per channel at:
 *   https://www.youtube.com/feeds/videos.xml?channel_id=UCxxxx
 * For shows native to YouTube (Rogan, Lex, etc.) this is the cheapest ingestion
 * path: it gives videoId + title + published, and captions are usually free.
 */
import type { EpisodeCandidate } from "../types";
import { decodeXml } from "./rss";

/**
 * Derive a channel feed URL from a channel URL or id.
 * Accepts `https://youtube.com/channel/UC...`, a bare `UC...` id, or returns
 * undefined for handle URLs (`@handle`) which require an API lookup first.
 */
export function channelFeedUrl(channelUrlOrId?: string | null): string | undefined {
  if (!channelUrlOrId) return undefined;
  const v = channelUrlOrId.trim();
  if (/^UC[\w-]{20,}$/.test(v)) {
    return `https://www.youtube.com/feeds/videos.xml?channel_id=${v}`;
  }
  const m = v.match(/channel\/(UC[\w-]{20,})/);
  if (m) return `https://www.youtube.com/feeds/videos.xml?channel_id=${m[1]}`;
  return undefined;
}

function entryTag(block: string, name: string): string | undefined {
  const re = new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i");
  const m = block.match(re);
  return m ? decodeXml(m[1]!) : undefined;
}

/**
 * Parse a YouTube channel Atom feed into episode candidates.
 * @param xml       Raw Atom feed.
 * @param podcastId Catalog podcast id to attribute episodes to.
 */
export function parseYoutubeFeed(xml: string, podcastId: string): EpisodeCandidate[] {
  const entries = xml.match(/<entry[\s\S]*?<\/entry>/gi) ?? [];
  const out: EpisodeCandidate[] = [];

  for (const entry of entries) {
    const videoId = entryTag(entry, "yt:videoId");
    const title = entryTag(entry, "title");
    if (!videoId || !title) continue;

    const publishedRaw = entryTag(entry, "published");
    const published = publishedRaw ? new Date(publishedRaw) : undefined;

    out.push({
      podcastId,
      guid: `yt:${videoId}`,
      youtubeId: videoId,
      youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
      title,
      description: entryTag(entry, "media:description"),
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      publishedAt: published && !Number.isNaN(published.getTime()) ? published : undefined,
    });
  }

  return out;
}
