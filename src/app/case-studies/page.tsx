import Link from "next/link";
import { requireServiceClient } from "@/lib/supabase/server";
import { getDomain } from "@/lib/utils";
import type { AuditReport } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Case studies · DubaiAI.pro" };

interface FeaturedRow {
  id: string;
  business_name: string;
  website_url: string;
  ai_readiness_score: number | null;
  report: AuditReport | null;
  featured_at: string | null;
}

async function loadFeatured(): Promise<FeaturedRow[]> {
  const sb = requireServiceClient();
  const { data, error } = await sb
    .from("audits")
    .select("id, business_name, website_url, ai_readiness_score, report, featured_at")
    .eq("is_featured", true)
    .eq("status", "complete")
    .order("featured_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return (data as FeaturedRow[]) ?? [];
}

export default async function CaseStudiesPage() {
  const items = await loadFeatured();

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <span className="pill-gold">Case studies</span>
      <h1 className="mt-3 font-display text-4xl font-bold">Real audits we&apos;ve run.</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Each of these is a full AI-readiness audit — generated through the same engine you can run on your own business below. Every claim is sourced from a public URL; what we couldn&apos;t verify is marked.
      </p>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {items.map((it) => (
            <CaseStudyCard key={it.id} row={it} />
          ))}
        </div>
      )}

      <div className="mt-16 card flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h3 className="font-display text-xl font-bold">Want one for your business?</h3>
          <p className="mt-1 text-muted">~60 seconds. PDF + report URL emailed to you. Free in beta.</p>
        </div>
        <Link href="/audit" className="btn-primary">Run my audit →</Link>
      </div>
    </div>
  );
}

function CaseStudyCard({ row }: { row: FeaturedRow }) {
  const r = row.report;
  const score = row.ai_readiness_score ?? r?.AI_readiness_score ?? 0;
  const tone =
    score >= 70 ? "text-emerald-400" : score >= 40 ? "text-gold" : "text-orange-400";
  const top = r?.top_automation_opportunities?.[0];
  return (
    <Link
      href={`/audit/${row.id}`}
      className="card group block transition hover:border-accent/50"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="h-section">{getDomain(row.website_url)}</div>
          <h3 className="mt-2 font-display text-xl font-bold group-hover:text-accent">
            {row.business_name}
          </h3>
          {r?.classification?.industry && (
            <div className="mt-1 text-xs text-muted">{r.classification.industry}</div>
          )}
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold leading-none ${tone}`}>{score}</div>
          <div className="text-xs text-muted">/100</div>
        </div>
      </div>
      {top && (
        <div className="mt-5">
          <div className="h-section">Top opportunity</div>
          <p className="mt-1 line-clamp-2 text-ink">
            <strong className="text-ink">{top.title}.</strong>{" "}
            <span className="text-muted">{top.description}</span>
          </p>
        </div>
      )}
      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="text-muted">Read the full audit</span>
        <span className="text-accent group-hover:translate-x-0.5 transition">→</span>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 card">
      <h3 className="font-display text-lg font-bold">No case studies yet.</h3>
      <p className="mt-1 text-muted">
        Add URLs to <code>case-studies.config.ts</code>, then run{" "}
        <code className="rounded bg-bg px-1 py-0.5">npm run seed:case-studies</code>{" "}
        to generate audits and pin them here.
      </p>
    </div>
  );
}
