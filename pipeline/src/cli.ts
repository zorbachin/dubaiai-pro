/**
 * CLI entrypoints for the Comb Engine.
 *
 *   tsx src/cli.ts demo               # runs the full loop offline with fakes
 *   tsx src/cli.ts poll-all           # production: poll every active podcast
 *   tsx src/cli.ts ingest <podcastId> # production: poll one podcast
 *   tsx src/cli.ts discover           # production: rank new shows to onboard
 *   tsx src/cli.ts summary            # print catalog stats (no API calls)
 *
 * Production commands load dependencies from the adapter module named by
 * PIPELINE_DEPS_MODULE env var. The default is the JSON file adapter which
 * works with the GitHub Actions / static deployment model. Set it to
 * ./adapters/podsupps.js to use the MySQL DB adapter (podsupps2 native).
 */
import type { PipelineDeps } from "./contracts";
import { consoleLogger } from "./contracts";
import { pollAll, pollPodcast } from "./orchestrator";
import { rankShows } from "./discover/expand";
import { runDemo } from "./demo";

async function loadProductionDeps(): Promise<PipelineDeps> {
  const mod = process.env["PIPELINE_DEPS_MODULE"] ?? "./adapters/json-deps.js";
  const imported: { buildJsonDeps?: (d?: string) => PipelineDeps; buildProductionDeps?: (log?: unknown) => PipelineDeps } =
    await import(/* @vite-ignore */ mod);
  if (imported.buildJsonDeps) return imported.buildJsonDeps();
  if (imported.buildProductionDeps) return imported.buildProductionDeps(consoleLogger);
  throw new Error(`Adapter module must export buildJsonDeps or buildProductionDeps: ${mod}`);
}

async function main() {
  const [cmd, arg] = process.argv.slice(2);

  switch (cmd) {
    case "demo": {
      await runDemo();
      return;
    }
    case "poll-all": {
      const deps = await loadProductionDeps();
      const results = await pollAll(deps, { maxEpisodesPerPodcast: 5 });
      const committed = results.flatMap((r) => r.processed).filter((p) => p.status === "committed");
      consoleLogger.info("poll-all complete", {
        podcasts: results.length,
        episodesCommitted: committed.length,
        mentions: committed.reduce((n, p) => n + p.mentions, 0),
      });
      return;
    }
    case "ingest": {
      if (!arg) throw new Error("usage: ingest <podcastId>");
      const deps = await loadProductionDeps();
      const podcast = await deps.db.getPodcast(arg);
      if (!podcast) throw new Error(`unknown podcast: ${arg}`);
      const result = await pollPodcast(podcast, deps, { maxEpisodes: 10 });
      consoleLogger.info("ingest complete", { podcastId: arg, processed: result.processed.length });
      return;
    }
    case "discover": {
      const deps = await loadProductionDeps();
      const catalog = await deps.db.listActivePodcasts();
      // In production, candidates come from a charts source / suggestions queue.
      const candidates = JSON.parse(process.env.SHOW_CANDIDATES ?? "[]");
      const proposals = rankShows(candidates, catalog, { limit: 20 });
      console.log(JSON.stringify(proposals, null, 2));
      return;
    }
    case "summary": {
      const { JsonCatalogDb } = await import("./adapters/json-db.js");
      const { join } = await import("path");
      const dataDir =
        process.env["DATA_DIR"] ??
        join(new URL(import.meta.url).pathname, "../../data");
      const db = new JsonCatalogDb(dataDir);
      const stats = db.summary();
      console.log("\n── Catalog summary ──────────────────────");
      for (const [k, v] of Object.entries(stats)) console.log(`  ${k.padEnd(12)}: ${v}`);
      console.log("─────────────────────────────────────────\n");
      return;
    }
    default:
      console.log(
        "commands: demo | poll-all | ingest <podcastId> | discover | summary\n" +
          "set PIPELINE_DEPS_MODULE to your adapter (default: json-deps).",
      );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
