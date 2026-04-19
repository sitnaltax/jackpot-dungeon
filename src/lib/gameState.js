// Svelte stores for reactive game state

import { writable, get } from 'svelte/store';
import { CONFIG } from './constants.js';
import { TOKEN_TYPES, getTokenValue } from './tokens.js';
import { generateStartingPods, getTokenPool, shuffle, clonePodTemplate, generateShopPods, generateWeakPod, upgradeRandomToken } from './pods.js';
import { generateEncounter, calculateBaseStat, FINAL_ORDEALS } from './encounters.js';
import { resolveEncounter } from './encounter.js';
import { generateItemShop, WEAK_ITEMS } from './items.js';
import { CLASSES, DIFFICULTIES } from './classes.js';
import { clearSave, loadPrefs, savePrefs } from './persistence.js';
import { getDailySeed, todayUTC } from './rng.js';
import { generateDailyScript } from './dailyScript.js';

// Game phases
export const PHASES = {
  START: 'start',
  CLASS_SELECT: 'classSelect',
  CHOICE: 'choice',
  DRAW: 'draw',
  ENCOUNTER: 'encounter',
  SHOP: 'shop',
  POD_REWARD: 'podReward',
  ITEM_SHOP: 'itemShop',
  ORDEAL_INTERLUDE: 'ordealInterlude',
  GAME_OVER: 'gameOver',
};

// Core game state stores
export const gamePhase = writable(PHASES.START);
export const encounterNumber = writable(0);
export const player = writable({
  pods: [],
  playerClass: null,
  stamina: CONFIG.startingStamina,
  maxStamina: CONFIG.startingStamina,
  xp: CONFIG.startingXp,
  treasure: 0,
  totalXpEarned: 0,
  totalTreasureEarned: 0,
  equipment: [null, null, null],
});
export const currentEncounter = writable(null);
export const drawnTokens = writable([]);
export const tokenPool = writable([]);
export const redrawsRemaining = writable(CONFIG.redrawsPerEncounter);
export const selectiveRedrawsRemaining = writable(CONFIG.selectiveRedrawsPerEncounter);
export const selectedTokensForRedraw = writable(new Set());
export const encounterResult = writable(null);
export const shopPods = writable([]);
export const selectedPodToReplace = writable(null);
export const purchasedShopPods = writable(new Set());
export const shopRefreshCount = writable(0);

// Returns the XP cost of the next shop refresh for the given class.
// n is the number of refreshes already used this shop visit.
// Default: 1, 2, 3… Classes may override via refreshCostFn.
export function getRefreshCost(playerClass, n) {
  if (playerClass?.refreshCostFn) return playerClass.refreshCostFn(n);
  return n + 1;
}

// Item shop state
export const shopItems = writable([]);
export const purchasedShopItems = writable(new Set());
export const selectedEquipmentSlot = writable(null); // slot index for replacement

// Encounter choice state (for even encounters >= 4)
export const choiceEncounters = writable({ hard: null, next: null });
export const chosenPath = writable(null); // 'hard' or 'basic'
export const rewardPod = writable(null); // Pod offered as reward after hard path

// Accumulated discard effects for the current encounter.
// Fires each time a token is discarded from the draw (via redrawAll or redrawSelected).
export const discardEffects = writable({ insight: 0, resolve: 0, xp: 0 });

// IDs of encounters that have been played this run (prevents repeats)
export const seenEncounterIds = writable(new Set());

// Glory score (Glory difficulty only)
export const gloryScore = writable(0);

// Final Ordeal state
export const ordealActive = writable(false);
export const ordealMysteryPool = writable(0);
export const ordealRound = writable(0);
export const ordealId = writable(null);
export const isVictory = writable(false);
export const ordealHomeUseCount = writable(0);

// Daily challenge state
export const isDailyRun              = writable(false);
export const dailyDate               = writable(null);
export const dailyScript             = writable(null);
export const podShopRefreshCount     = writable(0);
export const itemShopIndex           = writable(0);
export const itemShopRefreshCount    = writable(0);
export const itemShopSequenceCursor  = writable(0);
export const dailyWasReAttempt       = writable(false);
// Set when user clicks "Daily Challenge" on start screen; cleared once the run begins
export const dailyPending            = writable(false);
// The pre-computed daily class id, set when user clicks "Daily Challenge"
export const dailyClassId            = writable(null);

// Apply difficulty-scaled mystery/trouble to a pre-selected encounter template from the daily script.
function applyDifficultyToTemplate(template, encounterNumber, difficulty) {
  const base = calculateBaseStat(encounterNumber, difficulty);
  return {
    ...template,
    mystery: base + (template.mysteryMod || 0),
    trouble: base + (template.troubleMod || 0),
  };
}

function applyOnDiscardEffects(tokens) {
  for (const token of tokens) {
    const typeData = TOKEN_TYPES[token.type];
    if (!typeData.onDiscard) continue;
    const effects = typeData.onDiscard(token);
    discardEffects.update(d => ({
      insight: d.insight + (effects.insight || 0),
      resolve: d.resolve + (effects.resolve || 0),
      xp: d.xp + (effects.xp || 0),
    }));
  }
}

