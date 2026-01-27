// Game configuration - easily adjustable for balancing
export const CONFIG = {
  // Pod/Token settings
  podCount: 6,
  tokensPerPod: 3,
  drawCount: 6,

  // Player settings
  startingStamina: 20,
  startingTreasure: 10,

  // Combat settings
  resolveFailFlat: 5,      // Flat stamina loss for failing resolve check
  resolveFailScale: 1.5,   // Additional stamina loss per point of deficiency

  // Redraw settings
  redrawsPerEncounter: 1,           // Number of full redraws allowed
  selectiveRedrawsPerEncounter: 1,  // Number of selective redraws (pick any tokens)

  // Shop settings
  shopSize: 4,             // Number of pods offered in shop
};

// Rank system - multipliers applied to base token values
export const RANKS = {
  inferior: { name: 'Inferior', multiplier: 0.8, color: '#555' },
  basic: { name: 'Basic', multiplier: 1, color: '#888' },
  bronze: { name: 'Bronze', multiplier: 1.25, color: '#cd7f32' },
  silver: { name: 'Silver', multiplier: 1.5, color: '#c0c0c0' },
  gold: { name: 'Gold', multiplier: 1.75, color: '#ffd700' },
  platinum: { name: 'Platinum', multiplier: 2, color: '#e5e4e2' },
  diamond: { name: 'Diamond', multiplier: 2.5, color: '#b9f2ff' },
};

// Note: inferior is excluded - it only appears in starting pods
export const RANK_ORDER = ['basic', 'bronze', 'silver', 'gold', 'platinum', 'diamond'];

// Get the base value of a token (base value * rank multiplier)
// Used for display and shop pricing - does not account for synergies
export function getTokenValue(token) {
  const typeData = TOKEN_TYPES[token.type];
  const rankData = RANKS[token.rank] || RANKS.basic;
  return Math.floor(typeData.baseValue * rankData.multiplier);
}

// Helper to count tokens with a specific tag in a draw
export function countTokensWithTag(tag, allDrawnTokens) {
  return allDrawnTokens.filter(t => TOKEN_TYPES[t.type].tags?.includes(tag)).length;
}

// Token types with base values
// - minDepth: minimum encounter number for this token to appear in shops (default: 0)
// - weight: relative probability weight for random selection (default: 1)
// - tags: optional array of tags for synergy groupings (e.g., ['Celestial'])
// - getValue: optional callback(token, allDrawnTokens) returning { stat: value } contributions
export const TOKEN_TYPES = {
  insight: { name: 'Insight', icon: '👁️', color: '#e74c3c', baseValue: 5, minDepth: 0, weight: 1 },
  resolve: { name: 'Resolve', icon: '💭', color: '#3498db', baseValue: 5, minDepth: 0, weight: 1 },
  treasure: { name: 'Treasure', icon: '💰', color: '#f1c40f', baseValue: 5, minDepth: 0, weight: 1 },
  lock: {
    name: 'Lock',
    icon: '🔒',
    color: '#3498db',
    baseValue: 4,
    minDepth: 2,
    weight: 1,
    getValue: (token, allDrawnTokens) => {
      const typeData = TOKEN_TYPES[token.type];
      const rankMultiplier = (RANKS[token.rank] || RANKS.basic).multiplier;
      const hasKey = allDrawnTokens.some(t => t.type === 'key');
      const bonus = hasKey ? 2 : 0;
      return { resolve: Math.floor((typeData.baseValue + bonus) * rankMultiplier) };
    },
  },
  key: {
    name: 'Key',
    icon: '🔑',
    color: '#e74c3c',
    baseValue: 4,
    minDepth: 2,
    weight: 1,
    getValue: (token, allDrawnTokens) => {
      const typeData = TOKEN_TYPES[token.type];
      const rankMultiplier = (RANKS[token.rank] || RANKS.basic).multiplier;
      const hasLock = allDrawnTokens.some(t => t.type === 'lock');
      const bonus = hasLock ? 2 : 0;
      return { insight: Math.floor((typeData.baseValue + bonus) * rankMultiplier) };
    },
  },
  scorpio: {
    name: 'Scorpio',
    icon: '♏',
    color: '#e74c3c',
    baseValue: 3,
    minDepth: 3,
    weight: 0.7,
    tags: ['Celestial'],
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.basic).multiplier;
      const celestialCount = countTokensWithTag('Celestial', allDrawnTokens);
      return { insight: Math.floor((3 + celestialCount) * rankMultiplier) };
    },
  },
  capricorn: {
    name: 'Capricorn',
    icon: '♑',
    color: '#3498db',
    baseValue: 2,
    minDepth: 3,
    weight: 0.7,
    tags: ['Celestial'],
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.basic).multiplier;
      const celestialCount = countTokensWithTag('Celestial', allDrawnTokens);
      return { resolve: Math.floor((2 + celestialCount) * rankMultiplier) };
    },
  },
  taurus: {
    name: 'Taurus',
    icon: '♉',
    color: '#f1c40f',
    baseValue: 3,
    minDepth: 3,
    weight: 0.7,
    tags: ['Celestial'],
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.basic).multiplier;
      const celestialCount = countTokensWithTag('Celestial', allDrawnTokens);
      return {
        treasure: Math.floor((3 + celestialCount) * rankMultiplier),
        insight: Math.floor(1 * rankMultiplier),
      };
    },
  },
};

// Alias for backwards compatibility
export const getEffectiveValue = getTokenValue;
