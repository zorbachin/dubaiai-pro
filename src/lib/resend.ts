import { Resend } from "resend";
import { env, flags } from "./env";
import type { AuditReport } from "./types";
import { getDomain } from "./utils";

let _resend: Resend | null = null;
function client(): Resend | null {
  if (!flags.hasResend) return null;
  if (_resend) return _resend;
  _resend = new Resend(env.RESEND_API_KEY);
  return _resend;
}

export async function sendAuditEmail(opts: {
  toUser: string;
  auditId: string;
  report: AuditReport;
}) {
  const c = client();
  if (!c) {
    console.warn("[resend] RESEND_API_KEY missing — skipping email send");
    return { skipped: true as const };
  }
  const reportUrl = `${env.APP_URL}/audit/${opts.auditId}`;
  const subject = `Your AI audit for ${opts.report.business_name}`;

  const html = renderEmail(opts.report, reportUrl);
  const recipients = Array.from(
    new Set([opts.toUser, env.ADMIN_EMAIL].filter(Boolean))
  );

  try {
    const res = await c.emails.send({
      from: env.EMAIL_FROM,
      to: recipients,
      subject,
      html
    });
    return { skipped: false as const, id: res.data?.id };
  } catch (err) {
    console.error("[resend] send failed:", err);
    return { skipped: false as const, error: String(err) };
  }
}

function renderEmail(r: AuditReport, url: string): string {
  const score = r.AI_readiness_score;
  const top3 = r.top_automation_opportunities.slice(0, 3);
  const li = (x: string) => `<li style="margin:6px 0;">${escapeHtml(x)}</li>`;
  return `<!doctype html>
<html><body style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; background:#0b0d12; color:#e7eaf0; padding:24px;">
  <div style="max-width:640px; margin:0 auto; background:#11141b; border:1px solid #1f2330; border-radius:14px; padding:28px;">
    <h1 style="margin:0 0 6px; font-size:22px;">AI audit — ${escapeHtml(r.business_name)}</h1>
    <div style="color:#8a93a6; font-size:14px;">${escapeHtml(getDomain(r.website_url))}</div>
    <div style="margin:20px 0; padding:16px; background:#0b0d12; border:1px solid #1f2330; border-radius:10px;">
      <div style="font-size:12px; color:#8a93a6; text-transform:uppercase; letter-spacing:.08em;">AI readiness</div>
      <div style="font-size:36px; font-weight:700; color:#e3b341;">${score}<span style="font-size:18px; color:#8a93a6;">/100</span></div>
    </div>
    <h2 style="font-size:16px; margin:18px 0 8px;">Top opportunities</h2>
    <ul style="padding-left:18px; color:#e7eaf0;">
      ${top3.map((o) => li(`<strong>${escapeHtml(o.title)}.</strong> ${escapeHtml(o.description)}`)).join("")}
    </ul>
    <p style="margin:24px 0;">
      <a href="${url}" style="display:inline-block; background:#7c5cff; color:white; padding:12px 18px; border-radius:8px; text-decoration:none; font-weight:600;">Open the full report</a>
    </p>
    <p style="color:#8a93a6; font-size:13px;">This audit was assembled from public information only and explicitly notes anything we couldn't verify. Reply to this email to book a 20-minute walkthrough.</p>
  </div>
</body></html>`;
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