// Token inspection modal state
// inspectedToken: the token being inspected
// inspectionContext: array of all drawn tokens (for synergy display), or null if not in an encounter
// inspectionSelectable: whether the token can be selected for redraw
export const inspectedToken = writable(null);
export const inspectionContext = writable(null);
export const inspectionEquipment = writable([]);
export const inspectionSelectable = writable(false);

export function inspectToken(token, context = null, selectable = false, equipment = []) {
  inspectedToken.set(token);
  inspectionContext.set(context);
  inspectionEquipment.set(equipment);
  inspectionSelectable.set(selectable);
}

export function closeInspection() {
  inspectedToken.set(null);
  inspectionContext.set(null);
  inspectionEquipment.set([]);
  inspectionSelectable.set(false);
}

// Equipment inspection modal state
export const inspectedEquipment = writable(null);

export function inspectEquipment(equipment) {
  inspectedEquipment.set(equipment);
}

export function closeEquipmentInspection() {
  inspectedEquipment.set(null);
}

// Class detail modal state
export const inspectedClass = writable(null);

export function inspectClass(playerClass) {
  inspectedClass.set(playerClass);
}

export function closeClassInspection() {
  inspectedClass.set(null);
}

// Helper to calculate bonuses from equipment only
export function getEquipmentBonuses(equipment) {
  const bonuses = {
    redraws: 0,
    selectiveRedraws: 0,
    bonusDraw: 0,
    insight: 0,
    resolve: 0,
    maxStamina: 0,
    staminaRegen: 0,
  };

  for (const item of equipment) {
    if (item && item.bonuses) {
      for (const key of Object.keys(bonuses)) {
        if (item.bonuses[key]) {
          bonuses[key] += item.bonuses[key];
        }
      }
    }
  }

  return bonuses;
}

// Helper to calculate total bonuses from equipment + class
export function getTotalBonuses(playerState) {
  const bonuses = getEquipmentBonuses(playerState.equipment || []);
  const classBonuses = playerState.playerClass?.bonuses || {};
  for (const key of Object.keys(bonuses)) {
    if (classBonuses[key]) {
      bonuses[key] += classBonuses[key];
    }
  }
  return bonuses;
}

// Compute effective max stamina (base + equipment + class bonuses)
export function getEffectiveMaxStamina(playerState) {
  const bonuses = getTotalBonuses(playerState);
  return playerState.maxStamina + bonuses.maxStamina;
}

// Sum the value of all Glory tokens in a player's pods (used for glory score accumulation).
function calculateGloryFromPods(pods) {
  let total = 0;
  for (const pod of pods) {
    for (const token of pod.tokens) {
      if (token.type === 'glory') {
        total += getTokenValue(token);
      }
    }
  }
  return total;
}

// Game actions — start screen transitions to class select
export function startNewGame() {
  isDailyRun.set(false);
  dailyDate.set(null);
  dailyScript.set(null);
  podShopRefreshCount.set(0);
  itemShopIndex.set(0);
  dailyWasReAttempt.set(false);
  dailyPending.set(false);
  dailyClassId.set(null);
  gamePhase.set(PHASES.CLASS_SELECT);
}

// Start a daily challenge run
export function startDailyChallenge(difficulty) {
  const date = todayUTC();
  const seed = getDailySeed(date);
  const script = generateDailyScript(seed);

  // Check if player already attempted today (before clearSave wipes state)
  const prefs = loadPrefs();
  const wasReAttempt = prefs.dailyAttempted === true && prefs.dailyAttemptedDate === date;

  clearSave();
  isDailyRun.set(true);
  dailyDate.set(date);
  dailyScript.set(script);
  podShopRefreshCount.set(0);
  itemShopIndex.set(0);
  dailyWasReAttempt.set(wasReAttempt);

  // Mark attempted in prefs (survives clearSave)
  savePrefs({ ...prefs, dailyAttempted: true, dailyAttemptedDate: date });

  selectClass(script.dailyClass, difficulty);
}

// Player selects a class and the game begins
export function selectClass(classId, difficultyId = 'normal') {
  clearSave();
  const chosenClass = CLASSES[classId];
  if (!chosenClass) return;

  const startingPods = generateStartingPods();
  const wizard = difficultyId === 'wizard';

  const difficultyData = DIFFICULTIES.find(d => d.id === difficultyId);
  const difficultyStaminaBonus = wizard ? 0 : (difficultyData?.staminaBonus || 0);
  const baseStamina = CONFIG.startingStamina + difficultyStaminaBonus;
  const baseXp = CONFIG.startingXp + (chosenClass.startingXpBonus || 0);
  const baseTreasure = chosenClass.startingTreasureBonus || 0;

  const startingBonusDraw = (chosenClass.bonuses?.bonusDraw || 0) +
    chosenClass.startingEquipment.reduce((sum, e) => sum + (e?.bonuses?.bonusDraw || 0), 0);

  const playerState = {
    pods: startingPods,
    maxPods: CONFIG.drawCount + startingBonusDraw * CONFIG.podsPerBonusDraw,
    playerClass: chosenClass,
    difficulty: difficultyId,
    stamina: baseStamina,
    maxStamina: baseStamina,
    xp: wizard ? baseXp + 99999 : baseXp,
    treasure: wizard ? baseTreasure + 99999 : baseTreasure,
    totalXpEarned: baseXp,
    totalTreasureEarned: baseTreasure,
    equipment: [...chosenClass.startingEquipment],
    hasEverBoughtFood: false,
  };

  // Set stamina to effective max (accounts for class + equipment bonuses)
  const effMax = getEffectiveMaxStamina(playerState);
  const staminaOffset = chosenClass.startingStaminaOffset || 0;
  playerState.stamina = wizard ? effMax + 99999 : effMax + staminaOffset;
  if (wizard) {
    playerState.maxStamina = baseStamina + 99999;
  }

  player.set(playerState);

  encounterNumber.set(0);
  encounterResult.set(null);
  seenEncounterIds.set(new Set());
  ordealActive.set(false);
  ordealMysteryPool.set(0);
  ordealRound.set(0);
  ordealId.set(null);
  isVictory.set(false);
  ordealHomeUseCount.set(0);
  gloryScore.set(0);
  startNextEncounter();
}

