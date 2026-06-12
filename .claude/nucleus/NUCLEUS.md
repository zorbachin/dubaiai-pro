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
### 2026-06-11 20:35 UTC · code
DURABLE RULE per Zorba: ENGLISH-FIRST defaults across game + portal (v26 shipped overnight) — default lang en, og cards English-led w/ Hebrew second, portal auto-detect removed. Saved user preferences win. He's asleep; merged autonomously per standing auto-mode.

### 2026-06-11 09:53 UTC · code
🚀 THE FLIP IS DONE (PR #101 merged): miklatgames.fun is THE address. CNAME committed, every burned-in URL migrated (og cards, share/challenge links, footer, promo pack, sibling docs), v25/SW v25 cache-bust. Old github.io links 301-redirect — nothing breaks. WhatsApp cache virgin on new domain. DURABLE: all future materials use miklatgames.fun. Remaining Zorba gates: GoatCounter claims (irondome + miklatgames), shot-list approval, WhatsApp preview test, then SEEDING per the 7-day plan.

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
<!-- HANDOFFS:END -->

## 🔄 Live State (auto)
_Refreshed automatically after each turn — do not edit by hand._

<!-- AUTOSTATE:START -->
- **When:** 2026-06-12 05:42 UTC
- **Branch:** `claude/iron-dome-game-zi3dtt`
- **Last commit:** e29b570 chore: refresh nucleus live state [skip ci] — 9 hours ago

**Working tree:**
```
M .claude/nucleus/NUCLEUS.md
 M irondome/index.html
 M irondome/sw.js
```

**Uncommitted changes:**
```
.claude/nucleus/NUCLEUS.md | 14 +++++++-------
 irondome/index.html        |  5 ++++-
 irondome/sw.js             |  2 +-
 3 files changed, 12 insertions(+), 9 deletions(-)
```

**Recent commits:**
```
e29b570 chore: refresh nucleus live state [skip ci] (9 hours ago)
1e8117c chore: refresh nucleus live state [skip ci] (9 hours ago)
4c0dc24 Merge origin/main (keep v26, round 2) (9 hours ago)
a2e85ca Merge origin/main (keep v26) (9 hours ago)
59d455b v26: English-first defaults — game and portal open in English (9 hours ago)
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

- **When:** 2026-06-11 20:35 UTC
- **Last commit:** 59d455b v26: English-first defaults — game and portal open in English — 1 second ago
- **When:** 2026-06-11 13:06 UTC
- **When:** 2026-06-11 12:54 UTC
- **Branch:** `claude/mamad-dash-location-0mmse2`
- **Last commit:** 4fe7a40 chore: refresh nucleus live state [skip ci] — 27 seconds ago
- **When:** 2026-06-11 12:47 UTC
- **When:** 2026-06-11 10:25 UTC
- **Branch:** `claude/mamad-dash-location-0mmse2`
- **Last commit:** 10cc83c chore: refresh nucleus live state [skip ci] — 26 seconds ago
✓ clean — nothing uncommitted
59d455b v26: English-first defaults — game and portal open in English (1 second ago)
902605a chore: refresh nucleus live state [skip ci] (11 hours ago)
3025d0d chore: refresh nucleus live state [skip ci] (11 hours ago)
5d3b646 chore: refresh nucleus live state [skip ci] (11 hours ago)
00a670e Merge origin/main (keep flip) (11 hours ago)
10cc83c chore: refresh nucleus live state [skip ci] (26 seconds ago)
e7bc69c Merge remote-tracking branch 'origin/main' into claude/mamad-dash-location-0mmse2 (84 seconds ago)
8b863d0 Music in sequences of three + bulletproof inside-screen centering (2 minutes ago)
34cb57f chore: refresh nucleus live state [skip ci] (11 minutes ago)
4fe7a40 chore: refresh nucleus live state [skip ci] (12 minutes ago)
4fe7a40 chore: refresh nucleus live state [skip ci] (27 seconds ago)
64ea910 Merge remote-tracking branch 'origin/main' into claude/mamad-dash-location-0mmse2 (2 minutes ago)
e11203a chore: nucleus snapshot [skip ci] (2 minutes ago)
5f07704 Music consistency + the flock: duck-only obstacles (2 minutes ago)
78bb4bb Mamad Dash offline: service worker (shell+art precache, runtime music cache) — makes the zero-signal promise true (49 minutes ago)
f052218 chore: refresh nucleus live state [skip ci] (2 hours ago)
149f3b1 chore: refresh nucleus live state [skip ci] (2 hours ago)
2e63f22 Merge remote-tracking branch 'origin/main' into claude/mamad-dash-location-0mmse2 (2 hours ago)
83e4bef chore: nucleus snapshot [skip ci] (2 hours ago)
586ebad Fix inside-mamad bleed on iPhone: self-healing canvas dimensions (2 hours ago)
e975d26 chore: refresh nucleus live state [skip ci] (2 hours ago)
7b0551f chore: refresh nucleus live state [skip ci] (2 hours ago)
960f7c7 chore: refresh nucleus live state [skip ci] (2 hours ago)
1429637 chore: refresh nucleus live state [skip ci] (2 hours ago)
6a300aa chore: refresh nucleus live state [skip ci] (2 hours ago)
5d626e7 chore: refresh nucleus live state [skip ci] (7 minutes ago)
ecf55ba chore: refresh nucleus live state [skip ci] (8 minutes ago)
afe7895 chore: refresh nucleus live state [skip ci] (30 minutes ago)
92b3c54 chore: refresh nucleus live state [skip ci] (30 minutes ago)
0e7ddc5 Merge origin/main (ours: irondome) (32 minutes ago)
f9bfbe6 v24 (part 1): strict music cycle, towers removed (damage on the art), menu redesign (14 seconds ago)
5d49d1f chore: refresh nucleus live state [skip ci] (58 minutes ago)
6bafaff chore: refresh nucleus live state [skip ci] (58 minutes ago)
0a9e9fd chore: refresh nucleus live state [skip ci] (59 minutes ago)
25358b9 v23: real-falafel sprites (no red), foreground buildings recede behind the art (59 minutes ago)
df8624b chore: refresh nucleus live state [skip ci] (31 seconds ago)
f8880b1 chore: refresh nucleus live state [skip ci] (8 minutes ago)
5dbb0c8 chore: refresh nucleus live state [skip ci] (9 minutes ago)
6b684c2 chore: refresh nucleus live state [skip ci] (9 minutes ago)
947b465 Merge origin/main (ours: irondome, theirs: other teams) (10 minutes ago)
7ed59b5 bin/sync-miklat: one-command game->arcade package sync (1 second ago)
8d13acf chore: refresh nucleus live state [skip ci] (2 minutes ago)
9354dae chore: refresh nucleus live state [skip ci] (20 minutes ago)
db9a28e chore: refresh nucleus live state [skip ci] (20 minutes ago)
731b88c Merge remote-tracking branch 'origin/main' into claude/mamad-dash-location-0mmse2 (21 minutes ago)
20c55e4 chore: refresh nucleus live state [skip ci] (6 minutes ago)
65e6b87 chore: refresh nucleus live state [skip ci] (7 minutes ago)
b4cce8d fix: restore clean v20 game files (conflict markers from squash-artifact merge) (7 minutes ago)
e85b7f3 Merge origin/main (keep v20) (8 minutes ago)
f9a4a70 v20: the levels finally LOOK like the art — 10 city worlds from the retro panoramas (9 minutes ago)
d83a262 chore: refresh nucleus live state [skip ci] (22 seconds ago)
5d1b8e3 chore: refresh nucleus live state [skip ci] (52 seconds ago)
a6ff8a7 Merge origin/main (keep v19 + mamad dash team's wallet adoption) (2 minutes ago)
25f2dec Merge origin/main (keep v19) (2 minutes ago)
14aec7b v19: the Miklat Wallet — shared shekels across games + CONTINUE mechanic (3 minutes ago)
2ba33a1 chore: refresh nucleus live state [skip ci] (53 minutes ago)
794c937 chore: refresh nucleus live state [skip ci] (53 minutes ago)
907a315 Merge remote-tracking branch 'origin/main' into claude/mamad-dash-location-0mmse2 (53 minutes ago)
10b5ed3 chore: nucleus snapshot [skip ci] (53 minutes ago)
cb1e13f Art asset index: public URLs for all surfaces (Claude Design etc.) (54 minutes ago)
14aec7b v19: the Miklat Wallet — shared shekels across games + CONTINUE mechanic (1 second ago)
82901b6 chore: refresh nucleus live state [skip ci] (27 minutes ago)
8142229 chore: refresh nucleus live state [skip ci] (27 minutes ago)
2f8dc5f chore: refresh nucleus live state [skip ci] (54 minutes ago)
36db328 chore: refresh nucleus live state [skip ci] (73 minutes ago)
cb1e13f Art asset index: public URLs for all surfaces (Claude Design etc.) (1 second ago)
7cb666c chore: refresh nucleus live state [skip ci] (51 seconds ago)
db2a387 Promo: final edit kit URLs post-QC (71 seconds ago)
7c7a020 chore: refresh nucleus live state [skip ci] (5 minutes ago)
f951de1 chore: refresh nucleus live state [skip ci] (6 minutes ago)
1da9d33 Promo: generated takes v1 URLs + QC bar (27 seconds ago)
fa99097 chore: refresh nucleus live state [skip ci] (6 minutes ago)
caf9111 Promo production: pre-composited 9:16 generation frames (5 shots) (10 minutes ago)
01c19ab chore: refresh nucleus live state [skip ci] (13 minutes ago)
d916205 Merge remote-tracking branch 'origin/main' into claude/mamad-dash-location-0mmse2 (14 minutes ago)
11db039 chore: refresh nucleus live state [skip ci] (69 seconds ago)
e0f8626 chore: refresh nucleus live state [skip ci] (6 minutes ago)
e3fe306 chore: refresh nucleus live state [skip ci] (6 minutes ago)
e099799 Soundtrack rotation: three tracks score the whole game (7 minutes ago)
98952a5 Merge origin/main (keep v18) (8 minutes ago)
cb7432d chore: refresh nucleus live state [skip ci] (25 minutes ago)
1e4afc5 Merge origin/main (keep portal) (27 minutes ago)
46cf169 Miklat Games portal: miklatgames.fun front door for all the games (28 minutes ago)
8bd786f MAMAD DASH: full game + art + pacing v2 + promo pack + MIKLAT arcade package (#74) (30 minutes ago)
030e3da chore: refresh nucleus live state [skip ci] (32 minutes ago)
01c3dd9 chore: refresh nucleus live state [skip ci] (33 seconds ago)
8f2c61f chore: refresh nucleus live state [skip ci] (63 seconds ago)
662e4ba chore: refresh nucleus live state [skip ci] (5 minutes ago)
0265043 chore: refresh nucleus live state [skip ci] (5 minutes ago)
eed1714 Merge remote-tracking branch 'origin/main' into claude/mamad-dash-location-0mmse2 (6 minutes ago)
49df04d MIKLAT GAMES master design prompt (permanent copy) (61 seconds ago)
2d07e7b chore: refresh nucleus live state [skip ci] (24 minutes ago)
6a52339 chore: refresh nucleus live state [skip ci] (25 minutes ago)
04c0795 Merge remote-tracking branch 'origin/main' into claude/mamad-dash-location-0mmse2 (26 minutes ago)
5b73325 chore: nucleus snapshot before main merge [skip ci] (27 minutes ago)
8e330d0 chore: refresh nucleus live state [skip ci] (3 minutes ago)
24156f1 chore: refresh nucleus live state [skip ci] (4 minutes ago)
120167c chore: refresh nucleus live state [skip ci] (2 hours ago)
2e29103 chore: refresh nucleus live state [skip ci] (2 hours ago)
6e72135 chore: refresh nucleus live state [skip ci] (2 hours ago)
4faab3e chore: refresh nucleus live state [skip ci] (2 minutes ago)
649fe76 chore: refresh nucleus live state [skip ci] (2 minutes ago)
ed1e364 MIKLAT GAMES v1: complete deployable arcade package (3 minutes ago)
08b8d5c chore: refresh nucleus live state [skip ci] (8 minutes ago)
c1f650e chore: refresh nucleus live state [skip ci] (8 minutes ago)
6bc5d1e chore: refresh nucleus live state [skip ci] (14 minutes ago)
642e41e chore: refresh nucleus live state [skip ci] (14 minutes ago)
b7a0e4d chore: refresh nucleus live state [skip ci] (17 minutes ago)
346c95c chore: refresh nucleus live state [skip ci] (22 minutes ago)
8896876 chore: refresh nucleus live state [skip ci] (22 minutes ago)
e21363f chore: refresh nucleus live state [skip ci] (3 minutes ago)
e6f0078 Merge origin/main (post-#82 squash) into branch (3 minutes ago)
46b0aef Merge origin/main into claude/iron-dome-game-zi3dtt (keep bilingual assets) (4 minutes ago)
514bde1 Bilingual burn-in across all promo assets (5 minutes ago)
f2d8f25 chore: refresh nucleus live state [skip ci] (9 minutes ago)
514bde1 Bilingual burn-in across all promo assets (2 seconds ago)
f2d8f25 chore: refresh nucleus live state [skip ci] (3 minutes ago)
9b4c85e Merge remote-tracking branch 'origin/main' into claude/iron-dome-game-zi3dtt (4 minutes ago)
9209bd7 Elite art pass: retro pixel art across share card + all promo assets (5 minutes ago)
447ce5a chore: refresh nucleus live state [skip ci] (8 minutes ago)
6cda150 chore: refresh nucleus live state [skip ci] (13 seconds ago)
4fa7e02 chore: refresh nucleus live state [skip ci] (8 hours ago)
5c97328 chore: refresh nucleus live state [skip ci] (8 hours ago)
5e6703b Merge remote-tracking branch 'origin/main' into claude/iron-dome-game-zi3dtt (8 hours ago)
009da8e Iron Dome launch promo pack: copy + cards + screenshots (8 hours ago)
510087a chore: refresh nucleus live state [skip ci] (4 minutes ago)
fa3306c chore: refresh nucleus live state [skip ci] (5 minutes ago)
d5a1cd2 Merge remote-tracking branch 'origin/main' into claude/iron-dome-game-zi3dtt (6 minutes ago)
e0b3a2c chore: refresh nucleus live state [skip ci] (6 minutes ago)
5134eb5 v15: full panel batch — GO verdict fixes, Daily Alert, real difficulty, feel polish (7 minutes ago)
5134eb5 v15: full panel batch — GO verdict fixes, Daily Alert, real difficulty, feel polish (1 second ago)
2c72477 chore: refresh nucleus live state [skip ci] (14 minutes ago)
aff1a2e chore: refresh nucleus live state [skip ci] (20 minutes ago)
b2b5be8 chore: refresh nucleus live state [skip ci] (23 minutes ago)
3fc13b7 chore: refresh nucleus live state [skip ci] (23 minutes ago)
ed91283 v13: difficulty select, intra-level ramp, bonus rounds, active Iron Sling volley (1 second ago)
1807ced chore: refresh nucleus live state [skip ci] (4 minutes ago)
e965ff0 chore: refresh nucleus live state [skip ci] (4 minutes ago)
3b19110 Merge remote-tracking branch 'origin/main' into claude/iron-dome-game-zi3dtt (5 minutes ago)
79f7776 chore: refresh nucleus live state [skip ci] (5 minutes ago)
54dd188 v12: Israeli voice pack — sabra sarcasm woven through every touchpoint (1 second ago)
0011b2d chore: refresh nucleus live state [skip ci] (3 hours ago)
50c8bdc chore: refresh nucleus live state [skip ci] (3 hours ago)
a1ba153 Merge remote-tracking branch 'origin/main' into claude/iron-dome-game-zi3dtt (3 hours ago)
59ebd05 chore: refresh nucleus live state [skip ci] (3 hours ago)
ee632d0 v11: loseable difficulty, <4s first kill, juice, heat, factions, sharing, iPhone fixes (12 seconds ago)
ac68fa5 chore: refresh nucleus live state [skip ci] (17 minutes ago)
02ac41d chore: refresh nucleus live state [skip ci] (17 minutes ago)
71757be Merge remote-tracking branch 'origin/main' into claude/iron-dome-game-zi3dtt (20 minutes ago)
7b72772 Mobile hardening: visual-viewport canvas, hard playfield clamp, music, version badge (21 minutes ago)
89bfac1 chore: refresh nucleus live state [skip ci] (73 minutes ago)
3c7c3f7 chore: refresh nucleus live state [skip ci] (74 minutes ago)
a38b345 Merge remote-tracking branch 'origin/main' into claude/iron-dome-game-zi3dtt (75 minutes ago)
13d5682 chore: refresh nucleus live state [skip ci] (75 minutes ago)
817e434 Core feel pivot: direct-hit tapping, no auto-aim, hypnotic rhythm (76 minutes ago)
817e434 Core feel pivot: direct-hit tapping, no auto-aim, hypnotic rhythm (1 second ago)
1b9fd79 chore: refresh nucleus live state [skip ci] (23 minutes ago)
7440fdd chore: refresh nucleus live state [skip ci] (23 minutes ago)
7d7eac0 chore: refresh nucleus live state [skip ci] (25 minutes ago)
1e4e045 chore: refresh nucleus live state [skip ci] (25 minutes ago)
d41df29 chore: refresh nucleus live state [skip ci] (7 minutes ago)
b4bdca7 chore: refresh nucleus live state [skip ci] (32 minutes ago)
5c4b64b chore: refresh nucleus live state [skip ci] (36 minutes ago)
76817f9 chore: refresh nucleus live state [skip ci] (37 minutes ago)
8a3a869 QA panel fixes: fail state, Red Alert endless mode, save hardening, UX + visual polish (37 minutes ago)
e7a755e Self-improving calibration + scale-proof touch mapping (1 second ago)
a7b9cf5 chore: refresh nucleus live state [skip ci] (11 minutes ago)
7cce0e9 chore: refresh nucleus live state [skip ci] (11 minutes ago)
93fe228 Add touch calibration mode, enforce 15% margins, fix input drops (12 minutes ago)
956e4f5 chore: refresh nucleus live state [skip ci] (66 minutes ago)
