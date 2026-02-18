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

  // Redraw settings (base values - equipment adds to these)
  redrawsPerEncounter: 0,           // Number of full redraws allowed
  selectiveRedrawsPerEncounter: 0,  // Number of selective redraws (pick any tokens)

  // Shop settings
  shopSize: 4,             // Number of pods offered in shop
};

// Rank system - multipliers applied to base token values
export const RANKS = {
  inferior: { name: 'Inferior', multiplier: 0.8, cost: 0, color: '#555' },
  basic: { name: 'Basic', multiplier: 1, cost: 0, color: '#888' },
  bronze: { name: 'Bronze', multiplier: 1.25, cost: 2, color: '#cd7f32' },
  silver: { name: 'Silver', multiplier: 1.5, cost: 4, color: '#c0c0c0' },
  gold: { name: 'Gold', multiplier: 1.75, cost: 6, color: '#ffd700' },
  platinum: { name: 'Platinum', multiplier: 2, cost: 8, color: '#e2d2df' },
  diamond: { name: 'Diamond', multiplier: 2.5, cost: 10, color: '#83e8ff' },
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

export const TOKEN_BASE_COST = 2;

// Token types with base values
// - minDepth: minimum encounter number for this token to appear in shops (default: 0)
// - weight: relative probability weight for random selection (default: 1)
// - tags: optional array of tags for synergy groupings (e.g., ['Celestial'])
// - getValue: optional callback(token, allDrawnTokens) returning { stat: value } contributions
export const TOKEN_TYPES = {
  insight: { name: 'Insight', icon: '👁️', color: '#e74c3c', baseValue: 5, minDepth: 0, weight: 1 },
  resolve: { name: 'Resolve', icon: '🛡️', color: '#3498db', baseValue: 5, minDepth: 0, weight: 1 },
  treasure: { name: 'Treasure', icon: '💰', color: '#f1c40f', baseValue: 5, minDepth: 0, weight: 1 },
  harmony: {
    name: 'Harmony',
    icon: '🎵',
    color: '#3498db',
    baseValue: 4,
    minDepth: 2,
    weight: 1,
    tags: ['Musical'],
    getValue: (token, allDrawnTokens) => {
      const typeData = TOKEN_TYPES[token.type];
      const rankMultiplier = (RANKS[token.rank] || RANKS.basic).multiplier;
      const hasOtherMusical = allDrawnTokens.some(t => t.type !== token.type && TOKEN_TYPES[t.type].tags?.includes('Musical'));
      const bonus = hasOtherMusical ? 2 : 0;
      return { resolve: Math.floor((typeData.baseValue + bonus) * rankMultiplier) };
    },
  },
  melody: {
    name: 'Melody',
    icon: '🎶',
    color: '#e74c3c',
    baseValue: 4,
    minDepth: 2,
    weight: 1,
    tags: ['Musical'],
    getValue: (token, allDrawnTokens) => {
      const typeData = TOKEN_TYPES[token.type];
      const rankMultiplier = (RANKS[token.rank] || RANKS.basic).multiplier;
      const hasOtherMusical = allDrawnTokens.some(t => t.type !== token.type && TOKEN_TYPES[t.type].tags?.includes('Musical'));
      const bonus = hasOtherMusical ? 2 : 0;
      return { insight: Math.floor((typeData.baseValue + bonus) * rankMultiplier) };
    },
  },
  chord: {
    name: 'Chord',
    icon: '🎹',
    color: '#9b59b6',
    baseValue: 1,
    minDepth: 7,
    weight: 0.6,
    tags: ['Musical'],
    borderEffect: 'linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000)',
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.basic).multiplier;
      const uniqueOtherMusical = new Set(
        allDrawnTokens
          .filter(t => t.type !== token.type && TOKEN_TYPES[t.type].tags?.includes('Musical'))
          .map(t => t.type)
      ).size;
      const value = uniqueOtherMusical >= 2 ? 3 : 1;
      return {
        insight: Math.floor(value * rankMultiplier),
        resolve: Math.floor(value * rankMultiplier),
        treasure: Math.floor(value * rankMultiplier),
      };
    },
  },
  discord: {
    name: 'Discord',
    icon: '🎸',
    color: '#9b59b6',
    baseValue: 2,
    minDepth: 11,
    weight: 0.4,
    tags: ['Musical'],
    borderEffect: 'linear-gradient(135deg, #e74c3c, #3498db)',
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.basic).multiplier;
      const uniqueOtherMusical = new Set(
        allDrawnTokens
          .filter(t => t.type !== token.type && TOKEN_TYPES[t.type].tags?.includes('Musical'))
          .map(t => t.type)
      ).size;
      const value = uniqueOtherMusical >= 3 ? 5 : 2;
      return {
        insight: Math.floor(value * rankMultiplier),
        resolve: Math.floor(value * rankMultiplier),
      };
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
      return { treasure: Math.floor((3 + celestialCount) * rankMultiplier) };
    },
  },
  libra: {
    name: 'Libra',
    icon: '♎',
    color: '#9b59b6',
    baseValue: 0,
    minDepth: 5,
    weight: 0.5,
    tags: ['Celestial'],
    borderEffect: 'linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000)',
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.basic).multiplier;
      const otherCelestials = countTokensWithTag('Celestial', allDrawnTokens) - 1;
      const bonus = Math.max(0, otherCelestials);
      return {
        insight: Math.floor(bonus * rankMultiplier),
        resolve: Math.floor(bonus * rankMultiplier),
        treasure: Math.floor(bonus * rankMultiplier),
      };
    },
  },
  // Botanical series - mirrors Celestial but with resolve preference
  oak: {
    name: 'Oak',
    icon: '🌳',
    color: '#3498db',
    baseValue: 3,
    minDepth: 3,
    weight: 0.7,
    tags: ['Botanical'],
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.basic).multiplier;
      const botanicalCount = countTokensWithTag('Botanical', allDrawnTokens);
      return { resolve: Math.floor((3 + botanicalCount) * rankMultiplier) };
    },
  },
  lotus: {
    name: 'Lotus',
    icon: '🪷',
    color: '#e74c3c',
    baseValue: 2,
    minDepth: 3,
    weight: 0.7,
    tags: ['Botanical'],
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.basic).multiplier;
      const botanicalCount = countTokensWithTag('Botanical', allDrawnTokens);
      return { insight: Math.floor((2 + botanicalCount) * rankMultiplier) };
    },
  },
  clover: {
    name: 'Clover',
    icon: '🍀',
    color: '#f1c40f',
    baseValue: 3,
    minDepth: 3,
    weight: 0.7,
    tags: ['Botanical'],
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.basic).multiplier;
      const botanicalCount = countTokensWithTag('Botanical', allDrawnTokens);
      return { treasure: Math.floor((3 + botanicalCount) * rankMultiplier) };
    },
  },
  fern: {
    name: 'Fern',
    icon: '🌿',
    color: '#9b59b6',
    baseValue: 0,
    minDepth: 5,
    weight: 0.5,
    tags: ['Botanical'],
    borderEffect: 'linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000)',
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.basic).multiplier;
      const otherBotanicals = countTokensWithTag('Botanical', allDrawnTokens) - 1;
      const bonus = Math.max(0, otherBotanicals);
      return {
        insight: Math.floor(bonus * rankMultiplier),
        resolve: Math.floor(bonus * rankMultiplier),
        treasure: Math.floor(bonus * rankMultiplier),
      };
    },
  },
  // Loner tokens - powerful alone, but conflict with other synergy tokens
  pluto: {
    name: 'Pluto',
    icon: '🪐',
    color: '#e74c3c',
    baseValue: 8,
    minDepth: 12,
    weight: 0.3,
    tags: ['Celestial'],
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.basic).multiplier;
      const otherCelestials = allDrawnTokens.filter(t =>
        t.id !== token.id && TOKEN_TYPES[t.type].tags?.includes('Celestial')
      ).length;
      const value = otherCelestials > 0 ? 0 : 8;
      return { insight: Math.floor(value * rankMultiplier) };
    },
  },
  hemlock: {
    name: 'Hemlock',
    icon: '☠️',
    color: '#3498db',
    baseValue: 8,
    minDepth: 12,
    weight: 0.3,
    tags: ['Botanical'],
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.basic).multiplier;
      const otherBotanicals = allDrawnTokens.filter(t =>
        t.id !== token.id && TOKEN_TYPES[t.type].tags?.includes('Botanical')
      ).length;
      const value = otherBotanicals > 0 ? 0 : 8;
      return { resolve: Math.floor(value * rankMultiplier) };
    },
  },
};

// Alias for backwards compatibility
export const getEffectiveValue = getTokenValue;

// Equipment system
export const EQUIPMENT_SLOTS = 3;
