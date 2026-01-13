// Combat resolution logic

import { CONFIG, getEffectiveValue } from './constants.js';

// Calculate totals from drawn tokens
export function calculateDrawTotals(drawnTokens) {
  const totals = {
    attack: 0,
    defense: 0,
    treasure: 0,
  };

  for (const token of drawnTokens) {
    const value = getEffectiveValue(token);
    totals[token.type] += value;
  }

  return totals;
}

// Resolve combat and return results
export function resolveCombat(drawnTokens, encounter) {
  const totals = calculateDrawTotals(drawnTokens);

  const result = {
    totals,
    encounter,
    defeated: false,
    damageDealt: 0,
    damageTaken: 0,
    treasureGained: totals.treasure,
    attackSuccess: false,
    defenseSuccess: false,
    overkill: 0,
    defenseDeficiency: 0,
  };

  // Attack resolution
  if (totals.attack >= encounter.health) {
    result.defeated = true;
    result.attackSuccess = true;
    result.overkill = totals.attack - encounter.health;
    result.treasureGained += encounter.treasureReward;
    result.damageDealt = encounter.health;
  } else {
    result.damageDealt = totals.attack;
  }

  // Defense resolution
  if (totals.defense >= encounter.danger) {
    result.defenseSuccess = true;
  } else {
    result.defenseDeficiency = encounter.danger - totals.defense;
    // Flat penalty + scaling damage based on deficiency
    result.damageTaken = Math.floor(
      CONFIG.defenseFailFlat + (result.defenseDeficiency * CONFIG.defenseFailScale)
    );
  }

  return result;
}

// Generate combat summary text
export function getCombatSummary(result) {
  const lines = [];

  // Attack summary
  if (result.attackSuccess) {
    lines.push(`✓ Attack: ${result.totals.attack} vs ${result.encounter.health} HP - DEFEATED!`);
    if (result.overkill > 0) {
      lines.push(`  Overkill: +${result.overkill}`);
    }
  } else {
    lines.push(`✗ Attack: ${result.totals.attack} vs ${result.encounter.health} HP - Enemy survives`);
  }

  // Defense summary
  if (result.defenseSuccess) {
    lines.push(`✓ Defense: ${result.totals.defense} vs ${result.encounter.danger} Danger - No damage!`);
  } else {
    lines.push(`✗ Defense: ${result.totals.defense} vs ${result.encounter.danger} Danger - FAILED`);
    lines.push(`  Took ${result.damageTaken} damage (${CONFIG.defenseFailFlat} flat + ${result.defenseDeficiency} × ${CONFIG.defenseFailScale})`);
  }

  // Treasure summary
  lines.push(`💰 Treasure: +${result.treasureGained}`);
  if (result.defeated) {
    lines.push(`  (${result.totals.treasure} from tokens + ${result.encounter.treasureReward} bonus)`);
  }

  return lines;
}
