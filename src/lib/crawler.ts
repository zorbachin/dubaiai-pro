import * as cheerio from "cheerio";
import type { CrawledPage } from "./types";
import { getDomain, truncate } from "./utils";

const USER_AGENT =
  "Mozilla/5.0 (compatible; AI-Audit-Engine/0.1; +https://dubaiai.pro/audit)";
const TIMEOUT_MS = 12_000;
const MAX_BYTES = 2_000_000; // 2 MB cap per page

const CANDIDATE_PATHS = [
  "/",
  "/about",
  "/about-us",
  "/company",
  "/team",
  "/pricing",
  "/plans",
  "/blog",
  "/insights",
  "/news",
  "/contact",
  "/contact-us"
];

async function fetchHtml(url: string): Promise<{ status: number; html: string } | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml"
      },
      redirect: "follow",
      signal: ctrl.signal
    });
    if (!res.ok) return { status: res.status, html: "" };
    const reader = res.body?.getReader();
    if (!reader) return { status: res.status, html: await res.text() };
    let received = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.length;
      chunks.push(value);
      if (received >= MAX_BYTES) break;
    }
    const buf = new Uint8Array(received);
    let offset = 0;
    for (const c of chunks) { buf.set(c, offset); offset += c.length; }
    return { status: res.status, html: new TextDecoder("utf-8").decode(buf) };
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

function detectTech(html: string, headers?: Record<string, string>): string[] {
  const hints = new Set<string>();
  const h = html.toLowerCase();
  const checks: [string, RegExp][] = [
    ["Next.js", /\/_next\/|__next_data__/],
    ["React", /react(-dom)?@|data-reactroot/],
    ["Vue", /\bvue(\.runtime)?\.js|data-v-app/],
    ["Webflow", /webflow\.js|data-wf-page/],
    ["Squarespace", /static\.squarespace\.com|squarespace-headers/],
    ["Wix", /static\.wixstatic\.com|wix-bolt/],
    ["WordPress", /wp-content\/|wp-includes\//],
    ["Shopify", /cdn\.shopify\.com|shopify\.theme/],
    ["HubSpot", /hs-scripts\.com|hubspot/],
    ["Google Analytics", /gtag\(\s*'config'|google-analytics\.com\/analytics\.js/],
    ["GA4", /gtag\/js\?id=g-|gtag\(\s*'event'/],
    ["Segment", /cdn\.segment\.com|analytics\.js/],
    ["Stripe", /js\.stripe\.com/],
    ["Calendly", /calendly\.com/],
    ["Intercom", /widget\.intercom\.io/],
    ["Mailchimp", /mailchimp\.com\/|mc\.us/],
    ["Tailwind CSS", /tailwind|tw-/],
    ["Bootstrap", /bootstrap(\.min)?\.css|class=\"[^\"]*\bcol-(?:sm|md|lg)-/],
    ["Framer", /framer\.com|framerusercontent/],
    ["Zapier", /zapier\.com/],
    ["Cloudflare", /cdn-cgi\//]
  ];
  for (const [name, re] of checks) if (re.test(h)) hints.add(name);
  if (headers?.["x-powered-by"]) hints.add(`Server: ${headers["x-powered-by"]}`);
  return [...hints];
}

function parsePage(url: string, status: number, html: string): CrawledPage {
  const $ = cheerio.load(html);
  $("script, style, noscript").remove();

  const title = $("title").first().text().trim() || undefined;
  const description =
    $('meta[name="description"]').attr("content")?.trim() ||
    $('meta[property="og:description"]').attr("content")?.trim() ||
    undefined;

  const headings: string[] = [];
  $("h1, h2, h3").each((_, el) => {
    const t = $(el).text().trim().replace(/\s+/g, " ");
    if (t && t.length < 200) headings.push(t);
  });

  const ctas: string[] = [];
  $("a, button").each((_, el) => {
    const t = $(el).text().trim().replace(/\s+/g, " ");
    if (!t || t.length > 60) return;
    if (/sign[\s-]?up|book|schedule|get started|contact|demo|free trial|buy|join|subscribe|download|talk to/i.test(t)) {
      ctas.push(t);
    }
  });

  const forms = $("form").length;

  const links: { href: string; text: string }[] = [];
  $("a[href]").each((_, el) => {
    const href = ($(el).attr("href") || "").trim();
    const text = $(el).text().trim().replace(/\s+/g, " ");
    if (href && !href.startsWith("#") && text) links.push({ href, text });
  });

  const text = $("body").text().replace(/\s+/g, " ").trim();
  const techHints = detectTech(html);

  return {
    url,
    status,
    title,
    description,
    headings: dedupe(headings).slice(0, 30),
    textPreview: truncate(text, 4000),
    ctas: dedupe(ctas).slice(0, 20),
    forms,
    links: links.slice(0, 80),
    techHints
  };
}

function dedupe<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

export async function crawlSite(rootUrl: string): Promise<CrawledPage[]> {
  const root = new URL(rootUrl);
  const domain = getDomain(rootUrl);
  const pages: CrawledPage[] = [];
  const seen = new Set<string>();

  for (const path of CANDIDATE_PATHS) {
    const target = new URL(path, root.origin).toString();
    if (seen.has(target)) continue;
    seen.add(target);
    const r = await fetchHtml(target);
    if (!r) continue;
    if (r.status >= 400) continue;
    if (!r.html) continue;
    pages.push(parsePage(target, r.status, r.html));
    if (pages.length >= 6) break;
  }

  // If still empty, at least try the root with a "www" swap.
  if (pages.length === 0) {
    const alt = root.hostname.startsWith("www.")
      ? root.toString().replace("www.", "")
      : root.toString().replace(root.hostname, "www." + root.hostname);
    const r = await fetchHtml(alt);
    if (r?.html) pages.push(parsePage(alt, r.status, r.html));
  }

  return pages.map((p) => ({
    ...p,
    headings: p.headings.length
      ? p.headings
      : [`(no headings on ${getDomain(p.url) || domain})`]
  }));
}
