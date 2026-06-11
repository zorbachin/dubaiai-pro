# MIKLAT GAMES — deploy runbook

This folder is the complete, ready-to-ship repo for **miklatgames.fun**.

## 1. Create the repo (60 seconds)
github.com → New repository → name: `miklatgames` → Public → no README.

## 2. Push this folder as the repo
From a machine with this folder (or add the new repo to a Claude session and
say "deploy the miklat package"):

    cd miklat
    git init -b main && git add -A && git commit -m "MIKLAT GAMES v1"
    git remote add origin https://github.com/zorbachin/miklatgames.git
    git push -u origin main

## 3. GitHub Pages
Repo → Settings → Pages → Source: Deploy from branch → main / root.
Custom domain: `miklatgames.fun` (the CNAME file is already here).
Tick "Enforce HTTPS" once the cert is issued.

## 4. Porkbun DNS for miklatgames.fun
Delete the default ALIAS/CNAME → pixie.porkbun.com records, then add:

    A      @    185.199.108.153
    A      @    185.199.109.153
    A      @    185.199.110.153
    A      @    185.199.111.153
    CNAME  www  zorbachin.github.io

## 5. GoatCounter analytics (pre-wired)
Sign up at goatcounter.com and register the site code **miklatgames**
(exactly that — the script tags already point at
miklatgames.goatcounter.com). Dashboard shows arcade + game pageviews
immediately; per-game event wiring lands in the next iteration.

## What's inside
- `index.html` — the arcade shelf (featured MAMAD DASH, two coming-soon doors,
  best-score memory, challenge-link forwarding, share button)
- `mamaddash/` — the full game, canonical URLs already flipped to
  miklatgames.fun
- `CNAME`, `manifest.webmanifest`, `og.jpg`

## Still pending
- Iron Dome port — needs its source repo added to a Claude session
- Arcade-specific og.jpg (currently reuses the MAMAD DASH card)
- Per-game GoatCounter events (plays/deaths/shares)
