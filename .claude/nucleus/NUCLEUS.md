# 🧠 Context Nucleus

> The single source of truth for everything you're doing with Claude — across
> chats, Cowork, code, and design. Any surface hands off context **to** this
> file; every new session reads context **from** it. If a fresh Claude doesn't
> have your context, it's because it hasn't read this yet — so it always does.

---

## 📌 North Star
_What we're ultimately building and why. Edit this by hand — it changes rarely._

- **🎯 THE NUMBER: $1,000,000.** Get the venture portfolio to a million.
- **Operating model:** Claude **works**; Zorba **guides + approves**. No task lists *for* Zorba — execute, then surface for approval. Sync with the CEO daily.
- **Project:** DubaiAI.pro — marketing site for a Dubai-based AI consultancy
  ("Bespoke AI Implementation & Audit").
- **What they sell:** Full-stack AI engineering across three layers —
  Layer 1 (AI Infrastructure), Layer 2 (AI Applications), Layer 3 (Agentic AI) —
  plus regulatory-grade AI auditing, for enterprises and government.
- **Goal:** A premium, high-trust landing page that converts enterprise/gov
  leads into a contact (`hello@dubaiai.pro`). Live at https://dubaiai.pro.

## 🎯 Active Threads
_What's in flight right now. The 1–5 things a new session should care about._

- [ ] Context Nucleus system is built (hooks + CLI + web bridge) — PR #10 open
      on `claude/epic-einstein-jPNIL`, not yet merged to `main`.
- [ ] Wire the nucleus widget into the local app at http://localhost:3001/.
- [ ] (add the next real landing-page task here)

## 🧩 Decisions & Conventions
_Choices already made, so no surface re-litigates them._

- **Single-file site:** everything lives in `index.html` (inline CSS/JS), no
  build step. Hosted on GitHub Pages via `CNAME` → dubaiai.pro.
- **Brand palette:** gold `#c8a45c` (accent), navy `#0a1628` (text/dark),
  cream/sand backgrounds (`#faf8f3`, `#f5f0e6`, `#e8e0d0`).
- **Type:** DM Serif Display (headings), Inter (body), JetBrains Mono (mono).
- **Sections / nav anchors:** hero, about, services, audit, process, cases,
  contact.
- **Contact:** `hello@dubaiai.pro`.

## 📥 Handoffs
_Newest first. Written automatically by hooks and by `nucleus push` from any
surface. This is the message-in-a-bottle between sessions._

<!-- HANDOFFS:START -->
### 2026-06-02 11:02 UTC · chat
NEWSLETTER PLATFORM = SUBSTACK (chosen). The Dispatch recurring segment: 'Three Two-Minute Time-Savers' (one WORK, one LIFE, one HEALTH; quick/fun; each a copy-paste prompt). Issue 001 written (content-assets/newsletter/ISSUE-001.md): feature 'Buy Back Your Time' + the 3 time-savers (kill the email thread / plan the night out / fridge->meal + 12-min calisthenics workout). Opt-in INVITE drafted (content-assets/newsletter/INVITE.md) — personal invites + warm leads + content-engine growth, NEVER import-and-blast. Masthead billing updated to feature the time-savers segment.

### 2026-06-02 10:59 UTC · chat
NEWSLETTER = 'The Dispatch' — cinematic, vintage movie-announcement style (built: content-assets/newsletter/dispatch-no-001.png via bin/cinema_news.py). Aged paper, double frame, 'proudly presents', dramatic serif billing, marquee bar, 'printed for a select readership'. NO LIST YET + DO NOT spam his contacts (kills deliverability + relationships). PLAN: use a real ESP (Substack or Beehiiv free) for compliance/unsubscribe; SEED via personal opt-in invites (Claude drafts) to people he knows + warm leads (post-repliers, clients like vybewear, video commenters); grow as a byproduct of the content engine (every post -> 'join the Dispatch'). Cadence: monthly/biweekly 'issue' = an event, quality over frequency. Positioning: 'a select readership', worth-their-time storytelling.

