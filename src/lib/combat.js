// Encounter resolution logic

import { CONFIG, TOKEN_TYPES, getEffectiveValue } from './constants.js';

// Calculate totals from drawn tokens
export function calculateDrawTotals(drawnTokens) {
  const totals = {
    insight: 0,
    resolve: 0,
    treasure: 0,
  };

  for (const token of drawnTokens) {
    const typeData = TOKEN_TYPES[token.type];

    // Use getValue callback if defined, otherwise default behavior
    if (typeData.getValue) {
      const contributions = typeData.getValue(token, drawnTokens);
      for (const [stat, value] of Object.entries(contributions)) {
        if (stat in totals) {
          totals[stat] += value;
        }
      }
    } else {
      const value = getEffectiveValue(token);
      totals[token.type] += value;
    }
  }

  return totals;
}

// Resolve encounter and return results
// bonuses: optional { insight, resolve } flat bonuses from equipment
export function resolveCombat(drawnTokens, encounter, bonuses = {}) {
  const totals = calculateDrawTotals(drawnTokens);

  // Apply flat bonuses from equipment
  if (bonuses.insight) totals.insight += bonuses.insight;
  if (bonuses.resolve) totals.resolve += bonuses.resolve;

  const result = {
    totals,
    encounter,
    revealed: false,
    staminaLost: 0,
    treasureGained: totals.treasure,
    insightSuccess: false,
    resolveSuccess: false,
    insightSurplus: 0,
    resolveDeficiency: 0,
  };

  // Insight resolution - can you perceive the fey's nature?
  if (totals.insight >= encounter.mystery) {
    result.revealed = true;
    result.insightSuccess = true;
    result.insightSurplus = totals.insight - encounter.mystery;
    // Treasure reward is half of the mystery value
    result.treasureGained += Math.floor(encounter.mystery / 2);
  }

  // Resolve resolution - can you withstand the trouble?
  if (totals.resolve >= encounter.trouble) {
    result.resolveSuccess = true;
  } else {
    result.resolveDeficiency = encounter.trouble - totals.resolve;
    // Flat penalty + scaling stamina loss based on deficiency
    result.staminaLost = Math.floor(
      CONFIG.resolveFailFlat + (result.resolveDeficiency * CONFIG.resolveFailScale)
    );
  }

  return result;
}

// Generate encounter summary text
export function getCombatSummary(result) {
  const lines = [];

  // Insight summary
  if (result.insightSuccess) {
    lines.push(`✓ Insight: ${result.totals.insight} vs ${result.encounter.mystery} Mystery - REVEALED!`);
  } else {
    lines.push(`✗ Insight: ${result.totals.insight} vs ${result.encounter.mystery} Mystery - Hidden`);
  }

  // Resolve summary
  if (result.resolveSuccess) {
    lines.push(`✓ Resolve: ${result.totals.resolve} vs ${result.encounter.trouble} Trouble - Steady!`);
  } else {
    lines.push(`✗ Resolve: ${result.totals.resolve} vs ${result.encounter.trouble} Trouble - SHAKEN`);
    lines.push(`  Lost ${result.staminaLost} stamina (${CONFIG.resolveFailFlat} flat + ${result.resolveDeficiency} × ${CONFIG.resolveFailScale})`);
  }

  // Treasure summary
  lines.push(`$ Treasure: +${result.treasureGained}`);
  if (result.revealed) {
    const mysteryBonus = Math.floor(result.encounter.mystery / 2);
    lines.push(`  (${result.totals.treasure} from tokens + ${mysteryBonus} from mystery reveal)`);
  }

  return lines;
}