// Odd floors offer a choice (hard challenge or skip)
function isChoiceEncounter(encNum) {
  return encNum >= 3 && encNum % 2 === 1;
}

function buildOrdealEncounter(pool, round, difficulty) {
  const chosenId = get(ordealId);
  const ordeal = FINAL_ORDEALS.find(o => o.id === chosenId) ?? FINAL_ORDEALS[0];
  const troublePerRound = CONFIG.ordealTroublePerRound[difficulty] ?? ordeal.troublePerRound;
  return {
    id: ordeal.id,
    name: ordeal.name,
    mystery: pool,
    trouble: calculateBaseStat(CONFIG.ordealStartDepth, difficulty) + ordeal.troubleMod + (round - 1) * troublePerRound,
    level: CONFIG.ordealStartDepth,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    isOrdeal: true,
    flavorText: ordeal.flavorText,
  };
}

function startOrdeal() {
  const difficulty = get(player).difficulty;
  const $isDailyRun = get(isDailyRun);
  const $dailyScript = get(dailyScript);

  let ordeal;
  if ($isDailyRun && $dailyScript) {
    ordeal = FINAL_ORDEALS.find(o => o.id === $dailyScript.ordealVariant) ?? FINAL_ORDEALS[0];
  } else {
    ordeal = FINAL_ORDEALS[Math.floor(Math.random() * FINAL_ORDEALS.length)];
  }

  const scale = CONFIG.ordealMysteryScale[difficulty] ?? 1.0;
  const pool = Math.round(ordeal.mysteryBase * scale);
  ordealId.set(ordeal.id);
  ordealActive.set(true);
  ordealRound.set(0);
  ordealMysteryPool.set(pool);
  ordealHomeUseCount.set(0);
  beginOrdealRound();
}

export function beginOrdealRound() {
  ordealRound.update(n => n + 1);
  const round = get(ordealRound);
  const pool = get(ordealMysteryPool);
  const difficulty = get(player).difficulty;
  const encounter = buildOrdealEncounter(pool, round, difficulty);
  beginEncounter(encounter);
}

export function startNextEncounter() {
  encounterNumber.update(n => n + 1);
  const encNum = get(encounterNumber);

  // Reset choice state
  chosenPath.set(null);
  rewardPod.set(null);
  encounterResult.set(null);

  // Transition to Final Ordeal after the last normal encounter
  if (encNum >= CONFIG.ordealStartDepth) {
    startOrdeal();
    return;
  }

  const $isDailyRun = get(isDailyRun);
  const $dailyScript = get(dailyScript);

  const difficulty = get(player).difficulty;

  // Odd floors: choice between hard challenge or skip
  if (isChoiceEncounter(encNum)) {
    let hardEncounter, nextEncounter;
    const hardFloor = encNum >= 13 ? encNum + 1 : encNum + 2;
    if ($isDailyRun && $dailyScript) {
      const scriptEntry = $dailyScript.encounters[encNum - 1];
      // Apply difficulty scaling to the stored template
      hardEncounter = applyDifficultyToTemplate(scriptEntry.hard, hardFloor, difficulty);
      nextEncounter = applyDifficultyToTemplate(scriptEntry.basic, encNum, difficulty);
    } else {
      const $seen = get(seenEncounterIds);
      hardEncounter = generateEncounter(hardFloor, difficulty, $seen);
      // Also exclude the hard encounter's ID so the two options are always distinct
      nextEncounter = generateEncounter(encNum, difficulty, new Set([...$seen, hardEncounter.id]));
    }
    choiceEncounters.set({ hard: hardEncounter, next: nextEncounter });
    gamePhase.set(PHASES.CHOICE);
    return;
  }

  // Even floors: normal encounter
  let encounter;
  if ($isDailyRun && $dailyScript) {
    encounter = applyDifficultyToTemplate($dailyScript.encounters[encNum - 1].basic, encNum, difficulty);
  } else {
    const $seen = get(seenEncounterIds);
    encounter = generateEncounter(encNum, difficulty, $seen);
  }
  beginEncounter(encounter);
}

