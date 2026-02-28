# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with hot reload (--host enabled)
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

## Architecture

Jackpot Dungeon is a Svelte 4 roguelike deck-builder where players draw tokens from pods to overcome fey encounters.

### Core Game Loop

1. **CLASS_SELECT phase** - Player picks a class and difficulty
2. **CHOICE phase** - On even encounters (≥2), player picks hard path (pod reward) or basic path (item shop)
3. **DRAW phase** - Player draws tokens from shuffled pool, can redraw
4. **ENCOUNTER phase** - Tokens resolve against encounter (insight vs mystery, resolve vs trouble)
5. **SHOP phase** - Spend treasure to replace pods with better ones

### State Management (`src/lib/gameState.js`)

All game state uses Svelte writable stores. Key stores:
- `gamePhase` - Current phase (START, CLASS_SELECT, CHOICE, DRAW, ENCOUNTER, POD_REWARD, ITEM_SHOP, SHOP, GAME_OVER)
- `player` - Contains pods array, playerClass, stamina, maxStamina, treasure, xp, equipment
- `drawnTokens` - Currently drawn tokens for the encounter
- `currentEncounter` - Active encounter with mystery/trouble values

Key functions:
- `selectClass(classId)` - Initializes game with chosen class, starting items, and bonuses
- `getTotalBonuses(playerState)` - Combines equipment + class bonuses
- `getEquipmentBonuses(equipment)` - Equipment bonuses only
- `getEffectiveMaxStamina(playerState)` - Base max + total bonuses

### Class System (`src/lib/classes.js`)

Four classes: Bricoleur, Polymath, Agonist, Maverick. Each defines:
- `bonuses` - Passive stat bonuses (redraws, selectiveRedraws, maxStamina, staminaRegen, etc.)
- `startingEquipment` - Array of 3 slots (items or null), mundane items defined in `STARTING_ITEMS`
- `startingTreasureBonus` / `startingXpBonus` - Extra starting resources
- `shopItemFilter` - Optional callback to exclude items from shops (e.g., Maverick excludes selectiveRedraws items)

### Token System (`src/lib/tokens.js`, `src/lib/pods.js`)

Token types defined in `TOKEN_TYPES` in `tokens.js`. Tokens have a **type** and **rank** (iron through diamond). Value = baseValue × rankMultiplier.

Token series with synergies via `getValue(token, allDrawnTokens)`:
- **Musical** (harmony, melody, chord, discord) - Bonus when drawn with other unique Musical tokens
- **Celestial** (scorpio, capricorn, taurus, virgo, aries, libra, pluto) - Scale with Celestial count
- **Botanical** (oak, lotus, clover, willow, orchid, fern, hemlock) - Scale with Botanical count
- **Chthonic** (obsidian, granite, geode) - Scale with Chthonic count, have `onDiscard` effects

Pods contain 3 tokens. Starting pods mostly use iron/ordinary ranks, with a couple of bronze tokens mixed in. Shop pods scale with encounter tier.

### Equipment System (`src/lib/items.js`)

3 equipment slots. Six item categories: Book (selectiveRedraws), Navigation (redraws), Light Source (bonusDraw), Weapon (resolve), Jewelry (insight), Food (stamina). Items purchased with XP in the item shop.

- Light sources: only one equipped at a time, auto-replace
- Food: heals on purchase, provides persistent maxStamina/staminaRegen while equipped
- `generateItemShop(encounterNumber, playerState)` - Generates 3 items with guarantee rules (food when low HP, light source at depth 8+, +2 draw at depth 14+). Respects class `shopItemFilter`.

### Encounter Resolution (`src/lib/encounter.js`)

`resolveEncounter(drawnTokens, encounter, bonuses, drawEffects)` calculates totals and returns result:
- Insight ≥ mystery → reveal bonus treasure (half of mystery value)
- Resolve < trouble → stamina loss (flat + scaled by deficiency)
- `bonuses` includes equipment + class insight/resolve
- `drawEffects` includes accumulated onDiscard token effects

### Encounter Scaling (`src/lib/encounters.js`)

`generateEncounter(encounterNumber)` creates encounters from a weighted pool with mystery/trouble values that scale linearly. Encounters have modifiers (mysteryMod, troubleMod, redrawBonus, selectiveRedrawBonus, treasureMultiplier, xpMultiplier).

### Shop Generation (`src/lib/pods.js`)

`generateShopPods(encounterNumber, count)` creates pods with ranks based on tier config. Higher encounters = higher guaranteed minimum ranks. Token types filtered by `minDepth` and weighted by `weight`.

Bonus draws expand the pod pool: each bonus draw adds `CONFIG.podsPerBonusDraw` (default 2) weak pods.

### Persistence (`src/lib/persistence.js`)

Game state is saved to `localStorage` automatically so mobile browsers don't lose progress when a tab is evicted from memory.

- `initAutoSave(stores)` — subscribes to all meaningful stores and debounces saves (500ms). Called once in `App.svelte` `onMount`.
- `loadSavedGame(stores)` — reads and restores state on page load. Called before `initAutoSave`.
- `clearSave()` — wipes the save. Called at the start of `selectClass` so each new run starts clean.
- `SAVE_VERSION` constant — bump this whenever the saved data shape changes incompatibly. Mismatched saves are discarded and the player starts fresh.

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
