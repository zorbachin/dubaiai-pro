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

### 2026-06-10 13:23 UTC · code
MAMAD DASH v2 look: bright Fortnite-esque palette (vivid day sky, Bauhaus cream skyline) + arcade juice (pop-text, coin glow/spin, landing squash, speed lines, countdown punch, confetti, PERFECT RUN bonus). Zorba steering: addictive + bright first, complexity later — master dash mode before adding anything. Full suite re-verified, pushed to PR #74.

### 2026-06-10 13:08 UTC · code
BUILT: MAMAD DASH standalone shippable mobile game at mamaddash/index.html (single-file, 453 lines). Tap=jump/swipe-down=duck, instant start, endless escalating siren waves, coins+streak bonuses, share button, localStorage best, all P0 mobile QA fixes baked in (on-canvas countdown, telegraph rings, error-contained loop). Verified headless on phone viewport: 3 waves cleared, death/share/restart/persist all pass, zero errors. On PR #74 (title/body updated to cover all 3 changes). Goes live at dubaiai.pro/mamaddash/ after merge + Porkbun DNS fix.

### 2026-06-10 12:54 UTC · code
Fixed the volleyball 'I'm timing it right and it misses' bug Zorba hit live: mini-game cursor was frame-based (2x speed on 120Hz phones, hit window < touch latency). Now time-based + 100ms input-latency grace. Pushed to PR #74. QA finding M2 closed.

### 2026-06-10 12:48 UTC · code
DIRECTION SHIFT (Zorba): MAMAD DASH should become a STANDALONE game — siren runner is the viral core; Tel Aviv exploration demoted to secondary/'a place to play'. Iron Dome + MAMAD DASH = the two viral candidates IF made perfect and dead-simple to play. SEPARATE parked idea: multiplayer Tel Aviv lifestyle game — chat, create worlds, interact ('trying to make it' sim). Echoes QA panel finding: dash is the tense set-piece, hustle layer runs dry. Meanwhile shipped PR #74: dash difficulty now ramps with countdown (calm start, frantic finish) + stumble death-spiral fix + freeze guard.

### 2026-06-10 12:28 UTC · code
DNS BROKEN: dubaiai.pro resolves to 44.227.76.166 / 44.227.65.245 (registrar parking IPs, likely GoDaddy) instead of GitHub Pages (185.199.108-111.153). Entire site down incl. /mamadio/ — Pages deploys are green, files on main; fix is at the DNS provider: apex A records to the four 185.199.x.153 IPs. Nucleus 'Live at dubaiai.pro' claim is currently false. github.io fallback also dead-ends (301s to the broken custom domain via CNAME).

### 2026-06-10 12:15 UTC · code
MAMADIO 4-agent QA panel complete (functionality/UX/fun-balance/design): unanimous SHIP WITH FIXES, zero JS errors, economy math verified exact. P0 fixes: mobile dash HUD hidden by alert banner; latent siren-null game-freeze; mini-games have no cancel. Big balance finds: Mendy 2.4x dominant, haggle deterministic, scooters dead content, quest income dries up with 80% of day left, runner stumble death-spiral. Top virality lever = end-screen share card. Full reports in /tmp/qa-func|qa-ux|qa-fun|qa-design.

### 2026-06-10 11:47 UTC · code
MAMADIO headless playtest passed: full flow (title→char→level→play→forced siren→MAMAD DASH runner with jump) renders and runs with zero console errors via Playwright/Chromium. Screenshots delivered to Zorba. Open loop 'browser playtest before merge' effectively closed pending Zorba's hands-on check at dubaiai.pro/mamadio/.
### 2026-06-11 03:22 UTC · code
Direction shift: game world goes FULL ART. Zorba wants in-game levels to look like the marketing (his screenshot showed the procedural flat-vector vs the rich pixel art). Image pack #3 emailed: 10 per-city level backgrounds (9:16, SKY RULE: upper 60% near-empty navy so rockets stay readable, bottom 20% clear for gameplay buildings, honeycomb dome baked in) + optional Red Alert bg. Integration plan on arrival: art = backdrop layer per level, restyle foreground tappable buildings pixel-chunky, ~150-200KB/img, SW-cached, game stays <2.5MB offline-capable. Pack #2 (icon/portrait/badge/victory) also still pending.

### 2026-06-11 03:14 UTC · code
v16 MERGED (PR #84): key art now IN the game, not just promo — retro art = menu background (SW-precached), honeycomb dome arc drawn into live gameplay sky over every city (render-verified). Clarified for Zorba: promo art vs game art were separate; now unified. Game visuals remain procedural (per-city scenes, rockets) with the art as menu+brand-dome layer.

### 2026-06-11 03:02 UTC · code
DURABLE BRAND RULE from Zorba: all Iron Dome promo assets bilingual BURNED IN — English leads (he expects more English-speaking players), Hebrew always prominent. All cards rebuilt: share-card.jpg (og image), story, square, press-hero titled variant. Merged next.

### 2026-06-11 02:58 UTC · code
Elite art pass MERGED (PR #82): retro pixel set composited into production — share-card.jpg 1200x630@170KB live as og:image (every WhatsApp link now shows the retro dome + Hebrew title card), story/square-falafel/press-hero rebuilt on the new art, originals archived in content-assets/irondome-promo/art/. DURABLE: retro pixel = the Iron Dome brand. Outstanding for launch: full-res app icon (Zorba re-downloads the minimal dome icon from ChatGPT), domain purchase, GoatCounter claim — then seeding per checklist.
### 2026-06-11 02:53 UTC · code
Art direction decided on ChatGPT image passes: RETRO pass -> share card (readable at thumbnail size, single clear story); FIRST pass panorama -> press hero (richness rewards full-size, tells the 10-cities story); icon/falafel-meme/story/daily-badge all approved as-is. BLOCKED on full-res originals from Zorba (uploads were ~300-600px chat-compressed; need ChatGPT downloads direct or via Drive). Then: typography overlay, icon regen 192/512, share-card + promo swap, WhatsApp-safe compression, one-pass re-ship.

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
<!-- HANDOFFS:END -->

## 🔄 Live State (auto)
_Refreshed automatically after each turn — do not edit by hand._

<!-- AUTOSTATE:START -->
- **When:** 2026-06-11 06:07 UTC
- **Branch:** `claude/iron-dome-game-zi3dtt`
- **Last commit:** e099799 Soundtrack rotation: three tracks score the whole game — 57 seconds ago

**Working tree:**
```
M .claude/nucleus/NUCLEUS.md
```

**Uncommitted changes:**
```
.claude/nucleus/NUCLEUS.md | 156 +++------------------------------------------
 1 file changed, 10 insertions(+), 146 deletions(-)
```

**Recent commits:**
```
e099799 Soundtrack rotation: three tracks score the whole game (57 seconds ago)
98952a5 Merge origin/main (keep v18) (2 minutes ago)
3ff608f v18: real soundtrack arrives — menu music + per-level track system (3 minutes ago)
4308681 MAMAD DASH soundtrack: three-track music system (#88) (6 minutes ago)
b775392 chore: refresh nucleus live state [skip ci] (15 minutes ago)
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
