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

- [ ] **Miklat Games is the active venture** — own repo `zorbachin/miklatgames`,
      live at miklatgames.fun (arcade shelf: Iron Dome first, Mamad Dash second,
      Balagan + Fabatollah coming-soon doors, offline SW on all surfaces).
- [ ] Miklat next-up: per-game GoatCounter event wiring (pageviews already live).
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
- **Mamad Dash = STANDALONE game** (Zorba, 2026-06-10): siren runner is the
  viral core; Tel Aviv exploration demoted to secondary. Iron Dome + Mamad Dash
  are THE two viral candidates if made perfect and dead-simple. Parked idea
  (separate): multiplayer Tel Aviv lifestyle game ("trying to make it" sim).
- **Claude = COO/CMO of Miklat Games** (Zorba, 2026-06-11): owns operations +
  marketing + the monetization plan. Plan of record lives at
  `miklatgames:.claude/os/MONETIZATION.md` — distribution-first (portals bring
  their own players), revenue switches on in phases.

## 📥 Handoffs
_Newest first. Written automatically by hooks and by `nucleus push` from any
surface. This is the message-in-a-bottle between sessions._

<!-- HANDOFFS:START -->
### 2026-06-12 03:24 UTC · code
MIKLAT DIGGER v1 SHIPPED overnight (4th live game): 853-line single file per the B+C bible, on the shelf w/ card+cover+SW bump. Review gate caught 4 flaky tests (worldgen fencing) + 1 real bug (walking tunnels burst pipes — fixed: only digging shakes ground); suite now 80/80 x40 stable. SS playtest (4K bot runs) tuning landed: mercy inv 2.0s, chase 4s, gentler early density, 3-item first list — casual median now AT genre bar (44s); stale-list fallback bug fixed; 31/31. Test suites persisted into repo (<game>/test/ = new factory invariant). Zorba wakes to: 4 playable games, war room, one Gemini key from full art

### 2026-06-12 03:00 UTC · chat
Universal design layer shipped (Zorba ask): DESIGN-SYSTEM.md = arcade-wide tokens (brand chrome constant across games, sound vocabulary, juice/perf budget, share-card standard) + CANONICAL CAST named: Savta (mascot-in-chief), Noni the kid, Shuki the vendor, Inspector Tikva, Rafi the worker — one universe, recurring characters. assets/universal/prompts.json = cast sheets + UI kit in one imagepack run. In flight: SS design sprint agent + SS bot-playtest agent (200+ runs/policy, tuning deltas) + Miklat Digger v1 build agent

### 2026-06-12 02:48 UTC · chat
MIKLAT DIGGER greenlit as B+C fusion (Zorba: 'I like b and c'): dig the mamad, keep hitting antiquities. Full v1 bible committed — coffee meter, brush mini-game, Inspector antagonist, 10 strata, mamad-upgrade meta = Miklat Wallet's first SINK, Pesach afikoman event. V1 = 2-3 day build, queued behind tomorrow's launch day. Open micro-gates: inspector tone OK?, coffee vs hummus meter

### 2026-06-11 20:46 UTC · chat
Zorba steers: BALAGAN = beach sports (matkot co-op + volleyball VS + scooter ghost race) — v2 bible committed. NEW game named: MIKLAT DIGGER (no spec existed; stage-0 doc w/ 3 options awaits his pick: Dig-Dug-style / build-the-mamad / archaeology-strata dig — recommend C). SHUK SHOPPER finished tonight per panel: sound synth + seeded DAILY SHUK w/ streaks (30/30 suite + determinism verified). Tomorrow's finish list: SS art pack (needs key), MD daily button + streaks port, ID portal build, Miklat Digger build once steered

### 2026-06-11 20:38 UTC · code
SOCIAL LAYER architected + research-validated (miklatgames .claude/os/SOCIAL.md): VS = 3 rungs (URL-duels zero-backend ship-first -> snapshot ghost racing w/ 36h forfeit -> WebRTC gated at 500 duels/wk); HaLuach opt-in board via Cloudflare Worker (code shipped api/haluach-worker.js, KV launch -> D1 at 500/day, $5/mo at full scale, TLV PoP <50ms); companion = Chavruta duo-streak (Duolingo evidence +22% daily completion), Bayit wallet, Motzash hot-seat. NEW GAME: BALAGAN = daily Israeli-culture duel for the group chat (balagan/WORLD.md) — awaiting Zorba stage-1 gate + naming approvals (Shem/HaLuach/Chavruta/Motzash) + Cloudflare account when HaLuach ships

