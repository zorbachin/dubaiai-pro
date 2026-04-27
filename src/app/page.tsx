import Link from "next/link";

const FEATURES = [
  { title: "Real research", body: "We crawl your homepage, about, pricing, blog and contact — then enrich with public web data. Every claim links to a source." },
  { title: "Founder-grade output", body: "An AI-readiness score, top 5 opportunities, 3 quick wins, and a 30-day roadmap. Specific, not generic." },
  { title: "Sales-ready", body: "Ships with a recommended offer, an estimated ROI range, and a draft outbound email you can send today." }
];

const STEPS = [
  { n: 1, t: "Tell us about the business", d: "Name, URL, optional founders & industry, one main goal." },
  { n: 2, t: "We crawl + research", d: "Site pages + public mentions in under a minute." },
  { n: 3, t: "Get a polished audit", d: "Web report + PDF + a draft email to send." }
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pt-20 pb-16">
          <div className="max-w-3xl">
            <span className="pill-gold">AI Audit Engine</span>
            <h1 className="mt-4 font-display text-5xl font-bold leading-tight md:text-6xl">
              Get a custom <span className="text-accent">AI implementation audit</span> for any business in minutes.
            </h1>
            <p className="mt-5 text-lg text-muted">
              Drop in a business name and a URL. We research the company, scan the site, score AI readiness, and hand back a consultative report — quick wins, a 30-day plan, and an estimated ROI range.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/audit" className="btn-primary">Run an audit →</Link>
              <Link href="/case-studies" className="btn-ghost">See case studies</Link>
              <a href="#how" className="btn-ghost">How it works</a>
            </div>
            <div className="mt-6 text-xs text-muted">
              No private data. Every research claim cites a public source. Clearly marks what it can&apos;t verify.
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card">
              <div className="h-section">Why founders use it</div>
              <h3 className="mt-2 font-display text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-3xl font-bold">How it works</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="card">
              <div className="text-3xl font-bold text-gold">0{s.n}</div>
              <div className="mt-2 font-display text-lg font-bold">{s.t}</div>
              <p className="mt-2 text-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="card flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h3 className="font-display text-2xl font-bold">Audit a business now.</h3>
            <p className="mt-1 text-muted">
              Free while in beta. Takes ~60 seconds. PDF + report URL emailed to you.
            </p>
          </div>
          <Link href="/audit" className="btn-primary">Start audit →</Link>
        </div>
      </section>
    </div>
  );
}
