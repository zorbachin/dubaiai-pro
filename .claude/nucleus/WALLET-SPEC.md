# MIKLAT WALLET — shared points contract (v1)
All games on miklatgames.fun share one localStorage key. Name-agnostic
(game may be Balagan or renamed — the key never changes).

KEY: `miklat_wallet`
SHAPE:
{
  "v": 1,
  "balance": 0,            // spendable shekels
  "lifetime": 0,           // total ever earned (never decreases — use for tiers)
  "unlocks": {},           // e.g. {"mamaddash.nightrun":true,"irondome.redalert2":true}
  "log": []                // last 20 entries: {t:epoch_s, src:"balagan", d:+50}
}
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
