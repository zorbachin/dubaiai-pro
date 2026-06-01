/**
 * CLI entrypoints for the Comb Engine.
 *
 *   tsx src/cli.ts demo               # runs the full loop offline with fakes
 *   tsx src/cli.ts poll-all           # production: poll every active podcast
 *   tsx src/cli.ts ingest <podcastId> # production: poll one podcast
 *   tsx src/cli.ts discover           # production: rank new shows to onboard
 *
 * The production commands load their dependencies from the adapter module named
 * by PIPELINE_DEPS_MODULE (default: ./adapters/podsupps.js inside podsupps2),
 * via a runtime dynamic import so this standalone package stays dependency-free
 * and typechecks without the app present.
 */
import type { PipelineDeps } from "./contracts";
import { consoleLogger } from "./contracts";
import { pollAll, pollPodcast } from "./orchestrator";
import { rankShows } from "./discover/expand";
import { runDemo } from "./demo";

async function loadProductionDeps(): Promise<PipelineDeps> {
  const mod = process.env.PIPELINE_DEPS_MODULE ?? "./adapters/podsupps.js";
  const imported: { buildProductionDeps: (log?: unknown) => PipelineDeps } = await import(
    /* @vite-ignore */ mod
  );
  return imported.buildProductionDeps(consoleLogger);
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
    default:
      console.log(
        "commands: demo | poll-all | ingest <podcastId> | discover\n" +
          "set PIPELINE_DEPS_MODULE to your adapter for production commands.",
      );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
