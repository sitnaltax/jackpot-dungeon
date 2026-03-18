# Daily Seeded Challenge — Spec

A "daily challenge" mode where every player faces the same sequence of encounters, shop offerings, and token distributions on a given UTC day.

---

## Core Design Principle

A naive "replace `Math.random()` with a seeded PRNG" approach breaks down because any player action that consumes a random number (shop refresh, redraw) shifts all subsequent outputs. Instead, we **pre-generate the entire world as a script** at run start using a seeded PRNG, then consume script entries as the game progresses. Token draws from the bag are still PRNG-seeded but will desync between players based on their choices — that's acceptable and expected.

---

## Overview

Each calendar day (UTC), a deterministic seed is derived from the date. When a player starts a Daily Challenge, that seed drives a one-time generation of the full `DailyScript` object, which is persisted alongside normal game state. As the game proceeds, world events are consumed from the script rather than generated on-the-fly.

---

## The DailyScript Object

Generated once at run start and stored as a plain JSON-serializable object.

```js
{
  dailyClass: 'bricoleur',           // fixed class for today (PRNG-picked)
  ordealVariant: 'trueSelfMirror',   // which Final Ordeal (PRNG-picked)

  // One entry per depth (0-indexed, generate ~25 deep to cover any full run)
  encounters: [
    {
      basic:    { /* encounter object */ },  // always present
      hard:     { /* encounter object */ },  // only used on CHOICE phases (odd depth ≥ 3)
      podReward: [ /* token objects */ ],    // the hard-path pod reward (same depths)
    },
    ...
  ],

  // One entry per depth. Each entry = 16 sets of pods (initial display + 15 refreshes).
  // Refresh #15 is the last allowed; Refresh button is disabled after that.
  podShops: [
    [ [pod, pod, pod], [pod, pod, pod], ... ],  // 16 × shopSize pods
    ...
  ],

  // One entry per item shop occurrence (generate ~10, matching max item shop count in a run).
  // Each entry is a long ordered list of items, pre-selected by weight.
  // At display time, filter by player eligibility, take shopSize, then apply guarantee overrides.
  // Also includes pre-selected guarantee items so overrides are also deterministic.
  itemShops: [
    {
      sequence: [ item, item, item, ... ],   // ~120 items (enough for 15 refreshes with filtering headroom)
      guaranteeFood:        [ item, ... ],   // ordered candidate list (food), try in order by affordability
      guaranteeLight:       [ item, ... ],   // ordered candidate list (light sources)
      guaranteeDraw2:       [ item, ... ],   // ordered candidate list (+2 draw items)
      guaranteeDraw3:       [ item, ... ],   // ordered candidate list (+3 draw items)
    },
    ...
  ],
}
```

---

## Implementation Plan

### 1. PRNG (`src/lib/rng.js`)

Implement **Mulberry32** for script generation only (not threaded into live game calls):

```js
export function mulberry32(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
```

Also export `getDailySeed` and `todayUTC`:

```js
export function getDailySeed(dateStr) {
  // dateStr: "YYYY-MM-DD" UTC
  let h = 0x811c9dc5;
  for (const c of dateStr) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

export function todayUTC() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;
}
```

### 2. Script Generation (`src/lib/dailyScript.js`, new file)

`generateDailyScript(seed)` uses `mulberry32(seed)` to produce the full `DailyScript`. It calls existing generation functions (with the PRNG substituted in) rather than reimplementing them. This is the only place the PRNG is used.

**Class selection**: Weighted pick from the non-Observer classes (Observer/wizard is excluded per policy).

**Encounters**: For each depth 1–25, call `generateEncounter(depth)` variants for basic and hard paths.

**Pod shops**: For each depth, call `generateShopPods(depth, count)` 16 times to produce all refresh sets. Caps at 15 refreshes.

**Item shops**: For each item shop slot, generate a 120-item master sequence using weighted random picks from the full item catalog (excluding Observer-only items). Pre-pick guarantee items of each required category from the catalog using the same PRNG.

