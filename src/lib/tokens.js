// Token type definitions
// - minDepth: minimum encounter number for this token to appear in shops (default: 0)
// - weight: relative probability weight for random selection (default: 1)
// - tags: optional array of tags for synergy groupings (e.g., ['Celestial'])
// - getValue: optional callback(token, allDrawnTokens, equippedItems) returning { stat: value } contributions
// - noSynergy: if true, getValue is called with an empty draw context (token has a fixed value, not context-dependent)
// - onDiscard: optional callback(token) returning { stat: value } applied once each time the token
//           freshly enters the draw (persists through redraws, even if the token is discarded)
// - image: optional URL string to use as the token's card art background.
//          If omitted, getTokenImage() picks one based on the token's first tag.

import { RANKS } from './constants.js';
import musicalImage from '../assets/musical.jpg';
import botanicalImage from '../assets/botanical.jpg';
import celestialImage from '../assets/celestial.jpg';
import chthonicImage from '../assets/chthonic.jpg';
import botanicalMusicalImage from '../assets/botanical-musical.jpg';
import celestialMusicalImage from '../assets/celestial-musical.jpg';
import genericImage from '../assets/generic.jpg';


// Helper to count tokens with a specific tag in a draw
export function countTokensWithTag(tag, allDrawnTokens) {
  return allDrawnTokens.filter(t => TOKEN_TYPES[t.type].tags?.includes(tag)).length;
}

// Get the base value of a token (base value * rank multiplier)
// Used for display and shop pricing - does not account for synergies
export function getTokenValue(token) {
  const typeData = TOKEN_TYPES[token.type];
  const rankData = RANKS[token.rank] || RANKS.bronze;
  return Math.floor(typeData.baseValue * rankData.multiplier);
}

