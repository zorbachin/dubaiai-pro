# MAMAD DASH — Launch Promo Pack

> Everything below is copy-paste ready. Voice: warm, self-aware, anti-hype.
> The game link is `https://dubaiai.pro/mamaddash/` everywhere — see the
> launch checklist at the bottom for what must happen before it resolves.

---

## 🟢 WhatsApp (the primary channel — groups + status)

**Group drop (English):**

> I made a game. It's called MAMAD DASH 🚨
> You run through Tel Aviv, jump over savtas, duck under doves, and try to
> reach the mamad before the boom. Savta judges you when you fail.
> 30 seconds, one thumb, no app, no signup:
> https://dubaiai.pro/mamaddash/
> Reply with your sirens count. I'm at 7.

**Status / short version:**

> New game: outrun the siren, savta is watching 🤌
> https://dubaiai.pro/mamaddash/ — beat my 7.

**The rematch mechanic (tell people!):** when you die, hit
**📤 CHALLENGE A FRIEND** — it sends a score card image + a link that
shows *your* number on *their* screen. The game does the trash talk.

---

## 📸 Instagram

**Caption (feed post — use the og.png or a phone screen-recording):**

> I got laid off, moved countries, and somewhere in between I built a game
> about the most Tel Aviv feeling there is: hearing the siren and doing the
> math — can I make it to the mamad in time?
>
> So: MAMAD DASH. You run. You jump over savtas (they're fine, they're
> faster than you). You duck under doves. You stack shekels. And when you
> don't make it, a savta shakes her head at you. Fair.
>
> No app store. No download. The link runs on your phone in 3 seconds.
> Link in bio — reply with how many sirens you survived. 🚨🤌
>
> #telaviv #gamedev #buildinpublic #israel #mamad #indiegame

**Story sequence (3 frames):**
1. Screen-recording of a dash ending in the savta death cam. Text overlay:
   "I made this." Poll sticker: "Can you survive 5 sirens? YES / I'm a savta"
2. Screenshot of your best score card. "Beat this and I'll post your name."
3. Link sticker → the game. "One thumb. 30 seconds. Go."

---

## 🎵 TikTok / Reels (3 scripts — film in 9:16, raw phone capture is the look)

**Clip 1 — "POV: the most Israeli game ever made" (15s)**
- 0-2s: face cam: "I made the most Israeli game possible."
- 2-10s: screen capture: siren hits, frantic dash, JUMP over savta — freeze
  frame, red circle on the savta: "that's a real obstacle."
- 10-14s: the death cam: savta head-shake + "The hummus survived. You did not."
- 14-15s: "Link in bio. Beat my score."
- Sound: the game's own siren + boom (it slaps in raw capture).

