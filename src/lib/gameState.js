// Svelte stores for reactive game state

import { writable, derived, get } from 'svelte/store';
import { CONFIG } from './constants.js';
import { TOKEN_TYPES } from './tokens.js';
import { generateStartingPods, getTokenPool, shuffle, clonePodTemplate, generateShopPods, generateWeakPod } from './pods.js';
import { generateEncounter, generateBasicEncounter } from './encounters.js';
import { resolveCombat } from './combat.js';
import { generateItemShop } from './items.js';
import { CLASSES } from './classes.js';

// Game phases
export const PHASES = {
  START: 'start',
  CLASS_SELECT: 'classSelect',
  CHOICE: 'choice',
  DRAW: 'draw',
  COMBAT: 'combat',
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
  treasure: CONFIG.startingTreasure,
  xp: 0,
  equipment: [null, null, null],
});
export const currentEncounter = writable(null);
export const drawnTokens = writable([]);
export const tokenPool = writable([]);
export const redrawsRemaining = writable(CONFIG.redrawsPerEncounter);
export const selectiveRedrawsRemaining = writable(CONFIG.selectiveRedrawsPerEncounter);
export const selectedTokensForRedraw = writable(new Set());
export const combatResult = writable(null);
export const shopPods = writable([]);
export const selectedPodToReplace = writable(null);
export const purchasedShopPods = writable(new Set());

// Item shop state
export const shopItems = writable([]);
export const purchasedShopItems = writable(new Set());
export const selectedEquipmentSlot = writable(null); // slot index for replacement

// Encounter choice state (for even encounters >= 4)
export const choiceEncounters = writable({ hard: null, basic: null });
export const chosenPath = writable(null); // 'hard' or 'basic'
export const rewardPod = writable(null); // Pod offered as reward after hard path

// Accumulated on-draw effects for the current encounter.
// Fires each time a token freshly enters the draw (including redraws of the same token).
export const drawEffects = writable({ insight: 0, resolve: 0, treasure: 0 });

function applyOnDrawEffects(tokens) {
  for (const token of tokens) {
    const typeData = TOKEN_TYPES[token.type];
    if (!typeData.onDraw) continue;
    const effects = typeData.onDraw(token);
    drawEffects.update(d => ({
      insight: d.insight + (effects.insight || 0),
      resolve: d.resolve + (effects.resolve || 0),
      treasure: d.treasure + (effects.treasure || 0),
    }));
  }
}

// Token inspection modal state
// inspectedToken: the token being inspected
// inspectionContext: array of all drawn tokens (for synergy display), or null if not in combat
// inspectionSelectable: whether the token can be selected for redraw
export const inspectedToken = writable(null);
export const inspectionContext = writable(null);
export const inspectionSelectable = writable(false);

export function inspectToken(token, context = null, selectable = false) {
  inspectedToken.set(token);
  inspectionContext.set(context);
  inspectionSelectable.set(selectable);
}

