/**
 * Seed the public /case-studies page.
 *
 * Reads URLs from ../case-studies.config.ts, runs the full audit pipeline
 * (crawl → research → generate → persist) for each one, and marks the
 * resulting audit as `is_featured = true`.
 *
 * Usage:
 *   npm run seed:case-studies
 *
 * Requires .env.local with:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   OPENAI_API_KEY  (without it, audits fall back to the mock template)
 *
 * No emails are sent.
 */

import { CASE_STUDIES } from "../case-studies.config";
import { requireServiceClient } from "../src/lib/supabase/server";
import { runAudit } from "../src/lib/pipeline";
import { normaliseUrl } from "../src/lib/utils";
import { flags } from "../src/lib/env";

const SEED_EMAIL = "case-studies@dubaiai.pro";

async function main() {
  if (!flags.hasSupabase) {
    console.error("Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY to .env.local.");
    process.exit(1);
  }
  if (!flags.hasOpenAI) {
    console.warn("⚠ OPENAI_API_KEY not set — audits will use the mock template.");
  }

  const sb = requireServiceClient();
  const force = process.argv.includes("--force");

  for (const cs of CASE_STUDIES) {
    const url = normaliseUrl(cs.websiteUrl);
    if (!url) {
      console.error(`✗ skipping invalid URL: ${cs.websiteUrl}`);
      continue;
    }

    // Already featured? skip unless --force
    const { data: existing } = await sb
      .from("audits")
      .select("id, status, is_featured")
      .eq("website_url", url)
      .eq("is_featured", true)
      .maybeSingle();

    if (existing && !force) {
      console.log(`→ ${cs.businessName.padEnd(22)} already featured (${existing.id}), skipping. Pass --force to re-run.`);
      continue;
    }

    // Upsert company
    await sb.from("companies").upsert(
      {
        name: cs.businessName,
        website_url: url,
        industry: cs.industry ?? null,
        founders: cs.founders?.length ? cs.founders : null
      },
      { onConflict: "website_url" }
    );

    // Insert a fresh audit row
    const { data: audit, error } = await sb
      .from("audits")
      .insert({
        business_name: cs.businessName,
        website_url: url,
        founders: cs.founders ?? null,
        industry: cs.industry ?? null,
        contact_email: SEED_EMAIL,
        main_goal: "unsure",
        status: "queued",
        status_message: "Case-study seed.",
        is_featured: true,
        featured_at: new Date().toISOString()
      })
      .select("id")
      .single();

    if (error || !audit) {
      console.error(`✗ ${cs.businessName}: failed to create audit row:`, error?.message);
      continue;
    }

    console.log(`→ ${cs.businessName.padEnd(22)} running pipeline (${audit.id})…`);
    try {
      await runAudit({
        auditId: audit.id,
        businessName: cs.businessName,
        websiteUrl: url,
        founders: cs.founders,
        industry: cs.industry,
        contactEmail: SEED_EMAIL,
        mainGoal: "unsure",
        skipEmail: true
      });
      const { data: done } = await sb
        .from("audits")
        .select("ai_readiness_score, status")
        .eq("id", audit.id)
        .maybeSingle();
      console.log(`✓ ${cs.businessName.padEnd(22)} ${done?.status} — score ${done?.ai_readiness_score ?? "?"}/100`);
    } catch (err) {
      console.error(`✗ ${cs.businessName}: pipeline failed:`, err instanceof Error ? err.message : err);
    }
  }

  console.log("\nDone. Visit /case-studies to see the results.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
