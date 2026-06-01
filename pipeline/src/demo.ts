/**
 * Offline end-to-end demo.
 *
 * Wires the real pipeline to in-memory fakes (a canned YouTube feed, a canned
 * caption track, a deterministic "LLM" that returns structured mentions, and an
 * in-memory catalog) so you can watch the whole loop run with zero secrets:
 *
 *   poll -> diff -> transcribe -> extract -> resolve -> plan -> commit
 *
 * Run: `pnpm --dir pipeline demo`  (or `npm run demo`)
 */
import type {
  CatalogDb,
  HttpClient,
  LlmClient,
  PipelineDeps,
  Transcriber,
} from "./contracts";
import { consoleLogger } from "./contracts";
import type { CatalogProduct, Transcript, WritePlan } from "./types";
import { pollPodcast } from "./orchestrator";

const SAMPLE_VIDEO_ID = "DEMO_VIDEO_1";

const sampleChannelFeed = `<?xml version="1.0"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015">
  <entry>
    <yt:videoId>${SAMPLE_VIDEO_ID}</yt:videoId>
    <title>The Optimization Episode — Sleep, Greens &amp; Focus</title>
    <published>2026-05-30T12:00:00+00:00</published>
    <media:description>We get into AG1, the Eight Sleep pod, and a great book.</media:description>
  </entry>
</feed>`;

const sampleCaptions = `<?xml version="1.0"?>
<transcript>
  <text start="30.0" dur="6.0">This episode is brought to you by AG1. Use code OPTIMIZE for a free travel pack.</text>
  <text start="600.0" dur="5.0">Honestly I sleep on the Eight Sleep pod every single night, it changed my recovery.</text>
  <text start="1820.0" dur="5.0">The book Why We Sleep by Matthew Walker is a must read.</text>
</transcript>`;

const fakeHttp: HttpClient = {
  async getText(url: string) {
    if (url.includes("feeds/videos.xml")) return sampleChannelFeed;
    if (url.includes("timedtext")) return sampleCaptions;
    throw new Error(`unexpected URL in demo: ${url}`);
  },
};

/** A deterministic stand-in for invokeLLM that returns structured mentions. */
const fakeLlm: LlmClient = {
  async completeJson<T>() {
    return {
      mentions: [
        {
          productName: "AG1",
          brand: "Athletic Greens",
          category: "Supplements",
          mentionType: "sponsor",
          quote: "This episode is brought to you by AG1.",
          bulletPoints: ["All-in-one greens powder", "Free travel pack with code"],
          promoCode: "OPTIMIZE",
          promoDiscount: "free travel pack",
          timestampSeconds: 30,
          confidence: 0.98,
        },
        {
          productName: "Pod",
          brand: "Eight Sleep",
          category: "Sleep",
          mentionType: "personal",
          quote: "I sleep on the Eight Sleep pod every single night, it changed my recovery.",
          bulletPoints: ["Temperature-regulating mattress cover", "Host uses nightly"],
          timestampSeconds: 600,
          confidence: 0.9,
        },
        {
          productName: "Why We Sleep",
          brand: "Matthew Walker",
          category: "Books",
          mentionType: "personal",
          quote: "Why We Sleep by Matthew Walker is a must read.",
          bulletPoints: ["Book on the science of sleep"],
          timestampSeconds: 1820,
          confidence: 0.85,
        },
      ],
    } as T;
  },
};

const fakeTranscriber: Transcriber = {
  async transcribe(): Promise<Transcript> {
    return { text: "", segments: [], source: "whisper" };
  },
};

/** In-memory catalog that already contains AG1 — so it should MATCH, not duplicate. */
function makeFakeDb(): CatalogDb & { committed: WritePlan[] } {
  const existing: CatalogProduct[] = [
    { id: "ag1-athletic-greens", name: "AG1", brand: "Athletic Greens", category: "Supplements" },
  ];
  const committed: WritePlan[] = [];
  return {
    committed,
    async listActivePodcasts() {
      return [{ id: "demo-show", name: "The Optimization Podcast", youtubeUrl: "https://youtube.com/channel/UC0000000000000000000001", isActive: true }];
    },
    async getPodcast(id) {
      return { id, name: "The Optimization Podcast", youtubeUrl: "https://youtube.com/channel/UC0000000000000000000001", isActive: true };
    },
    async listProducts() {
      return existing;
    },
    async getProcessedEpisodeGuids() {
      return new Set<string>();
    },
    async commit(plan) {
      committed.push(plan);
      return {
        newProducts: plan.newProducts.length,
        mentions: plan.mentions.length,
        promoCodes: plan.promoCodes.length,
      };
    },
  };
}

export function makeDemoDeps(): PipelineDeps & { db: ReturnType<typeof makeFakeDb> } {
  const db = makeFakeDb();
  return { http: fakeHttp, llm: fakeLlm, transcriber: fakeTranscriber, db, log: consoleLogger };
}

export async function runDemo(): Promise<void> {
  const deps = makeDemoDeps();
  const podcast = (await deps.db.listActivePodcasts())[0]!;
  const result = await pollPodcast(podcast, deps);

  const plan = deps.db.committed[0];
  console.log("\n──────── DEMO RESULT ────────");
  console.log(`Discovered episodes : ${result.discovered}`);
  console.log(`Episodes processed  : ${result.processed.length}`);
  for (const p of result.processed) {
    console.log(`  • ${p.title} -> ${p.status} (${p.mentions} mentions, ${p.newProducts} new products)`);
  }
  if (plan) {
    console.log(`\nNew products created : ${plan.newProducts.map((p) => `${p.brand} ${p.name}`).join(", ") || "(none)"}`);
    console.log(`AG1 matched existing : ${plan.mentions.some((m) => m.productId === "ag1-athletic-greens") ? "yes ✓ (no duplicate)" : "NO ✗"}`);
    console.log(`Promo codes captured : ${plan.promoCodes.map((c) => c.code).join(", ") || "(none)"}`);
    console.log(`Cross-show stats     : ${plan.statUpdates.map((s) => `${s.productId}=${s.crossPodcastCount}`).join(", ")}`);
  }
  console.log("─────────────────────────────\n");
}