// Begin an encounter (after choice or for non-choice encounters)
function beginEncounter(encounter) {
  seenEncounterIds.update(s => new Set([...s, encounter.id]));
  currentEncounter.set(encounter);

  // Calculate redraws from equipment + class and encounter bonuses
  const $player = get(player);
  const totalBonuses = getTotalBonuses($player);
  const redrawBonus = encounter.redrawBonus || 0;
  const selectiveBonus = encounter.selectiveRedrawBonus || 0;

  // Reset draw state with total and encounter bonuses
  redrawsRemaining.set(Math.max(0, CONFIG.redrawsPerEncounter + totalBonuses.redraws + redrawBonus));
  selectiveRedrawsRemaining.set(Math.max(0, CONFIG.selectiveRedrawsPerEncounter + totalBonuses.selectiveRedraws + selectiveBonus));
  selectedTokensForRedraw.set(new Set());

  // Reset on-draw effects for this encounter
  discardEffects.set({ insight: 0, resolve: 0, xp: 0 });

  // Draw tokens
  drawTokens();

  gamePhase.set(PHASES.DRAW);
}

// Player chooses the hard path
export function chooseHardPath() {
  const $choices = get(choiceEncounters);
  chosenPath.set('hard');
  beginEncounter($choices.hard);
}

// Player skips the challenge on odd floors — use the pre-generated next encounter
export function skipChallenge() {
  const $choices = get(choiceEncounters);
  beginEncounter($choices.next);
}

export function drawTokens() {
  const $player = get(player);
  const pool = getTokenPool($player.pods);
  tokenPool.set(pool);

  // Draw count includes bonus draws from light sources (equipment + class)
  const totalBonuses = getTotalBonuses($player);
  const totalDraw = CONFIG.drawCount + totalBonuses.bonusDraw;
  const drawn = pool.slice(0, totalDraw);
  drawnTokens.set(drawn);
}

export function redrawAll() {
  const remaining = get(redrawsRemaining);
  if (remaining <= 0) return;

  redrawsRemaining.update(n => n - 1);
  selectedTokensForRedraw.set(new Set());
  applyOnDiscardEffects(get(drawnTokens));
  drawTokens();
}

export function toggleTokenSelection(tokenId) {
  selectedTokensForRedraw.update(selected => {
    const newSet = new Set(selected);
    if (newSet.has(tokenId)) {
      newSet.delete(tokenId);
    } else {
      newSet.add(tokenId);
    }
    return newSet;
  });
}

export function redrawSelected() {
  const remaining = get(selectiveRedrawsRemaining);
  if (remaining <= 0) return;

  const $selected = get(selectedTokensForRedraw);
  if ($selected.size === 0) return;

  const $player = get(player);
  const $drawnTokens = get(drawnTokens);

  // Get all tokens and create the pool
  const allTokens = $player.pods.flatMap(pod => pod.tokens);

  // Separate kept tokens from tokens to redraw
  const keptTokens = $drawnTokens.filter(t => !$selected.has(t.id));
  const keptTokenIds = new Set(keptTokens.map(t => t.id));

  // Available pool is all tokens except the ones we're keeping
  const availablePool = shuffle(allTokens.filter(t => !keptTokenIds.has(t.id)));

  // Draw new tokens to replace the selected ones
  const numToDraw = $selected.size;
  const newTokens = availablePool.slice(0, numToDraw);

  // Apply onDiscard effects for the tokens being replaced
  const discardedTokens = $drawnTokens.filter(t => $selected.has(t.id));
  applyOnDiscardEffects(discardedTokens);

  const combined = [...keptTokens, ...newTokens];
  drawnTokens.set(combined);

  // Clear selection and decrement redraws
  selectedTokensForRedraw.set(new Set());
  selectiveRedrawsRemaining.update(n => n - 1);
}

export function confirmDraw() {
  gamePhase.set(PHASES.ENCOUNTER);
  executeEncounter();
}

