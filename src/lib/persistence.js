// State persistence to localStorage.
// All game state lives in Svelte stores (in-memory), so it evaporates when mobile browsers
// discard the tab. This module saves to localStorage after each meaningful change and
// restores on page load.

import { get } from 'svelte/store';
import { CLASSES } from './classes.js';
import { reseedIds } from './pods.js';

const SAVE_KEY = 'jackpot-dungeon-save';
// Bump this when the save data shape changes incompatibly so old saves are discarded.
const SAVE_VERSION = 3;

// Phases that have nothing worth restoring
const TRANSIENT_PHASES = ['start', 'classSelect'];

export function saveGame(stores) {
  const phase = get(stores.gamePhase);
  if (TRANSIENT_PHASES.includes(phase)) return;

  const $player = get(stores.player);
  // Exclude playerClass (contains functions); store its ID instead
  const { playerClass, ...playerRest } = $player;

  try {
    const data = {
      version: SAVE_VERSION,
      gamePhase: phase,
      encounterNumber: get(stores.encounterNumber),
      isDebugMode: get(stores.isDebugMode),
      player: { ...playerRest, playerClassId: playerClass?.id ?? null },
      currentEncounter: get(stores.currentEncounter),
      drawnTokens: get(stores.drawnTokens),
      tokenPool: get(stores.tokenPool),
      redrawsRemaining: get(stores.redrawsRemaining),
      selectiveRedrawsRemaining: get(stores.selectiveRedrawsRemaining),
      encounterResult: get(stores.encounterResult),
      shopPods: get(stores.shopPods),
      selectedPodToReplace: get(stores.selectedPodToReplace),
      purchasedShopPods: [...get(stores.purchasedShopPods)],
      shopItems: get(stores.shopItems),
      purchasedShopItems: [...get(stores.purchasedShopItems)],
      selectedEquipmentSlot: get(stores.selectedEquipmentSlot),
      choiceEncounters: get(stores.choiceEncounters),
      chosenPath: get(stores.chosenPath),
      rewardPod: get(stores.rewardPod),
      drawEffects: get(stores.drawEffects),
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be full or unavailable; fail silently
  }
}

export function loadSavedGame(stores) {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;

    const data = JSON.parse(raw);
    if (data.version !== SAVE_VERSION) {
      clearSave();
      return false;
    }

    // Restore playerClass reference from ID (brings back functions like shopItemFilter)
    const { playerClassId, ...playerRest } = data.player;
    const playerClass = playerClassId ? (CLASSES[playerClassId] ?? null) : null;

    stores.gamePhase.set(data.gamePhase);
    stores.encounterNumber.set(data.encounterNumber);
    stores.isDebugMode.set(data.isDebugMode ?? false);
    stores.player.set({ ...playerRest, playerClass });
    stores.currentEncounter.set(data.currentEncounter);
    stores.drawnTokens.set(data.drawnTokens ?? []);
    stores.tokenPool.set(data.tokenPool ?? []);
    stores.redrawsRemaining.set(data.redrawsRemaining ?? 0);
    stores.selectiveRedrawsRemaining.set(data.selectiveRedrawsRemaining ?? 0);
    stores.encounterResult.set(data.encounterResult ?? null);
    stores.shopPods.set(data.shopPods ?? []);
    stores.selectedPodToReplace.set(data.selectedPodToReplace ?? null);
    stores.purchasedShopPods.set(new Set(data.purchasedShopPods ?? []));
    stores.shopItems.set(data.shopItems ?? []);
    stores.purchasedShopItems.set(new Set(data.purchasedShopItems ?? []));
    stores.selectedEquipmentSlot.set(data.selectedEquipmentSlot ?? null);
    stores.choiceEncounters.set(data.choiceEncounters ?? { hard: null, basic: null });
    stores.chosenPath.set(data.chosenPath ?? null);
    stores.rewardPod.set(data.rewardPod ?? null);
    stores.drawEffects.set(data.drawEffects ?? { insight: 0, resolve: 0, xp: 0 });

    // Advance ID counters so newly-created pods/tokens don't collide with restored ones.
    reseedIds(
      data.player?.pods ?? [],
      [...(data.drawnTokens ?? []), ...(data.tokenPool ?? [])],
    );

    return true;
  } catch {
    clearSave();
    return false;
  }
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}

// Subscribe to all meaningful stores and save (debounced) on any change.
// Returns a cleanup function to unsubscribe.
export function initAutoSave(stores) {
  let timer = null;

  function scheduleSave() {
    clearTimeout(timer);
    timer = setTimeout(() => saveGame(stores), 500);
  }

  const unsubs = [
    stores.gamePhase,
    stores.encounterNumber,
    stores.isDebugMode,
    stores.player,
    stores.currentEncounter,
    stores.drawnTokens,
    stores.tokenPool,
    stores.redrawsRemaining,
    stores.selectiveRedrawsRemaining,
    stores.encounterResult,
    stores.shopPods,
    stores.purchasedShopPods,
    stores.shopItems,
    stores.purchasedShopItems,
    stores.choiceEncounters,
    stores.chosenPath,
    stores.rewardPod,
    stores.drawEffects,
  ].map(store => store.subscribe(scheduleSave));

  return () => {
    unsubs.forEach(u => u());
    clearTimeout(timer);
  };
}
