// Token type definitions
// - minDepth: minimum encounter number for this token to appear in shops (default: 0)
// - weight: relative probability weight for random selection (default: 1)
// - tags: optional array of tags for synergy groupings (e.g., ['Celestial'])
// - getValue: optional callback(token, allDrawnTokens) returning { stat: value } contributions
// - onDraw: optional callback(token) returning { stat: value } applied once each time the token
//           freshly enters the draw (persists through redraws, even if the token is discarded)

import { RANKS } from './constants.js';

// Helper to count tokens with a specific tag in a draw
export function countTokensWithTag(tag, allDrawnTokens) {
  return allDrawnTokens.filter(t => TOKEN_TYPES[t.type].tags?.includes(tag)).length;
}

// Get the base value of a token (base value * rank multiplier)
// Used for display and shop pricing - does not account for synergies
export function getTokenValue(token) {
  const typeData = TOKEN_TYPES[token.type];
  const rankData = RANKS[token.rank] || RANKS.basic;
  return Math.floor(typeData.baseValue * rankData.multiplier);
}

export const TOKEN_TYPES = {
  // --- Core ---
  insight:  { name: 'Insight',  icon: '👁️', color: '#e74c3c', baseValue: 5, minDepth: 0, weight: 1 },
  resolve:  { name: 'Resolve',  icon: '🛡️', color: '#3498db', baseValue: 5, minDepth: 0, weight: 1 },
  xp: { name: 'Experience', icon: '⭐', color: '#f1c40f', baseValue: 5, minDepth: 0, weight: 1 },

  // --- Musical series ---
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
        xp: Math.floor(value * rankMultiplier),
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

  // --- Celestial series ---
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
      return { xp: Math.floor((3 + celestialCount) * rankMultiplier) };
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
        xp: Math.floor(bonus * rankMultiplier),
      };
    },
  },
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

  // --- Botanical series ---
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
      return { xp: Math.floor((3 + botanicalCount) * rankMultiplier) };
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
        xp: Math.floor(bonus * rankMultiplier),
      };
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

  // --- Chthonic series ---
  // Start at 0 power but gain +2 per Chthonic token drawn (including self).
  // Each token also grants a flat +1 to its stat immediately upon entering the draw,
  // even if later discarded — this fires again if the same token is redrawn.
  obsidian: {
    name: 'Obsidian',
    icon: '🌑',
    color: '#e74c3c',
    baseValue: 0,
    minDepth: 10,
    weight: 0.5,
    tags: ['Chthonic'],
    onDraw: () => ({ insight: 1 }),
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.basic).multiplier;
      const chthonicCount = countTokensWithTag('Chthonic', allDrawnTokens);
      return { insight: Math.floor(2 * chthonicCount * rankMultiplier) };
    },
  },
  granite: {
    name: 'Granite',
    icon: '🪨',
    color: '#3498db',
    baseValue: 0,
    minDepth: 10,
    weight: 0.5,
    tags: ['Chthonic'],
    onDraw: () => ({ resolve: 1 }),
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.basic).multiplier;
      const chthonicCount = countTokensWithTag('Chthonic', allDrawnTokens);
      return { resolve: Math.floor(2 * chthonicCount * rankMultiplier) };
    },
  },
  geode: {
    name: 'Geode',
    icon: '💎',
    color: '#f1c40f',
    baseValue: 0,
    minDepth: 10,
    weight: 0.5,
    tags: ['Chthonic'],
    onDraw: () => ({ xp: 1 }),
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.basic).multiplier;
      const chthonicCount = countTokensWithTag('Chthonic', allDrawnTokens);
      return { xp: Math.floor(2 * chthonicCount * rankMultiplier) };
    },
  },

  // --- "Mind" pair. ---
  // Untagged dual-stat tokens: each contributes to one combat stat + xp
  // Efficient but not synergistic, to take up a little space
  brainstorm: {
    name: 'Brainstorm',
    icon: '🧠',
    color: '#e74c3c',
    borderEffect: 'linear-gradient(135deg, #e74c3c, #f1c40f)',
    baseValue: 4,
    minDepth: 13,
    weight: 1,
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.basic).multiplier;
      const value = Math.floor(4 * rankMultiplier);
      return { insight: value, xp: value };
    },
  },
  meditation: {
    name: 'Meditation',
    icon: '🧘',
    color: '#3498db',
    borderEffect: 'linear-gradient(135deg, #3498db, #f1c40f)',
    baseValue: 4,
    minDepth: 13,
    weight: 1,
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.basic).multiplier;
      const value = Math.floor(4 * rankMultiplier);
      return { resolve: value, xp: value };
    },
  },

  // --- Wild ---
  wild: {
    name: 'Wild',
    icon: '🃏',
    color: '#9b59b6',
    baseValue: 0,
    minDepth: 16,
    weight: 0.2,
    tags: ['Musical', 'Celestial', 'Botanical', 'Chthonic'],
    borderEffect: 'linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000)',
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.basic).multiplier;
      const tags = ['Musical', 'Celestial', 'Botanical', 'Chthonic'];
      let tagCount = 0;
      for (const tag of tags) {
        if (allDrawnTokens.some(t => t.type !== 'wild' && TOKEN_TYPES[t.type].tags?.includes(tag))) {
          tagCount++;
        }
      }
      const bonus = Math.max(0, tagCount - 1);
      const value = Math.floor(3 * bonus * rankMultiplier);
      return { insight: value, resolve: value, xp: value };
    },
  },
};
