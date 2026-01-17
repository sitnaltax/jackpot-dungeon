// Pod and token definitions

import { RANKS, RANK_ORDER } from './constants.js';

let nextPodId = 1;
let nextTokenId = 1;

// Token types for random generation
const TOKEN_TYPES = ['insight', 'composure', 'treasure'];

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
// Each pod has one bronze token
export const STARTING_POD_TEMPLATES = [
  // Insight-focused pods
  {
    tokenDefs: [
      { type: 'insight', rank: 'bronze' },
      { type: 'insight' },
      { type: 'treasure' },
    ],
    cost: 0,
  },
  {
    tokenDefs: [
      { type: 'insight' },
      { type: 'insight' },
      { type: 'insight' },
    ],
    cost: 0,
  },
  // Composure-focused pods
  {
    tokenDefs: [
      { type: 'composure', rank: 'bronze' },
      { type: 'composure' },
      { type: 'treasure' },
    ],
    cost: 0,
  },
  {
    tokenDefs: [
      { type: 'composure' },
      { type: 'composure' },
      { type: 'composure' },
    ],
    cost: 0,
  },
  // Balanced pods
  {
    tokenDefs: [
      { type: 'insight' },
      { type: 'composure' },
      { type: 'treasure' },
    ],
    cost: 0,
  },
  {
    tokenDefs: [
      { type: 'treasure' },
      { type: 'treasure' },
      { type: 'composure' },
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

// Pick a random token type
function randomTokenType() {
  return TOKEN_TYPES[Math.floor(Math.random() * TOKEN_TYPES.length)];
}

// Generate a single shop pod for a given tier
function generateShopPod(tier) {
  const config = TIER_CONFIG[tier];

  // Decide pod composition: focused (all same type) or mixed
  const isFocused = Math.random() < 0.0; // For now, no pods are focused
  const primaryType = randomTokenType();

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
      type = randomTokenType();
    }

    tokenDefs.push({ type, rank });
  }

  // Sort tokens by rank (highest first) for nicer display
  tokenDefs.sort((a, b) => RANK_ORDER.indexOf(b.rank) - RANK_ORDER.indexOf(a.rank));

  // Calculate cost based on token values
  const tokenValueSum = tokenDefs.reduce((sum, t) => sum + RANKS[t.rank].value, 0);

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
    pods.push(generateShopPod(tier));
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
