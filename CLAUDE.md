# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with hot reload (--host enabled)
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

## Architecture

Jacq's Quest is a Svelte 4 roguelike deck-builder where players draw tokens from pods to overcome fey encounters. The atmosphere should be eerie and lonely with actual combat not happening.

### Core Game Loop

1. **CLASS_SELECT phase** - Player picks a class and difficulty
2. **CHOICE phase** - On odd encounters (≥3), player picks hard path (pod reward) or basic path (easier encounter)
3. **DRAW phase** - Player draws tokens from shuffled pool, can redraw
4. **ENCOUNTER phase** - Tokens resolve against encounter (insight vs mystery, resolve vs trouble)
5. **SHOP phase** - Spend XP to replace pods with better ones
6. **Final Ordeal** - At depth 19, a randomly chosen ordeal begins. Repeating DRAW/ENCOUNTER rounds with escalating trouble and a shared mystery pool. Between rounds: ORDEAL_INTERLUDE to spend XP. Victory when the mystery pool reaches 0.

### State Management (`src/lib/gameState.js`)

All game state uses Svelte writable stores. Key stores:
- `gamePhase` - Current phase (START, CLASS_SELECT, CHOICE, DRAW, ENCOUNTER, POD_REWARD, ITEM_SHOP, SHOP, ORDEAL_INTERLUDE, GAME_OVER)
- `player` - Contains pods array, playerClass, stamina, maxStamina, treasure, xp, equipment
- `drawnTokens` - Currently drawn tokens for the encounter
- `currentEncounter` - Active encounter with mystery/trouble values
- `ordealActive` - Whether the Final Ordeal is in progress
- `ordealMysteryPool` - Remaining mystery in the ordeal
- `ordealRound` - Current ordeal round number
- `ordealId` - Which ordeal variant was randomly chosen

Key functions:
- `selectClass(classId)` - Initializes game with chosen class, starting items, and bonuses
- `getTotalBonuses(playerState)` - Combines equipment + class bonuses
- `getEquipmentBonuses(equipment)` - Equipment bonuses only
- `getEffectiveMaxStamina(playerState)` - Base max + total bonuses
- `beginOrdealRound()` - Advances to the next ordeal round

### Class System (`src/lib/classes.js`)

Four classes: Bricoleur, Polymath, Agonist, Maverick. Each defines:
- `bonuses` - Passive stat bonuses (redraws, selectiveRedraws, maxStamina, staminaRegen, etc.)
- `startingEquipment` - Array of 3 slots (items or null), mundane items defined in `STARTING_ITEMS`
- `startingTreasureBonus` / `startingXpBonus` - Extra starting resources
- `shopItemFilter` - Optional callback to exclude items from shops (e.g., Maverick excludes selectiveRedraws items)
- `onInsightFailure(result)` - Optional callback returning `{ treasure?, xp? }` on insight failure
- `encounterXpMultiplier` - Stacked with encounter xpMultiplier (Polymath)
- `startingStaminaOffset` - Applied after effMax calculated (Polymath: -10)
- `refreshCostFn(n)` - Cost of the nth pod shop refresh

### Token System (`src/lib/tokens.js`, `src/lib/pods.js`)

Token types defined in `TOKEN_TYPES` in `tokens.js`. Tokens have a **type** and **rank** (iron through mythical). Value = baseValue × rankMultiplier.

Token series with synergies via `getValue(token, allDrawnTokens, equippedItems)`:
- **Musical** (harmony, melody, chord, discord) - Bonus when drawn with other unique Musical tokens, or when Musical-tagged items are equipped
- **Celestial** (scorpio, capricorn, taurus, virgo, aries, libra, pluto) - Scale with Celestial count
- **Botanical** (oak, lotus, clover, willow, orchid, fern, hemlock) - Scale with Botanical count
- **Chthonic** (obsidian, granite, geode) - Scale with Chthonic count, have `onDiscard` effects
- **Wild** - Flat 4 × rank multiplier to all three resources (insight, resolve, xp). Tagged as Musical, Celestial, Botanical, and Chthonic.

`getTokenImage(typeData)` returns a card art URL for a token type. Checks `typeData.image` first, then picks by first matching tag (Musical, Celestial, Botanical, Chthonic), then returns a default. To override a specific token, set `image` on its entry in `TOKEN_TYPES`.

Pods contain 3 tokens. Starting pods mostly use iron/ordinary ranks, with a couple of bronze tokens mixed in. Shop pods scale with encounter tier.