export const TOKEN_TYPES = {
  // --- Core ---
  insight: {
    name: 'Insight', icon: '👁️', color: '#e74c3c', baseValue: 5, minDepth: 0, weight: 1,
    noSynergy: true,
    getValue: (token) => ({ insight: Math.floor(5 * (RANKS[token.rank] || RANKS.bronze).multiplier) }),
  },
  resolve: {
    name: 'Resolve', icon: '🛡️', color: '#3498db', baseValue: 5, minDepth: 0, weight: 1,
    noSynergy: true,
    getValue: (token) => ({ resolve: Math.floor(5 * (RANKS[token.rank] || RANKS.bronze).multiplier) }),
  },
  xp: {
    name: 'Experience', icon: '⭐', color: '#f1c40f', baseValue: 5, minDepth: 0, weight: 1,
    noSynergy: true,
    getValue: (token) => ({ xp: Math.floor(5 * (RANKS[token.rank] || RANKS.bronze).multiplier) }),
  },

  // --- Musical series ---
  harmony: {
    name: 'Harmony',
    icon: '🎵',
    color: '#3498db',
    baseValue: 4,
    minDepth: 2,
    weight: 1,
    tags: ['Musical'],
    getValue: (token, allDrawnTokens, equippedItems = []) => {
      const typeData = TOKEN_TYPES[token.type];
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const hasOtherMusical = allDrawnTokens.some(t => t.type !== token.type && TOKEN_TYPES[t.type].tags?.includes('Musical'))
        || equippedItems.some(item => item?.tags?.includes('Musical'));
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
    getValue: (token, allDrawnTokens, equippedItems = []) => {
      const typeData = TOKEN_TYPES[token.type];
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const hasOtherMusical = allDrawnTokens.some(t => t.type !== token.type && TOKEN_TYPES[t.type].tags?.includes('Musical'))
        || equippedItems.some(item => item?.tags?.includes('Musical'));
      const bonus = hasOtherMusical ? 2 : 0;
      return { insight: Math.floor((typeData.baseValue + bonus) * rankMultiplier) };
    },
  },
  chord: {
    name: 'Chord',
    icon: '🎹',
    color: '#9b59b6',
    baseValue: 1,
    minDepth: 5,
    weight: 0.4,
    tags: ['Musical'],
    borderEffect: 'linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000)',
    getValue: (token, allDrawnTokens, equippedItems = []) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const musicalItemBonus = equippedItems.some(item => item?.tags?.includes('Musical')) ? 1 : 0;
      const uniqueOtherMusical = new Set(
        allDrawnTokens
          .filter(t => t.type !== token.type && TOKEN_TYPES[t.type].tags?.includes('Musical'))
          .map(t => t.type)
      ).size + musicalItemBonus;
      const value = uniqueOtherMusical >= 2 ? 5 : 1;
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
    minDepth: 10,
    weight: 0.3,
    tags: ['Musical'],
    borderEffect: 'linear-gradient(135deg, #e74c3c, #3498db)',
    getValue: (token, allDrawnTokens, equippedItems = []) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const musicalItemBonus = equippedItems.some(item => item?.tags?.includes('Musical')) ? 1 : 0;
      const uniqueOtherMusical = new Set(
        allDrawnTokens
          .filter(t => t.type !== token.type && TOKEN_TYPES[t.type].tags?.includes('Musical'))
          .map(t => t.type)
      ).size + musicalItemBonus;
      const value = uniqueOtherMusical >= 3 ? 6 : 2;
      return {
        insight: Math.floor(value * rankMultiplier),
        resolve: Math.floor(value * rankMultiplier),
      };
    },
  },

  // --- Musical dual-tag tokens ---
  lyra: {
    name: 'Lyra',
    icon: '🎼',
    color: '#e74c3c',
    baseValue: 5,
    minDepth: 7,
    weight: 0.2,
    tags: ['Musical', 'Celestial'],
    noSynergy: true,
    image: celestialMusicalImage,
    getValue: (token) => ({ insight: Math.floor(5 * (RANKS[token.rank] || RANKS.bronze).multiplier) }),
  },
  bellflower: {
    name: 'Bellflower',
    icon: '🔔',
    color: '#3498db',
    baseValue: 5,
    minDepth: 7,
    weight: 0.2,
    tags: ['Musical', 'Botanical'],
    noSynergy: true,
    image: botanicalMusicalImage,
    getValue: (token) => ({ resolve: Math.floor(5 * (RANKS[token.rank] || RANKS.bronze).multiplier) }),
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
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const celestialCount = countTokensWithTag('Celestial', allDrawnTokens);
      return { insight: Math.floor((3 + Math.min(4, celestialCount)) * rankMultiplier) };
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
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const celestialCount = countTokensWithTag('Celestial', allDrawnTokens);
      return { resolve: Math.floor((2 + Math.min(4, celestialCount)) * rankMultiplier) };
    },
  },
  sagittarius: {
    name: 'Sagittarius',
    icon: '♐',
    color: '#f1c40f',
    baseValue: 3,
    minDepth: 3,
    weight: 0.7,
    tags: ['Celestial'],
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const celestialCount = countTokensWithTag('Celestial', allDrawnTokens);
      return { xp: Math.floor((3 + Math.min(4, celestialCount)) * rankMultiplier) };
    },
  },
  virgo: {
    name: 'Virgo',
    icon: '♍',
    color: '#e74c3c',
    borderEffect: 'linear-gradient(135deg, #e74c3c, #f1c40f)',
    baseValue: 2,
    minDepth: 6,
    weight: 0.4,
    tags: ['Celestial'],
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const celestialCount = countTokensWithTag('Celestial', allDrawnTokens);
      const value = Math.floor((2 + Math.min(3, celestialCount)) * rankMultiplier);
      return { insight: value, xp: value };
    },
  },
  aries: {
    name: 'Aries',
    icon: '♈',
    color: '#3498db',
    borderEffect: 'linear-gradient(135deg, #3498db, #f1c40f)',
    baseValue: 1,
    minDepth: 6,
    weight: 0.2,
    tags: ['Celestial'],
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const celestialCount = countTokensWithTag('Celestial', allDrawnTokens);
      const value = Math.floor((1 + Math.min(3, celestialCount)) * rankMultiplier);
      return { resolve: value, xp: value };
    },
  },
  libra: {
    name: 'Libra',
    icon: '♎',
    color: '#9b59b6',
    baseValue: 0,
    minDepth: 8,
    weight: 0.2,
    tags: ['Celestial'],
    borderEffect: 'linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000)',
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const otherCelestials = countTokensWithTag('Celestial', allDrawnTokens) - 1;
      const bonus = Math.min(5, Math.max(0, otherCelestials));
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
    synergyPenalty: true,
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const otherCelestials = allDrawnTokens.filter(t =>
        t.id !== token.id && TOKEN_TYPES[t.type].tags?.includes('Celestial')
      ).length;
      const value = otherCelestials > 0 ? 0 : 9;
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
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const botanicalCount = countTokensWithTag('Botanical', allDrawnTokens);
      return { resolve: Math.floor((3 + Math.min(4, botanicalCount)) * rankMultiplier) };
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
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const botanicalCount = countTokensWithTag('Botanical', allDrawnTokens);
      return { insight: Math.floor((2 + Math.min(4, botanicalCount)) * rankMultiplier) };
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
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const botanicalCount = countTokensWithTag('Botanical', allDrawnTokens);
      return { xp: Math.floor((3 + Math.min(4, botanicalCount)) * rankMultiplier) };
    },
  },
  willow: {
    name: 'Willow',
    icon: '🌾',
    color: '#3498db',
    borderEffect: 'linear-gradient(135deg, #3498db, #f1c40f)',
    baseValue: 2,
    minDepth: 6,
    weight: 0.4,
    tags: ['Botanical'],
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const botanicalCount = countTokensWithTag('Botanical', allDrawnTokens);
      const value = Math.floor((2 + Math.min(3, botanicalCount)) * rankMultiplier);
      return { resolve: value, xp: value };
    },
  },
  orchid: {
    name: 'Orchid',
    icon: '🌺',
    color: '#e74c3c',
    borderEffect: 'linear-gradient(135deg, #e74c3c, #f1c40f)',
    baseValue: 1,
    minDepth: 6,
    weight: 0.2,
    tags: ['Botanical'],
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const botanicalCount = countTokensWithTag('Botanical', allDrawnTokens);
      const value = Math.floor((1 + Math.min(3, botanicalCount)) * rankMultiplier);
      return { insight: value, xp: value };
    },
  },
  fern: {
    name: 'Fern',
    icon: '🌿',
    color: '#9b59b6',
    baseValue: 0,
    minDepth: 8,
    weight: 0.2,
    tags: ['Botanical'],
    borderEffect: 'linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000)',
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const otherBotanicals = countTokensWithTag('Botanical', allDrawnTokens) - 1;
      const bonus = Math.min(5, Math.max(0, otherBotanicals));
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
    synergyPenalty: true,
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const otherBotanicals = allDrawnTokens.filter(t =>
        t.id !== token.id && TOKEN_TYPES[t.type].tags?.includes('Botanical')
      ).length;
      const value = otherBotanicals > 0 ? 0 : 9;
      return { resolve: Math.floor(value * rankMultiplier) };
    },
  },

  // --- Chthonic series ---
  // Flat base power of 3 (no synergy between Chthonic tokens).
  // Each token grants a bonus to its stat when discarded via redraw, scaled by rank.
  obsidian: {
    name: 'Obsidian',
    icon: '🌑',
    color: '#e74c3c',
    baseValue: 3,
    minDepth: 10,
    weight: 0.5,
    tags: ['Chthonic'],
    noSynergy: true,
    onDiscard: (token) => ({ insight: Math.floor(3 * (RANKS[token.rank] || RANKS.bronze).multiplier) }),
    getValue: (token) => ({ insight: Math.floor(3 * (RANKS[token.rank] || RANKS.bronze).multiplier) }),
  },
  granite: {
    name: 'Granite',
    icon: '🪨',
    color: '#3498db',
    baseValue: 3,
    minDepth: 10,
    weight: 0.5,
    tags: ['Chthonic'],
    noSynergy: true,
    onDiscard: (token) => ({ resolve: Math.floor(3 * (RANKS[token.rank] || RANKS.bronze).multiplier) }),
    getValue: (token) => ({ resolve: Math.floor(3 * (RANKS[token.rank] || RANKS.bronze).multiplier) }),
  },
  starRuby: {
    name: 'Star Ruby',
    icon: '💎',
    color: '#f1c40f',
    baseValue: 3,
    minDepth: 10,
    weight: 0.5,
    tags: ['Chthonic'],
    noSynergy: true,
    onDiscard: (token) => ({ xp: Math.floor(3 * (RANKS[token.rank] || RANKS.bronze).multiplier) }),
    getValue: (token) => ({ xp: Math.floor(3 * (RANKS[token.rank] || RANKS.bronze).multiplier) }),
  },

  // --- Mindstorm group ---
  // High-value tokens with the Mindstorm tag.
  // Each Mindstorm token beyond the first reduces the effective base of all Mindstorm tokens by 1.
  brainstorm: {
    name: 'Brainstorm',
    icon: '🧠',
    color: '#e74c3c',
    borderEffect: 'linear-gradient(135deg, #e74c3c, #f1c40f)',
    baseValue: 5,
    minDepth: 13,
    weight: 0.5,
    tags: ['Mindstorm'],
    synergyPenalty: true,
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const penalty = Math.max(0, countTokensWithTag('Mindstorm', allDrawnTokens) - 1);
      const effectiveBase = Math.max(0, 5 - penalty);
      return { insight: Math.floor(effectiveBase * rankMultiplier), xp: Math.floor(effectiveBase * rankMultiplier) };
    },
  },
  meditation: {
    name: 'Meditation',
    icon: '🧘',
    color: '#3498db',
    borderEffect: 'linear-gradient(135deg, #3498db, #f1c40f)',
    baseValue: 5,
    minDepth: 13,
    weight: 0.5,
    tags: ['Mindstorm'],
    synergyPenalty: true,
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const penalty = Math.max(0, countTokensWithTag('Mindstorm', allDrawnTokens) - 1);
      const effectiveBase = Math.max(0, 5 - penalty);
      return { resolve: Math.floor(effectiveBase * rankMultiplier), xp: Math.floor(effectiveBase * rankMultiplier) };
    },
  },
  revelation: {
    name: 'Revelation',
    icon: '💫',
    color: '#f1c40f',
    baseValue: 9,
    minDepth: 13,
    weight: 0.5,
    tags: ['Mindstorm'],
    synergyPenalty: true,
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const penalty = Math.max(0, countTokensWithTag('Mindstorm', allDrawnTokens) - 1);
      const effectiveBase = Math.max(0, 9 - penalty);
      return { xp: Math.floor(effectiveBase * rankMultiplier) };
    },
  },
  astromancy: {
    name: 'Astromancy',
    icon: '🤩',
    color: '#e74c3c',
    baseValue: 6,
    minDepth: 13,
    weight: 0.5,
    tags: ['Celestial', 'Mindstorm'],
    synergyPenalty: true,
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const penalty = Math.max(0, countTokensWithTag('Mindstorm', allDrawnTokens) - 1);
      const effectiveBase = Math.max(0, 6 - penalty);
      return { insight: Math.floor(effectiveBase * rankMultiplier) };
    },
  },
  xylomancy: {
    name: 'Xylomancy',
    icon: '🌲',
    color: '#3498db',
    baseValue: 6,
    minDepth: 13,
    weight: 0.5,
    tags: ['Botanical', 'Mindstorm'],
    synergyPenalty: true,
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const penalty = Math.max(0, countTokensWithTag('Mindstorm', allDrawnTokens) - 1);
      const effectiveBase = Math.max(0, 6 - penalty);
      return { resolve: Math.floor(effectiveBase * rankMultiplier) };
    },
  },

  // --- Wild ---
  wild: {
    name: 'Wild',
    icon: '🃏',
    color: '#9b59b6',
    baseValue: 4,
    minDepth: 16,
    weight: 0.1,
    tags: ['Musical', 'Celestial', 'Botanical', 'Chthonic', 'Mindstorm'],
    noSynergy: true,
    borderEffect: 'linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000)',
    image: genericImage,
    getValue: (token) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const value = Math.floor(4 * rankMultiplier);
      return { insight: value, resolve: value, xp: value };
    },
  },
};

// --- Token card art ---
// Each token type can also set `image` directly to override.




const TAG_IMAGES = {
  Musical: musicalImage,
  Celestial: celestialImage,
  Botanical: botanicalImage,
  Chthonic: chthonicImage,
};

const DEFAULT_IMAGE = genericImage


// Returns an image URL for the token's card art background.
// Checks typeData.image first, then picks by first matching tag, then returns a default.
export function getTokenImage(typeData) {
  if (typeData.image) return typeData.image;
  for (const tag of (typeData.tags ?? [])) {
    if (TAG_IMAGES[tag]) return TAG_IMAGES[tag];
  }
  return DEFAULT_IMAGE;
}