export function executeEncounter() {
  const $drawnTokens = get(drawnTokens);
  const $encounter = get(currentEncounter);
  const $player = get(player);

  // Get total bonuses (equipment + class) for encounter
  const totalBonuses = getTotalBonuses($player);
  const encounterBonuses = {
    insight: totalBonuses.insight,
    resolve: totalBonuses.resolve,
  };

  const $discardEffects = get(discardEffects);
  const result = resolveEncounter($drawnTokens, $encounter, encounterBonuses, $discardEffects, $player.equipment || []);

  // Award Treasure: on insight success, scaled by Mystery (3 for 6-15, 4 for 16-25, 5 for 26-35, etc.)
  // On failure: 1.
  const insightTreasure = result.insightSuccess
    ? Math.max(3, 2 + Math.ceil(($encounter.mystery - 5)/ 10))
    : 0;
  const baseTreasure = result.insightSuccess ? insightTreasure : 1;

  // Class callbacks for encounter outcomes
  const insightFailureBonus = !result.insightSuccess
    ? ($player.playerClass?.onInsightFailure?.(result) ?? {})
    : {};

  result.baseTreasure = baseTreasure;
  result.insightFailureBonus = insightFailureBonus;
  result.xpGained = result.xpGained + (insightFailureBonus.xp ?? 0);
  result.treasureGained = baseTreasure + (insightFailureBonus.treasure ?? 0);

  // Calculate stamina regen from equipment + class
  const staminaRegen = totalBonuses.staminaRegen;
  result.staminaRegen = staminaRegen;

  // --- Final Ordeal branch ---
  if (get(ordealActive)) {
    // Deplete pool by insight dealt this round (pool floored at 0)
    ordealMysteryPool.update(p => Math.max(0, p - result.totals.insight));

    result.treasureGained = 0;

    encounterResult.set(result);

    player.update(p => {
      const effMax = getEffectiveMaxStamina(p);
      const afterDamage = p.stamina + staminaRegen - result.staminaLost;
      return {
        ...p,
        stamina: Math.min(effMax, Math.max(0, afterDamage)),
        xp: p.xp + result.xpGained,
        totalXpEarned: p.totalXpEarned + result.xpGained,
      };
    });

    const $playerAfterOrdeal = get(player);
    if ($playerAfterOrdeal.stamina <= 0) {
      gamePhase.set(PHASES.GAME_OVER);
    } else if (result.insightSuccess) {
      // Glory difficulty: award 7x glory token value on victory
      if ($player.difficulty === 'glory') {
        const victoryGlory = calculateGloryFromPods($playerAfterOrdeal.pods) * 7;
        gloryScore.update(g => g + victoryGlory);
      }
      isVictory.set(true);
      gamePhase.set(PHASES.GAME_OVER);
    }
    // else: stay at ENCOUNTER — EncounterResult shows, player proceeds to ORDEAL_INTERLUDE
    return;
  }
  // --- End ordeal branch ---

  encounterResult.set(result);

  // Apply results to player (including stamina regen)
  player.update(p => {
    const effMax = getEffectiveMaxStamina(p);
    const afterRegen = p.stamina + staminaRegen;
    const afterDamage = afterRegen - result.staminaLost;
    return {
      ...p,
      stamina: Math.min(effMax, Math.max(0, afterDamage)),
      xp: p.xp + result.xpGained,
      treasure: p.treasure + result.treasureGained,
      totalXpEarned: p.totalXpEarned + result.xpGained,
      totalTreasureEarned: p.totalTreasureEarned + result.treasureGained,
    };
  });

  // Glory difficulty: accumulate glory from all owned Glory tokens after each normal encounter
  if ($player.difficulty === 'glory') {
    const gloryGained = calculateGloryFromPods(get(player).pods);
    gloryScore.update(g => g + gloryGained);
  }

  // Check for game over after regen is applied
  const $playerAfter = get(player);
  if ($playerAfter.stamina <= 0) {
    gamePhase.set(PHASES.GAME_OVER);
  }
}

export function proceedFromEncounter() {
  if (get(ordealActive)) {
    gamePhase.set(PHASES.ORDEAL_INTERLUDE);
    return;
  }

  const $chosenPath = get(chosenPath);

  const encNum = get(encounterNumber);

  if ($chosenPath === 'hard') {
    // Hard path (odd floor): offer pod reward, then pod shop
    const $isDailyRun = get(isDailyRun);
    const $dailyScript = get(dailyScript);
    let pod;
    if ($isDailyRun && $dailyScript) {
      pod = $dailyScript.encounters[encNum - 1].podReward;
    } else {
      const $pc = get(player).playerClass;
      [pod] = generateShopPods(encNum, 1, Math.random, {
        upgradesTokens: $pc?.upgradesTokens ?? false,
      });
    }
    rewardPod.set(pod);
    gamePhase.set(PHASES.POD_REWARD);
  } else if (encNum % 2 === 0) {
    // Even floor: item shop, then pod shop
    openItemShop();
  } else {
    // Odd floor (floor 1, no choice): straight to pod shop
    proceedToShop();
  }
}

// Item shop functions
export function openItemShop() {
  const $player = get(player);
  const encNum = get(encounterNumber);
  const $isDailyRun = get(isDailyRun);
  const $dailyScript = get(dailyScript);
  const $itemShopIndex = get(itemShopIndex);

  let items;
  if ($isDailyRun && $dailyScript) {
    const slotIndex = Math.min($itemShopIndex, $dailyScript.itemShops.length - 1);
    const scriptShop = $dailyScript.itemShops[slotIndex];
    itemShopSequenceCursor.set(0);
    itemShopRefreshCount.set(0);
    items = pickItemsFromScript(scriptShop, encNum, $player, 0);
    itemShopIndex.update(n => n + 1);
  } else {
    items = generateItemShop(encNum, $player);
  }

  shopItems.set(items);
  purchasedShopItems.set(new Set());
  selectedEquipmentSlot.set(null);
  gamePhase.set(PHASES.ITEM_SHOP);
}