The key constraint: all calls go through the local Mulberry32 instance, not the game's live `Math.random()`. Existing generation functions must accept an optional `rng` parameter so they can be called with either the seeded PRNG or `Math.random`.

### 3. Adapting Generation Functions

Each random-using generation function gains an optional `rng = Math.random` parameter:

- `generateEncounter(encounterNumber, rng)` in `encounters.js`
- `generateShopPods(encounterNumber, count, rng)` in `pods.js`
- `generateItemShop(encounterNumber, playerState, rng)` in `items.js` — or split into a "pick item sequence" step and a "apply guarantees" step (see below)

Normal game play passes nothing (uses `Math.random`). Script generation passes the seeded PRNG.

### 4. Item Shop Display Logic

Because guarantee rules (force-show food when low HP, light source at depth 6+, etc.) depend on player state at display time, item shop display is split into two phases:

**At script generation time** (state-independent):
- Pre-generate the master item sequence (weighted random picks)
- Pre-pick an **ordered list** of guarantee candidates for each type (food, light, +2 draw, +3 draw) — enough candidates that at least one is likely affordable (e.g. all items of that category, shuffled by the PRNG).

**At display time** (state-dependent, unchanged from normal play):
1. Take the next N eligible items from the sequence (skip items the player has already purchased)
2. Determine which guarantees apply based on current player state and depth
3. For each applicable guarantee, walk the pre-picked candidate list and use the **first item the player can currently afford**; if none are affordable, skip the guarantee entirely

This preserves the guarantee behavior while keeping shop contents deterministic, and ensures the player is never shown a guaranteed item they can't buy.

### 5. Shop Refresh Cap

Cap pod shop and item shop refreshes at 15 per encounter. The `DailyScript` pre-generates exactly 16 sets (initial + 15 refreshes), and the Refresh button is disabled once the cap is reached. This cap applies only in daily challenge mode.

### 6. New Stores (`src/lib/gameState.js`)

```js
export const isDailyRun       = writable(false);
export const dailyDate        = writable(null);    // "YYYY-MM-DD"
export const dailyScript      = writable(null);    // DailyScript object
export const dailyAttempted   = writable(false);   // tracked in prefs, not save
export const podShopRefreshCount = writable(0);    // resets each SHOP phase
export const itemShopIndex    = writable(0);       // which item shop slot we're on
```

`podShopRefreshCount` replaces (or supplements) the existing refresh tracking, reset to 0 when entering SHOP phase.

### 7. `startDailyChallenge(difficulty)` Function

```js
export function startDailyChallenge(difficulty) {
  const date = todayUTC();
  const seed = getDailySeed(date);
  const script = generateDailyScript(seed);
  clearSave();
  isDailyRun.set(true);
  dailyDate.set(date);
  dailyScript.set(script);
  podShopRefreshCount.set(0);
  itemShopIndex.set(0);
  // Mark attempted in prefs (survives clearSave)
  savePrefs({ ...loadPrefs(), dailyAttempted: true, dailyAttemptedDate: date });
  selectClass(script.dailyClass, difficulty);
}
```

### 8. Consuming the Script

| Game event | Script field consumed |
|---|---|
| Enter ENCOUNTER phase | `script.encounters[depth].basic` (or `.hard` on hard path) |
| Enter CHOICE phase | Both `.basic` and `.hard` for that depth; `.podReward` for the hard-path reward |
| Enter SHOP phase | `script.podShops[depth][refreshCount]`; reset `podShopRefreshCount` to 0 |
| Refresh pod shop | Increment `podShopRefreshCount`; use `script.podShops[depth][refreshCount]` |
| Enter ITEM_SHOP phase | `script.itemShops[itemShopIndex]`; increment `itemShopIndex` |
| Refresh item shop | Consume further into `script.itemShops[itemShopIndex].sequence` |
| Enter ordeal | Use `script.ordealVariant` |

