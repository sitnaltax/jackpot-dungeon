// Encounter resolution logic

import { TOKEN_TYPES, getTokenValue } from './tokens.js';

// Calculate totals from drawn tokens
export function calculateDrawTotals(drawnTokens, equippedItems = []) {
  const totals = {
    insight: 0,
    resolve: 0,
    xp: 0,
  };

  for (const token of drawnTokens) {
    const typeData = TOKEN_TYPES[token.type];

    // Use getValue callback if defined, otherwise default behavior
    if (typeData.getValue) {
      const contributions = typeData.getValue(token, drawnTokens, equippedItems);
      for (const [stat, value] of Object.entries(contributions)) {
        if (stat in totals) {
          totals[stat] += value;
        }
      }
    } else {
      const value = getTokenValue(token);
      totals[token.type] += value;
    }
  }

  return totals;
}

// Calculate stamina lost given a resolve deficiency and encounter.
// deficiency = encounter.trouble - resolve (must be > 0).
// insightMet: whether the player met the Insight requirement (not applicable during the Final Ordeal).
export function calculateStaminaLost(deficiency, encounter, insightMet = false) {
  const depth = encounter.level || 1;
  const trouble = encounter.trouble;
  if (trouble <= 1) return 7;
  let scalingFactor = (deficiency - 1) / (trouble - 1);
  if (insightMet) scalingFactor *= (2/3)
  return Math.round(7 + scalingFactor * (15 + depth));
}

// Resolve encounter and return results
// bonuses: optional { insight, resolve } flat bonuses from equipment
// discardEffects: optional { insight, resolve, xp } accumulated from token onDiscard callbacks
// isOrdeal: suppresses insightMet from reducing stamina loss (Final Ordeal rounds)
export function resolveEncounter(drawnTokens, encounter, bonuses = {}, discardEffects = {}, equippedItems = [], isOrdeal = false) {
  const totals = calculateDrawTotals(drawnTokens, equippedItems);

  // Apply flat bonuses from equipment
  if (bonuses.insight) totals.insight += bonuses.insight;
  if (bonuses.resolve) totals.resolve += bonuses.resolve;

  // Apply accumulated on-draw effects (flat, not rank-scaled, persist through redraws)
  if (discardEffects.insight) totals.insight += discardEffects.insight;
  if (discardEffects.resolve) totals.resolve += discardEffects.resolve;
  if (discardEffects.xp) totals.xp += discardEffects.xp;

  const result = {
    totals,
    equipmentBonuses: { insight: bonuses.insight || 0, resolve: bonuses.resolve || 0 },
    discardEffects: { insight: discardEffects.insight || 0, resolve: discardEffects.resolve || 0, xp: discardEffects.xp || 0 },
    encounter,
    revealed: false,
    staminaLost: 0,
    xpGained: totals.xp,
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
    // XP reward is half of the mystery value
    result.xpGained += Math.floor(encounter.mystery / 2);
  }

  // Resolve resolution - can you withstand the trouble?
  if (totals.resolve >= encounter.trouble) {
    result.resolveSuccess = true;
  } else {
    result.resolveDeficiency = encounter.trouble - totals.resolve;
    result.staminaLost = calculateStaminaLost(result.resolveDeficiency, encounter, !isOrdeal && result.insightSuccess);
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
export function getEncounterSummary(result) {
  const lines = [];

  const eqInsight = result.equipmentBonuses?.insight || 0;
  const eqResolve = result.equipmentBonuses?.resolve || 0;
  const deInsight = result.discardEffects?.insight || 0;
  const deResolve = result.discardEffects?.resolve || 0;
  const deXp = result.discardEffects?.xp || 0;

  const insightSuffix = bonusSuffix(result.totals.insight, eqInsight, deInsight);
  const resolveSuffix = bonusSuffix(result.totals.resolve, eqResolve, deResolve);

  // Insight summary
  if (result.insightSuccess) {
    lines.push(`✓ Insight: ${result.totals.insight}${insightSuffix} vs ${result.encounter.mystery} Mystery - Bonus Treasure found!`);
  } else {
    const failureBonus = result.insightFailureBonus ?? {};
    const bonusParts = [];
    if (failureBonus.treasure) bonusParts.push(`+$${failureBonus.treasure}`);
    if (failureBonus.xp) bonusParts.push(`+${failureBonus.xp} XP`);
    const bonusText = bonusParts.length ? ` (${bonusParts.join(', ')})` : '';
    lines.push(`✗ Insight: ${result.totals.insight}${insightSuffix} vs ${result.encounter.mystery} Mystery - No bonus${bonusText}`);
  }

  // Resolve summary
  if (result.resolveSuccess) {
    lines.push(`✓ Resolve: ${result.totals.resolve}${resolveSuffix} vs ${result.encounter.trouble} Trouble - Steady!`);
  } else {
    lines.push(`✗ Resolve: ${result.totals.resolve}${resolveSuffix} vs ${result.encounter.trouble} Trouble - Stamina lost`);
    lines.push(`  Lost ${result.staminaLost} stamina (${result.resolveDeficiency} short of ${result.encounter.trouble} Trouble)`);
  }

  // XP summary
  lines.push(`⭐ XP: +${result.xpGained}`);
  if (result.revealed) {
    const parts = [`${result.totals.xp} from tokens`, `${Math.floor(result.encounter.mystery / 2)} from mystery reveal`];
    lines.push(`  (${parts.join(' + ')})`);
  }

  return lines;
}
