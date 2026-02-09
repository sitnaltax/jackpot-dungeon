// Svelte stores for reactive game state

import { writable, derived, get } from 'svelte/store';
import { CONFIG, STARTING_EQUIPMENT } from './constants.js';
import { generateStartingPods, getTokenPool, shuffle, clonePodTemplate, generateShopPods } from './pods.js';
import { generateEncounter, generateBasicEncounter } from './encounters.js';
import { resolveCombat } from './combat.js';

// Game phases
export const PHASES = {
  START: 'start',
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
export const player = writable({
  pods: [],
  stamina: CONFIG.startingStamina,
  maxStamina: CONFIG.startingStamina,
  treasure: CONFIG.startingTreasure,
  xp: 0,
  equipment: [...STARTING_EQUIPMENT],
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

// Encounter choice state (for even encounters >= 4)
export const choiceEncounters = writable({ hard: null, basic: null });
export const chosenPath = writable(null); // 'hard' or 'basic'
export const rewardPod = writable(null); // Pod offered as reward after hard path

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

// Helper to calculate total redraws from equipment
function getEquipmentBonuses(equipment) {
  const bonuses = {
    redraws: 0,
    selectiveRedraws: 0,
  };

  for (const item of equipment) {
    if (item && item.bonuses) {
      if (item.bonuses.redraws) {
        bonuses.redraws += item.bonuses.redraws;
      }
      if (item.bonuses.selectiveRedraws) {
        bonuses.selectiveRedraws += item.bonuses.selectiveRedraws;
      }
    }
  }

  return bonuses;
}

// Derived stores
export const allTokens = derived(player, ($player) => {
  return $player.pods.flatMap(pod => pod.tokens);
});

export const isGameOver = derived(player, ($player) => {
  return $player.stamina <= 0;
});

// Game actions
export function startNewGame() {
  const startingPods = generateStartingPods();

  player.set({
    pods: startingPods,
    stamina: CONFIG.startingStamina,
    maxStamina: CONFIG.startingStamina,
    treasure: CONFIG.startingTreasure,
    xp: 0,
    equipment: [...STARTING_EQUIPMENT],
  });

  encounterNumber.set(0);
  combatResult.set(null);
  startNextEncounter();
}

// Check if this encounter number should offer a choice
function isChoiceEncounter(encNum) {
  return encNum >= 4 && encNum % 2 === 0;
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

  // Calculate redraws from equipment and encounter bonuses
  const $player = get(player);
  const equipmentBonuses = getEquipmentBonuses($player.equipment);
  const redrawBonus = encounter.redrawBonus || 0;
  const selectiveBonus = encounter.selectiveRedrawBonus || 0;

  // Reset draw state with equipment and encounter bonuses
  redrawsRemaining.set(Math.max(0, CONFIG.redrawsPerEncounter + equipmentBonuses.redraws + redrawBonus));
  selectiveRedrawsRemaining.set(Math.max(0, CONFIG.selectiveRedrawsPerEncounter + equipmentBonuses.selectiveRedraws + selectiveBonus));
  selectedTokensForRedraw.set(new Set());

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

  // Draw the configured number of tokens
  const drawn = pool.slice(0, CONFIG.drawCount);
  drawnTokens.set(drawn);
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

  // Combine kept and new tokens
  drawnTokens.set([...keptTokens, ...newTokens]);

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

  const result = resolveCombat($drawnTokens, $encounter);

  // Award XP: 3 if insight success, 1 otherwise
  const baseXp = result.insightSuccess ? 3 : 1;

  // Apply encounter multipliers
  const treasureMultiplier = $encounter.treasureMultiplier || 1.0;
  const xpMultiplier = $encounter.xpMultiplier || 1.0;

  result.baseTreasure = result.treasureGained;
  result.baseXp = baseXp;
  result.treasureMultiplier = treasureMultiplier;
  result.xpMultiplier = xpMultiplier;
  result.treasureGained = Math.floor(result.treasureGained * treasureMultiplier);
  result.xpGained = Math.floor(baseXp * xpMultiplier);

  combatResult.set(result);

  // Apply results to player
  player.update(p => ({
    ...p,
    stamina: Math.max(0, p.stamina - result.staminaLost),
    treasure: p.treasure + result.treasureGained,
    xp: p.xp + result.xpGained,
  }));

  // Check for game over
  const $player = get(player);
  if ($player.stamina <= 0) {
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
    gamePhase.set(PHASES.ITEM_SHOP);
  } else {
    // Normal encounter: regular shop
    proceedToShop();
  }
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

// Item shop functions (after basic path)
export function skipItemShop() {
  proceedToShop();
}

export function restartGame() {
  startNewGame();
}
