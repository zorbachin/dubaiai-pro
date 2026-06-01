/**
 * The Comb Engine orchestrator.
 *
 * Ties the stages into the agent loop the venture brief asked for:
 *
 *   poll feed -> diff against processed -> for each new episode:
 *     transcribe -> extract -> resolve -> plan -> commit -> mark processed
 *
 * `pollAll` runs this across every active podcast and is what a daily cron (or
 * the admin "Run ingestion" button) invokes.
 */
import type { PipelineDeps } from "./contracts";
import type { CatalogPodcast, EpisodeCandidate } from "./types";
import { parseRssFeed } from "./sources/rss";
import { channelFeedUrl, parseYoutubeFeed } from "./sources/youtube";
import { getTranscript } from "./transcribe/index";
import { extractMentions } from "./extract/extract";
import { resolveMentions } from "./resolve/resolve";
import { buildWritePlan, planIsEmpty } from "./write/plan";

export interface IngestResult {
  guid: string;
  title: string;
  status: "committed" | "skipped" | "error";
  newProducts: number;
  mentions: number;
  reason?: string;
}

export interface PollResult {
  podcastId: string;
  discovered: number;
  processed: IngestResult[];
}

/** Discover episode candidates for a podcast from whichever feed it has. */
export async function discoverEpisodes(
  podcast: CatalogPodcast,
  deps: PipelineDeps,
): Promise<EpisodeCandidate[]> {
  const ytFeed = channelFeedUrl(podcast.youtubeUrl);
  if (ytFeed) {
    const xml = await deps.http.getText(ytFeed);
    return parseYoutubeFeed(xml, podcast.id);
  }
  if (podcast.rssUrl) {
    const xml = await deps.http.getText(podcast.rssUrl);
    return parseRssFeed(xml, podcast.id);
  }
  deps.log.warn("podcast has no ingestable feed", { podcastId: podcast.id });
  return [];
}

/** Process a single already-discovered episode end-to-end. */
export async function ingestEpisode(
  podcast: CatalogPodcast,
  candidate: EpisodeCandidate,
  deps: PipelineDeps,
): Promise<IngestResult> {
  const base = { guid: candidate.guid, title: candidate.title, newProducts: 0, mentions: 0 };
  try {
    const transcript = await getTranscript(candidate, deps);
    if (!transcript) {
      return { ...base, status: "skipped", reason: "no transcript" };
    }

    const extracted = await extractMentions(
      { podcastName: podcast.name, episodeTitle: candidate.title, transcript },
      { llm: deps.llm, log: deps.log, minConfidence: deps.minConfidence },
    );
    if (extracted.length === 0) {
      return { ...base, status: "skipped", reason: "no mentions extracted" };
    }

    const catalog = await deps.db.listProducts();
    const resolved = resolveMentions(extracted, catalog, deps.matchThreshold ?? 0.82);
    const plan = buildWritePlan(candidate, resolved);

    if (planIsEmpty(plan)) {
      return { ...base, status: "skipped", reason: "empty plan" };
    }

    const result = await deps.db.commit(plan);
    deps.log.info("episode committed", {
      guid: candidate.guid,
      newProducts: result.newProducts,
      mentions: result.mentions,
    });
    return {
      ...base,
      status: "committed",
      newProducts: result.newProducts,
      mentions: result.mentions,
    };
  } catch (err) {
    deps.log.error("episode ingest failed", { guid: candidate.guid, err: String(err) });
    return { ...base, status: "error", reason: String(err) };
  }
}

/** Poll one podcast: discover, diff against processed, ingest the new ones. */
export async function pollPodcast(
  podcast: CatalogPodcast,
  deps: PipelineDeps,
  opts: { maxEpisodes?: number } = {},
): Promise<PollResult> {
  const candidates = await discoverEpisodes(podcast, deps);
  const seen = await deps.db.getProcessedEpisodeGuids(podcast.id);
  const fresh = candidates.filter((c) => !seen.has(c.guid));
  const limited = typeof opts.maxEpisodes === "number" ? fresh.slice(0, opts.maxEpisodes) : fresh;

  deps.log.info("polled podcast", {
    podcastId: podcast.id,
    discovered: candidates.length,
    new: fresh.length,
    processing: limited.length,
  });

  const processed: IngestResult[] = [];
  for (const candidate of limited) {
    processed.push(await ingestEpisode(podcast, candidate, deps));
  }
  return { podcastId: podcast.id, discovered: candidates.length, processed };
}

/** Poll every active podcast. The daily-cron entrypoint. */
export async function pollAll(
  deps: PipelineDeps,
  opts: { maxEpisodesPerPodcast?: number } = {},
): Promise<PollResult[]> {
  const podcasts = await deps.db.listActivePodcasts();
  const results: PollResult[] = [];
  for (const podcast of podcasts) {
    try {
      results.push(
        await pollPodcast(podcast, deps, { maxEpisodes: opts.maxEpisodesPerPodcast }),
      );
    } catch (err) {
      deps.log.error("pollPodcast failed", { podcastId: podcast.id, err: String(err) });
      results.push({ podcastId: podcast.id, discovered: 0, processed: [] });
    }
  }
  return results;
}
