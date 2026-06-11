# MIKLAT GAMES — Master Design Prompt
(Copy-paste into any Claude session — Cowork, code, or chat. A working v1 of
this design is already built in this folder; the prompt regenerates or evolves
it from scratch.)

---

Build a mobile-first arcade portal: MIKLAT GAMES (miklatgames.fun) — "the games
you play in the shelter." One single-file index.html (inline CSS/JS, no build
step, no backend), deployed on GitHub Pages, housing self-contained HTML5 games
that each live in their own folder (live now: /mamaddash/; next: /irondome/).

NORTH STAR: tap the link → playing a game in under 3 seconds. The homepage is a
game shelf, not a website. Every design decision defers to that.

BRAND: name MIKLAT GAMES. The joke is affectionate Tel Aviv resilience — a neon
arcade inside a bomb shelter. Premium-playful, never grim, never military.
Palette (lock to hex): deep navy #0b0e1a base, warm gold #ffd166 primary CTA,
mint teal #7ee8c7 accents, alert coral #ff5d5d sparingly (siren moments only),
cream #f4ecdd cards. Typography: heavy 900-weight display for titles, system
font stack. Bold-outline flat cartoon energy matching the games' art.

LAYOUT (mobile-first, one screen, portrait):
1. Header strip: MIKLAT GAMES logotype (gold gradient) + one-line tag "Games
   from the shelter. Free. No app. One thumb." + a small pulsing siren-lamp 🚨.
2. THE SHELF: one FEATURED game card (large, 16:9 key art, glowing PLAY ▶,
   live best-score read from that game's localStorage key, "Daily Siren" badge
   if the game has a daily mode) + a grid of smaller cards for other games.
   Unreleased games are steel shelter-door cards: diagonal teal-steel stripes,
   shield emblem, "DOOR OPENING SOON".
3. Footer: tiny — navigator.share button for the site, "Built in Tel Aviv
   between sirens", a deep link to today's daily run. Nothing else.

HOUSE SYSTEMS (the 10M-club requirements):
- PLAY = same-tab navigation to /gamename/. No iframes, no preloading.
- Per-game localStorage best-score convention (e.g. md_best) so the shelf
  remembers the player: "🏆 Your best: 7 sirens".
- Challenge-link forwarding: any ?beat=/?daily= params hitting the homepage
  redirect into the right game with params intact (the rematch loop must
  never dead-end on the shelf).
- PWA: manifest.webmanifest (MIKLAT GAMES, standalone, navy), apple-touch-icon,
  installable; og:image 1200x630 JPEG <300KB so links unfurl rich in WhatsApp
  (the #1 distribution channel).
- Analytics: GoatCounter, site code `miklatgames`, script on shelf + games.
- Performance budget: first paint <50KB inline; art lazy-loads; zero external
  requests beyond the games' own assets and the analytics script.

VOICE for all copy: warm, sarcastic, anti-hype. Card hook example (MAMAD
DASH): "Outrun the siren. Savta is watching." Never war language — the tone is
street-smart resilience comedy.

DEPLOY TARGET: GitHub repo zorbachin/miklatgames, Pages from main/root, CNAME
file containing miklatgames.fun, Porkbun DNS: A records on @ to
185.199.108.153 / .109.153 / .110.153 / .111.153, CNAME www →
zorbachin.github.io.

DELIVERABLES: index.html (complete, deployable), manifest.webmanifest,
og.jpg spec, CNAME, README with deploy runbook. Verify on a 390x844 viewport:
score memory, card navigation, challenge forwarding, og preview.