### 2026-06-11 20:15 UTC · chat
Naval framework set captured (.claude/os/frameworks/naval-prompts.md) AND executed on Zorba's real data (naval-execution.md). Verdicts: specific-knowledge niche = 'AI-operated micro-ventures at game-speed, the machine is the product'; top model = THE MIKLAT OS kit (score 14: package nucleus+agentbus+coursegen as template+course, the arcade is the playable proof); leverage finding = no labor problem, UNPLUGGED leverage (built-to-5 assets never connected to distribution); 24mo equity gap ~$23K from games alone if conversions happen this week

### 2026-06-11 19:52 UTC · code
NIGHT SHIFT COMPLETE: (1) 10M panels x3 games — verdicts in each PANEL-VERDICT.md; 11 prescribed fixes applied+syntax-verified (incl. panel-caught tip-jar tap bug, ID save crash, SS restart race + 6s difficulty saturation). Ship calls: ID+SS itch today, MD ship, CrazyGames needs portal build. (2) War Room launch console at academy/war-room.html — all gates/links/prompt packs/pitch. (3) Zorba Campus: 5 courses from 30-day audit via new bin/coursegen. (4) Morning brief drafted in Gmail. (5) T020-T025 queued. Zorba's 2h: keys session -> art packs -> portals -> WhatsApp+press

### 2026-06-11 18:49 UTC · code
Night shift delivered: (1) MIKLAT ACADEMY at miklatgames/academy/ — 7-level gamified 10M-download playbook, every number researched+sourced (8 fact sheets in .claude/os/research/). Core teachings: distribution>product (Wordle), own-domain ads beat portal revshare ~8x, Ko-fi 0% for tips, tribe support is quantified (+67% label effect, $1B bonds) but needs label/1-click/badge, WhatsApp=98% IL rail, JTA wire effect, 906 schools+850 Hillels pipe, Hanukkah blitz. (2) GAME-FACTORY.md 7-stage pipeline codified + full backfill: MD events, SS og, dormant tip jars all surfaces, press specs + WORLD.md for ID+MD. Zorba blockers: Ko-fi account, fresh Gemini key (new project), then portal submissions

### 2026-06-11 18:32 UTC · code
Overnight mandate (Zorba): (1) build a personalized 2h gamified monetization course — the 10M-download playbook — as an interactive Miklat-style academy page; core thesis to teach: tribe-support marketing, branding, gameplay experience. (2) Audit the whole game workflow, codify the repeatable factory pipeline (10M advisor reviews, prompt packs/imagepack, logic pass, ship/marketing), backfill games that missed stages. 3 research/audit agents running

