// Svelte stores for reactive game state

import { writable, get } from 'svelte/store';
import { CONFIG } from './constants.js';
import { TOKEN_TYPES } from './tokens.js';
import { generateStartingPods, getTokenPool, shuffle, clonePodTemplate, generateShopPods, generateWeakPod } from './pods.js';
import { generateEncounter } from './encounters.js';
import { resolveEncounter } from './encounter.js';
import { generateItemShop } from './items.js';
import { CLASSES } from './classes.js';
import { clearSave } from './persistence.js';

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
  GAME_OVER: 'gameOver',
};

// Core game state stores
export const gamePhase = writable(PHASES.START);
export const encounterNumber = writable(0);
export const isDebugMode = writable(false);
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

// Game actions — start screen transitions to class select
export function startNewGame() {
  isDebugMode.set(false);
  gamePhase.set(PHASES.CLASS_SELECT);
}

export function startDebugGame() {
  isDebugMode.set(true);
  gamePhase.set(PHASES.CLASS_SELECT);
}

// Player selects a class and the game begins
export function selectClass(classId, difficultyId = 'normal') {
  clearSave();
  const chosenClass = CLASSES[classId];
  if (!chosenClass) return;

  const startingPods = generateStartingPods();
  const debug = get(isDebugMode);

  const baseStamina = CONFIG.startingStamina;
  const baseXp = CONFIG.startingXp + (chosenClass.startingXpBonus || 0);
  const baseTreasure = chosenClass.startingTreasureBonus || 0;

  const startingBonusDraw = (chosenClass.bonuses?.bonusDraw || 0) +
    chosenClass.startingEquipment.reduce((sum, e) => sum + (e?.bonuses?.bonusDraw || 0), 0);

  const wizard = difficultyId === 'wizard';

  const playerState = {
    pods: startingPods,
    maxPods: CONFIG.drawCount + startingBonusDraw * CONFIG.podsPerBonusDraw,
    playerClass: chosenClass,
    difficulty: difficultyId,
    stamina: baseStamina,
    maxStamina: baseStamina,
    xp: debug || wizard ? baseXp + 99999 : baseXp,
    treasure: debug || wizard ? baseTreasure + 99999 : baseTreasure,
    totalXpEarned: baseXp,
    totalTreasureEarned: baseTreasure,
    equipment: [...chosenClass.startingEquipment],
  };

  // Set stamina to effective max (accounts for class + equipment bonuses)
  const effMax = getEffectiveMaxStamina(playerState);
  const staminaOffset = chosenClass.startingStaminaOffset || 0;
  playerState.stamina = debug || wizard ? effMax + 99999 : effMax + staminaOffset;
  if (debug || wizard) {
    playerState.maxStamina = baseStamina + 99999;
  }

  player.set(playerState);

  encounterNumber.set(0);
  encounterResult.set(null);
  startNextEncounter();
}

// Odd floors offer a choice (hard challenge or skip)
function isChoiceEncounter(encNum) {
  return encNum >= 3 && encNum % 2 === 1;
}

export function startNextEncounter() {
  encounterNumber.update(n => n + 1);
  const encNum = get(encounterNumber);

  // Reset choice state
  chosenPath.set(null);
  rewardPod.set(null);
  encounterResult.set(null);

  const difficulty = get(player).difficulty;

  // Odd floors: choice between hard challenge or skip
  if (isChoiceEncounter(encNum)) {
    const hardEncounter = generateEncounter(encNum + 2, difficulty);
    const nextEncounter = generateEncounter(encNum, difficulty);
    choiceEncounters.set({ hard: hardEncounter, next: nextEncounter });
    gamePhase.set(PHASES.CHOICE);
    return;
  }

  // Even floors: normal encounter
  const encounter = generateEncounter(encNum, difficulty);
  beginEncounter(encounter);
}

