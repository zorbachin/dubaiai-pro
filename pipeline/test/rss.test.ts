import { describe, it, expect } from "vitest";
import { parseRssFeed, parseDuration, decodeXml } from "../src/sources/rss";

describe("parseDuration", () => {
  it("parses seconds, mm:ss and hh:mm:ss", () => {
    expect(parseDuration("90")).toBe(90);
    expect(parseDuration("2:30")).toBe(150);
    expect(parseDuration("1:02:03")).toBe(3723);
    expect(parseDuration(undefined)).toBeUndefined();
    expect(parseDuration("abc")).toBeUndefined();
  });
});

describe("decodeXml", () => {
  it("unwraps CDATA and decodes entities", () => {
    expect(decodeXml("<![CDATA[Hello & <b>world</b>]]>")).toBe("Hello & <b>world</b>");
    expect(decodeXml("Tim &amp; Eric&#39;s")).toBe("Tim & Eric's");
  });
});

describe("parseRssFeed", () => {
  const feed = `<rss><channel>
    <item>
      <title><![CDATA[Episode 100: Sleep Science]]></title>
      <guid isPermaLink="false">ep-100</guid>
      <pubDate>Wed, 28 May 2026 10:00:00 GMT</pubDate>
      <itunes:duration>1:30:00</itunes:duration>
      <enclosure url="https://cdn.example.com/ep100.mp3" type="audio/mpeg" length="1"/>
      <description>All about sleep.</description>
    </item>
    <item>
      <title>Episode 99</title>
      <enclosure url="https://cdn.example.com/ep99.mp3" type="audio/mpeg"/>
    </item>
  </channel></rss>`;

  it("extracts episodes with guid, audio, duration and date", () => {
    const eps = parseRssFeed(feed, "demo");
    expect(eps).toHaveLength(2);
    expect(eps[0]).toMatchObject({
      podcastId: "demo",
      guid: "ep-100",
      title: "Episode 100: Sleep Science",
      audioUrl: "https://cdn.example.com/ep100.mp3",
      durationSeconds: 5400,
    });
    expect(eps[0]!.publishedAt?.getUTCFullYear()).toBe(2026);
  });

  it("falls back to enclosure url as guid when guid missing", () => {
    const eps = parseRssFeed(feed, "demo");
    expect(eps[1]!.guid).toBe("https://cdn.example.com/ep99.mp3");
  });
});
