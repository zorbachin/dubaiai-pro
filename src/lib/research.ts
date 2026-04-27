import type { ResearchHit } from "./types";
import { getDomain } from "./utils";

// Lightweight web research. We avoid hard dependencies on a paid SERP API in
// the MVP; instead we hit DuckDuckGo's HTML endpoint which returns plain
// markup we can parse server-side. If it fails (rate limit, network), we
// degrade gracefully and the model relies on crawl + user-supplied data.
//
// Slot in Brave Search / SerpAPI / Tavily here when you have a key.

const DDG_ENDPOINT = "https://duckduckgo.com/html/";

async function ddgSearch(query: string, max = 6): Promise<ResearchHit[]> {
  try {
    const res = await fetch(DDG_ENDPOINT + "?q=" + encodeURIComponent(query), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AI-Audit-Engine/0.1; +https://dubaiai.pro/audit)"
      },
      // DDG sometimes throttles; keep this snappy.
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) return [];
    const html = await res.text();
    const hits: ResearchHit[] = [];
    const re =
      /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) && hits.length < max) {
      const rawUrl = decodeURIComponent(m[1]).replace(/^\/\/duckduckgo\.com\/l\/\?uddg=/, "");
      const url = rawUrl.split("&")[0];
      if (!/^https?:\/\//.test(url)) continue;
      const title = stripTags(m[2]);
      const snippet = stripTags(m[3]);
      hits.push({ kind: "search", url, title, snippet });
    }
    return hits;
  } catch {
    return [];
  }
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export interface ResearchInput {
  businessName: string;
  websiteUrl: string;
  founders?: string[];
  industry?: string;
}

export async function gatherResearch(input: ResearchInput): Promise<ResearchHit[]> {
  const queries: string[] = [
    `"${input.businessName}" company`,
    `"${input.businessName}" funding OR "raised" OR investors`,
    `"${input.businessName}" reviews`,
    `"${input.businessName}" press OR launch OR announces`,
    `site:linkedin.com/company "${input.businessName}"`,
    `site:${getDomain(input.websiteUrl)} about`
  ];
  if (input.founders?.length) {
    for (const f of input.founders.slice(0, 2)) {
      queries.push(`"${f}" "${input.businessName}"`);
    }
  }
  if (input.industry) {
    queries.push(`"${input.businessName}" "${input.industry}"`);
  }

  const all: ResearchHit[] = [];
  for (const q of queries) {
    const r = await ddgSearch(q, 4);
    all.push(...r);
    if (all.length >= 25) break;
  }

  // de-dupe by URL
  const byUrl = new Map<string, ResearchHit>();
  for (const h of all) if (!byUrl.has(h.url)) byUrl.set(h.url, h);
  return [...byUrl.values()].slice(0, 20);
}
