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

1. **DRAW phase** - Player draws 6 tokens from shuffled pool, can redraw
2. **COMBAT phase** - Tokens resolve against encounter (insight vs mystery, resolve vs trouble)
3. **SHOP phase** - Spend treasure to replace pods with better ones

### State Management (`src/lib/gameState.js`)

All game state uses Svelte writable stores. Key stores:
- `gamePhase` - Current phase (START, DRAW, COMBAT, SHOP, GAME_OVER)
- `player` - Contains pods array, stamina, treasure
- `drawnTokens` - Currently drawn tokens for combat
- `currentEncounter` - Active encounter with mystery/trouble values

Exported functions modify state: `startNewGame()`, `drawTokens()`, `redrawAll()`, `confirmDraw()`, `purchasePod()`, etc.

### Token System (`src/lib/constants.js`, `src/lib/pods.js`)

Tokens have a **type** (insight, resolve, treasure, lock, key) and **rank** (inferior through diamond). Value = baseValue × rankMultiplier.

Some tokens have synergies via `getValue(token, allDrawnTokens)` callback - e.g., lock/key boost each other when drawn together.

Pods contain 3 tokens. Starting pods use inferior/basic ranks. Shop pods scale with encounter tier.

### Combat Resolution (`src/lib/combat.js`)

`resolveCombat(drawnTokens, encounter)` calculates totals and returns result:
- Insight ≥ mystery → reveal bonus treasure
- Resolve < trouble → stamina loss (flat + scaled by deficiency)

### Encounter Scaling (`src/lib/encounters.js`)

`generateEncounter(encounterNumber)` creates encounters with mystery/trouble/reward values that scale with formulas using linear + exponential growth.

### Shop Generation (`src/lib/pods.js`)

`generateShopPods(encounterNumber, count)` creates pods with ranks based on tier config. Higher encounters = higher guaranteed minimum ranks. Token types filtered by `minDepth` and weighted by `weight`.

## Configuration

`CONFIG` object in `src/lib/constants.js` contains all balance values:
- Pod/token counts, draw count
- Starting stamina/treasure
- Combat penalty formulas
- Redraw limits, shop size
