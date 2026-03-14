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
    minDepth: 7,
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
    minDepth: 11,
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
      const value = otherBotanicals > 0 ? 0 : 8;
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

  // --- "Mind" pair. ---
  // Untagged dual-stat tokens: each contributes to one encounter stat + xp
  // Efficient but not synergistic, to take up a little space
  brainstorm: {
    name: 'Brainstorm',
    icon: '🧠',
    color: '#e74c3c',
    borderEffect: 'linear-gradient(135deg, #e74c3c, #f1c40f)',
    baseValue: 5,
    minDepth: 13,
    weight: 1,
    noSynergy: true,
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const value = Math.floor(5 * rankMultiplier);
      return { insight: value, xp: value };
    },
  },
  meditation: {
    name: 'Meditation',
    icon: '🧘',
    color: '#3498db',
    borderEffect: 'linear-gradient(135deg, #3498db, #f1c40f)',
    baseValue: 5,
    minDepth: 13,
    weight: 1,
    noSynergy: true,
    getValue: (token, allDrawnTokens) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const value = Math.floor(5 * rankMultiplier);
      return { resolve: value, xp: value };
    },
  },

  // --- Wild ---
  wild: {
    name: 'Wild',
    icon: '🃏',
    color: '#9b59b6',
    baseValue: 4,
    minDepth: 6,
    weight: 0.1,
    tags: ['Musical', 'Celestial', 'Botanical', 'Chthonic'],
    borderEffect: 'linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000)',
    getValue: (token) => {
      const rankMultiplier = (RANKS[token.rank] || RANKS.bronze).multiplier;
      const value = Math.floor(4 * rankMultiplier);
      return { insight: value, resolve: value, xp: value };
    },
  },
};

// --- Token card art ---
// Simple placeholder SVGs, one per tag group. Replace with real art URLs later.
// Each token type can also set `image` directly to override.

function svgUri(svg) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const TAG_IMAGES = {
  Musical: svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 75">` +
    `<rect width="60" height="75" fill="rgb(20,5,35)"/>` +
    `<ellipse cx="18" cy="62" rx="8" ry="5" fill="rgb(140,60,180)" opacity="0.8"/>` +
    `<line x1="26" y1="62" x2="26" y2="30" stroke="rgb(160,80,200)" stroke-width="2" opacity="0.8"/>` +
    `<line x1="26" y1="30" x2="44" y2="24" stroke="rgb(160,80,200)" stroke-width="2" opacity="0.8"/>` +
    `<ellipse cx="36" cy="57" rx="7" ry="4" fill="rgb(170,90,210)" opacity="0.7"/>` +
    `<line x1="43" y1="57" x2="43" y2="24" stroke="rgb(180,100,220)" stroke-width="2" opacity="0.7"/>` +
    `<path d="M4 22 Q18 13 32 22 Q46 31 56 20" stroke="rgb(110,40,150)" stroke-width="1.5" fill="none" opacity="0.5"/>` +
    `<path d="M4 16 Q18 7 32 16 Q46 25 56 14" stroke="rgb(90,25,130)" stroke-width="1" fill="none" opacity="0.35"/>` +
    `</svg>`
  ),
  Celestial: svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 75">` +
    `<rect width="60" height="75" fill="rgb(3,3,20)"/>` +
    `<circle cx="12" cy="12" r="1.5" fill="white" opacity="0.9"/>` +
    `<circle cx="28" cy="6" r="1" fill="white" opacity="0.7"/>` +
    `<circle cx="50" cy="15" r="2" fill="white" opacity="0.85"/>` +
    `<circle cx="55" cy="7" r="1" fill="white" opacity="0.55"/>` +
    `<circle cx="7" cy="40" r="1" fill="white" opacity="0.5"/>` +
    `<circle cx="48" cy="46" r="1.5" fill="white" opacity="0.7"/>` +
    `<circle cx="34" cy="60" r="1" fill="white" opacity="0.5"/>` +
    `<circle cx="6" cy="66" r="1" fill="white" opacity="0.4"/>` +
    `<circle cx="44" cy="68" r="1" fill="white" opacity="0.45"/>` +
    `<circle cx="21" cy="28" r="1" fill="white" opacity="0.5"/>` +
    `<path d="M38 34 A14 14 0 1 1 38 62 A10 10 0 1 0 38 34" fill="rgb(220,210,120)" opacity="0.5"/>` +
    `</svg>`
  ),
  Botanical: svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 75">` +
    `<rect width="60" height="75" fill="rgb(4,18,4)"/>` +
    `<line x1="30" y1="72" x2="30" y2="16" stroke="rgb(50,110,50)" stroke-width="2.5" opacity="0.8"/>` +
    `<path d="M30 45 Q50 30 58 20 Q44 28 30 45" fill="rgb(40,105,40)" opacity="0.8"/>` +
    `<path d="M30 32 Q10 20 2 11 Q18 20 30 32" fill="rgb(55,125,55)" opacity="0.7"/>` +
    `<path d="M30 58 Q52 50 60 42 Q44 50 30 58" fill="rgb(30,88,30)" opacity="0.65"/>` +
    `<path d="M30 22 Q14 13 7 7 Q20 14 30 22" fill="rgb(60,135,60)" opacity="0.55"/>` +
    `</svg>`
  ),
  Chthonic: svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 75">` +
    `<rect width="60" height="75" fill="rgb(12,6,3)"/>` +
    `<polygon points="30,8 42,30 30,26 18,30" fill="rgb(115,68,26)" opacity="0.75"/>` +
    `<polygon points="16,38 30,26 26,56 9,60" fill="rgb(88,52,20)" opacity="0.65"/>` +
    `<polygon points="44,38 30,26 34,56 51,60" fill="rgb(98,57,23)" opacity="0.65"/>` +
    `<polygon points="26,56 34,56 30,72" fill="rgb(78,46,18)" opacity="0.8"/>` +
    `<line x1="30" y1="8" x2="30" y2="72" stroke="rgb(165,105,45)" stroke-width="1" opacity="0.28"/>` +
    `</svg>`
  ),
};

const DEFAULT_IMAGE = svgUri(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 75">` +
  `<rect width="60" height="75" fill="rgb(12,12,25)"/>` +
  `<polygon points="30,8 52,37 30,67 8,37" stroke="rgb(72,72,115)" stroke-width="1.5" fill="none" opacity="0.6"/>` +
  `<polygon points="30,18 46,37 30,57 14,37" stroke="rgb(62,62,100)" stroke-width="1" fill="none" opacity="0.45"/>` +
  `<polygon points="30,28 40,37 30,47 20,37" stroke="rgb(72,72,115)" stroke-width="1" fill="none" opacity="0.3"/>` +
  `</svg>`
);

// Returns an image URL for the token's card art background.
// Checks typeData.image first, then picks by first matching tag, then returns a default.
export function getTokenImage(typeData) {
  if (typeData.image) return typeData.image;
  for (const tag of (typeData.tags ?? [])) {
    if (TAG_IMAGES[tag]) return TAG_IMAGES[tag];
  }
  return DEFAULT_IMAGE;
}
