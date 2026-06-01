import { describe, it, expect } from "vitest";
import { channelFeedUrl, parseYoutubeFeed } from "../src/sources/youtube";

describe("channelFeedUrl", () => {
  it("builds a feed url from a bare channel id", () => {
    expect(channelFeedUrl("UCabcdefghijklmnopqrstuv")).toBe(
      "https://www.youtube.com/feeds/videos.xml?channel_id=UCabcdefghijklmnopqrstuv",
    );
  });
  it("extracts the channel id from a channel url", () => {
    expect(channelFeedUrl("https://youtube.com/channel/UCabcdefghijklmnopqrstuv")).toContain(
      "channel_id=UCabcdefghijklmnopqrstuv",
    );
  });
  it("returns undefined for handle urls (need API lookup)", () => {
    expect(channelFeedUrl("https://youtube.com/@joerogan")).toBeUndefined();
    expect(channelFeedUrl(null)).toBeUndefined();
  });
});

describe("parseYoutubeFeed", () => {
  const feed = `<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015">
    <entry>
      <yt:videoId>abc123XYZ_-</yt:videoId>
      <title>JRE #2000 - Guest</title>
      <published>2026-05-29T18:00:00+00:00</published>
    </entry>
  </feed>`;

  it("extracts video id, guid and thumbnail", () => {
    const eps = parseYoutubeFeed(feed, "jre");
    expect(eps).toHaveLength(1);
    expect(eps[0]).toMatchObject({
      podcastId: "jre",
      guid: "yt:abc123XYZ_-",
      youtubeId: "abc123XYZ_-",
      youtubeUrl: "https://www.youtube.com/watch?v=abc123XYZ_-",
    });
    expect(eps[0]!.thumbnailUrl).toContain("abc123XYZ_-");
  });
});
