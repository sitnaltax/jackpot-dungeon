// Encounter resolution logic

import { CONFIG, getEffectiveValue } from './constants.js';

// Calculate totals from drawn tokens
export function calculateDrawTotals(drawnTokens) {
  const totals = {
    insight: 0,
    composure: 0,
    treasure: 0,
  };

  for (const token of drawnTokens) {
    const value = getEffectiveValue(token);
    totals[token.type] += value;
  }

  return totals;
}

// Resolve encounter and return results
export function resolveCombat(drawnTokens, encounter) {
  const totals = calculateDrawTotals(drawnTokens);

  const result = {
    totals,
    encounter,
    revealed: false,
    staminaLost: 0,
    treasureGained: totals.treasure,
    insightSuccess: false,
    composureSuccess: false,
    insightSurplus: 0,
    composureDeficiency: 0,
  };

  // Insight resolution - can you perceive the fey's nature?
  if (totals.insight >= encounter.mystery) {
    result.revealed = true;
    result.insightSuccess = true;
    result.insightSurplus = totals.insight - encounter.mystery;
    result.treasureGained += encounter.treasureReward;
  }

  // Composure resolution - can you withstand the bewilderment?
  if (totals.composure >= encounter.bewilderment) {
    result.composureSuccess = true;
  } else {
    result.composureDeficiency = encounter.bewilderment - totals.composure;
    // Flat penalty + scaling stamina loss based on deficiency
    result.staminaLost = Math.floor(
      CONFIG.composureFailFlat + (result.composureDeficiency * CONFIG.composureFailScale)
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
    if (result.insightSurplus > 0) {
      lines.push(`  Surplus: +${result.insightSurplus}`);
    }
  } else {
    lines.push(`✗ Insight: ${result.totals.insight} vs ${result.encounter.mystery} Mystery - Hidden`);
  }

  // Composure summary
  if (result.composureSuccess) {
    lines.push(`✓ Composure: ${result.totals.composure} vs ${result.encounter.bewilderment} Bewilderment - Steady!`);
  } else {
    lines.push(`✗ Composure: ${result.totals.composure} vs ${result.encounter.bewilderment} Bewilderment - SHAKEN`);
    lines.push(`  Lost ${result.staminaLost} stamina (${CONFIG.composureFailFlat} flat + ${result.composureDeficiency} × ${CONFIG.composureFailScale})`);
  }

  // Treasure summary
  lines.push(`💰 Treasure: +${result.treasureGained}`);
  if (result.revealed) {
    lines.push(`  (${result.totals.treasure} from tokens + ${result.encounter.treasureReward} bonus)`);
  }

  return lines;
}