// Pick items from a daily script item shop slot, consuming from sequence at cursor position.
// Returns up to 3 items applying guarantee rules.
function pickItemsFromScript(scriptShop, encounterNumber, playerState, cursorStart) {
  const budget = playerState.treasure || 0;
  const classFilter = playerState.playerClass?.shopItemFilter;
  const equippedIds = new Set(
    (playerState.equipment || []).filter(e => e).map(e => e.id)
  );
  const equippedMaxDraw = Math.max(0, ...(playerState.equipment || []).map(e => e?.bonuses?.bonusDraw || 0));

  function isEligible(item) {
    if ((item.minDepth || 0) > encounterNumber) return false;
    if (classFilter && !classFilter(item)) return false;
    if (equippedIds.has(item.id)) return false;
    if (equippedMaxDraw > 0 && (item.bonuses?.bonusDraw || 0) > 0 && (item.bonuses?.bonusDraw || 0) < equippedMaxDraw) return false;
    return true;
  }

  // Consume from sequence, skipping ineligible items, until we have 3 or run out
  const shopItems = [];
  const usedIds = new Set();
  let cursor = cursorStart;

  // Apply guarantees first using pre-picked candidate lists
  const hpPercent = playerState.stamina / playerState.maxStamina;

  // depth 6+ light source guarantee
  if (encounterNumber >= 6 && shopItems.length < 3) {
    const equippedLight = (playerState.equipment || []).find(e => e?.category === 'lightSource');
    const equippedDraw = equippedLight?.bonuses?.bonusDraw || 0;
    for (const item of (scriptShop.guaranteeLight || [])) {
      if (usedIds.has(item.id)) continue;
      if (!isEligible(item)) continue;
      if (item.cost > budget) continue;
      const itemDraw = item.bonuses?.bonusDraw || 0;
      if (itemDraw > equippedDraw) {
        shopItems.push(item);
        usedIds.add(item.id);
        break;
      }
    }
  }

  // low HP food guarantee — only requires affordability, not full eligibility,
  // so equipped food items don't exhaust the candidate list
  if (!playerState.hasEverBoughtFood && hpPercent < 0.75 && shopItems.length < 3) {
    for (const item of (scriptShop.guaranteeFood || [])) {
      if (usedIds.has(item.id)) continue;
      if (!isEligible(item)) continue;
      if (item.cost > budget) continue;
      shopItems.push(item);
      usedIds.add(item.id);
      break;
    }
  }

  // Fill remaining slots from sequence
  while (shopItems.length < 3 && cursor < scriptShop.sequence.length) {
    const item = scriptShop.sequence[cursor++];
    if (usedIds.has(item.id)) continue;
    if (!isEligible(item)) continue;
    if (item.cost > budget) continue;
    shopItems.push(item);
    usedIds.add(item.id);
  }

  // Update cursor store
  itemShopSequenceCursor.set(cursor);

  // Pad with weak items if fewer than 3 slots were filled
  if (shopItems.length < 3) {
    const weakAvailable = WEAK_ITEMS.filter(i => i.cost <= budget && !usedIds.has(i.id));
    for (const item of weakAvailable) {
      if (shopItems.length >= 3) break;
      shopItems.push(item);
      usedIds.add(item.id);
    }
  }

  return shopItems;
}

export function selectEquipmentSlot(slotIndex) {
  const current = get(selectedEquipmentSlot);
  if (current === slotIndex) {
    selectedEquipmentSlot.set(null);
  } else {
    selectedEquipmentSlot.set(slotIndex);
  }
}

export function purchaseItem(item, shopIndex) {
  const $player = get(player);
  const $purchasedShopItems = get(purchasedShopItems);

  // Can't afford or already purchased
  if ($player.treasure < item.cost) return;
  if ($purchasedShopItems.has(shopIndex)) return;

  // Find where to place the item
  let targetSlot = get(selectedEquipmentSlot);

  // Light source auto-replace: if buying a light source and one is already equipped
  if (item.category === 'lightSource') {
    const existingLightSlot = $player.equipment.findIndex(
      e => e?.category === 'lightSource'
    );
    if (existingLightSlot !== -1) {
      targetSlot = existingLightSlot;
    }
  }

  // If no slot selected, try to find an empty one
  if (targetSlot === null || targetSlot === undefined) {
    const emptySlot = $player.equipment.findIndex(e => e === null);
    if (emptySlot !== -1) {
      targetSlot = emptySlot;
    } else {
      // No empty slot and none selected — can't purchase
      return;
    }
  }

  // Prevent equipping a second light source (unless replacing existing one)
  if (item.category === 'lightSource') {
    const hasOtherLight = $player.equipment.some(
      (e, i) => i !== targetSlot && e?.category === 'lightSource'
    );
    if (hasOtherLight) return;
  }

  // Apply purchase
  player.update(p => {
    const newEquipment = [...p.equipment];
    newEquipment[targetSlot] = item;

    // Effective max stamina after swap (uses equipment only for hypothetical calc, plus class)
    const effMax = getEffectiveMaxStamina({ ...p, equipment: newEquipment });

    // Apply food heal on pickup
    let newStamina = p.stamina;
    if (item.staminaHeal) {
      newStamina = Math.min(effMax, newStamina + item.staminaHeal);
    }

    // Cap stamina if max decreased
    newStamina = Math.min(effMax, newStamina);

    // Check if +draw expanded and we need more pods
    const newBonuses = getEquipmentBonuses(newEquipment);
    const classBonusDraw = p.playerClass?.bonuses?.bonusDraw || 0;
    const totalBonusDraw = newBonuses.bonusDraw + classBonusDraw;
    const requiredPods = CONFIG.drawCount + totalBonusDraw * CONFIG.podsPerBonusDraw;

    let newPods = [...p.pods];
    let newMaxPods = p.maxPods;

    if (requiredPods > newMaxPods) {
      const podsToAdd = requiredPods - newMaxPods;
      for (let i = 0; i < podsToAdd; i++) {
        newPods.push(generateWeakPod());
      }
      newMaxPods = requiredPods;
    }

    return {
      ...p,
      treasure: p.treasure - item.cost,
      equipment: newEquipment,
      pods: newPods,
      maxPods: newMaxPods,
      stamina: newStamina,
    };
  });

  // Mark as purchased
  purchasedShopItems.update(set => {
    const newSet = new Set(set);
    newSet.add(shopIndex);
    return newSet;
  });

  if (item.category === 'food') {
    player.update(p => ({ ...p, hasEverBoughtFood: true }));
  }

  selectedEquipmentSlot.set(null);
}

