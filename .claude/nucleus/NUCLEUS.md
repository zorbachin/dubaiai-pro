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
- **PRIVACY (durable, important):** Zorba and Meytal's pregnancy is FRESH and PRIVATE. NEVER reference a baby / pregnancy / expecting in any public content. Keep all family framing aspirational only: "hoping to start a family."

## 📥 Handoffs
_Newest first. Written automatically by hooks and by `nucleus push` from any
surface. This is the message-in-a-bottle between sessions._

<!-- HANDOFFS:START -->
### 2026-06-10 19:09 UTC · code
OVERNIGHT SHIFT COMPLETE: promo pack merged (PR #81, content-assets/irondome-promo/) — full bilingual launch copy (WhatsApp x4, Telegram DM+post, Reddit x2, press HE+EN, X, meme pages, 20s clip script, crisis one-liners, seeding checklist) + visual cards (story/square/meme/share) + v15 screenshots. ChatGPT image prompts EMAILED to Zorba for the elite art pass (6 prompts, no-text rule, palette locked). MORNING PLAN: Zorba does domain + GoatCounter + ChatGPT images -> Claude swaps URL in one pass (it's on its own line everywhere), composites Hebrew typography on new art, re-ships -> seeding begins per checklist.

### 2026-06-10 19:00 UTC · code
Iron Dome launch promo pack complete at /tmp/PROMO-PACK.md: WhatsApp (4 msgs incl. parents + alert-night protocol), Telegram admin DM + channel post, Reddit x2, press pitches HE/EN, X posts, meme-page DM, 20s clip script, crisis one-liners, seeding checklist. URL on own line everywhere for domain swap. No em-dashes in personal copy.
### 2026-06-10 18:53 UTC · code
Iron Dome v15 = consolidated brutal-panel batch: stability NO-GO->GO (music was DEAD for everyone - D1 one-liner; 2 soft-lock paths closed), DAILY ALERT shipped (date-seeded, streaks, deterministic-verified), commando actually hard + loss thresholds + 50% win gate, per-mode bests, death beat + fanfares + whiff feel + bonus fiesta + sling sweep. Panel verdict: core loop tortured clean (saves/concurrency/soak all green).

### 2026-06-10 18:30 UTC · code
Iron Dome v14 (growth Day-1 from brutal panel): OG/Twitter cards + share-card.png, ?ref attribution (K-factor measurable), challenge links w/ beat-this banner, wa.me fallback, NEW BEST first-run bug fixed + primary CTA at peak, emoji result grid, per-level funnel events. STILL BLOCKING (Zorba-only): claim irondome.goatcounter.com, buy domain (~$10, kipa.lol / irondome.lol style), WhatsApp-test the preview card. 3 more panel reports pending.

### 2026-06-10 18:24 UTC · code
NEW EXPLICIT GOAL from Zorba: get Iron Dome to 10,000 USERS as fast as possible (stable, fun, viral). Convened brutal 10M-cohort panel #3: growth/virality (funnel, OG tags, WhatsApp K-factor, 7-day distribution plan), retention (FTUE, day-2 hook, difficulty honesty), release-stability (v13 torture: saves v1->v13, bonus/sling state machines, GO/NO-GO verdict), game-feel (miss experience, bonus fiesta, sling payoff, sound mix). All running on v13.
### 2026-06-10 18:17 UTC · code
Iron Dome v13: difficulty select (Easy/Normal/Commando w/ point multipliers), intra-level ramp (starts easy, +35% by level end), bonus falafel-rush rounds after L3/6/9 (double points, no risk), Iron Sling now an ACTIVE volley button (pops 4 lowest rockets, charges per level), crates more frequent + first-crate hint. All per Zorba's Tetris/DrMario feedback. E2E verified.
### 2026-06-10 18:12 UTC · code
Iron Dome v12: Israeli voice pack per Zorba ('more branded, sabra sarcasm, yell at Knesset') — rotating sarcastic level-clear headlines, anonymous-MK reaction quotes (fictional/anonymous = playful not political), escalating Hebrew combo shouts, power-up attitude lines, family-style game-over teasing. DURABLE BRAND RULE: Iron Dome voice = sabra sarcasm, hummus/savta/Knesset-committee humor, bilingual, never name real politicians.
### 2026-06-10 15:14 UTC · code
Iron Dome v11 built: QA round 2 applied (sim-validated loseable difficulty, <4s first kill, hit-stop/pitch-ladder juice, best-gap cliffhanger death, dynamic music) + Zorba's asks (adaptive heat = skill-coupled escalation; Houthi whimper/Hezbollah thud/IRGC boom + sarcastic quips; one-tap Share with clipboard fallback) + all iPhone P0/P1 fixes (Dynamic Island chevrons, zoom translate, iOS audio recovery, SW hang guard). Leaderboard = needs backend, deferred; share button is the zero-backend social layer.

### 2026-06-10 14:56 UTC · code
Iron Dome v10 MERGED (PR #76): visual-viewport canvas (fixes iOS-zoom hiding the city below fold), playfield 15-85% closed at spawn-time too, procedural hypnotic music loop, version badge on menu, SW network-first navigations (self-healing stale caches). QA round 2 running: 2 agents (10M-downloads addiction expert + iPhone-format engineer). KEY HYPOTHESIS for Zorba's reports: he's likely on a stale SW cache (old dubaiai.pro PWA can never self-update — domain dead); badge will prove which build he runs.

### 2026-06-10 13:29 UTC · code
Iron Dome core-feel pivot per Zorba: direct-hit tapping (tap ON rocket, tip = DIRECT HIT bonus), removed ALL auto-aim/fling/queue, hypnotic steady spawn rhythm, upgrades repurposed (Quick Fuse/City Armor). This IS the shippable mobile loop. 27/27 tests x3.

### 2026-06-10 13:05 UTC · code
CORRECTION (supersedes earlier mamadio note): do NOT change anything. By design per Zorba — STANDALONE Mamad Dash includes the Tel Aviv exploration; the 2-IN-1 build is just Iron Dome + Dash with NO exploration. This session (iron dome) must not interfere with the mamadio build.

### 2026-06-10 13:03 UTC · code
FOR MAMADIO SESSION (PR #71): Zorba feedback — 'mamad dash doesn't have the exploration in tel aviv, just the dash game'. He expected the Tel Aviv exploration part, not only the dash mechanic. Route to the mamadio workstream.

### 2026-06-10 13:03 UTC · code
PR #73 MERGED per Zorba's 'merge': QA batch + analytics + Red Alert endless mode live. CRITICAL DNS ISSUE: dubaiai.pro points at Porkbun parking IPs (44.227.65.245/.76.166) not GitHub Pages -> SSL error, whole domain dead. CNAME removed from repo so site serves at https://zorbachin.github.io/dubaiai-pro/ until DNS fixed. TO RESTORE: fix Porkbun DNS (A @ -> 185.199.108-111.153, CNAME www -> zorbachin.github.io) then re-add CNAME file (content: dubaiai.pro). Zorba steering: arcade style confirmed, 'one shippable optimized mobile Iron Dome version'.
### 2026-06-10 12:23 UTC · code
QA panel (4 agents) delivered + all fixes shipped to PR #73 branch: game was UNLOSABLE (blind tapper cleared L10) -> fail state restored w/ sim-tuned assists; Red Alert endless mode added (retention); 3 save-robustness P1s fixed (corrupt save bricked boot); skyline-clone math bug (37.7≈12π); shelter UX (pause mute, shop on loss, kind game-over copy). 26/26 + endless e2e tests.

### 2026-06-10 12:05 UTC · code
Analytics added to Iron Dome (PR #73 draft): GoatCounter cookieless tracking — visits, plays/session, wins, PWA installs. ACTION FOR ZORBA: claim site code 'irondome' at goatcounter.com (1 min) -> dashboard irondome.goatcounter.com. QA panel: 4 specialist agents (functionality/ease/fun/visual design) testing in background.

### 2026-06-10 11:47 UTC · code
PR #70 MERGED — Iron Dome is LIVE at https://dubaiai.pro/irondome/ (user approved merge after htmlpreview diagnosis). v6 includes self-improving calibration. Update the durable test-link preference: use the LIVE link from now on. Note: parallel session shipped MAMADIO companion game (PR #71, mamadio/) — merged main into our branch resolving nucleus conflicts as union.
### 2026-06-10 11:43 UTC · code
Diagnosed user's 'incomplete image + inverted taps' phone report: htmlpreview.github.io strips meta viewport -> iOS lays out at 980px, city below fold, broken touch geometry. NOT a game bug. Added self-improving calibration (in-play EMA on tap residuals, converges ~12 taps, tested) + rect-based scale-proof touch mapping. Better preview host: raw.githack.com (serves HTML intact). Real fix = merge PR #70 to go live on dubaiai.pro/irondome/. 26/26 tests.

### 2026-06-10 11:31 UTC · code
Iron Dome v4: touch calibration mode (guided tap/swipe, measures thumb offset, applied to all input), hard 15% margin guarantee w/ automated barrage test, fixed silent input drops (queue drop-oldest bug = the 'function stops' complaint), instant launch, target dedup, monotonic-clock guard. 25/25 tests x3.

### 2026-06-10 10:36 UTC · code
Iron Dome v4 'function is everything' overhaul: found root cause of 'function stops' = silent 2-interceptor cap (research: MC Recharged uses unlimited ammo + cooldown) → shot queue that never swallows taps; chain-reaction kills; spawn/land bounds inside city; cityscape brightened 2x + true bottom third; falafels enlarged w/ glow. Verified via rendered screenshots. 17/17 tests.

### 2026-06-10 10:25 UTC · code
Iron Dome input overhaul per user feedback ('tap accuracy off, add fling'): aim assist (taps snap to predicted intercept point), proximity-fuze detonation, fling/swipe gesture with speed-scaled lead. Verified by new automated checks (direct tap kills, fling kills) — 17/17.

### 2026-06-10 10:08 UTC · code
Built real screenshot pipeline for Iron Dome (jsdom + node-canvas at phone res, /tmp/render.js) — can now visually verify changes without a browser. Confirmed cityscapes render (Sderot/TLV/Haifa/Eilat all good); found+fixed Jerusalem dome/wall hidden behind foreground buildings, now elevated on ridge.

### 2026-06-10 09:47 UTC · code
Durable preference: every Iron Dome (and similar) update message must end with the test/preview link — user tests on phone immediately. Preview while PR #70 unmerged: https://htmlpreview.github.io/?https://github.com/zorbachin/dubaiai-pro/blob/claude/iron-dome-game-zi3dtt/irondome/index.html (live link after merge: dubaiai.pro/irondome/)

### 2026-06-10 09:37 UTC · code
Iron Dome v2 pushed to PR #70: mobile visibility overhaul (bigger glowing rockets w/ nose cone + flame + smoke trail, incoming-warning chevrons), per-city skyline/topography backdrops in bottom third (all 10 cities), falafel-ball ground impacts per user request. Smoke test 16/16.

### 2026-06-10 09:35 UTC · code
Built MAMADIO — Tel Aviv hustle game, companion to Iron Dome. Single-file canvas game at mamadio/index.html (3 levels: Gordon Beach/Florentin/Old North; 3 characters: Chabadnik/Shop Owner/Influencer; shekel economy from unemployment money; random Home Front Command sirens force a run to the mamad). Draft PR #71 open on claude/mamadio-game-design-v9mr1w; needs a browser playtest before merge. Will be live at dubaiai.pro/mamadio/ once merged.

### 2026-06-10 09:26 UTC · code
Iron Dome game v1 shipped: PR #70 (draft) on claude/iron-dome-game-zi3dtt. Full game at irondome/index.html — 10 city levels, 5 rocket types, 4 power-ups, 4 persistent upgrades incl. Iron Sling, HE/EN+RTL, offline PWA, synth audio. jsdom smoke test 15/15, no CI on repo. Open loop: needs a real phone test before merge; user wants alternative visual styles later.

### 2026-06-10 09:18 UTC · code
Iron Dome game greenlit: tap-to-intercept arcade game at dubaiai.pro/irondome/. Decisions: Hebrew+English toggle (HE default), style between retro and modern (neon arcade, user wants multiple styles eventually), offline-first installable PWA for shelter play, levels = Israeli cities, power-ups + upgrades (Iron Sling/David's Sling, Iron Beam). Branch claude/iron-dome-game-zi3dtt

### 2026-06-02 17:26 UTC · chat
SSA EMAILS STATUS: NOT sent (Claude has no recipient list + sending in Zorba's name to real people needs his nod). Drafts exist: .claude/os/customers/challenge-emails.md (5-day 'Get Your Weekend Back' challenge sequence) + outreach-scripts.md. BLOCKERS: (1) challenge emails need CHALLENGE SIGNUPS to send to (challenge not launched yet). (2) 'new clients' + 'send to more' = Claude needs WHO (names/emails) to personalize. DURABLE RULE: DON'T BE GENERIC — outreach must be personalized/researched per person (1 specific line up top), never template blasts. Warm leads on file: Isaac/vybewear, GTAA tournament leads (Phil Immordino/gtaaweb.org), Jack@Ambo. NEXT: Zorba names the new clients -> Claude writes a specific message per person + sends via Gmail.

### 2026-06-02 15:56 UTC · chat
NUDGE ENGINE BUILT (Google Calendar = the 'email me when to post' system Zorba asked for). Created 6 calendar events 6/3-6/8, 09:00 Asia/Jerusalem, each with the exact copy/link in the description + email reminder 30min before + popup at time: 6/3 LAUNCH socials, 6/4 Note+restack, 6/5 Build Log 001, 6/6 Note (posting fear), 6/7 PUBLISH Issue 002, 6/8 Note. Calendar auto-emails him. Notes also banked in NOTES-BANK.md. PATTERN going forward: Claude schedules posts as Calendar events w/ copy in notes = hands-off reminders toward the 2-week automation goal.

### 2026-06-02 15:43 UTC · chat
ISSUE 003 'The Ring' WRITTEN (content-assets/newsletter/ISSUE-003-the-ring.md), full story in Zorba's voice, no em-dashes, 4 acts (The Amazon Ring / Diamonds for Adir / Made by Hand / More Than a Ring). KEY FACTS: budget Amazon ring guessed (size/cut/style), seen by Meytal in LA but covered; back in Israel launched MORAL EDGE media channel (doing well); documentary on Oct 7 (7 families, tragedy->life-saving impact); met JEN AIRLEY (son Binyamin died a hero) who reminded him of his mom (his BROWN's death non-violent — sensitive, flagged optional); she introduced ALON MESIKA + 'Diamonds for Adir' (son Adir killed at Nova festival, was about to propose; Alon donated a diamond to an engaged soldier -> grew to hundreds; Zorba wears Adir's hat+necklace brand). Alon's workshop: get sized, come back, make/finish each other's wedding rings; 2 soldiers told combat/Adir stories (some off-camera); rings made by hand worn at wedding outside Jerusalem. THEME: Amazon-ring-that-doesn't-fit -> handmade-with-history = sign things are changing; Substack now = accountability/reflection/motivation ('motivation is contagious to seekers, repulsive to the fearful'); CTA pivots to practical tips/tutorials next + asks audience to comment what they want. AUTOMATION: built content-assets/COWORK-QUEUE.md = browser task specs (Substack publish-as-draft + Etsy listings + discount codes) Cowork reads from the shared nucleus and executes; nucleus can't auto-spawn Cowork but this is the turnkey handoff.

### 2026-06-02 15:19 UTC · chat
SUBSTACK AUTOMATION: confirmed NO way for Claude to post into Substack (no Zapier integration, no public write API). Only paths: Cowork/computer-use browser agent (clicks publish) or Zorba pastes (~10s). Everything stays paste-ready. MORE CONTENT READY: (1) ISSUE 002 (ready, no gaps) = insight essay 'I Don't Sell AI. I Sell Time.' (content-assets/newsletter/ISSUE-002-time-not-ai.md). (2) NOTES-BANK.md = 12 ready Substack Notes (post 1/day). Note: the RING story + the venture CHRONOLOGY are stronger but still need Zorba's inputs/assets (queued). No em-dashes throughout.

### 2026-06-02 14:33 UTC · chat
CONTENT IDEA (open loop): 'Keeping Up with the Claudashians' — a series concept (play on Keeping Up with the Kardashians x Claude). Zorba wants it to eventually make it into the content engine once we can get it working. Capture + develop later; needs the concept/format defined.

### 2026-06-02 14:33 UTC · chat
CADENCE GOAL (durable): 1+ post per day, lean into volume. Refined rule: it's not about volume, it's ASK-WEIGHT — don't stack two HEAVY asks (video / go-read-and-subscribe) on the same feed same day; pair one heavy + one light (quote card/tip/meme). 2-WEEK TARGET: content + posting basically FULLY AUTOMATED. Claude to keep adjusting/learning the system toward that (within constraints: FB personal=manual, IG needs media, native>API for TikTok). 'do the substack note' = Zorba posting the launch Note now (Claude can't post to Substack; delivered final Note text to paste).

### 2026-06-02 14:32 UTC · chat
CADENCE RULE (durable): don't stack two big asks on the same feed same day. He posted the calisthenics VIDEO today -> SCHEDULE the Zorbasphere social launch posts (FB/IG/LI/X) for TOMORROW. Today is fine for: Substack being live, warm 1:1 DMs (the invite), and one Substack Note (different channel). Buffer LI+X launch drafts = set to tomorrow. LAUNCH KIT saved: content-assets/newsletter/LAUNCH-NOTES-REPLIES.md (3 Substack Notes + reply templates). REPLY MODE ON: Zorba pastes comments/DMs, Claude drafts on-brand replies.

### 2026-06-02 14:26 UTC · chat
🎉 PUBLISHED & LIVE: Zorbasphere premiere 'The First Call' is OUT on Substack. URL: https://zgrashin.substack.com/p/the-first-call (pub: zgrashin.substack.com). Zorba overcame the exact posting fear he wrote about. MILESTONE. Invite kit (INVITE.md) updated with the real subscribe link https://zgrashin.substack.com. NEXT: (a) send warm opt-in invites, (b) cross-post the launch to FB/IG/LI/X via the content engine, (c) set up Etsy codes DISPATCH15/INSIDER40 + bundle listing. Build Log + Issue 002 (ring / chronology) queued.

### 2026-06-02 14:18 UTC · chat
PUBLICATION NAME = ZORBASPHERE (replaces 'The Dispatch' — that was generic; Zorba owns the zorbasphere domain, works as the everything-hub). Masthead cover regenerated to ZORBASPHERE; all newsletter docs renamed The Dispatch->Zorbasphere (ISSUE-001, PERK-LADDER, INVITE, THE-BUILD-LOG, ISSUE-002). PUBLICATION LOGO = the golden glasses on navy (content-assets/newsletter/logo-glasses.png, avatar/circle-safe) — his signature mark. Subtitle stays 'A LET AI DO IT PICTURE'. All em-dashes scrubbed.

### 2026-06-02 14:13 UTC · chat
PUBLISH DECISIONS for Dispatch Issue 001: (1) AUDIENCE = EVERYONE / FREE / PUBLIC. Do NOT paywall the premiere (Zorba's instinct correct) — origin story's job = reach + subscribers, not revenue; too early to ask for payment. Paid perk ladder kicks in LATER once there's an audience. (2) Substack TAGS = yes add ~6: building in public, AI, founder story, entrepreneurship, productivity, solopreneur. (3) SEO pass = via post settings, NOT body stuffing: SEO subtitle/meta = 'How I went from laid off and broke in a sublet to building an AI business that gives people their time back. The honest origin of Let AI Do It.', slug the-first-call, image alt text per photo. Post type = Text. Spec added to ISSUE-001.md. Also: call prep for Jack@Ambo EMAILED to zgrashin@gmail.com (msg 19e88ad951490236) — payroll report time-savings + undercut a SaaS he pays for.

### 2026-06-02 13:59 UTC · chat
ISSUE 001 act titles set (cover PROGRAM + in-story section headers, they mirror): 'Sunset at the Duomo' (engagement + broke backstory), 'Weddings and Wartime' (wedding + Nissim + Minimovies film + war + safe room), 'Mission Possible: AI' (the house/mission + Passover + zorbot/bloop/feed-flip + buildyourbot/selfsellingai + close). Replaced the weak 'The Feed That Went Quiet' etc. 'Mission Possible - Ai' tidied to 'Mission Possible: AI'. Masthead regenerated. No em-dashes.

### 2026-06-02 13:38 UTC · chat
DESIGN: (1) Newsletter masthead REDESIGNED as a vintage NEWSPAPER MOVIE-LISTING: two columns split by a center rule (left = NOW SHOWING feature 'The First Call' + tagline, right = THE PROGRAM billing + ADMIT ONE stamp + run-time/credits), masthead 'THE DISPATCH / A LET AI DO IT PICTURE', bottom marquee. Was too book/poster-like before; now split-the-middle newsprint. cinema_news.py rewritten, 1200x1000. (2) Bundle thumb ('The Solo Founder's AI Operating System') now has a VALUE TAGLINE: 'Run your whole business with AI. 20 systems, one download.' SUBSTACK note: standard newsletter/article = the 'Text' post type (confirmed).

### 2026-06-02 13:10 UTC · chat
CHANNELS FINALIZED: (A) THE NEWSLETTER = 'The Build Log' (content-assets/newsletter/THE-BUILD-LOG.md): super brief weekly, ~150 words, format = Building / Idea / Next / Steal-this(time-saver). Sample 001 ready. (B) SUBSTACK 'The Dispatch' = in-depth story/insight + the HUB that holds EVERYTHING he offers (story, Etsy shop, work-with-me/letaidoit.pro, buildyourbot/selfsellingai tools, Minimovies films) via the About page. PERK LADDER = FULL (content-assets/newsletter/PERK-LADDER.md): Reader(free web) -> Free subscriber (15% Etsy code DISPATCH15 + occasional free guide) -> Paid (~$7/mo: 40% code INSIDER40 + 1 free guide/mo + early access + BTS build breakdowns + discounted audit call + prompt vault) -> Client (the revenue the ladder funnels to). Etsy codes made in Shop Manager>Marketing>Sales&discounts. Welcome email drafted. No em-dashes.

### 2026-06-02 13:06 UTC · chat
CHANNEL SPLIT (strategic): TWO lanes. (A) SUBSTACK = 'The Dispatch' = STORY/INSIGHT/building-in-public (origin story lives here, NOT time-saving). EXCLUSIVE perk: Substack subscribers get Zorba's ETSY products at a DISCOUNT (+ early access/behind-the-scenes). (B) THE NEWSLETTER = PRODUCTIVITY / time-saving AI tips (home for the 'Three Time-Savers' practical content). PHOTO/ASSET corrections for Issue 001: the DUOMO photos = ENGAGEMENT (proposal on knee w/ visible tripod 'alibi', kiss at lit facade, night selfie w/ RING on hand -> sets up Amazon-ring tease). The chuppah/crowd/first-dance photos = WEDDING. NISSIM BLACK (longtime friend+collaborator) performed a SURPRISE set at the WEDDING (crowd-under-spotlight = the performance photo); Meytal surprised too. Surprise WEDDING FILM (made morning of wedding, played live, youtu.be/pd3musK_Nbo) = seed of MINIMOVIES.io. Melinda BAT mitzvah film = another Minimovies example. Substack embeds YouTube natively (no compression needed).

### 2026-06-02 12:53 UTC · chat
ISSUE 001 full entertainment pass (craft only, invented nothing): tighter comedic timing on the secret-filming caper, sharper 'IG vs reality' turn, leaner hardship montage, planted the AMAZON RING early as a wink, added a cinematic 'NEXT ISSUE' tease. RING SUBPLOT (next story): proposed with an Amazon ring -> they later MADE their own rings by hand with ALON MESIKA, on camera, became part of THE DOCUMENTARY. (There is a documentary about them — capture as asset.) Wedding PHOTOS exist (3 shared: crowd-under-spotlight hora, chuppah w/ green dress+kippot, first dance) but came inline in chat, NOT saved to repo — Zorba drags them into Substack at layout. Photo slots noted in ISSUE-001.md.

### 2026-06-02 12:16 UTC · chat
ISSUE 001 = full real origin (Zorba's own words, polished, no em-dashes, cinematic). KEY BIO FACTS (durable): Engaged at the Duomo, Milan, sunset, last night of a 6-wk budget trip; filmed it using a 'new iPhone mic to test' as alibi (tripod+mics+ring box in a bag). Moved to Israel ~1yr prior; laid off 2 days after booking ticket; company folded 6 wks later; six-figure cushion gone. Met Meytal within 6 wks (hours before a flight); rocket jammed her door -> she moved into his room; Yom Haatzmaut -> first sublet (extended 2x). Money came from 'angels', one who seemed to track his bank account. SUBPLOTS: a FILM in active development w/ investor signed; a TV series being pitched to big names (both months away). Wedding = global, Alaskan+Ethiopian+Israeli+American culture collision; war began 9 days later; has a mamad/safe room; 1st month of marriage in own place then spare room (mom's bed). THE HOUSE: family friends' beautiful home near Netanya (near mother-in-law) they can't live in = chance at dream home = the MISSION (support family, get the home, use AI). Passover: said AI makes him feel free (lets him bring ideas to life fast, like standup). Chronology woven in: zorbot.io -> chatbot on his ChatGPT history+his book on how to think -> 'that's a product' = bloop -> algorithm shifted to AI tool builds -> ~$1k + 1000+ hrs -> reaching out to businesses -> buildyourbot.io + selfsellingai.pro. Tone: warm, determined, grateful, anti-hype. Tied subplots: film/TV ('AI did not make me wait'), the angel (pay it forward), the house (building toward it in public).

### 2026-06-02 11:28 UTC · chat
ISSUE 001 STORY corrected + VOICE RULE. (1) NO EM-DASHES in his content — more human (use commas/periods/parentheses). Durable voice rule. (2) Corrected timeline: OBSESSION came BEFORE the business. During the war his YouTube feed flipped (no news, only AI builds) -> got obsessed -> started PAYING for subscriptions to test them himself, figuring 'if it lands one job it's worth it.' Baby found out MIDWAY through the war while deep in AI, not knowing what to do -> that 'changed the math' -> first call -> second -> hardest part = posting. (3) Story rewritten present-tense/cinematic (in-the-moment, not safe past tense). (4) DROPPED the Three Time-Savers from the premiere — he 'didn't get the tips'; premiere = pure origin story. Segment returns later reworked. Masthead billing now teases story beats (The Feed That Went Quiet / Midway Through the War / The Mission, Made Plain).

### 2026-06-02 11:07 UTC · chat
VENTURE CHRONOLOGY (new, from Zorba — NOT previously documented; build-in-public timeline for Dispatch Issue 002 'How One Site Became a Whole Build'): (1) zorbot.io = his FIRST site, built to try and get work (the digital first call). (2) -> led to a PRODUCT 'bloop' on buildyourbot.io. (3) Riley + selfsellingai evolved from it. (4) a CLOSING TOOL (foxy-close-tool/Instant Proposals) became its own product. Through-line: same instinct each time — find where time leaks, build the fix; mission got clearer = take back your time, give time back to others. NEEDS FROM ZORBA: one-line confirm per beat + the asset to embed (video link + site URL/screenshot) — sites are bot-blocked so Claude can't pull them. Skeleton: content-assets/newsletter/ISSUE-002-chronology.md. NOTE: we 'started this' 2026-06-01 (OS + AUDIT.md + decision log).

### 2026-06-02 11:05 UTC · chat
ISSUE 001 REWRITTEN = origin story 'The First Call' (his real story): came back engaged/broke/no job/sublet -> married -> baby coming -> WAR days after wedding -> obsessing over AI in the bomb shelter -> first call, second call -> finally got over the unease of POSTING. MISSION (clearer now): build a business to take back his own time AND give time back to others. NOT to make people AI-obsessed; he likes people who want to grow + use tools well; loves solving problems like he does ON SET. Building LIVE, exposed: 'follow me, make that first call/post yourself.' Voice: plain, confessional, anti-hype, sell the WHY (time/freedom). Masthead recut (title 'The First Call'). Kept Three Two-Minute Time-Savers as closing segment. Substack IS SET UP — ready to paste & publish. Updated voice-guide story assets (house/war now filled).

### 2026-06-02 11:02 UTC · chat
NEWSLETTER PLATFORM = SUBSTACK (chosen). The Dispatch recurring segment: 'Three Two-Minute Time-Savers' (one WORK, one LIFE, one HEALTH; quick/fun; each a copy-paste prompt). Issue 001 written (content-assets/newsletter/ISSUE-001.md): feature 'Buy Back Your Time' + the 3 time-savers (kill the email thread / plan the night out / fridge->meal + 12-min calisthenics workout). Opt-in INVITE drafted (content-assets/newsletter/INVITE.md) — personal invites + warm leads + content-engine growth, NEVER import-and-blast. Masthead billing updated to feature the time-savers segment.




<!-- HANDOFFS:END -->

## 🔄 Live State (auto)
_Refreshed automatically after each turn — do not edit by hand._

<!-- AUTOSTATE:START -->
- **When:** 2026-06-11 02:53 UTC
- **Branch:** `claude/iron-dome-game-zi3dtt`
- **Last commit:** 4fa7e02 chore: refresh nucleus live state [skip ci] — 8 hours ago

**Working tree:**
```
M .claude/nucleus/NUCLEUS.md
```

**Uncommitted changes:**
```
.claude/nucleus/NUCLEUS.md | 22 ++++++++++++++--------
 1 file changed, 14 insertions(+), 8 deletions(-)
```

**Recent commits:**
```
4fa7e02 chore: refresh nucleus live state [skip ci] (8 hours ago)
5c97328 chore: refresh nucleus live state [skip ci] (8 hours ago)
5e6703b Merge remote-tracking branch 'origin/main' into claude/iron-dome-game-zi3dtt (8 hours ago)
009da8e Iron Dome launch promo pack: copy + cards + screenshots (8 hours ago)
510087a chore: refresh nucleus live state [skip ci] (8 hours ago)
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