### 2026-06-02 09:45 UTC · chat
CLOSING-TOOL PUSH prepped (content-assets/closing-tool/): 6-slide carousel + 3 quote cards (built) + COPY.md (FB/IG/LI/X captions + newsletter draft + demo recording brief + hero-video spec). One message: 'deals die in the follow-up gap — this closes it.' WAITING ON: Zorba records the basic demo (drop in Drive) -> Claude cuts the website hero video + queues everything. COMMAND CENTER #1 DONE: nucleus serve exposes /command.json (per-venture board+brain) for the existing localhost widget to sync; / now renders a per-venture dashboard.

### 2026-06-02 09:36 UTC · chat
NEXT CONTENT PILLAR (Zorba's idea): DEMO of the CLOSING TOOL (foxy-close-tool / Instant Proposals) — show how it works (he records a basic walkthrough), then cut a HERO VIDEO for the website. Plus carousels + supporting content. Claude to map the full push. WORKFLOW PAIN (important, recurring): doing everything in ONE chat thread makes it hard to separate ideas / jump between projects — THIS is why he wants the BRAIN in a WIDGET/COMMAND CENTER (separate surface per project), not one giant thread. Nucleus already has 'bin/nucleus serve' web bridge + widget — candidate to wire up as the per-project command center. Reconcile with ROLE.md anti-splinter rule (home is Claude) — the widget earns its keep IF it cleanly separates projects.

### 2026-06-02 09:19 UTC · chat
PRODUCT DEPTH UPGRADE (per Zorba: too sparse, worth $1000 sell $60). New product structure: COVER -> ADHD ONE-PAGER (whole system at a glance, 1 page) -> DEEP WALKTHROUGH (numbered steps, easy-to-follow) -> each step has a copy-paste PROMPT box with CLICKABLE 'Run in ChatGPT/Claude' links that auto-fill (chatgpt.com/?q= and claude.ai/new?q= URL-encoded) -> bonus prompt pack -> Work-With-Me CTA. Engine upgraded (bin/etsybuild.py: onepager/step/prompt blocks). Flagship #01 rebuilt as the exemplar/template (6KB->22KB). AWAITING format approval, then batch all 20 to this template + reprice bundle to $60.

### 2026-06-02 09:06 UTC · chat
ETSY PUBLISH KIT COMPLETE: 20 thumbnails (etsy-shop/thumbs/*.png, 2000x2000 branded) + LISTINGS.md (SEO title/13 tags/price/description for all 20) + 20 PDFs (each w/ Work-With-Me page). Prices: Lite $9, Kit $17, Flagship $24, Bundle $59. CONSTRAINT: Etsy is NOT API-listable from here (not on Zapier; digital file+image upload must be done in Etsy UI). So final publish = Zorba pastes title/tags/desc + uploads thumb (image 1) + PDF (digital file), ~2 min each. LAUNCH SHELF recommendation: Bundle + Beat the Posting Block + Audit Subscriptions + 50 Tasks + ADHD Planner first, then drip 2-3/week as marketing beats.

### 2026-06-02 05:46 UTC · chat
ALL 20 Etsy products BUILT (etsy-shop/*.pdf) via upgraded engine: each now has page numbers + a branded 'Work With Me / Go Deeper' CTA closing page (contact: letaidoit.pro + @zorb_ai DM) so every sale is a potential consulting lead. ETSY GOAL = $3,000+/month for OrganizedOrionDesign. NEW STRUCTURE (all ventures): each gets a RESEARCH sub-agent running a standing brief — study who's winning, reverse-engineer why, filter through Zorba's real approach/skills (honest/self-shot/buy-back-time/anti-hype), recommend 1-3 moves at weekly review. Doc: .claude/os/research-briefs.md. Default product CTA contact = letaidoit.pro + @zorb_ai (confirm if you want a booking link/email added).

### 2026-06-02 05:29 UTC · chat
SENT (Zapier Gmail now connected for sending): AutoGLM cancel+refund -> autoglm@z.ai (msg 19e86ccebe1f1112); HighLevel cancel+refund -> billing@gohighlevel.com (msg 19e86cd2a4dd19f9). DAILY at CEO sync: check for their reply, resend follow-up until written cancel+refund confirmed, then verify charges stopped via Stripe receipts. Agentbus T015 (AutoGLM follow-up), T016 (HighLevel confirm), T017 (Etsy OrganizedOrionDesign digital venture). ETSY = DIGITAL (PDFs/AI guides/student planners/story guides); Zorba 1hr/wk creates, Claude markets/optimizes. NEXT BUILDS: GHL feature->rebuild map on free stack; stand up OrganizedOrionDesign + first product.

### 2026-06-02 05:23 UTC · chat
SPEND DECISIONS (real amounts confirmed from receipts): (1) Claude = Max 20x $200/mo — TOP tier, NOT $100. Flat-rate, can't 'exceed' in $, only hit rate limits. He runs whole OS on it → KEEP, it's the engine. ChatGPT $20 + Gemini $20 worth it. AI-model spend (~$240) is his MOST productive spend, don't trim. (2) AutoGLM = $100/mo billed by Z.ai (autoglm@z.ai) — CAN'T CANCEL, shady. PRIORITY CUT. Drafted cancellation+refund-demand email in Gmail; fallback = Stripe/card chargeback. (3) GoHighLevel ~$100/mo — rebuildable on existing free stack (Netlify forms + Gmail + Google Cal/Cal.com + sheet/Airtable CRM); only SMS-at-scale (Twilio) is harder & he's not using it → CUT, Claude rebuilds the lead→CRM→follow-up flow. (4) Runway — KEEP but right-size: pause between production sprints, resub only in months he batches hero videos (made the BYB 'Transformers' video). (5) Etsy/OrganizedOrionDesign → keep ONLY as low-touch: Zorba ~1hr/wk builds assets, Claude markets/optimizes, else cut. Add as venture. (6) Vybewear (Isaac@vybewear.com) = CLIENT/friend for LAI/BYB (forwarded GTAA tournament leads) — track as customer, revenue-relevant. TRUE BLEED = AutoGLM $100 + GHL $100 = ~$200/mo.

### 2026-06-02 05:13 UTC · chat
SPEND AUDIT (from real Gmail receipts, 30d): PAYING → GoHighLevel ~$100/mo CRM (already tried to cancel, charged anyway — RESOLVE), Runway AI (premium video, redundant — CUT), TopView (cheap video), OpusClip/opus.pro (clipping — keep for MM), AutoGLM (GLM sub — likely redundant w/ Claude, review), ElevenLabs (voice — right-size), X Premium, Etsy Plus $10 (live shop OrganizedOrionDesign jewelry), Anthropic/Claude (core). NOT paying → HeyGen, Higgsfield, Manus (don't start any; brand is self-shot). Recoverable ~$155-235/mo. SURFACED ventures not in ventures.md: Etsy shop OrganizedOrionDesign + Vybe/vybewear. Ambo call booked today 11:30 EST (Meet: meet.google.com/wfd-zwvt-ies) — need Sam & Jack emails to invite. North Star set to $1M.

### 2026-06-02 05:10 UTC · chat
OPERATING MODEL (durable): Claude's job = DO THE WORK. Zorba's job = GUIDE + APPROVE. Stop handing Zorba task lists for himself; execute, then surface for approval. NORTH STAR NUMBER = $1,000,000 (get the portfolio to a million). CADENCE: sync with the CEO daily. ACTIVE: schedule call with Sam & Jack at Ambo (byb-ambassador / Ambassador program) for 11:30 EST today (2026-06-02).

### 2026-06-02 05:06 UTC · chat
BIG MANDATE (2026-06-02): User wants the full portfolio running like a company. (1) PodSupps (podsupps.com) → run autonomously, Claude starts marketing it + drives signups/logins. (2) For other ventures, Claude is the guide — tell him what to do. (3) SPEND AUDIT: monitor wasted spend — still need Manus? Etsy? right-size ElevenLabs? pay for HeyGen? cheapest effective video tool (Higgsfield vs Topview)? (4) Build CORPORATE AGENTIC STRUCTURE: who runs which workstream, cost, investment needed. (5) Send him prompts/nudges when lagging — 'your job is 24/7'. KEY INSIGHT to apply: his brand is REAL/self-shot (calisthenics) → expensive AI-video/avatar tools may be redundant.

### 2026-06-02 04:50 UTC · chat
🎉 BIG WIN 2026-06-02: calisthenics video published LIVE to Facebook, Instagram (Reel, zorb_ai), and LinkedIn. X uncertain (Buffer timed out mid-86MB-upload — verify manually). Posting block broken. SUSTAINABLE CADENCE in .claude/os/content/posting-cadence.md: batch 1 pillar video/Sun → Claude atomizes + queues all platforms in Buffer → user approves + posts FB manually. Floor 3/wk; FB 3-5x, IG 4-5x, LI 3x, X 5x, TikTok 3x, newsletter 1x.

### 2026-06-02 04:43 UTC · chat
🎉 PUBLISHED: Zorba posted the calisthenics AI explainer video to Facebook (personal profile, his #1 platform) — first published win, posting block broken. WORKING PATTERN for video→Buffer: upload to Drive, share 'anyone w/ link', attach via https://drive.usercontent.google.com/download?id=FILEID&export=download (the uc?export=download form FAILS; usercontent form WORKS for <100MB). 3 video drafts now staged in Buffer w/ video attached: LinkedIn, X (Quickquotables), IG (zorb_ai, set as Reel).

### 2026-06-02 04:31 UTC · chat
Buffer connected (org 'My Organization'). Channels: LinkedIn (zachary-grashin profile), Instagram (zorb_ai), X (Quickquotables — DIFFERENT brand, do not use for LetAIDoIt). TikTok NOT connected. LINKEDIN DRAFT for calisthenics video created in Buffer (text-only OK). IG can't be pre-loaded — Buffer/IG requires media and the video is local on Zorba's Mac; he must create IG post in Buffer by uploading the clip + pasting caption. FB = manual (personal profile).

### 2026-06-02 04:06 UTC · chat
Facebook = PERSONAL PROFILE (his most responsive platform) — cannot be auto-posted/scheduled by Buffer or any tool (Meta API rule). FB stays a MANUAL post by Zorba. Buffer handles the rest: IG (Business), LinkedIn, TikTok. Connecting Buffer via Zapier for scheduling those.

### 2026-06-02 04:03 UTC · chat
PLATFORM PRIORITY: Facebook is Zorba's most fertile/responsive platform, then Instagram, then LinkedIn. He WANTS to build up LinkedIn, IG, and TikTok (growth targets). So: post to Facebook FIRST for engagement/leads, and cross-post to IG/LI/TikTok as the build-up play. Newsletter should link to the posted video (flywheel).

### 2026-06-02 03:58 UTC · chat
BRAND CONFIRMED: the golden glasses are Zorba's REAL signature — he wears them in his actual video footage (calisthenics explainer). The card system we built around gold glasses isn't invented, it's authentic to him. Bonus: his burned-in caption style uses a green keyword highlight ~= the Action Green (#69BE28) we picked for v3. Brand is already cohesive across his real content. The glasses are THE mark — lean into it everywhere.

### 2026-06-02 03:56 UTC · chat
ASSET: Zorba has a real shot video — 'Zorba Explainer(5)', him at a calisthenics park (working out, corny/human vibe) delivering the core pitch. Transcript on file. On-message: 'every business owner has something they don't wanna do… AI answers your call, schedules, email in your voice, inventory tracked… I'm not here to sell you on AI, I'm here to buy back your time… so you have more time to work out.' Calisthenics setting ties to the time-back close. POSTABLE TODAY. File local on his Mac (~/Movies/Zorba Explainer(5)) — not in container.

### 2026-06-02 03:46 UTC · chat
User is based in Tel Aviv (works via VPN). Treat Tel Aviv local time as the real clock for standups/cadence/day-planning.

### 2026-06-02 03:33 UTC · code
Built cardgen3 (v3 brand): College Navy #002244 + gold glasses hero + Action Green #69BE28 accent + cream serif. 3 variants. This is the Seahawks-palette synthesis per user direction. Still need real site screenshots to exact-match gold shade/fonts (env is bot-blocked: WebFetch 403 everywhere, Netlify MCP 502).

### 2026-06-02 03:31 UTC · chat
BRAND PALETTE DIRECTION: gold glasses on BLUE, or GREEN — Seahawks colors (College Navy #002244 + Action Green ~#69BE28) WITH gold. Synthesize a Zorba-wide brand from zorbot.io + buildyourbot.io + selfsellingai.pro. Method: pull real deployed code from Netlify (bot-blocked to WebFetch). Mapping: selfsellingai.pro→letaidoit site; buildyourbot→byb-ambassador.

### 2026-06-02 03:26 UTC · code
Built cardgen2 with golden-glasses signature mark (vector, recurring brand element). 3 style directions: A navy+glasses-watermark, B cream editorial (glasses hero), C bold split. Awaiting user's pick + real brand refs (can't fetch zorbot/buildyourbot/selfsellingai — all 403 bot-blocked).

### 2026-06-02 03:24 UTC · chat
DESIGN DIRECTION: content is good but visuals need more edge — distinct, scroll-stopping, recognizably HIS. Brand references: zorbot.io, buildyourbot.io, selfsellingai.pro. SIGNATURE ELEMENT: his 'golden glasses' — use as a recurring brand mark to give cards a distinct edge. Match the existing brand worlds, not generic.

### 2026-06-02 03:13 UTC · code
REAL SITE MAP (Netlify, 16 sites, owned by zorbachin/PodSupps team): letaidoit→letaidoit.netlify.app (OWNED, exists!), minimovies→minimovies.io (LIVE custom domain), byb-ambassador→byb-ambassador.netlify.app (forms enabled), foxy-close-tool→foxy-close-tool.netlify.app (the Instant Proposals closing tool), podsupps→podsupps.com, plus machberet, dad-ai-discovery, vybe-discovery, pbgai, zorbasphere, tlv-summer, polar-bear-prep, foxy-epoxy-discovery. NOTE: owned 'letaidoit' project already exists — redrop may be done or it's an empty shell; verify deploy.

### 2026-06-02 03:09 UTC · chat
SAFETY RULE (standing): Claude may CREATE drafts/designs with real tools (Gmail drafts, Canva, image-gen) but NEVER auto-send, auto-publish, or charge. User always does the final send/post/deploy. Applies to Netlify too — prep, don't flip live without explicit yes.

### 2026-06-02 03:01 UTC · code
PILLAR 1 created + atomized: 'How I got into AI business' → 10 pieces across a week (anchor video, carousel, 3 written posts, 3 quote cards, meme, newsletter), queued T008-T014 for LetAIDoIt. Through-line: 'You don't need to learn AI, you need someone who already did the 1000 hours.' Voice guide upgraded to v1 with his real word samples.

### 2026-06-01 18:38 UTC · chat
CONTENT SYSTEM (key workflow): user batches 2-4 hrs Sun/Mon on RAW content creation only (his strength, peak 7:30am). Then Claude atomizes each raw asset into many formats across the week (video→clips/carousel/quotes/memes/written/email). Create once, ship all week. Removes midweek blank-page + posting friction.

### 2026-06-01 18:27 UTC · chat
FEATURE: dopaminergic focus dashboard. User has ADHD, misses scroll/gamification/focus-meter — text-only is hard to visualize his day. Build self-contained focus.html (no server, double-click, brand colors): focus meter, progress ring, XP/streaks, scrollable task cards. Generated from the live board.

### 2026-06-01 18:26 UTC · code
Built dump parser: bin/dump (reliable capture to .claude/os/dumps/) + dump skill (Opus parses raw dump → flywheel content across video/carousel/meme/writing, in user's voice, queued to content board, with 3 hook options). Idea input valve is live.

### 2026-06-01 18:25 UTC · chat
FEATURE: brain-dump parser. User dumps a raw idea/theme (one post or a week), Claude (Opus 4.8) parses it into outstanding FLYWHEEL content — structured, in his voice, queued to the content board. Input valve for his ADHD idea flow.

### 2026-06-01 18:23 UTC · code
Built master content-board.md (color-coded by type, idea→POSTED pipeline), scripts-tomorrow.md (2 ready-to-read scripts for 7:30 SSA-C + Origin-Drafts), voice-guide v0. Tomorrow's shoot is on the bus.

### 2026-06-01 18:19 UTC · chat
VOICE-LEARNING METHOD: Claude researches user online + builds a voice guide from chat notes, user corrects it (lowest friction). REUSE INSIGHT: user has a great buildyourbot.io video he wants to repurpose for letaidoit + others.

### 2026-06-01 18:19 UTC · chat
BIG INITIATIVE: full content map sprint — audit ALL content across ventures, then schedule + queue everything. Nothing floating. Treat as a structured sprint.

### 2026-06-01 18:14 UTC · chat
STORY ASSETS to learn & use in content: the house, the war, and the previous drafts we wrote but never published. These are raw material for authentic launches.

### 2026-06-01 18:14 UTC · chat
VOICE: user's own voice + Hormozi-style direct marketer, but human/good. Self-aware, meta, slightly subversive. Reframes in human terms: 'get your time back' (benefit) vs 'AI is the solution' (feature). This is a SKILL to implement for all content agents.

### 2026-06-01 18:14 UTC · chat
LAUNCH RESET: nothing is truly launched yet except kinda Minimovies. Treat EVERY venture as Day 1 / square one. Marketing + research sub-agents start from scratch, no assumed traction.

### 2026-06-01 18:14 UTC · chat
PEAK CONTENT TIME: user records content best EARLY AM, ~7:30am. Schedule content creation/recording into that window; protect it.

### 2026-06-01 18:11 UTC · chat
DECISION: Home = Claude (100% reliable today). Command-center widget = PARKED as future upgrade, only if it earns it — not built now (anti-splinter). Comms style = caveman-warm (1.5): one line, action-first, light encouragement. No fragile channels.

### 2026-06-01 18:08 UTC · chat
COMMS preference: wants concise 'caveman style' text pings when action needed (link / approval / yes-no). Telegram annoying. WhatsApp or iMessage preferred. But this is secondary to: don't splinter him — only add a channel if it works 100%.
<!-- HANDOFFS:END -->

## 🔄 Live State (auto)
_Refreshed automatically after each turn — do not edit by hand._

<!-- AUTOSTATE:START -->
- **When:** 2026-06-02 11:02 UTC
- **Branch:** `main`
- **Last commit:** ea99af4 The Dispatch Issue 001 + Three Time-Savers segment + opt-in invite (#46) — 23 seconds ago

**Working tree:**
```
M .claude/nucleus/NUCLEUS.md
```

**Uncommitted changes:**
```
.claude/nucleus/NUCLEUS.md | 32 +++++++++++++++++++++-----------
 1 file changed, 21 insertions(+), 11 deletions(-)
```

**Recent commits:**
```
ea99af4 The Dispatch Issue 001 + Three Time-Savers segment + opt-in invite (#46) (23 seconds ago)
c0afb07 chore: refresh nucleus live state [skip ci] (2 minutes ago)
e37a49d chore: refresh nucleus live state [skip ci] (3 minutes ago)
7b2c4ae The Dispatch — cinematic vintage movie-announcement newsletter (#45) (3 minutes ago)
8fde60d chore: refresh nucleus live state [skip ci] (77 minutes ago)
```
<!-- AUTOSTATE:END -->

## 🌀 Reflections
_The nucleus checking in on itself._

<!-- REFLECTIONS:START -->
### 2026-06-01 10:07 UTC
GAP: proactive capture is invisible to the user — they couldn't tell it was working. Fix: whenever you capture, show a one-line '🧠 saved: ...' receipt in chat so it's verifiable in real time. Visibility is as important as the capture itself.

### 2026-06-01 07:57 UTC
Added three new capture signals (validations/'this works', directional steering, cross-workstream patterns) and a self-improvement loop. Learned the user wants memory that promotes patterns and tunes its own rules, not just a static log.
<!-- REFLECTIONS:END -->