export function closeInspection() {
  inspectedToken.set(null);
  inspectionContext.set(null);
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

// Derived stores
export const allTokens = derived(player, ($player) => {
  return $player.pods.flatMap(pod => pod.tokens);
});

export const isGameOver = derived(player, ($player) => {
  return $player.stamina <= 0;
});

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
export function selectClass(classId) {
  const chosenClass = CLASSES[classId];
  if (!chosenClass) return;

  const startingPods = generateStartingPods();
  const debug = get(isDebugMode);

  const baseStamina = CONFIG.startingStamina;
  const baseTreasure = CONFIG.startingTreasure + (chosenClass.startingTreasureBonus || 0);
  const baseXp = chosenClass.startingXpBonus || 0;

  const playerState = {
    pods: startingPods,
    maxPods: CONFIG.drawCount,
    playerClass: chosenClass,
    stamina: baseStamina,
    maxStamina: baseStamina,
    treasure: debug ? baseTreasure + 1000 : baseTreasure,
    xp: debug ? baseXp + 1000 : baseXp,
    equipment: [...chosenClass.startingEquipment],
  };

  // Set stamina to effective max (accounts for class + equipment bonuses)
  const effMax = getEffectiveMaxStamina(playerState);
  playerState.stamina = debug ? effMax + 1000 : effMax;
  if (debug) {
    playerState.maxStamina = baseStamina + 1000;
  }

  player.set(playerState);

  encounterNumber.set(0);
  combatResult.set(null);
  startNextEncounter();
}

// Check if this encounter number should offer a choice
function isChoiceEncounter(encNum) {
  return encNum >= 2 && encNum % 2 === 0;
}

export function startNextEncounter() {
  encounterNumber.update(n => n + 1);
  const encNum = get(encounterNumber);

  // Reset choice state
  chosenPath.set(null);
  rewardPod.set(null);
  combatResult.set(null);

  // Check if this is a choice encounter
  if (isChoiceEncounter(encNum)) {
    // Generate both encounter options
    const hardEncounter = generateEncounter(encNum);
    const basicEncounter = generateBasicEncounter(encNum);

    choiceEncounters.set({ hard: hardEncounter, basic: basicEncounter });
    gamePhase.set(PHASES.CHOICE);
    return;
  }

  // Normal encounter flow
  const encounter = generateEncounter(encNum);
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
  drawEffects.set({ insight: 0, resolve: 0, treasure: 0 });

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

// Player chooses the basic path
export function chooseBasicPath() {
  const $choices = get(choiceEncounters);
  chosenPath.set('basic');
  beginEncounter($choices.basic);
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
  applyOnDrawEffects(drawn);
}

export function redrawAll() {
  const remaining = get(redrawsRemaining);
  if (remaining <= 0) return;

  redrawsRemaining.update(n => n - 1);
  selectedTokensForRedraw.set(new Set());
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

  // Combine kept and new tokens; only newly drawn tokens trigger onDraw effects
  const combined = [...keptTokens, ...newTokens];
  drawnTokens.set(combined);
  applyOnDrawEffects(newTokens);

  // Clear selection and decrement redraws
  selectedTokensForRedraw.set(new Set());
  selectiveRedrawsRemaining.update(n => n - 1);
}

export function confirmDraw() {
  gamePhase.set(PHASES.COMBAT);
  executeCombat();
}

export function executeCombat() {
  const $drawnTokens = get(drawnTokens);
  const $encounter = get(currentEncounter);
  const $player = get(player);

  // Get total bonuses (equipment + class) for combat
  const totalBonuses = getTotalBonuses($player);
  const combatBonuses = {
    insight: totalBonuses.insight,
    resolve: totalBonuses.resolve,
  };

  const $drawEffects = get(drawEffects);
  const result = resolveCombat($drawnTokens, $encounter, combatBonuses, $drawEffects);

  // Award XP: 3 if insight success, 1 otherwise, plus 1 per 5 depth level
  const baseXp = (result.insightSuccess ? 3 : 1) + Math.floor(get(encounterNumber) / 5);

  // Apply encounter multipliers
  const treasureMultiplier = $encounter.treasureMultiplier || 1.0;
  const xpMultiplier = $encounter.xpMultiplier || 1.0;

  result.baseTreasure = result.treasureGained;
  result.baseXp = baseXp;
  result.treasureMultiplier = treasureMultiplier;
  result.xpMultiplier = xpMultiplier;
  result.treasureGained = Math.floor(result.treasureGained * treasureMultiplier);
  result.xpGained = Math.floor(baseXp * xpMultiplier);

  // Calculate stamina regen from equipment + class
  const staminaRegen = totalBonuses.staminaRegen;
  result.staminaRegen = staminaRegen;

  combatResult.set(result);

  // Apply results to player (including stamina regen)
  player.update(p => {
    const effMax = getEffectiveMaxStamina(p);
    const afterDamage = Math.max(0, p.stamina - result.staminaLost);
    const afterRegen = Math.min(effMax, afterDamage + staminaRegen);
    return {
      ...p,
      stamina: afterRegen,
      treasure: p.treasure + result.treasureGained,
      xp: p.xp + result.xpGained,
    };
  });

  // Check for game over
  const $playerAfter = get(player);
  if ($playerAfter.stamina <= 0) {
    gamePhase.set(PHASES.GAME_OVER);
  }
}

export function proceedFromCombat() {
  const $chosenPath = get(chosenPath);

  if ($chosenPath === 'hard') {
    // Hard path: offer pod reward
    const encNum = get(encounterNumber);
    const [pod] = generateShopPods(encNum, 1);
    rewardPod.set(pod);
    gamePhase.set(PHASES.POD_REWARD);
  } else if ($chosenPath === 'basic') {
    // Basic path: item shop
    openItemShop();
  } else {
    // Normal encounter: regular shop
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
  if ($player.xp < item.cost) return;
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
    const totalDraw = CONFIG.drawCount + newBonuses.bonusDraw + classBonusDraw;

    let newPods = [...p.pods];
    let newMaxPods = p.maxPods;

    if (totalDraw > newMaxPods) {
      const podsToAdd = totalDraw - newMaxPods;
      for (let i = 0; i < podsToAdd; i++) {
        newPods.push(generateWeakPod());
      }
      newMaxPods = totalDraw;
    }

    return {
      ...p,
      xp: p.xp - item.cost,
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
  if ($player.treasure < podTemplate.cost) return;
  if (!$selectedPod) return;
  if ($purchasedShopPods.has(shopIndex)) return;

  // Create new pod from template
  const newPod = clonePodTemplate(podTemplate);

  // Replace the selected pod
  player.update(p => ({
    ...p,
    treasure: p.treasure - podTemplate.cost,
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
  const refreshCost = 1;

  if ($player.treasure < refreshCost) return;

  const encNum = get(encounterNumber);
  const generatedPods = generateShopPods(encNum, CONFIG.shopSize);

  player.update(p => ({
    ...p,
    treasure: p.treasure - refreshCost,
  }));

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

export function takeRewardTreasure() {
  const $rewardPod = get(rewardPod);

  if (!$rewardPod) return;

  // Give half the pod's cost as treasure
  const treasureValue = Math.floor($rewardPod.cost / 2);

  player.update(p => ({
    ...p,
    treasure: p.treasure + treasureValue,
  }));

  selectedPodToReplace.set(null);
  rewardPod.set(null);
  proceedToShop();
}

export function restartGame() {
  gamePhase.set(PHASES.START);
}