export function skipItemShop() {
  if (get(ordealActive)) {
    beginOrdealRound();
    return;
  }
  proceedToShop();
}

export function proceedToShop() {
  const encNum = get(encounterNumber);
  const $isDailyRun = get(isDailyRun);
  const $dailyScript = get(dailyScript);
  const $player = get(player);
  const isGloryMode = $player.difficulty === 'glory' && !get(ordealActive);

  let generatedPods;
  if ($isDailyRun && $dailyScript) {
    // Daily mode: use first set (index 0) from pre-generated shop sets
    const depthIndex = Math.min(encNum - 1, $dailyScript.podShops.length - 1);
    generatedPods = $dailyScript.podShops[depthIndex][0];
  } else {
    const $pc = $player.playerClass;
    generatedPods = generateShopPods(encNum, CONFIG.shopSize, Math.random, {
      upgradesTokens: $pc?.upgradesTokens ?? false,
      costMultiplier: $pc?.bonuses?.podCostMultiplier ?? 1.0,
      includeGlory: isGloryMode,
    });
  }

  shopPods.set(generatedPods);
  selectedPodToReplace.set(null);
  purchasedShopPods.set(new Set());
  shopRefreshCount.set(0);
  podShopRefreshCount.set(0);
  gamePhase.set(PHASES.SHOP);
}

export function selectPodToReplace(podId) {
  const current = get(selectedPodToReplace);
  if (current === podId) {
    selectedPodToReplace.set(null);
  } else {
    selectedPodToReplace.set(podId);
  }
}

export function purchasePod(podTemplate, shopIndex) {
  const $player = get(player);
  const $selectedPod = get(selectedPodToReplace);
  const $purchasedShopPods = get(purchasedShopPods);

  // Check if we can afford it, have selected a pod to replace, and pod isn't already purchased
  if ($player.xp < podTemplate.cost) return;
  if (!$selectedPod) return;
  if ($purchasedShopPods.has(shopIndex)) return;
  const maxPerShop = $player.playerClass?.maxPodsPerShop;
  if (maxPerShop && $purchasedShopPods.size >= maxPerShop) return;

  // Create new pod from template
  const newPod = clonePodTemplate(podTemplate);

  // Replace the selected pod
  player.update(p => ({
    ...p,
    xp: p.xp - podTemplate.cost,
    pods: p.pods.map(pod =>
      pod.id === $selectedPod ? newPod : pod
    ),
  }));

  // Mark this shop pod as purchased
  purchasedShopPods.update(set => {
    const newSet = new Set(set);
    newSet.add(shopIndex);
    return newSet;
  });

  selectedPodToReplace.set(null);
}

export function refreshShop() {
  const $player = get(player);
  const $refreshCount = get(shopRefreshCount);
  const refreshCost = getRefreshCost($player.playerClass, $refreshCount);

  if ($player.xp < refreshCost) return;

  const $isDailyRun = get(isDailyRun);
  const $dailyScript = get(dailyScript);

  // Daily mode: cap refreshes at 15
  const $podShopRefreshCount = get(podShopRefreshCount);
  if ($isDailyRun && $podShopRefreshCount >= 15) return;

  const encNum = get(encounterNumber);
  let generatedPods;

  const isGloryMode = $player.difficulty === 'glory' && !get(ordealActive);

  if ($isDailyRun && $dailyScript) {
    const newRefreshCount = $podShopRefreshCount + 1;
    const depthIndex = Math.min(encNum - 1, $dailyScript.podShops.length - 1);
    generatedPods = $dailyScript.podShops[depthIndex][newRefreshCount];
  } else {
    const $pc = $player.playerClass;
    generatedPods = generateShopPods(encNum, CONFIG.shopSize, Math.random, {
      upgradesTokens: $pc?.upgradesTokens ?? false,
      costMultiplier: $pc?.bonuses?.podCostMultiplier ?? 1.0,
      includeGlory: isGloryMode,
    });
  }

  player.update(p => ({ ...p, xp: p.xp - refreshCost }));
  shopRefreshCount.update(n => n + 1);
  podShopRefreshCount.update(n => n + 1);
  shopPods.set(generatedPods);
  selectedPodToReplace.set(null);
  purchasedShopPods.set(new Set());
}

export function skipShop() {
  if (get(ordealActive)) {
    beginOrdealRound();
    return;
  }
  startNextEncounter();
}

// Pod reward functions (after hard path)
export function takeRewardPod() {
  const $rewardPod = get(rewardPod);
  const $player = get(player);

  if (!$rewardPod) return;

  // Need to select a pod to replace first
  const $selectedPod = get(selectedPodToReplace);
  if (!$selectedPod) return;

  // Create new pod from template
  const newPod = clonePodTemplate($rewardPod);

  // Replace the selected pod
  player.update(p => ({
    ...p,
    pods: p.pods.map(pod =>
      pod.id === $selectedPod ? newPod : pod
    ),
  }));

  selectedPodToReplace.set(null);
  rewardPod.set(null);
  proceedToShop();
}

