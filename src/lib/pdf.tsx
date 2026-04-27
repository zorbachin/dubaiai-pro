import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import type { AuditReport } from "./types";
import { getDomain } from "./utils";

const s = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: "Helvetica", color: "#1a1f2c", lineHeight: 1.5 },
  h1: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
  h2: { fontSize: 14, fontWeight: 700, marginTop: 18, marginBottom: 6 },
  h3: { fontSize: 11, fontWeight: 700, marginTop: 8, marginBottom: 2 },
  meta: { color: "#6b7280", fontSize: 9, marginBottom: 16 },
  card: { padding: 12, backgroundColor: "#f8f6ff", borderRadius: 6, marginBottom: 8 },
  scoreBox: { padding: 14, backgroundColor: "#0b0d12", color: "#e3b341", borderRadius: 8, marginVertical: 12, flexDirection: "row", alignItems: "baseline" },
  scoreNum: { color: "#e3b341", fontSize: 32, fontWeight: 700 },
  scoreSlash: { color: "#8a93a6", fontSize: 14, marginLeft: 4 },
  scoreLabel: { color: "#e7eaf0", fontSize: 10, marginLeft: 12 },
  bullet: { flexDirection: "row", marginBottom: 3 },
  bulletDot: { width: 10 },
  bulletText: { flex: 1 },
  pill: { fontSize: 8, color: "#5b21b6", backgroundColor: "#ede9fe", paddingHorizontal: 4, paddingVertical: 1, borderRadius: 3, marginRight: 4 },
  row: { flexDirection: "row", flexWrap: "wrap", marginTop: 2 },
  cite: { color: "#6b7280", fontSize: 8 },
  rule: { borderBottomWidth: 1, borderBottomColor: "#e5e7eb", marginVertical: 10 }
});

function Bullets({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((t, i) => (
        <View key={i} style={s.bullet}>
          <Text style={s.bulletDot}>•</Text>
          <Text style={s.bulletText}>{t}</Text>
        </View>
      ))}
    </View>
  );
}

function Opportunity({
  title,
  description,
  effort,
  impact,
  estimated_value,
  tools
}: {
  title: string;
  description: string;
  effort?: string;
  impact?: string;
  estimated_value?: string;
  tools?: string[];
}) {
  return (
    <View style={s.card}>
      <Text style={s.h3}>{title}</Text>
      <Text>{description}</Text>
      <View style={s.row}>
        {effort && <Text style={s.pill}>Effort: {effort}</Text>}
        {impact && <Text style={s.pill}>Impact: {impact}</Text>}
        {estimated_value && <Text style={s.pill}>{estimated_value}</Text>}
      </View>
      {tools?.length ? <Text style={{ color: "#6b7280", marginTop: 4, fontSize: 9 }}>Tools: {tools.join(", ")}</Text> : null}
    </View>
  );
}

function ReportDocument({ r }: { r: AuditReport }) {
  return (
    <Document title={`AI audit — ${r.business_name}`}>
      <Page size="A4" style={s.page}>
        <Text style={s.h1}>AI audit — {r.business_name}</Text>
        <Text style={s.meta}>
          {getDomain(r.website_url)} · generated {new Date(r.generated_at).toLocaleDateString()}
        </Text>

        <Text style={s.h2}>Executive summary</Text>
        <Text>{r.company_summary}</Text>

        <View style={s.scoreBox}>
          <Text style={s.scoreNum}>{r.AI_readiness_score}</Text>
          <Text style={s.scoreSlash}>/100</Text>
          <Text style={s.scoreLabel}>{r.AI_readiness_explanation}</Text>
        </View>

        <Text style={s.h2}>What the business appears to do</Text>
        <Text>{r.likely_business_model}</Text>
        <Text style={{ marginTop: 4 }}>{r.mission_positioning}</Text>

        <Text style={s.h2}>Founder research</Text>
        <Text>{r.founder_research}</Text>

        <Text style={s.h2}>Current digital / tech maturity</Text>
        <Text style={s.h3}>Detected stack</Text>
        <Bullets items={r.current_tech_stack} />
        <Text style={s.h3}>Website observations</Text>
        <Bullets items={r.website_observations} />

        <Text style={s.h2}>Top AI implementation opportunities</Text>
        {r.top_automation_opportunities.map((o, i) => (
          <Opportunity key={i} {...o} />
        ))}

        <Text style={s.h2}>Quick wins</Text>
        {r.quick_wins.map((o, i) => (
          <Opportunity key={i} {...o} />
        ))}
      </Page>

      <Page size="A4" style={s.page}>
        <Text style={s.h2}>30-day roadmap</Text>
        {r.implementation_roadmap.map((w, i) => (
          <View key={i} style={s.card}>
            <Text style={s.h3}>{w.week} — {w.goal}</Text>
            <Bullets items={w.steps} />
          </View>
        ))}

        <Text style={s.h2}>Estimated ROI range</Text>
        <Text>
          USD {r.estimated_value.range_low_usd.toLocaleString()} – {r.estimated_value.range_high_usd.toLocaleString()}
        </Text>
        <Text style={{ marginTop: 4 }}>{r.estimated_value.rationale}</Text>

        <Text style={s.h2}>Suggested next step</Text>
        <Text>{r.recommended_offer}</Text>

        <Text style={s.h2}>Outbound email (ready to send)</Text>
        <View style={s.card}>
          <Text>{r.outbound_email_copy}</Text>
        </View>

        <View style={s.rule} />
        <Text style={s.h3}>Unknowns / not verified</Text>
        <Bullets items={r.unknowns.length ? r.unknowns : ["—"]} />

        <Text style={s.h3}>Citations</Text>
        {r.citations.map((c, i) => (
          <Text key={i} style={s.cite}>[{i + 1}] {c.label} — {c.url}</Text>
        ))}
      </Page>
    </Document>
  );
}

export async function renderAuditPdf(report: AuditReport): Promise<Buffer> {
  return renderToBuffer(<ReportDocument r={report} />);
}