**Clip 2 — "the death messages" (12s)**
- Montage of 4 deaths, each freeze-framed on a different roast line
  ("NU, BAALI…" / "Your savta made it. You didn't." / "Bituach Leumi
  cannot help you now.")
- Caption: "the game roasts you in Hebrew grandmother."

**Clip 3 — duet bait (10s)**
- Screen capture of a PERFECT RUN (confetti, Iron Dome intercept).
- Text: "nobody has beaten 10 sirens yet. Daily run resets at midnight —
  same gauntlet for everyone. ?daily=1"
- This is the one to re-post daily with the day's number.

---

## 🐦 X / Twitter

> I built an endless runner where the power-up is reaching your safe room
> on time and the final boss is a grandmother's disappointment.
>
> MAMAD DASH 🚨 — no app, no signup, one thumb:
> https://dubaiai.pro/mamaddash/
>
> Built the whole thing with AI in days, in public. Beat my 7 sirens.

---

## 💼 LinkedIn (build-in-public angle)

> Last week this was an idea. Today it's a playable game.
>
> MAMAD DASH — a mobile runner about the most Tel Aviv ritual there is:
> the siren sounds, and you run for the mamad.
>
> What shipped, all AI-built, all reviewed by AI agent panels (a QA team,
> a game-feel specialist, a growth lead — each one played it and filed
> reports):
> • Zero-friction: a URL that runs in 3 seconds, no install
> • A challenge loop: lose, and the game renders a score-card image
>   daring your friends to beat you
> • A daily seeded run — everyone faces the identical gauntlet
> • And yes: a grandmother who shakes her head when you fail
>
> The interesting part isn't the game. It's that one person + AI agents
> now ships what used to take a studio team a quarter.
>
> Play it (30 seconds, I'll wait): https://dubaiai.pro/mamaddash/

---

## 🖼️ Assets

| Asset | Where |
|---|---|
| OG / link-preview card (1200×630) | `mamaddash/og.png` (auto-unfurls on every shared link) |
| Challenge score card | generated in-game on every share (📤 button) |
| Gameplay screenshots | captured fresh in chat + `/tmp/qa-dash/*.png` in the build session |
| Better art (optional) | ChatGPT prompt kit already delivered — drop images in chat to upgrade runner/savta/backgrounds |

## ✅ Launch checklist (the morning list — in order)

1. **Porkbun DNS** (5 min, blocks everything): delete the `ALIAS`/`CNAME` →
   `pixie.porkbun.com` records; add A records on `@`: 185.199.108.153,
   185.199.109.153, 185.199.110.153, 185.199.111.153; CNAME `www` →
   `zorbachin.github.io`.
2. **Merge PR #74** → game goes live at dubaiai.pro/mamaddash/ on Pages.
3. Verify link unfurls with the og.png card in a WhatsApp chat with yourself.
4. Drop the WhatsApp group message. Then IG story. Then TikTok Clip 1.
5. Optional but recommended this week: buy `mamaddash.com` (trust +
   memorability in Israeli group chats), GoatCounter account → send me the
   code and I wire play-count analytics same day.

---

## 🎬 PROMO VIDEO — "Your excuse expired" (30s, sarcastic, high-energy)

**Assets:** two AI motion clips generated from the real game art (links in chat /
Higgsfield library), plus 2-3 phone screen-recordings of actual gameplay
(record: one near-miss door arrival, one savta death cam, one marathon banner).

**VO script (record yourself, or CapCut TTS "deep male, fast"):**

> Every country gets a superhero. Ours got a guy filming himself
> running from rockets.
>
> MAMAD DASH. Jump the savtas. Duck the doves. Reach the mamad
> before the boom.
>
> Yes — that's a real grandmother. No — she will not move.
> She's faster than you anyway.
>
> And when you fail — and you WILL fail — savta will be there.
> Judging.
>
> MAMAD DASH. Free. No app store. One thumb.
> Your excuse just expired. Link in bio.

**Cut sheet (30s, cut on the beat, music: high-BPM klezmer-trap or anything absurd):**

| Time | Visual | VO line |
|---|---|---|
| 0-4s | Clip 1 (night keyart motion): runner sprinting, siren pulsing | "Every country gets a superhero…" |
| 4-9s | Clip 2 (beach leap over savta) | "MAMAD DASH. Jump the savtas…" |
| 9-14s | Screen-rec: gameplay, jump + duck + coins | "Yes, that's a real grandmother…" |
| 14-20s | Screen-rec: death cam — savta 🤌 + roast caption (HOLD on the caption) | "And when you fail…" |
| 20-25s | Screen-rec: final-3s red alert sprint → door slam → confetti | (no VO — let the siren wail carry it) |
| 25-30s | og card / title art + URL text overlay | "Free. No app. One thumb. Your excuse just expired." |

Export 9:16 1080x1920 for TikTok/Reels/Shorts; the 16:9 clip doubles for X/YouTube.

### 🎞️ GENERATED TAKES v1 (2026-06-11) — pending Zorba QC
| Shot | URL |
|---|---|
| GEN-1 Alert (4s) | https://d8j0ntlcm91z4.cloudfront.net/user_3C0rlhNLQ6y6WKswf6tgXWP78Pv/hf_20260611_060752_da9514ab-8667-4399-9b4d-b43a4b31abdb.mp4 |
| GEN-2 Sprint (5s) | https://d8j0ntlcm91z4.cloudfront.net/user_3C0rlhNLQ6y6WKswf6tgXWP78Pv/hf_20260611_060807_8ba199b2-3057-48e3-a56c-29b329227f83.mp4 |
| GEN-3 Near-collision (4s) | https://d8j0ntlcm91z4.cloudfront.net/user_3C0rlhNLQ6y6WKswf6tgXWP78Pv/hf_20260611_060821_accbdf36-b454-4dd0-aa32-3d99db5d7edb.mp4 |
| GEN-4 Dash to door (5s) | https://d8j0ntlcm91z4.cloudfront.net/user_3C0rlhNLQ6y6WKswf6tgXWP78Pv/hf_20260611_060838_f28813c5-a79f-43e6-bd71-35b0c691f1d9.mp4 |
| GEN-5 Door closes (4s) | https://d8j0ntlcm91z4.cloudfront.net/user_3C0rlhNLQ6y6WKswf6tgXWP78Pv/hf_20260611_060850_34e1ba01-3816-42bb-a5d2-fc4e62215c27.mp4 |
| Bonus: beach hero 16:9 (10s) | https://d8j0ntlcm91z4.cloudfront.net/user_3C0rlhNLQ6y6WKswf6tgXWP78Pv/hf_20260611_051016_abc659e9-29ca-4d5f-9a9f-792cfb77dfdc.mp4 |
| Night keyart 9:16 (10s, earlier) | https://d8j0ntlcm91z4.cloudfront.net/user_3C0rlhNLQ6y6WKswf6tgXWP78Pv/hf_20260611_050950_a3bd2a87-f66a-492f-a7e8-b52d271b7fe0.mp4 |

QC bar (per the 10M-club plan): watch each at 1x AND 0.25x — any extra/backwards
limb, melting face, warping door edge, savta drift/duplication, or spontaneous
text = thumbs-down → regenerate (max 3, then static fallback). Discard the
clips' native audio in the edit; the game's siren is the score.