### 2026-06-11 17:51 UTC · code
Shuk Shopper gameplay-art pipeline shipped: game auto-upgrades from emoji to painted art when assets/*.png exist (3 shuk backdrops, player run/slide, 3 vendors; magenta chroma-key for transparency). assets/prompts.json = full spec w/ character bible. BLOCKER for Zorba: needs free Gemini key (aistudio.google.com/apikey) + run 'bin/imagepack shukshopper/assets' to fill it

### 2026-06-11 17:39 UTC · code
Shuk Shopper world grounded in REAL shuks (user steering): HaCarmel -> Levinsky -> Mahane Yehuda, 13 districts (produce/falafel-pizza/fish/juice/tchotchkes/spice/nuts/bureka/gazoz/bakery/cheese/halva/night-shuk) implemented in-game; baskets advance districts, lists are district-local. WORLD.md = design bible with roadmap (Shabbat siren finale, Savta boss, per-shuk leaderboards)

### 2026-06-11 17:33 UTC · code
Tooling preference: Higgsfield = waste of credits for image gen — use FREE Gemini instead, batched not one-by-one. Built bin/imagepack in miklatgames (reads <game>/press/prompts.json, batch-calls free Gemini API). Shuk Shopper press pack v1 generated (keyart/icon/poster/itch cover/banner)

### 2026-06-11 17:20 UTC · code
MG org restructured: mg-ceo is now a dedicated Commercialization CEO (one job: marketing/distribution to the 10K-user goal); each game gets a full-time PM agent (irondome/mamaddash/shukshopper) managing that game's 10M advisor panel. Recorded in .claude/os/ventures.md

### 2026-06-11 16:26 UTC · code
SHUK SHOPPER shipped to miklatgames (branch claude/cool-rubin-gb8jv6): Subway Surfers research-mapped to the shuk — 3-lane swipe runner, Ima's shopping list = the basket loop, vendor chase = the stumble/caught system, shekels breadcrumb the safe lane. Emoji-sprite v1 (zero assets), EN/HE, offline SW, ?beat= challenge links, headless-verified. Design doc + Shuk Tour roadmap in repo. NOTE: new game jumped the monetization queue (plan says portals first) — Zorba's call.

### 2026-06-11 13:39 UTC · code
Miklat Games has its own workspace now: zorbachin/miklatgames repo (miklatgames.fun, GitHub Pages). Arcade shelf live with Iron Dome + Mamad Dash, two coming-soon doors (Balagan, Fabatollah), offline SW everywhere, GoatCounter analytics. Dev branch this session: claude/cool-rubin-gb8jv6.

### 2026-06-11 13:05 UTC · code
Music sequences-of-three shipped (PR #104, Zorba's model: one song per 3-wave block rotating per cycle, Temple Dash on marathons) + iOS preload fix + insideScene transform hard-reset (final centering guarantee). REMINDER AT TOP OF NEXT SESSION: add miklatgames repo to session picker — 4 merged fix-rounds are waiting to deploy to the live site.

### 2026-06-11 12:54 UTC · code
Live-play feedback round shipped (PR #103 merged): music = one driving track per run (no more per-wave hopping), THE FLOCK added (stacked duck-only air wall, guaranteed 1/wave + 2/marathon, jump stays reliable default elsewhere). End-screen misalign fix (#102) merged but STILL NOT LIVE — miklatgames repo needs re-sync from dubaiai-pro:miklat/ (Cowork one-liner or add repo to session). This is now the #1 friction: every fix is double-gated until the miklatgames repo is in-session.

### 2026-06-11 10:31 UTC · code
🚀 MIKLATGAMES.FUN IS LIVE (confirmed via Zorba's screenshot — Cowork deployed). iOS canvas-desync bug (inside-mamad heading bleed) root-caused + fixed in PR #102 (self-healing per-frame dimension check, orientationchange double-resize, fit-to-width headings). GAP: live site serves from the miklatgames repo, which doesn't auto-sync from dubaiai-pro miklat/ — fix is merged on dubaiai-pro main but NOT yet live. Next session MUST include the miklatgames repo so code-session pushes deploy directly; until then Cowork re-syncs on request.

### 2026-06-11 08:40 UTC · code
Cowork deploy master prompt v2 delivered (current state: all merged, miklat/ on main is the package; 7 steps: repo, push package, Pages, Porkbun DNS both domains, GoatCounter 'miklatgames', Iron Dome check in zorbasphere, full verification + nucleus handoff from cowork). Awaiting 'live' from Zorba for final verification pass.

### 2026-06-11 08:14 UTC · code
LAUNCH WALKTHROUGH delivered to Zorba (6 steps, ~12 min): create miklatgames repo → new claude.ai/code session w/ both repos + deploy one-liner (package = dubaiai-pro:miklat/) → Pages main/root + custom domain → Porkbun 4 A records + www CNAME → GoatCounter code 'miklatgames' → say 'keys turned' for end-to-end verification. After that every merge auto-deploys to miklatgames.fun in ~60s.
### 2026-06-11 09:19 UTC · code
v24 MERGED (PR #100): the REAL per-city art from Zorba's Drive folder on all 10 levels (downloaded+classified 39 Drive files via MCP; all 10 cities matched, dome-centered, sky-rule; visually verified contact sheet), drawn towers REMOVED everywhere (damage = fire/smoke on the artwork, HUD city counter), strict 1-2-3 music cycle on every level (L10 wraps to song 1), menu redesigned (PLAY hero + mode subtitles + 3 difficulty mini-buttons + How-To demoted), REAL app icon from Drive replaces placeholder. Triple-check table ALL GREEN. Drive folder also contains Mamad Dash sprites/props batch (noted for their session).
### 2026-06-11 08:13 UTC · code
v23 MERGED (PR #99): art worlds preload at boot + full SW precache (procedural flash eliminated — root cause of 'old levels' reports), falafel sprites re-cut clean (brown/green, no explosion-red), foreground tappable buildings now low-rise+darker so art cityscapes are the hero while keeping break-apart gameplay. Game is visually complete on Zorba's art end to end.
### 2026-06-11 07:53 UTC · code
v21 MERGED (PR #97): centered full-dome art worlds (5 scenes cycling 10 levels, in-game center-crop, band capped 40% H) + REAL falafel sprites cut from the art tumbling on collision (old painted balls erased). Game is now visually end-to-end Zorba's art: menu bg, level worlds, falafel, share cards. Remaining gates: DNS->flip, GoatCounter x2, shot-list approval, nice-to-have art files (icon/victory/badge).

### 2026-06-11 07:54 UTC · code
WORKSTREAM SYNC AUDIT: mamaddash canonical == miklat package (byte-verified modulo domain+analytics deltas); bin/sync-miklat script added so it can never drift. mamadio stable by design. OUT OF SYNC: Iron Dome (not ported — location unconfirmed, zorbasphere candidate, or regenerate); deploy keys still with Zorba (miklatgames repo, Porkbun DNS x2 domains, GoatCounter).

### 2026-06-11 07:33 UTC · code
PLAYTEST BATCH SHIPPED (PR #95 merged): pause button + PAUSED key screen (ring legend, costs, helpers), HOME button, hits cost -10 shekels, emoji ink-centered in telegraph rings, lime scooter helper (1.55x hyper-speed one screen, smash-proof), easy/medium/hard difficulty persisted (dailies pinned medium). All verified headless. The game now has its full v1 feature set.

### 2026-06-11 07:40 UTC · code
v20 MERGED (PR #96): LEVELS NOW WEAR THE REAL ART — discovered 5 unprocessed full-res retro panoramas in session uploads; cut 10 per-city level worlds from them (bg1-bg10.jpg, dome baked in, clean playfield sky, pixel-crisp, lazy-loaded w/ procedural fallback). Also: caught+fixed conflict markers committed to game files during a squash-artifact merge (restored from clean commit, 23/23 tests). The '16 portrait images' ask is now MOOT for levels — only nice-to-haves remain (icon, victory art, daily badge as standalone files).
### 2026-06-11 07:32 UTC · code
v19 MERGED (PR #94): Miklat Wallet live — shared ₪ economy ('Bituach Leumi fund') across Iron Dome + Mamad Dash (their session adopted WALLET-SPEC.md independently, both directions confirmed on main). CONTINUE mechanic live (max(300, 25% wallet), once/run, never Daily). Cross-game loop: earn in Mamad Dash -> survive Red Alert in Iron Dome. Remaining Zorba gates unchanged: DNS->flip, GoatCounter x2, 16 level images, shot-list approval.
### 2026-06-11 07:30 UTC · code
MIKLAT WALLET CONTRACT (for Mamad Dash session + all future games): shared economy on localStorage key 'miklat.wallet', format {"sh": <int>}, currency ₪ shekels, lore = unemployment money (ביטוח לאומי). Rules: clamp >= 0, try/catch all access, spend = check-then-decrement. Iron Dome v19 implements it (migrated legacy coins, shop spends from it, CONTINUE mechanic costs max(300, 25% of wallet), once per run, never in Daily). Mamad Dash should earn INTO and spend FROM the same key - its 'shekels from unemployment' ARE this wallet.

### 2026-06-11 06:30 UTC · code
FOR CLAUDE DESIGN (artwork was missing there): full MAMAD DASH art index with public fetchable URLs now at mamaddash/ART-INDEX.md — base https://rawcdn.githack.com/zorbachin/dubaiai-pro/<main-sha>/mamaddash/ + art/ paths (sprites, 4 hood bgs, door, power-ups, keyart, hero, icon, og). Palette: navy #0b0e1a gold #ffd166 teal #7ee8c7 coral #ff5d5d cream #f4ecdd sky #37b6ff. Any surface: fetch by URL, don't regenerate the art.

### 2026-06-11 06:29 UTC · code
PROMO EDIT KIT COMPLETE: 4 generated keepers (alert / slide+leap combo per Zorba's reorder / full door entry / door closes) + composited beats per cut sheet. All URLs in PROMO.md. Audio rule: discard native clip audio (gibberish) — game siren is the score. Next: Zorba QCs slide-leap, then CapCut assembly per cut sheet + VO script. ~790 credits left.

### 2026-06-11 06:14 UTC · code
PROMO SHOOT v1 COMPLETE: all 5 narrative shots rendered per 10M-club plan (alert/sprint/near-collision/dash-to-door/door-closes) + 2 earlier hero clips. URLs + QC bar in PROMO.md. ~110 credits used, ~850 left. Awaiting Zorba's eyeball QC (sandbox can't watch video); regen budget 3/clip then static fallback. Composited beats (leap whip, nu-shake, SHOE thunk, boom, title) are post-work in any editor per the cut sheet.

### 2026-06-11 06:02 UTC · code
SOUNDTRACK SHIPPED (PR #88 merged): Jericho Run=title/death panel, Temple Run Shalom=beach + 45%-offset section for Florentin/Night, Temple Dash=Old North + ALL marathons. Death cam silent. Note: 'level 2' upload was byte-dupe of level 1 — awaiting a distinct song. 10M-club production plan delivered for promo video: 5 generated clips + 4 composited beats, shoe gag = composited near-still + sound design (RED-rated for generation), every clip needs pre-composited start/end frames from sprites; QC bar = any artifact at 1x → regenerate, max 3 tries then static fallback. Next: build composite frames, run generations, Zorba eyeballs clips (sandbox can't watch video).
### 2026-06-11 06:13 UTC · code
🎨 ART ASSET MANIFEST for any Claude surface (Design/Cowork): ALL Iron Dome art is in repo zorbachin/dubaiai-pro on main, publicly fetchable via https://raw.githubusercontent.com/zorbachin/dubaiai-pro/main/ + path. FULL-RES RETRO ORIGINALS (no text, master art): content-assets/irondome-promo/art/{retro-wide-clean.png (1672x941 hero), retro-press-hero.png (1717x916 maximal panorama), retro-square-panorama.png (1254sq), retro-falafel.png (1254sq), retro-wide-alt.png}. PRODUCTION CARDS (typography burned in): content-assets/irondome-promo/{share-card.jpg 1200x630, story-1080x1920.png, square-1080.png, meme-knesset-1080.png, press-hero-titled-1920x1080.png} + gameplay screenshots. IN-GAME: irondome/{share-card.jpg, menu-bg.jpg, icon-192/512.png}. NOTE: the 16 per-level world backgrounds DO NOT EXIST AS FILES anywhere — they were chat previews only; Zorba must upload them (re-download from ChatGPT) before any surface can use them.

### 2026-06-11 06:07 UTC · code
v18 MERGED (PR #89): FULL SOUNDTRACK live — home_screen.mp3 on menu (first-tap unlock per iOS), 3 gameplay tracks rotating 1-2-3 across campaign (L10+Red Alert = hottest track, Daily = track 2, bonus keeps synth fiesta). Per Zorba: reuse 3 tracks, no need for ten. All tracks runtime-cached (offline after first listen). Pending unchanged: DNS->flip, GoatCounter claims, 16 level images re-upload, shot-list approval.
### 2026-06-11 05:27 UTC · code
MIKLAT GAMES PORTAL MERGED (PR #86) in auto mode: bilingual arcade front door live at github.io root (consultancy moved to /dubaiai/), shell-only SW bypassing game paths, challenge passthrough, GoatCounter 'miklatgames'. bin/miklat-flip = one-command domain cutover (CNAME + Iron Dome URL migration + cache bumps) — RUN ONLY AFTER Porkbun DNS set. Board deliverables sent to Zorba: MIKLAT-BLUEPRINT.md (incl. paste-able design prompt) + SHOT-LIST.md (video parked pending his beat approval). ZORBA-ONLY GATES: Porkbun records for miklatgames.fun (A 185.199.108/109/110/111.153 + CNAME www->zorbachin.github.io), claim goatcounter codes 'irondome'+'miklatgames', re-upload the 16 level-art images as files, approve shot list, create WhatsApp Channel.

### 2026-06-11 05:20 UTC · code

### 2026-06-11 05:55 UTC · code
MAMAD DASH promo: locked reliability-first production plan — 5 generated clips max, all start frames pre-composited from sprite art, shoe-in-door punchline done as composited near-still + sound design (never generated), title/text composited in post

### 2026-06-11 05:54 UTC · code
PROMO VIDEO SHOT LIST (Zorba, canonical): alert on phone → runs → almost hits savta → jumps over her → she shakes fist → reaches mamad door → enters → door almost closes → savta's SHOE stops it → she enters → door closes → BOOM → title card MAMAD DASH. Priority: animations must work, no glitch, no AI slop. Sent to 10M club for shot-by-shot optimization before generating.

### 2026-06-11 05:23 UTC · code
🚢 PR #74 MERGED to main (squash 8bd786f) under Zorba's auto mode — game+art+pacing v2+promo+miklat package all canon. Nucleus merge conflict union-resolved (no handoffs lost). Repo creation still 403 (token scope, not permission mode) — miklatgames repo needs Zorba/Cowork. Iron Dome: NOT a standalone repo; only candidate is zorbasphere (private, updated 2026-06-10) — confirm or regenerate from nucleus context. Remaining launch gates: create miklatgames repo + push miklat/ package, Porkbun DNS (miklatgames.fun + optionally dubaiai.pro), GoatCounter code 'miklatgames'.

### 2026-06-11 05:20 UTC · code
### 2026-06-11 05:20 UTC · code
MIKLAT PORTAL BLUEPRINT delivered at /tmp/MIKLAT-BLUEPRINT.md: (1) complete one-shot Claude design prompt for the miklatgames.fun portal (root index.html, Iron Dome visual system, EN-led/HE RTL, instant-play cards, PWA w/ SW that bypasses /irondome//mamadio/ scopes, GoatCounter code 'miklatgames', challenge param passthrough); (2) HOSTING DECISION = option A: point miklatgames.fun at THIS repo (Porkbun A 185.199.108-111.153 + AAAA + CNAME www->zorbachin.github.io, CNAME file 'miklatgames.fun'), consultancy moves to /dubaiai/ — games' paths survive, github.io 301s itself; (3) Iron Dome URL swap list: index.html lines 11/12/18/261/1963 + PROMO-PACK 17 occurrences + sw bump v18; (4) v1 scope: 2 cards + ghost card + WhatsApp Channel notify hook; OUT: accounts/leaderboards/comments. ZORBA-ONLY steps: Porkbun records (5 min) + claim GoatCounter 'miklatgames' + create WhatsApp Channel.

### 2026-06-11 05:16 UTC · code
MIKLATGAMES.FUN purchased on Porkbun (miklat = shelter — perfect umbrella brand) to house ALL games. Directives: (1) no promo video yet — shot list first; (2) board convened to ready Iron Dome + new portal site for the 10k push; (3) CHECK-IN FOR MAMAD DASH TEAM: Zorba wants Mamad Dash ready for the miklatgames.fun portal launch — status of PR #71 / standalone build? Portal will link all games; reply via nucleus with current state + what's needed. (4) 16 retro level-art images shown in chat but NOT saved as files — need re-upload to integrate reskin.

### 2026-06-11 03:48 UTC · code
v17 MERGED (PR #85): end screens redesigned per Zorba's screenshot — stat strip with HITS TAKEN (new cityHits counter) + intercepted + direct hits on every end screen, shop collapsed behind toggle, overlay screens can never overflow the frame (safe centering + scroll fallback), menu tightened. Awaiting Zorba's image packs #2 (icon/portrait/victory) and #3 (10 level worlds) for the beauty pass.

HANDOFF → Cowork: master deploy prompt delivered (merge PR #74, create+populate miklatgames repo from miklat/ package, Pages+CNAME, Porkbun DNS guided, Iron Dome port from wherever it lives in GitHub, full release verification, GoatCounter reminder code 'miklatgames'). Code session = build shop; Cowork = release manager. If Iron Dome isn't in GitHub, regenerate from nucleus context.

### 2026-06-11 05:18 UTC · code
MIKLAT GAMES v1 packaged in dubaiai-pro/miklat/ (session can't create repos — 403). Arcade shelf + full MAMAD DASH port (canonical → miklatgames.fun) + GoatCounter code 'miklatgames' pre-wired + deploy runbook. Verified over HTTP. BLOCKERS FOR ZORBA: (1) create github.com/zorbachin/miklatgames + add to a session OR run the runbook push commands; (2) Porkbun DNS for miklatgames.fun (4 A records); (3) GoatCounter signup with code 'miklatgames'; (4) tell me where Iron Dome's source lives for its port.

### 2026-06-11 05:12 UTC · code
DECISION (Zorba): bought miklatgames.fun on Porkbun as the umbrella arcade for all games (solves growth panel's dubaiai.pro trust problem). Wants a Claude design prompt for a mobile-first arcade site built on 10M-club counsel. Brand insight: Miklat = shelter — 'the games you play in the shelter' is the moat. Promo clip 1 (9:16 night) rendered via Higgsfield kling3_0, clip 2 rendering; VO script + cut sheet committed in PROMO.md.

### 2026-06-11 04:24 UTC · code
PACING V2 SHIPPED (board option C, full assessment cycle complete): speed carryover w/ 14% dip, 0.6s door beats (was 2s freeze), 30s marathon every 4th siren, goals up. Measured: 68s continuous blocks vs 11.5s loops, run share 86->97%. Board scores: QA SHIP (16.7ms, zero errors), Art B+ (from C+), all punch lists fixed same-session (street tint, contrast, notch-safe HUD, icon 106KB). Temple Run critique resolved while keeping deadline-death identity.

### 2026-06-11 03:53 UTC · code
DESIGN STEER (Zorba): waves feel too short/quick — wants Temple Run flow: long continuous runs that 'really keep going', deaths that take time and investment to arrive, not 10-second chunks. Reconvening full board for all-aspects assessment of the post-art build before tuning.

### 2026-06-11 03:39 UTC · code
FULL ART PASS COMPLETE: all 4 hand-painted hood backgrounds in-game with parallax, hand-drawn mamad door, power-up icon trio (crowned hummus!), runner v2 with duck-slide, title screen key art, new og.jpg (146KB WhatsApp-safe) + app icon. Regression green, zero errors. MAMAD DASH looks like a commercial game. Branch/PR #74 has everything; launch still gated on Porkbun DNS + merge.
<!-- HANDOFFS:END -->

## 🔄 Live State (auto)
_Refreshed automatically after each turn — do not edit by hand._

<!-- AUTOSTATE:START -->
- **When:** 2026-06-12 03:24 UTC
- **Branch:** `claude/cool-rubin-gb8jv6`
- **Last commit:** 345eef9 nucleus: universal design system + 3 agents in flight (SS sprint, SS playtest, MDG build) — 24 minutes ago

**Working tree:**
```
✓ clean — nothing uncommitted
```

**Recent commits:**
```
345eef9 nucleus: universal design system + 3 agents in flight (SS sprint, SS playtest, MDG build) (24 minutes ago)
95dcbc7 nucleus: miklat digger v1 greenlit (B+C fusion) (35 minutes ago)
3e6fb41 nucleus: balagan v2 steer, miklat digger capture, shuk shopper finished (7 hours ago)
98e859b nucleus: social layer architected + validated (7 hours ago)
e9f45ee Naval frameworks: captured + executed against the nucleus and 30-day audit (7 hours ago)
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