export function takeRewardXp() {
  const $rewardPod = get(rewardPod);

  if (!$rewardPod) return;

  // Give half the pod's cost as XP
  const xpValue = Math.floor($rewardPod.cost / 2);

  player.update(p => ({
    ...p,
    xp: p.xp + xpValue,
    totalXpEarned: p.totalXpEarned + xpValue,
  }));

  selectedPodToReplace.set(null);
  rewardPod.set(null);
  proceedToShop();
}

export function restartGame() {
  gamePhase.set(PHASES.START);
}

// --- Final Ordeal interlude actions ---

// Spend XP to reduce the mystery pool (3 XP : 1 mystery, pool cannot go below 1)
export function ordealSpendOnClue(xpToSpend) {
  const $player = get(player);
  if ($player.xp < xpToSpend || xpToSpend <= 0) return;
  const maxReduction = Math.max(0, get(ordealMysteryPool) - 1);
  const reduction = Math.min(Math.floor(xpToSpend / 3), maxReduction);
  if (reduction <= 0) return;
  const xpSpent = reduction * 3;
  player.update(p => ({ ...p, xp: p.xp - xpSpent }));
  ordealMysteryPool.update(p => Math.max(1, p - reduction));
}

// Spend XP to heal stamina. Efficiency starts at 40% of XP spent, halves each use.
export function ordealSpendOnStamina(xpToSpend) {
  const $player = get(player);
  if ($player.xp < xpToSpend || xpToSpend <= 0) return;
  const effMax = getEffectiveMaxStamina($player);
  const maxHeal = effMax - $player.stamina;
  const useCount = get(ordealHomeUseCount);
  const efficiency = 0.4 / Math.pow(2, useCount);
  const potentialHeal = Math.floor(xpToSpend * efficiency);
  const heal = Math.min(potentialHeal, maxHeal);
  if (heal <= 0) return;
  // Spend all XP if not capped; spend only what's needed if capped by max stamina
  const xpSpent = potentialHeal <= maxHeal ? xpToSpend : Math.ceil(maxHeal / efficiency);
  ordealHomeUseCount.update(n => n + 1);
  player.update(p => {
    return {
      ...p,
      xp: p.xp - xpSpent,
      stamina: Math.min(effMax, p.stamina + heal),
    };
  });
}

// Go to pod shop; after shop, beginOrdealRound() is called by skipShop()
export function ordealOpenPodShop() {
  const encNum = get(encounterNumber);
  const $isDailyRun = get(isDailyRun);
  const $dailyScript = get(dailyScript);

  let generatedPods;
  let baseIndex = 0;
  if ($isDailyRun && $dailyScript) {
    const depthIndex = Math.min(encNum - 1, $dailyScript.podShops.length - 1);
    // Use ordealRound - 1 as the base index so each interlude's pod shop shows a fresh set.
    // ordealRound is already incremented by beginOrdealRound() before the encounter, so
    // round 1 interlude → index 0, round 2 interlude → index 1, etc.
    baseIndex = Math.min(get(ordealRound) - 1, $dailyScript.podShops[depthIndex].length - 1);
    generatedPods = $dailyScript.podShops[depthIndex][baseIndex];
  } else {
    const $pc = get(player).playerClass;
    generatedPods = generateShopPods(encNum, CONFIG.shopSize, Math.random, {
      upgradesTokens: $pc?.upgradesTokens ?? false,
      costMultiplier: $pc?.bonuses?.podCostMultiplier ?? 1.0,
    });
  }

  shopPods.set(generatedPods);
  selectedPodToReplace.set(null);
  purchasedShopPods.set(new Set());
  shopRefreshCount.set(0);
  podShopRefreshCount.set(baseIndex);
  gamePhase.set(PHASES.SHOP);
}

// Convert XP to treasure (8 XP : 1 treasure), then open item shop.
// After the item shop, skipItemShop() routes back to beginOrdealRound().
export function ordealOpenItemShop(xpToConvert) {
  const $player = get(player);
  if (xpToConvert > 0 && $player.xp >= xpToConvert) {
    const treasureGain = Math.floor(xpToConvert / 8);
    const xpSpent = treasureGain * 8; // only spend what's actually converted
    player.update(p => ({
      ...p,
      xp: p.xp - xpSpent,
      treasure: p.treasure + treasureGain,
      totalTreasureEarned: p.totalTreasureEarned + treasureGain,
    }));
  }
  const encNum = get(encounterNumber);
  const $isDailyRun = get(isDailyRun);
  const $dailyScript = get(dailyScript);
  const $itemShopIndex = get(itemShopIndex);

  let items;
  if ($isDailyRun && $dailyScript) {
    const slotIndex = Math.min($itemShopIndex, $dailyScript.itemShops.length - 1);
    const scriptShop = $dailyScript.itemShops[slotIndex];
    itemShopSequenceCursor.set(0);
    itemShopRefreshCount.set(0);
    items = pickItemsFromScript(scriptShop, encNum, get(player), 0);
    itemShopIndex.update(n => n + 1);
  } else {
    items = generateItemShop(encNum, get(player));
  }

  shopItems.set(items);
  purchasedShopItems.set(new Set());
  selectedEquipmentSlot.set(null);
  gamePhase.set(PHASES.ITEM_SHOP);
}
