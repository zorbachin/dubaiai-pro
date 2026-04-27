import { notFound } from "next/navigation";
import { requireServiceClient } from "@/lib/supabase/server";
import type { AuditReport, AuditRow } from "@/lib/types";
import { ScoreBlock } from "@/components/report/score";
import { OpportunityCard } from "@/components/report/opportunity-card";
import { ReportCTA } from "@/components/report/cta";
import { formatUSD, getDomain } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function loadAudit(id: string): Promise<AuditRow | null> {
  const sb = requireServiceClient();
  const { data, error } = await sb.from("audits").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error(error);
    return null;
  }
  return (data as AuditRow) ?? null;
}

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const audit = await loadAudit(id);
  if (!audit) notFound();
  if (audit.status !== "complete" || !audit.report) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16">
        <h1 className="font-display text-3xl font-bold">Your audit is still in progress.</h1>
        <p className="mt-2 text-muted">Status: {audit.status}. Refresh this page in a moment, or watch the live status.</p>
        <a href={`/audit/${audit.id}/status`} className="btn-primary mt-6">Open status →</a>
      </div>
    );
  }

  const r: AuditReport = audit.report;
  const domain = getDomain(r.website_url);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="pill-gold">AI audit</span>
          <h1 className="mt-3 font-display text-4xl font-bold">{r.business_name}</h1>
          <a href={r.website_url} target="_blank" rel="noreferrer" className="text-muted hover:text-ink">
            {domain} ↗
          </a>
        </div>
        <div className="flex gap-2">
          <a className="btn-ghost" href={`/api/audits/${audit.id}/pdf`}>Download PDF</a>
        </div>
      </div>

      {/* Top: summary + score */}
      <div className="mt-8 grid gap-4 md:grid-cols-[1fr_360px]">
        <div className="card">
          <div className="h-section">Executive summary</div>
          <p className="mt-3 text-lg leading-relaxed">{r.company_summary}</p>
        </div>
        <ScoreBlock score={r.AI_readiness_score} explanation={r.AI_readiness_explanation} />
      </div>

      {/* What the business does */}
      <Section title="What the business appears to do">
        <p className="text-ink">{r.likely_business_model}</p>
        <p className="mt-3 text-muted">{r.mission_positioning}</p>
        <div className="mt-4 card bg-bg/50">
          <div className="h-section">Founder research</div>
          <p className="mt-2 text-muted">{r.founder_research}</p>
        </div>
      </Section>

      {/* Tech maturity */}
      <Section title="Current digital / tech maturity">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card">
            <div className="h-section">Detected stack</div>
            <ul className="mt-3 space-y-1.5 text-ink">
              {r.current_tech_stack.map((s, i) => <li key={i}>• {s}</li>)}
            </ul>
          </div>
          <div className="card">
            <div className="h-section">Website observations</div>
            <ul className="mt-3 space-y-1.5 text-ink">
              {r.website_observations.map((s, i) => <li key={i}>• {s}</li>)}
            </ul>
          </div>
        </div>
      </Section>

      {/* Top opportunities */}
      <Section title="Top AI implementation opportunities">
        <div className="grid gap-4">
          {r.top_automation_opportunities.map((o, i) => (
            <OpportunityCard key={i} o={o} index={i} />
          ))}
        </div>
      </Section>

      {/* Quick wins */}
      <Section title="Quick wins (this week)">
        <div className="grid gap-4 md:grid-cols-3">
          {r.quick_wins.map((o, i) => (
            <OpportunityCard key={i} o={o} />
          ))}
        </div>
      </Section>

      {/* Roadmap */}
      <Section title="30-day roadmap">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {r.implementation_roadmap.map((w, i) => (
            <div key={i} className="card">
              <div className="text-2xl font-bold text-gold">{w.week}</div>
              <div className="mt-1 font-display text-lg font-bold">{w.goal}</div>
              <ul className="mt-3 space-y-1 text-sm text-muted">
                {w.steps.map((s, j) => <li key={j}>• {s}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ROI */}
      <Section title="Estimated ROI range">
        <div className="card">
          <div className="flex flex-wrap items-baseline gap-3">
            <div className="text-3xl font-bold text-gold">{formatUSD(r.estimated_value.range_low_usd)}</div>
            <div className="text-muted">to</div>
            <div className="text-3xl font-bold text-gold">{formatUSD(r.estimated_value.range_high_usd)}</div>
            <span className="pill ml-2">annualised</span>
          </div>
          <p className="mt-3 text-muted">{r.estimated_value.rationale}</p>
        </div>
      </Section>

      {/* Outbound email + offer */}
      <Section title="A draft email you could send today">
        <div className="card">
          <div className="h-section">Recommended offer</div>
          <p className="mt-2">{r.recommended_offer}</p>
          <div className="mt-5 h-section">Outbound email copy</div>
          <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-line bg-bg p-4 text-sm leading-relaxed text-ink">
{r.outbound_email_copy}
          </pre>
        </div>
      </Section>

      {/* CTA */}
      <Section title="Suggested next step">
        <ReportCTA auditId={audit.id} businessName={r.business_name} />
      </Section>

      {/* Unknowns + citations */}
      <Section title="What we couldn’t verify">
        <div className="card">
          <ul className="space-y-1.5 text-muted">
            {(r.unknowns.length ? r.unknowns : ["—"]).map((u, i) => <li key={i}>• {u}</li>)}
          </ul>
        </div>
      </Section>

      <Section title="Sources">
        <div className="card">
          <ol className="grid gap-1.5 text-sm">
            {r.citations.map((c, i) => (
              <li key={i} className="text-muted">
                <span className="text-muted">[{i + 1}]</span>{" "}
                <a className="text-ink hover:text-accent" href={c.url} target="_blank" rel="noreferrer">
                  {c.label}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
