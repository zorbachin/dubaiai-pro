import { AuditForm } from "@/components/audit-form";

export const metadata = { title: "Run an audit · DubaiAI.pro" };

export default function AuditFormPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <span className="pill-accent">New audit</span>
      <h1 className="mt-3 font-display text-4xl font-bold">Tell us about the business.</h1>
      <p className="mt-2 text-muted">
        We&apos;ll crawl the public site and gather public mentions to build a tailored AI audit. Takes about a minute.
      </p>
      <div className="mt-8">
        <AuditForm />
      </div>
    </div>
  );
}