### Equipment System (`src/lib/items.js`)

3 equipment slots. Seven item categories: Book (selectiveRedraws), Navigation (redraws), Light Source (bonusDraw), Weapon (resolve), Jewelry (insight), Food (stamina), Instrument (Musical tag). Items purchased with **Treasure** in the item shop.

- Light sources: only one equipped at a time, auto-replace
- Food: heals on purchase (`staminaHeal`), provides persistent maxStamina/staminaRegen while equipped. When an item has both `maxStamina` and `staminaHeal`, the UI displays them as a single "+N Stamina" bonus.
- Instruments: provide Musical tag for synergy with Musical tokens; no inherent stat bonuses
- `generateItemShop(encounterNumber, playerState)` - Generates 3 items with guarantee rules (food when low HP, light source upgrade at depth 6+). Respects class `shopItemFilter`.

### Encounter Resolution (`src/lib/encounter.js`)

`resolveEncounter(drawnTokens, encounter, bonuses, drawEffects)` calculates totals and returns result:
- Insight ≥ mystery → reveal bonus XP (half of mystery value)
- Resolve < trouble → stamina loss (flat + scaled by deficiency)
- `bonuses` includes equipment + class insight/resolve
- `discardEffects` includes accumulated onDiscard token effects
- `calculateStaminaLost(deficiency, encounter)` is exported separately for live UI prediction

### Encounter Scaling (`src/lib/encounters.js`)

`generateEncounter(encounterNumber)` creates encounters from a weighted pool with mystery/trouble values that scale linearly. Encounters have modifiers (mysteryMod, troubleMod, redrawBonus, selectiveRedrawBonus, treasureMultiplier, xpMultiplier).

`FINAL_ORDEALS` array defines ordeal variants, each with:
- `id`, `name`, `flavorText`
- `mysteryBase` - Base mystery pool before difficulty scale (`CONFIG.ordealMysteryScale` still applies)
- `troubleMod` - Flat modifier added to `calculateBaseStat(ordealStartDepth, difficulty)`
- `troublePerRound` - Flat trouble increase per subsequent round

### Shop Generation (`src/lib/pods.js`)

`generateShopPods(encounterNumber, count)` creates pods with ranks based on tier config. Higher encounters = higher guaranteed minimum ranks. Token types filtered by `minDepth` and weighted by `weight`.

Bonus draws expand the pod pool: each bonus draw adds `CONFIG.podsPerBonusDraw` (default 2) weak pods.

### Persistence (`src/lib/persistence.js`)

Game state is saved to `localStorage` automatically so mobile browsers don't lose progress when a tab is evicted from memory.

- `initAutoSave(stores)` — subscribes to all meaningful stores and debounces saves (500ms). Called once in `App.svelte` `onMount`.
- `loadSavedGame(stores)` — reads and restores state on page load. Called before `initAutoSave`.
- `clearSave()` — wipes the save. Called at the start of `selectClass` so each new run starts clean.
- `SAVE_VERSION` constant — bump this whenever the saved data shape changes incompatibly. Mismatched saves are discarded and the player starts fresh. Currently **15**.

**When adding new persistent state:**
1. Add the store to the `saveGame` serialization block in `persistence.js`
2. Add it to the `loadSavedGame` restoration block (with a safe default for old saves)
3. Add it to the `initAutoSave` subscriptions array
4. Bump `SAVE_VERSION`

**Serialization caveats:**
- `player.playerClass` contains functions and cannot be JSON-serialized. It is stored as `playerClassId` and restored via `CLASSES[playerClassId]`.
- `Set` values (`purchasedShopPods`, `purchasedShopItems`) are serialized as arrays and reconstructed as Sets on load.
- Phases `start` and `classSelect` are not saved — nothing worth restoring there.

## Configuration

`CONFIG` object in `src/lib/constants.js` contains all balance values:
- Pod/token counts, draw count
- Starting stamina/treasure
- Encounter penalty formulas
- Redraw limits, shop size
- `podsPerBonusDraw` - Extra pods added per bonus draw gained
- `ordealStartDepth` - Encounter number at which the Final Ordeal begins (19)
- `ordealMysteryScale` - Per-difficulty multiplier on each ordeal's `mysteryBase`
- `ordealTroublePerRound` - Superseded by per-ordeal `troublePerRound` in `FINAL_ORDEALS`