// Begin an encounter (after choice or for non-choice encounters)
function beginEncounter(encounter) {
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
  encounterNumber.update(n => n + 1);
  chosenPath.set(null);
  rewardPod.set(null);
  encounterResult.set(null);
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

  // Award Treasure: 3 if insight success, 1 otherwise.
  // Depth thresholds add bonus treasure on insight success: +1 at depth 6, +2 at depth 12.
  const depth = get(encounterNumber);
  const insightDepthBonus = result.insightSuccess
    ? (depth >= 12 ? 2 : depth >= 6 ? 1 : 0)
    : 0;
  const baseTreasure = (result.insightSuccess ? 3 : 1) + insightDepthBonus;

  // Apply encounter multipliers
  const xpMultiplier = $encounter.xpMultiplier || 1.0;
  const treasureMultiplier = $encounter.treasureMultiplier || 1.0;
  const classXpMultiplier = $player.playerClass?.bonuses?.encounterXpMultiplier ?? 1.0;

  // Class callbacks for encounter outcomes
  const insightFailureBonus = !result.insightSuccess
    ? ($player.playerClass?.onInsightFailure?.(result) ?? {})
    : {};

  result.baseXp = result.xpGained;
  result.baseTreasure = baseTreasure;
  result.insightDepthBonus = insightDepthBonus;
  result.insightFailureBonus = insightFailureBonus;
  result.xpMultiplier = xpMultiplier * classXpMultiplier;
  result.treasureMultiplier = treasureMultiplier;
  result.xpGained = Math.floor(result.xpGained * xpMultiplier * classXpMultiplier) + (insightFailureBonus.xp ?? 0);
  result.treasureGained = Math.floor(baseTreasure * treasureMultiplier) + (insightFailureBonus.treasure ?? 0);

  // Calculate stamina regen from equipment + class
  const staminaRegen = totalBonuses.staminaRegen;
  result.staminaRegen = staminaRegen;

  encounterResult.set(result);

  // Apply results to player (including stamina regen)
  player.update(p => {
    const effMax = getEffectiveMaxStamina(p);
    const afterDamage = Math.max(0, p.stamina - result.staminaLost);
    const afterRegen = Math.min(effMax, afterDamage + staminaRegen);
    return {
      ...p,
      stamina: afterRegen,
      xp: p.xp + result.xpGained,
      treasure: p.treasure + result.treasureGained,
      totalXpEarned: p.totalXpEarned + result.xpGained,
      totalTreasureEarned: p.totalTreasureEarned + result.treasureGained,
    };
  });

  // Check for game over
  const $playerAfter = get(player);
  if ($playerAfter.stamina <= 0) {
    gamePhase.set(PHASES.GAME_OVER);
  }
}

export function proceedFromEncounter() {
  const $chosenPath = get(chosenPath);

  const encNum = get(encounterNumber);

  if ($chosenPath === 'hard') {
    // Hard path (odd floor): offer pod reward, then pod shop
    const [pod] = generateShopPods(encNum, 1);
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
  const items = generateItemShop(encNum, $player);
  shopItems.set(items);
  purchasedShopItems.set(new Set());
  selectedEquipmentSlot.set(null);
  gamePhase.set(PHASES.ITEM_SHOP);
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

  selectedEquipmentSlot.set(null);
}

export function skipItemShop() {
  proceedToShop();
}

export function proceedToShop() {
  const encNum = get(encounterNumber);

  // Generate fresh shop pods based on current encounter
  const generatedPods = generateShopPods(encNum, CONFIG.shopSize);

  shopPods.set(generatedPods);
  selectedPodToReplace.set(null);
  purchasedShopPods.set(new Set());
  shopRefreshCount.set(0);
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

  const encNum = get(encounterNumber);
  const generatedPods = generateShopPods(encNum, CONFIG.shopSize);

  player.update(p => ({ ...p, xp: p.xp - refreshCost }));
  shopRefreshCount.update(n => n + 1);
  shopPods.set(generatedPods);
  selectedPodToReplace.set(null);
  purchasedShopPods.set(new Set());
}

export function skipShop() {
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
