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
4. **COMBAT phase** - Tokens resolve against encounter (insight vs mystery, resolve vs trouble)
5. **SHOP phase** - Spend treasure to replace pods with better ones

### State Management (`src/lib/gameState.js`)

All game state uses Svelte writable stores. Key stores:
- `gamePhase` - Current phase (START, CLASS_SELECT, CHOICE, DRAW, COMBAT, POD_REWARD, ITEM_SHOP, SHOP, GAME_OVER)
- `player` - Contains pods array, playerClass, stamina, maxStamina, treasure, xp, equipment
- `drawnTokens` - Currently drawn tokens for combat
- `currentEncounter` - Active encounter with mystery/trouble values

Key functions:
- `selectClass(classId)` - Initializes game with chosen class, starting items, and bonuses
- `getTotalBonuses(playerState)` - Combines equipment + class bonuses
- `getEquipmentBonuses(equipment)` - Equipment bonuses only
- `getEffectiveMaxStamina(playerState)` - Base max + total bonuses

### Class System (`src/lib/classes.js`)

Four classes: Explorer, Merchant, Athlete, Fool. Each defines:
- `bonuses` - Passive stat bonuses (redraws, selectiveRedraws, maxStamina, staminaRegen, etc.)
- `startingEquipment` - Array of 3 slots (items or null), mundane items defined in `STARTING_ITEMS`
- `startingTreasureBonus` / `startingXpBonus` - Extra starting resources
- `shopItemFilter` - Optional callback to exclude items from shops (e.g., Fool excludes selectiveRedraws items)

### Token System (`src/lib/tokens.js`, `src/lib/pods.js`)

Token types defined in `TOKEN_TYPES` in `tokens.js`. Tokens have a **type** and **rank** (iron through diamond). Value = baseValue × rankMultiplier.

Token series with synergies via `getValue(token, allDrawnTokens)`:
- **Musical** (harmony, melody, chord, discord) - Bonus when drawn with other unique Musical tokens
- **Celestial** (scorpio, capricorn, taurus, libra, pluto) - Scale with Celestial count
- **Botanical** (oak, lotus, clover, fern, hemlock) - Scale with Botanical count
- **Chthonic** (obsidian, granite, geode) - Scale with Chthonic count, have `onDraw` effects

Pods contain 3 tokens. Starting pods use iron/basic ranks. Shop pods scale with encounter tier.

### Equipment System (`src/lib/items.js`)

3 equipment slots. Six item categories: Book (selectiveRedraws), Navigation (redraws), Light Source (bonusDraw), Weapon (resolve), Jewelry (insight), Food (stamina). Items purchased with XP in the item shop.

- Light sources: only one equipped at a time, auto-replace
- Food: heals on purchase, provides persistent maxStamina/staminaRegen while equipped
- `generateItemShop(encounterNumber, playerState)` - Generates 3 items with guarantee rules (food when low HP, light source at depth 8+, +2 draw at depth 14+). Respects class `shopItemFilter`.

### Combat Resolution (`src/lib/combat.js`)

`resolveCombat(drawnTokens, encounter, bonuses, drawEffects)` calculates totals and returns result:
- Insight ≥ mystery → reveal bonus treasure (half of mystery value)
- Resolve < trouble → stamina loss (flat + scaled by deficiency)
- `bonuses` includes equipment + class insight/resolve
- `drawEffects` includes accumulated onDraw token effects

### Encounter Scaling (`src/lib/encounters.js`)

`generateEncounter(encounterNumber)` creates encounters from a weighted pool with mystery/trouble values that scale linearly. Encounters have modifiers (mysteryMod, troubleMod, redrawBonus, treasureMultiplier, xpMultiplier).

### Shop Generation (`src/lib/pods.js`)

`generateShopPods(encounterNumber, count)` creates pods with ranks based on tier config. Higher encounters = higher guaranteed minimum ranks. Token types filtered by `minDepth` and weighted by `weight`.

Bonus draws expand the pod pool: each bonus draw adds `CONFIG.podsPerBonusDraw` (default 2) weak pods.

## Configuration

`CONFIG` object in `src/lib/constants.js` contains all balance values:
- Pod/token counts, draw count
- Starting stamina/treasure
- Combat penalty formulas
- Redraw limits, shop size
- `podsPerBonusDraw` - Extra pods added per bonus draw gained
