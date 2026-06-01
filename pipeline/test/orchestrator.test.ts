import { describe, it, expect } from "vitest";
import { makeDemoDeps } from "../src/demo";
import { ingestEpisode, pollPodcast } from "../src/orchestrator";

describe("orchestrator (end-to-end, fakes)", () => {
  it("runs the full loop and commits a coherent plan", async () => {
    const deps = makeDemoDeps();
    const podcast = (await deps.db.listActivePodcasts())[0]!;
    const result = await pollPodcast(podcast, deps);

    expect(result.discovered).toBe(1);
    expect(result.processed).toHaveLength(1);
    expect(result.processed[0]!.status).toBe("committed");

    const plan = deps.db.committed[0]!;
    // AG1 already in catalog -> matched, not duplicated.
    expect(plan.newProducts.map((p) => p.id)).not.toContain("ag1-athletic-greens");
    // Eight Sleep + Why We Sleep are novel.
    expect(plan.newProducts.length).toBe(2);
    // All three mentions recorded.
    expect(plan.mentions.length).toBe(3);
    // Sponsor promo code captured.
    expect(plan.promoCodes.map((c) => c.code)).toContain("OPTIMIZE");
    // Timestamps carried through for player deep-links.
    expect(plan.mentions.find((m) => m.productId === "ag1-athletic-greens")?.timestampSeconds).toBe(30);
  });

  it("skips already-processed episodes on a second poll", async () => {
    const deps = makeDemoDeps();
    // Pretend the only episode was already processed.
    deps.db.getProcessedEpisodeGuids = async () => new Set(["yt:DEMO_VIDEO_1"]);
    const podcast = (await deps.db.listActivePodcasts())[0]!;
    const result = await pollPodcast(podcast, deps);
    expect(result.processed).toHaveLength(0);
    expect(deps.db.committed).toHaveLength(0);
  });

  it("skips an episode with no transcript", async () => {
    const deps = makeDemoDeps();
    // Empty captions + no audio url -> no transcript source.
    deps.http.getText = async (url: string) => {
      if (url.includes("feeds/videos.xml"))
        return `<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015"><entry><yt:videoId>NOCAPS</yt:videoId><title>No captions ep</title></entry></feed>`;
      return "<transcript></transcript>";
    };
    const podcast = (await deps.db.listActivePodcasts())[0]!;
    const candidate = { podcastId: podcast.id, guid: "yt:NOCAPS", youtubeId: "NOCAPS", title: "No captions ep" };
    const res = await ingestEpisode(podcast, candidate, deps);
    expect(res.status).toBe("skipped");
    expect(res.reason).toBe("no transcript");
  });
});
