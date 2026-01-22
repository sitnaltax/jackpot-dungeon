// Pod and token definitions

import { RANKS, RANK_ORDER, TOKEN_TYPES as TOKEN_TYPE_DATA } from './constants.js';

let nextPodId = 1;
let nextTokenId = 1;


// Create a token (value determined by type + rank)
export function createToken(type, rank = 'basic') {
  return {
    id: `token-${nextTokenId++}`,
    type,
    rank,
  };
}

// Create a pod from token definitions
export function createPod(tokenDefs, cost = 0) {
  return {
    id: `pod-${nextPodId++}`,
    tokens: tokenDefs.map(def => createToken(def.type, def.rank || 'basic')),
    cost,
  };
}

// Clone a pod template (creates new IDs)
export function clonePodTemplate(template) {
  return createPod(template.tokenDefs, template.cost);
}

// ======================
// STARTING POD TEMPLATES
// ======================

// Preset mix: 2 insight-focused, 2 composure-focused, 2 balanced
// Each pod has 1 basic token and 2 inferior tokens
export const STARTING_POD_TEMPLATES = [
  // Insight-focused pods
  {
    tokenDefs: [
      { type: 'insight', rank: 'bronze' },
      { type: 'insight', rank: 'inferior' },
      { type: 'treasure', rank: 'inferior' },
    ],
    cost: 0,
  },
  {
    tokenDefs: [
      { type: 'insight' },
      { type: 'insight', rank: 'inferior' },
      { type: 'insight', rank: 'inferior' },
    ],
    cost: 0,
  },
  // Composure-focused pods
  {
    tokenDefs: [
      { type: 'composure', rank: 'bronze' },
      { type: 'composure', rank: 'inferior' },
      { type: 'treasure', rank: 'inferior' },
    ],
    cost: 0,
  },
  {
    tokenDefs: [
      { type: 'composure' },
      { type: 'composure', rank: 'inferior' },
      { type: 'composure', rank: 'inferior' },
    ],
    cost: 0,
  },
  // Balanced pods
  {
    tokenDefs: [
      { type: 'insight' },
      { type: 'composure', rank: 'inferior' },
      { type: 'treasure', rank: 'inferior' },
    ],
    cost: 0,
  },
  {
    tokenDefs: [
      { type: 'treasure' },
      { type: 'treasure', rank: 'inferior' },
      { type: 'composure', rank: 'inferior' },
    ],
    cost: 0,
  },
];

// ======================
// DYNAMIC SHOP GENERATION
// ======================

// Get shop tier based on encounter number
function getShopTier(encounterNumber) {
  if (encounterNumber >= 20) return 5;
  if (encounterNumber >= 15) return 4;
  if (encounterNumber >= 10) return 3;
  if (encounterNumber >= 5) return 2;
  return 1;
}

// Tier configuration
// - minRank: at least one token will be this rank
// - baseRank: starting rank for other tokens
// - upgradeChance: chance for each token to upgrade one tier
// - maxUpgrades: maximum number of tier upgrades per token
const TIER_CONFIG = {
  1: { minRank: 'bronze', baseRank: 'basic', upgradeChance: 0.30, maxUpgrades: 2 },
  2: { minRank: 'silver', baseRank: 'bronze', upgradeChance: 0.30, maxUpgrades: 2 },
  3: { minRank: 'gold', baseRank: 'silver', upgradeChance: 0.30, maxUpgrades: 2 },
  4: { minRank: 'platinum', baseRank: 'gold', upgradeChance: 0.30, maxUpgrades: 2 },
  5: { minRank: 'diamond', baseRank: 'platinum', upgradeChance: 0.30, maxUpgrades: 1 },
};

// Get the next rank up (or same if at max)
function upgradeRank(rank) {
  const index = RANK_ORDER.indexOf(rank);
  if (index < RANK_ORDER.length - 1) {
    return RANK_ORDER[index + 1];
  }
  return rank;
}

// Roll a rank for a token based on tier config
function rollTokenRank(config, isGuaranteed = false) {
  // If this is the guaranteed slot, use minRank
  if (isGuaranteed) {
    return config.minRank;
  }

  // Start at base rank and potentially upgrade
  let rank = config.baseRank;
  for (let i = 0; i < config.maxUpgrades; i++) {
    if (Math.random() < config.upgradeChance) {
      rank = upgradeRank(rank);
    } else {
      break; // Stop upgrading once we fail a roll
    }
  }
  return rank;
}

// Pick a random token type, filtered by depth and weighted by probability
function randomTokenType(encounterNumber) {
  // Filter to tokens available at this depth
  const available = Object.entries(TOKEN_TYPE_DATA)
    .filter(([_, data]) => (data.minDepth ?? 0) <= encounterNumber)
    .map(([type, data]) => ({ type, weight: data.weight ?? 1 }));

  // Weighted random selection
  const totalWeight = available.reduce((sum, t) => sum + t.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const { type, weight } of available) {
    roll -= weight;
    if (roll <= 0) return type;
  }

  // Fallback (shouldn't happen)
  return available[available.length - 1].type;
}

// Generate a single shop pod for a given tier and encounter depth
function generateShopPod(tier, encounterNumber) {
  const config = TIER_CONFIG[tier];

  // Decide pod composition: focused (all same type) or mixed
  const isFocused = Math.random() < 0.0; // For now, no pods are focused
  const primaryType = randomTokenType(encounterNumber);

  const tokenDefs = [];

  for (let i = 0; i < 3; i++) {
    // First token gets guaranteed minimum rank
    const isGuaranteed = i === 0;
    const rank = rollTokenRank(config, isGuaranteed);

    // Determine type
    let type;
    if (isFocused) {
      // Focused pods: all same type, maybe one treasure
      if (i === 2 && primaryType !== 'treasure' && Math.random() < 0.4) {
        type = 'treasure';
      } else {
        type = primaryType;
      }
    } else {
      // Mixed pods: random types
      type = randomTokenType(encounterNumber);
    }

    tokenDefs.push({ type, rank });
  }

  // Sort tokens by rank (highest first) for nicer display
  tokenDefs.sort((a, b) => RANK_ORDER.indexOf(b.rank) - RANK_ORDER.indexOf(a.rank));

  // Calculate cost based on token values (base * multiplier)
  const tokenValueSum = tokenDefs.reduce((sum, t) => {
    const baseValue = TOKEN_TYPE_DATA[t.type].baseValue;
    const multiplier = RANKS[t.rank].multiplier;
    return sum + Math.floor(baseValue * multiplier);
  }, 0);

  // Add random factor: -10% to +20% of base cost
  const randomFactor = 0.9 + (Math.random() * 0.3);
  const cost = Math.floor(tokenValueSum * randomFactor);

  return { tokenDefs, cost };
}

// Generate shop pods for a given encounter number
export function generateShopPods(encounterNumber, count = 4) {
  const tier = getShopTier(encounterNumber);
  const pods = [];

  for (let i = 0; i < count; i++) {
    pods.push(generateShopPod(tier, encounterNumber));
  }

  return pods;
}

// Legacy function - now just calls generateShopPods
export function getAvailableShopPods(encounterNumber) {
  return generateShopPods(encounterNumber);
}

// Generate starting pods for a new game
export function generateStartingPods() {
  return STARTING_POD_TEMPLATES.map(template => clonePodTemplate(template));
}

// Shuffle array utility
export function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get all tokens from pods and shuffle them
export function getTokenPool(pods) {
  const allTokens = pods.flatMap(pod => pod.tokens);
  return shuffle(allTokens);
}
