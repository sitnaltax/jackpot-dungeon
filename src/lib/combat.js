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
// drawEffects: optional { insight, resolve, treasure } accumulated from token onDraw callbacks
export function resolveCombat(drawnTokens, encounter, bonuses = {}, drawEffects = {}) {
  const totals = calculateDrawTotals(drawnTokens);

  // Apply flat bonuses from equipment
  if (bonuses.insight) totals.insight += bonuses.insight;
  if (bonuses.resolve) totals.resolve += bonuses.resolve;

  // Apply accumulated on-draw effects (flat, not rank-scaled, persist through redraws)
  if (drawEffects.insight) totals.insight += drawEffects.insight;
  if (drawEffects.resolve) totals.resolve += drawEffects.resolve;
  if (drawEffects.treasure) totals.treasure += drawEffects.treasure;

  const result = {
    totals,
    equipmentBonuses: { insight: bonuses.insight || 0, resolve: bonuses.resolve || 0 },
    drawEffects: { insight: drawEffects.insight || 0, resolve: drawEffects.resolve || 0, treasure: drawEffects.treasure || 0 },
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

// Build a bonus breakdown suffix like " (8 tokens + 2 equip + 1 draw)"
function bonusSuffix(total, eqBonus, drawBonus) {
  if (eqBonus === 0 && drawBonus === 0) return '';
  const tokenPart = total - eqBonus - drawBonus;
  const parts = [`${tokenPart} tokens`];
  if (eqBonus > 0) parts.push(`${eqBonus} equip`);
  if (drawBonus > 0) parts.push(`${drawBonus} draw`);
  return ` (${parts.join(' + ')})`;
}

// Generate encounter summary text
export function getCombatSummary(result) {
  const lines = [];

  const eqInsight = result.equipmentBonuses?.insight || 0;
  const eqResolve = result.equipmentBonuses?.resolve || 0;
  const deInsight = result.drawEffects?.insight || 0;
  const deResolve = result.drawEffects?.resolve || 0;
  const deTreasure = result.drawEffects?.treasure || 0;

  const insightSuffix = bonusSuffix(result.totals.insight, eqInsight, deInsight);
  const resolveSuffix = bonusSuffix(result.totals.resolve, eqResolve, deResolve);

  // Insight summary
  if (result.insightSuccess) {
    lines.push(`✓ Insight: ${result.totals.insight}${insightSuffix} vs ${result.encounter.mystery} Mystery - REVEALED!`);
  } else {
    lines.push(`✗ Insight: ${result.totals.insight}${insightSuffix} vs ${result.encounter.mystery} Mystery - Hidden`);
  }

  // Resolve summary
  if (result.resolveSuccess) {
    lines.push(`✓ Resolve: ${result.totals.resolve}${resolveSuffix} vs ${result.encounter.trouble} Trouble - Steady!`);
  } else {
    lines.push(`✗ Resolve: ${result.totals.resolve}${resolveSuffix} vs ${result.encounter.trouble} Trouble - SHAKEN`);
    lines.push(`  Lost ${result.staminaLost} stamina (${CONFIG.resolveFailFlat} flat + ${result.resolveDeficiency} × ${CONFIG.resolveFailScale})`);
  }

  // Treasure summary
  lines.push(`$ Treasure: +${result.treasureGained}`);
  const tokenTreasure = result.totals.treasure - deTreasure;
  if (result.revealed || deTreasure > 0) {
    const parts = [`${tokenTreasure} tokens`];
    if (deTreasure > 0) parts.push(`${deTreasure} draw`);
    if (result.revealed) parts.push(`${Math.floor(result.encounter.mystery / 2)} mystery reveal`);
    lines.push(`  (${parts.join(' + ')})`);
  }

  return lines;
}
