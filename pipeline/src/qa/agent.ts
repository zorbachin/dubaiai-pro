/**
 * QA Agent
 *
 * Checks the live site for:
 *   1. Page health      — every show/product/category page returns 200
 *   2. Image health     — every product image URL in the data files is accessible
 *   3. Link health      — every affiliate/website URL is reachable (follows redirects)
 *
 * Exit code 0 = all green. Exit code 1 = failures found (triggers issue creation
 * in the GitHub Actions workflow).
 *
 * Usage:
 *   SITE_URL=https://www.podsupps.com DATA_DIR=./data npx tsx src/qa/agent.ts
 */
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type { StoredProduct } from "../adapters/json-db";
import type { CatalogPodcast } from "../types";

const SITE_URL = (process.env["SITE_URL"] ?? "https://www.podsupps.com").replace(/\/$/, "");
const DATA_DIR = process.env["DATA_DIR"] ?? join(new URL(import.meta.url).pathname, "../../../data");
const CONCURRENCY = 10;
const TIMEOUT_MS = 12_000;

// ── Helpers ───────────────────────────────────────────────────────────────────

function readJson<T>(name: string, fallback: T): T {
  const p = join(DATA_DIR, name);
  if (!existsSync(p)) return fallback;
  return JSON.parse(readFileSync(p, "utf8")) as T;
}

interface CheckResult {
  url: string;
  status: number | "timeout" | "error";
  ok: boolean;
  note?: string;
}

async function checkUrl(url: string, label: string): Promise<CheckResult> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "PodSupps-QA/0.1" },
    });
    clearTimeout(timer);
    return { url, status: res.status, ok: res.ok, note: label };
  } catch (err) {
    const isTimeout = String(err).includes("abort") || String(err).includes("timeout");
    return { url, status: isTimeout ? "timeout" : "error", ok: false, note: label };
  }
}

/** Run checks in batches of CONCURRENCY. */
async function checkAll(items: { url: string; label: string }[]): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const batch = items.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map((it) => checkUrl(it.url, it.label)));
    results.push(...batchResults);
  }
  return results;
}

// ── Build check lists from the data files ─────────────────────────────────────

function pageChecks(): { url: string; label: string }[] {
  const podcasts = readJson<CatalogPodcast[]>("podcasts.json", []);
  const products = readJson<StoredProduct[]>("products.json", []);
  const pages: { url: string; label: string }[] = [
    { url: SITE_URL + "/", label: "homepage" },
    { url: SITE_URL + "/podcasts", label: "podcasts index" },
    { url: SITE_URL + "/products", label: "products index" },
    { url: SITE_URL + "/marketplace", label: "marketplace" },
  ];
  for (const p of podcasts) pages.push({ url: `${SITE_URL}/podcast/${p.id}`, label: `podcast:${p.id}` });
  // Sample up to 50 product pages to keep the check fast.
  const sample = products.slice(0, 50);
  for (const p of sample) pages.push({ url: `${SITE_URL}/product/${p.id}`, label: `product:${p.id}` });
  return pages;
}

function imageChecks(): { url: string; label: string }[] {
  const products = readJson<StoredProduct[]>("products.json", []);
  return products
    .filter((p): p is StoredProduct & { imageUrl: string } => Boolean(p.imageUrl))
    .map((p) => ({ url: p.imageUrl, label: `img:${p.id}` }));
}

function linkChecks(): { url: string; label: string }[] {
  const products = readJson<StoredProduct[]>("products.json", []);
  const checks: { url: string; label: string }[] = [];
  for (const p of products) {
    const url = p.affiliateUrl ?? p.websiteUrl;
    if (url) checks.push({ url, label: `link:${p.id}` });
  }
  return checks;
}

// ── Reporting ─────────────────────────────────────────────────────────────────

function report(section: string, results: CheckResult[]): number {
  const failures = results.filter((r) => !r.ok);
  const line = (r: CheckResult) =>
    `  ${r.ok ? "✓" : "✗"} [${r.status}] ${r.url}${r.note ? ` (${r.note})` : ""}`;

  console.log(`\n── ${section} (${results.length} checked, ${failures.length} failed) ──`);
  if (failures.length > 0) {
    failures.forEach((r) => console.log(line(r)));
  } else {
    console.log("  All OK");
  }
  return failures.length;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`QA Agent — ${SITE_URL}`);
  console.log(`Data dir: ${DATA_DIR}`);
  console.log(`Started: ${new Date().toISOString()}\n`);

  const [pageResults, imageResults, linkResults] = await Promise.all([
    checkAll(pageChecks()),
    checkAll(imageChecks()),
    checkAll(linkChecks()),
  ]);

  const totalFailed =
    report("Page health", pageResults) +
    report("Image health", imageResults) +
    report("Link health", linkResults);

  console.log(`\nTotal failures: ${totalFailed}`);

  const totalChecked = pageResults.length + imageResults.length + linkResults.length;
  console.log(
    `\n${totalFailed === 0 ? "✅ All clear" : `❌ ${totalFailed}/${totalChecked} checks failed`} — ${new Date().toISOString()}`,
  );

  process.exit(totalFailed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("QA agent crashed:", err);
  process.exit(1);
});
