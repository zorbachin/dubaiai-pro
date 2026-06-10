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
