# AI Audit Engine — DubaiAI.pro

A production-ready MVP that takes a **business name + website URL** and returns a polished, consultative **AI implementation audit**: AI-readiness score, top 5 opportunities, 3 quick wins, a 30-day roadmap, ROI range, recommended offer, and an outbound email draft. Includes a lead-capture CTA, an admin dashboard, and PDF export.

> The original DubaiAI.pro static landing page lives on the `main` branch (`index.html`) for reference.

## Stack

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS**
- **Supabase** for the database (Postgres + RLS)
- **OpenAI** (`gpt-4o-mini` by default) for structured-JSON report generation
- **Resend** for transactional email
- **Inngest** for the background pipeline (crawl → research → generate)
- **@react-pdf/renderer** for downloadable PDFs
- **cheerio** for the website crawler, **DuckDuckGo HTML** for zero-config web research (drop in Brave / SerpAPI / Tavily later)

Designed to deploy on **Vercel** in one click.

---

## File structure

```
.
├── public/                          # static assets (favicons, etc.)
├── src/
│   ├── app/
│   │   ├── layout.tsx              # global shell (header/footer)
│   │   ├── page.tsx                # 1. Landing
│   │   ├── globals.css
│   │   ├── audit/
│   │   │   ├── page.tsx            # 2. Audit form
│   │   │   └── [id]/
│   │   │       ├── page.tsx        # 4. Report
│   │   │       └── status/page.tsx # 3. Loading / status
│   │   ├── admin/page.tsx          # 5. Admin dashboard (password-gated)
│   │   └── api/
│   │       ├── audits/route.ts             # POST: create audit, queue job
│   │       ├── audits/[id]/route.ts        # GET: status polling
│   │       ├── audits/[id]/pdf/route.ts    # GET: PDF download
│   │       ├── leads/route.ts              # 6. Lead-capture CTA
│   │       ├── inngest/route.ts            # Inngest serve handler
│   │       └── admin/{login,logout}/route.ts
│   ├── components/
│   │   ├── audit-form.tsx
│   │   └── report/{score,opportunity-card,cta}.tsx
│   └── lib/
│       ├── crawler.ts              # homepage / about / pricing / blog / contact
│       ├── research.ts             # public-web search (DDG, swappable)
│       ├── openai.ts               # structured-JSON audit generator
│       ├── pipeline.ts             # crawl → research → generate → persist → email
│       ├── pdf.tsx                 # React-PDF renderer
│       ├── resend.ts               # email send
│       ├── mock-report.ts          # graceful fallback when no API keys
│       ├── inngest/{client,functions}.ts
│       ├── supabase/{server,client}.ts
│       ├── env.ts, types.ts, utils.ts
├── supabase/
│   └── schema.sql                  # tables + RLS + trigger
├── .env.example
├── tailwind.config.ts, postcss.config.mjs
├── next.config.mjs, tsconfig.json
└── package.json
```

---

## Quick start (local)

```bash
# 1. Install
npm install

# 2. Copy env and fill in keys (see .env.example)
cp .env.example .env.local

# 3. Apply the schema in your Supabase project
#    Open Supabase → SQL → New query → paste supabase/schema.sql → Run

# 4. Dev
npm run dev
# → http://localhost:3000
```

The app **runs without any API keys** for development:

- No `OPENAI_API_KEY`? → audits return a polished mock report.
- No `INNGEST_*`? → the pipeline runs in-process inside the API route.
- No `RESEND_API_KEY`? → emails are skipped (logged).
- No `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`? → the API will return a clear error explaining what to set.

To exercise the **background-job path** locally with Inngest:

```bash
npm run inngest        # starts the Inngest dev UI on http://localhost:8288
# in another tab
npm run dev
```

---

## Environment variables

See [`.env.example`](.env.example). Minimum to run end-to-end against real services:

| Variable | Where to get |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same |
| `SUPABASE_SERVICE_ROLE_KEY` | same — **server-only**, never ship to the browser |
| `OPENAI_API_KEY` | platform.openai.com |
| `RESEND_API_KEY` | resend.com |
| `EMAIL_FROM` | a verified Resend sender, e.g. `Reports <reports@yourdomain.com>` |
| `ADMIN_EMAIL` | bcc destination for completed audits |
| `INNGEST_EVENT_KEY` / `INNGEST_SIGNING_KEY` | app.inngest.com after connecting your deployment |
| `ADMIN_PASSWORD` | shared secret for the `/admin` MVP gate |
| `NEXT_PUBLIC_APP_URL` | full origin used in emails (e.g. `https://dubaiai.pro`) |

Optional placeholders for tech-stack detection: `BUILTWITH_API_KEY`, `WAPPALYZER_API_KEY` (not yet wired — drop into `lib/crawler.ts` `detectTech`).

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo into Vercel — defaults work (Next.js detected).
3. Add the env vars from `.env.example` in **Project → Settings → Environment Variables**.
4. Apply `supabase/schema.sql` in your Supabase project once.
5. In **Inngest** → connect your Vercel deployment, point it at `https://<your-domain>/api/inngest`. Inngest will give you `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` — paste into Vercel.
6. (Optional) In **Resend**, verify your sending domain so emails don't land in spam.

---

## Pipeline overview

`POST /api/audits` →

1. Validates input + URL, upserts `companies`, inserts `audits` (status=`queued`).
2. Sends `audit/requested` Inngest event (or runs the pipeline inline if Inngest isn't configured).
3. **Crawl** the site (`/`, `/about`, `/pricing`, `/blog`, `/contact`, …) with cheerio. Extract title, meta, headings, CTAs, forms, links, and detect ~20 tech-stack hints from HTML. Persist as `sources` rows.
4. **Research**: DuckDuckGo HTML search for `"<name>" company`, `funding`, `reviews`, `press`, `linkedin`, founders. Persist as `sources`.
5. **Generate**: OpenAI Chat Completions with `response_format: json_object`, a strict system prompt that bans private/unverifiable claims, and a schema-shaped user prompt. Validates + clamps the response.
6. **Persist** the JSON `report` on `audits`, then explode into denormalised `report_sections` rows (executive_summary, ai_readiness, top_opportunities, quick_wins, roadmap, estimated_value, next_step).
7. **Email** the requester + admin via Resend with a deep-link to the report.

Failures are caught and stored on `audits.error` with `status='failed'`.

---

## Report sections (matches spec)

- Executive summary
- What the business appears to do
- Current digital / tech maturity
- AI readiness score (0–100)
- Top 5 AI implementation opportunities
- 3 quick wins
- 30-day roadmap
- Estimated ROI range
- Suggested next step + draft outbound email
- "What we couldn't verify" (unknowns)
- Sources / citations
- CTA: **Request Implementation Plan**

---

## Honesty & safety guarantees

- The system prompt explicitly forbids inventing private or unverifiable facts.
- Every research claim is expected to map back to a URL in `citations`.
- An `unknowns` array is always rendered, both on the page and in the PDF.
- The crawler caps page bytes (2 MB), respects a 12-second timeout, identifies itself with a UA, and only fetches pages from the user-supplied origin.

---

## Roadmap (post-MVP)

- Swap DDG for Brave Search / Tavily / SerpAPI for higher-quality citations.
- Plug in BuiltWith / Wappalyzer for richer tech-stack detection.
- Replace the shared-password admin gate with proper Supabase Auth + RLS-based access.
- Add a public webhook (`/api/webhooks/audit-complete`) for CRM/Slack integrations.
- Richer PDF (cover, contents, brand theming) — current version is functional.

---

## Sample mocked report

When `OPENAI_API_KEY` is unset, every audit returns the curated template in `src/lib/mock-report.ts` — same shape as a real run, with the score, opportunities, roadmap and outbound email all populated, so the rest of the pipeline (DB write, PDF render, email) works end-to-end out of the box.
