// Svelte stores for reactive game state

import { writable, derived, get } from 'svelte/store';
import { CONFIG } from './constants.js';
import { generateStartingPods, getTokenPool, shuffle, clonePodTemplate, getAvailableShopPods } from './pods.js';
import { generateEncounter } from './encounters.js';
import { resolveCombat } from './combat.js';

// Game phases
export const PHASES = {
  START: 'start',
  DRAW: 'draw',
  COMBAT: 'combat',
  SHOP: 'shop',
  GAME_OVER: 'gameOver',
};

// Core game state stores
export const gamePhase = writable(PHASES.START);
export const encounterNumber = writable(0);
export const player = writable({
  pods: [],
  health: CONFIG.startingHealth,
  maxHealth: CONFIG.startingHealth,
  treasure: CONFIG.startingTreasure,
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

// Derived stores
export const allTokens = derived(player, ($player) => {
  return $player.pods.flatMap(pod => pod.tokens);
});

export const isGameOver = derived(player, ($player) => {
  return $player.health <= 0;
});

// Game actions
export function startNewGame() {
  const startingPods = generateStartingPods();

  player.set({
    pods: startingPods,
    health: CONFIG.startingHealth,
    maxHealth: CONFIG.startingHealth,
    treasure: CONFIG.startingTreasure,
  });

  encounterNumber.set(0);
  combatResult.set(null);
  startNextEncounter();
}

export function startNextEncounter() {
  encounterNumber.update(n => n + 1);
  const encNum = get(encounterNumber);

  // Generate new encounter
  const encounter = generateEncounter(encNum);
  currentEncounter.set(encounter);

  // Reset draw state
  redrawsRemaining.set(CONFIG.redrawsPerEncounter);
  selectiveRedrawsRemaining.set(CONFIG.selectiveRedrawsPerEncounter);
  selectedTokensForRedraw.set(new Set());
  combatResult.set(null);

  // Draw tokens
  drawTokens();

  gamePhase.set(PHASES.DRAW);
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
  combatResult.set(result);

  // Apply results to player
  player.update(p => ({
    ...p,
    health: Math.max(0, p.health - result.damageTaken),
    treasure: p.treasure + result.treasureGained,
  }));

  // Check for game over
  const $player = get(player);
  if ($player.health <= 0) {
    gamePhase.set(PHASES.GAME_OVER);
  }
}

export function proceedToShop() {
  const encNum = get(encounterNumber);
  const availablePods = getAvailableShopPods(encNum);

  // Shuffle and pick shop size
  const shuffled = shuffle(availablePods);
  const shopSelection = shuffled.slice(0, CONFIG.shopSize);

  shopPods.set(shopSelection);
  selectedPodToReplace.set(null);
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

export function purchasePod(podTemplate) {
  const $player = get(player);
  const $selectedPod = get(selectedPodToReplace);

  // Check if we can afford it and have selected a pod to replace
  if ($player.treasure < podTemplate.cost) return;
  if (!$selectedPod) return;

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

  selectedPodToReplace.set(null);
}

export function skipShop() {
  startNextEncounter();
}

export function restartGame() {
  startNewGame();
}
