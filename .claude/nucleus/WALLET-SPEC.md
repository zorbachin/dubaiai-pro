# MIKLAT WALLET — shared points contract (v1)
All games on miklatgames.fun share one localStorage key. Name-agnostic
(game may be Balagan or renamed — the key never changes).

KEY: `miklat.wallet`  (SHIPPED in Iron Dome v19 — this is canon)
SHAPE (v1, as shipped in Iron Dome v19):
{ "sh": 0 }                // spendable shekels — that's it for v1
FUTURE (v2, additive only — never break "sh"):
  "lifetime", "unlocks": {"game.mode":true}, "log"
RULES:
- Read: JSON.parse(localStorage.getItem('miklat_wallet')||'null') — always
  null-guard + try/catch; missing/corrupt = fresh wallet.
- Write: earn(src, amount) and spend(amount, unlockId) helpers; clamp
  balance >= 0; cap log at 20; bump lifetime only on earn.
- Hub game (Balagan/Mamadio rework) is the primary EARNER.
- Existing games are SPENDERS: gate new modes on unlocks["game.mode"].
  Games may also award small earn() bonuses (e.g. first win of the day).
- Never rename the key, never store PII, schema changes bump "v" with
  in-place migration.
UNLOCK IDs RESERVED SO FAR: (claim yours here)
- mamaddash.* — TBD by mamaddash session
- irondome.*  — TBD by irondome session
