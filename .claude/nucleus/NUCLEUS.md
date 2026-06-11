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

### 2026-06-11 03:03 UTC · code
ART LANDED: Zorba's ChatGPT character sheets (runner 5 poses w/ beard+phone+REC, savta 3 poses) sliced and integrated — real run cycle, jump/duck poses, tumble ragdoll, hand-drawn savta in death cam + as cart obstacle. Emoji fallback kept. Looks like a real game now. Also sent Art Direction Kit v2 email (Iron Dome standard, 11 prompts w/ hex palette + exact dims) — backgrounds/door/key art/icons still to come from Zorba's ChatGPT session.

### 2026-06-11 02:54 UTC · code
STANDING QUALITY BAR (Zorba): art-prompt kits must match the Iron Dome standard — rules header (NO TEXT anywhere, AI mangles Hebrew; typography composited by Claude afterward), palette locked with exact hex codes + a 'stay strictly on palette' correction line, exact pixel dimensions/aspect ratio per asset, composition notes (where to leave calm space for overlays), style anchors, small-size readability notes. MAMAD DASH palette: sky #37b6ff, cream #f4ecdd, gold #ffd166, teal #7ee8c7, coral #ff5d5d, navy #0b0e1a.

### 2026-06-10 19:45 UTC · code
QA SIGN-OFF complete → SHIP. All 5 punch-list items fixed incl. the daily-determinism blocker (independent seeded RNG streams per spawn system — interleave-proof; verified across skill levels). Perf: vsync-locked 60fps, p95 16.7ms. Soak: 9 waves + 10 restart cycles clean. MAMAD DASH is promo-ready; morning checklist in mamaddash/PROMO.md.

### 2026-06-10 19:19 UTC · code
Overnight progress: It2+It3 shipped (challenge card image share + ?beat= rematch loop, Today's Siren daily seed, revive-once, difficulty re-tighten, perf sprite caches), og.png + PROMO.md (all-channel launch copy + morning checklist) committed. Game made DOMAIN-PORTABLE per Zorba's zorbot.io directive — share links self-configure to any host. zorbot.io = Railway app (www CNAME 0uded1nb.up.railway.app), NOT GitHub Pages: deploying there needs the zorbot repo added to a session (add-repo tool unavailable tonight, GitHub MCP token also expired). Umbrella-site rec: itch.io page as instant no-DNS public home + CrazyGames/Poki submissions later. QA sign-off agent running.

### 2026-06-10 19:02 UTC · code
OVERNIGHT DIRECTIVE (Zorba): work through the night with advisor panels to get MAMAD DASH to optimum virality + rock-solid stability + social features; promo materials ready by morning. Executing: It2 Challenge Card share loop, It3 difficulty/revive, perf hardening, QA sign-off, promo pack (key art, channel copy, screenshots, launch checklist). Morning blockers for Zorba: Porkbun DNS records, merge PR #74, optional mamaddash.com domain + GoatCounter account.

### 2026-06-10 18:55 UTC · code
Iteration 1 (feel patch) SHIPPED to PR #74: touchstart jump (-100ms latency), landing buffer, fast-fall, hit-stop, camera dip+speed zoom, coin fly+combo pitch, star smash-through, celebration trio fixed (confetti above overlay, cleared on wave start, door flash wired), ghost invuln, ragdoll floor, audio bus+heartbeat pulse. All assertions green. Next per roadmap: It2 Challenge Card + og:image + analytics (awaiting GoatCounter/GA account from Zorba), It3 difficulty+revive+daily. Art prompts handed to Zorba for ChatGPT.

### 2026-06-10 18:28 UTC · code
10M panel complete (retention/growth/feel). Verdict: core is real (60s sessions, 92-100% wave-1 survival, deaths cluster at the door) but 3 gaps to viral: (1) FEEL — jump fires on touchend costing ~100ms (the 'browser game vs game' gap), no hit-stop, celebration confetti bugged behind overlay; (2) GROWTH — share is naked text, no og:image, no challenge loop; Challenge Card (canvas image + ?beat= URL) is THE build; (3) RETENTION — mid-skill players are immortal (no skill ceiling), coins have no sink. Roadmap: It1 feel patch -> It2 challenge card+og:image+analytics -> It3 difficulty+revive+daily seed. Death cam already shipped mid-panel. Awaiting Zorba: GoatCounter account, mamaddash.com domain decision, art-pass go.

### 2026-06-10 18:19 UTC · code
DECISION (Zorba): build the absurd death cam with savta shaking her head (growth panel's TikTok-punchline rec) — freeze-zoom on death, ragdoll runner, judging savta, rotating one-liner captions. Also: analytics not wired anywhere yet (marketing MCP has only Meta Ads connected, no GA) — recommending GoatCounter for play counts.

### 2026-06-10 15:46 UTC · code
STANDING RULE (Zorba): every time a game/site update is pushed, ALWAYS include the playable test link in the reply — no asking. Current MAMAD DASH test link: https://raw.githack.com/zorbachin/dubaiai-pro/claude/mamad-dash-location-0mmse2/mamaddash/index.html (until PR #74 merges + Porkbun DNS fixed, then dubaiai.pro/mamaddash/).

### 2026-06-10 15:20 UTC · code
MAMAD DASH polish pass shipped (Zorba feedback: 'addictive but waves feel same, no power-ups, siren too constant'): 4 cycling hood themes w/ distinct skies+obstacle sets+wave banner (beach/florentin/old north/night), 3 power-ups (star/magnet/+3s), siren wail now last-3s-only with chirp at wave start. All verified headless, zero errors, pushed to PR #74.

### 2026-06-10 15:01 UTC · code
VALIDATED: Zorba played MAMAD DASH on his real phone via the raw.githack branch link (repo is public, link works) and loves the bright look — sent a screenshot of wave 2, red countdown 3, confetti, 55 shekels mid-run: 'This is a great image.' Bright Fortnite-esque direction is confirmed working on real hardware.
<!-- HANDOFFS:END -->

## 🔄 Live State (auto)
_Refreshed automatically after each turn — do not edit by hand._

<!-- AUTOSTATE:START -->
- **When:** 2026-06-11 17:33 UTC
- **Branch:** `claude/cool-rubin-gb8jv6`
- **Last commit:** 3d6f138 MG org: dedicated commercialization CEO to 10K users + full-time PM per game running its 10M advisor panel — 13 minutes ago

**Working tree:**
```
✓ clean — nothing uncommitted
```

**Recent commits:**
```
3d6f138 MG org: dedicated commercialization CEO to 10K users + full-time PM per game running its 10M advisor panel (13 minutes ago)
fda68b3 nucleus: capture Shuk Shopper ship + monetization queue-jump note (65 minutes ago)
af4f340 os: register Miklat Games venture (Claude as COO/CMO) + promote standalone-game decision to nucleus (75 minutes ago)
934bdd4 nucleus: capture Miklat Games workspace handoff (4 hours ago)
195c4d4 Duck-only rate to 15%+ and red/green color language (#106) (4 hours ago)
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