The consuming components/functions check `$isDailyRun`; if true, pull from the script instead of calling the generator.

### 9. Persistence (`src/lib/persistence.js`)

`dailyScript` is a plain object and serializes cleanly. Add to `saveGame`:

```js
isDailyRun:           get(isDailyRun),
dailyDate:            get(dailyDate),
dailyScript:          get(dailyScript),
podShopRefreshCount:  get(podShopRefreshCount),
itemShopIndex:        get(itemShopIndex),
```

Add corresponding restoration to `loadSavedGame` with safe defaults.

No call-count tracking or fast-forward is needed — the script is fully self-contained.

Bump **`SAVE_VERSION` to 16**.

`dailyAttempted` and `dailyAttemptedDate` live in **prefs** (separate localStorage key), so they survive `clearSave()`.

### 10. UI Changes

**StartScreen**: "Daily Challenge" button alongside "New Game". If `dailyAttempted` and today's date matches `dailyAttemptedDate`, show a subtle indicator (e.g. "✓ Played today"). The button is not disabled — re-attempts are allowed.

**ClassSelect**: In daily mode, the class panel shows only the daily class (pre-selected), grayed out and non-interactive. The player still picks difficulty (Observer excluded).

**GameOver**: When `$isDailyRun`:
- Show the date: "Daily Challenge — 2026-03-18"
- Share synopsis: `I [conquered/fell at] Jacq's Daily Challenge (2026-03-18) as a Bricoleur on Normal difficulty, at Depth 7. [re-attempt] https://rule0.com/jacq/`
- `[re-attempt]` appended only if the player has attempted the same date before this run.

### 11. Implementation Sequence

1. Write `src/lib/rng.js` (Mulberry32, `getDailySeed`, `todayUTC`)
2. Add optional `rng` parameter to `generateEncounter`, `generateShopPods`, and item selection in `generateItemShop`
3. Write `src/lib/dailyScript.js` — `generateDailyScript(seed)` producing the full script
4. Add `isDailyRun`, `dailyDate`, `dailyScript`, `podShopRefreshCount`, `itemShopIndex` stores
5. Add `startDailyChallenge(difficulty)` to `gameState.js`
6. Wire encounter/shop consumption: check `$isDailyRun` and pull from script where applicable
7. Add 15-refresh cap in daily mode (pod shop + item shop)
8. Update persistence (save/load all new stores) and bump SAVE_VERSION
9. UI: StartScreen button, ClassSelect locked class display, GameOver daily header + share text
10. Smoke-test: open two browser tabs, start daily challenge, verify identical encounters and shops
11. Smoke-test: refresh a shop 15 times, verify button disables at cap
12. Smoke-test: save mid-run, reload, verify script resumes from correct position

---

## Open Questions

1. **Class and difficulty locking** — Should daily challenge fix the class, the difficulty, or both?

   Answer: Class should be fixed, difficulty should not.

2. **Re-attempt policy** — Can players restart and retry?

   Answer: Yes. We track `dailyAttempted` in prefs and append "(re-attempt)" to the share text, but make no attempt to enforce a single-attempt rule.

3. **Observer (wizard) difficulty** — Should it be excluded?

   Answer: Yes, Observer is disabled in daily challenge mode.

4. **Timezone / date boundary** — UTC date used as seed; players near midnight may see "tomorrow's" challenge early.

   Answer: Acceptable.

5. **Leaderboard / sharing** — Server-side leaderboard in scope?

   Answer: No, out of scope.

6. **Historical daily seeds** — Let players replay a previous date?

   Answer: Not initially; interface complexity not worth it.

7. **Seeding the ordeal** — Same ordeal variant for all daily players?

   Answer: Yes, pre-selected by the daily seed.

---

## Out of Scope (for now)

- Server-side score tracking
- Anti-cheat / replay validation
- Forcing specific events or encounters for "curated" dailies
- Historical seed replay
