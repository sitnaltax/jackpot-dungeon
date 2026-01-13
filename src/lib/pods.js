// Pod and token definitions

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

// Preset mix: 2 attack-focused, 2 defense-focused, 2 balanced
// All starting tokens are basic rank
export const STARTING_POD_TEMPLATES = [
  // Attack-focused pods
  {
    tokenDefs: [
      { type: 'attack' },
      { type: 'attack' },
      { type: 'treasure' },
    ],
    cost: 0,
  },
  {
    tokenDefs: [
      { type: 'attack' },
      { type: 'attack' },
      { type: 'attack' },
    ],
    cost: 0,
  },
  // Defense-focused pods
  {
    tokenDefs: [
      { type: 'defense' },
      { type: 'defense' },
      { type: 'treasure' },
    ],
    cost: 0,
  },
  {
    tokenDefs: [
      { type: 'defense' },
      { type: 'defense' },
      { type: 'defense' },
    ],
    cost: 0,
  },
  // Balanced pods
  {
    tokenDefs: [
      { type: 'attack' },
      { type: 'defense' },
      { type: 'treasure' },
    ],
    cost: 0,
  },
  {
    tokenDefs: [
      { type: 'treasure' },
      { type: 'treasure' },
      { type: 'defense' },
    ],
    cost: 0,
  },
];

// ======================
// SHOP POD TEMPLATES
// ======================
// Organized by tier for progression

export const SHOP_POD_TEMPLATES = {
  // Tier 1: Early game - bronze tokens become available
  tier1: [
    {
      tokenDefs: [
        { type: 'attack', rank: 'bronze' },
        { type: 'attack' },
        { type: 'attack' },
      ],
      cost: 12,
    },
    {
      tokenDefs: [
        { type: 'defense', rank: 'bronze' },
        { type: 'defense' },
        { type: 'defense' },
      ],
      cost: 12,
    },
    {
      tokenDefs: [
        { type: 'treasure', rank: 'bronze' },
        { type: 'treasure' },
        { type: 'treasure' },
      ],
      cost: 10,
    },
    {
      tokenDefs: [
        { type: 'attack', rank: 'bronze' },
        { type: 'defense', rank: 'bronze' },
        { type: 'treasure' },
      ],
      cost: 14,
    },
    {
      tokenDefs: [
        { type: 'attack', rank: 'bronze' },
        { type: 'attack', rank: 'bronze' },
        { type: 'treasure' },
      ],
      cost: 16,
    },
    {
      tokenDefs: [
        { type: 'defense', rank: 'bronze' },
        { type: 'defense', rank: 'bronze' },
        { type: 'treasure' },
      ],
      cost: 16,
    },
  ],

  // Tier 2: Mid game - silver tokens become available
  tier2: [
    {
      tokenDefs: [
        { type: 'attack', rank: 'silver' },
        { type: 'attack', rank: 'bronze' },
        { type: 'attack' },
      ],
      cost: 28,
    },
    {
      tokenDefs: [
        { type: 'defense', rank: 'silver' },
        { type: 'defense', rank: 'bronze' },
        { type: 'defense' },
      ],
      cost: 28,
    },
    {
      tokenDefs: [
        { type: 'treasure', rank: 'silver' },
        { type: 'treasure', rank: 'bronze' },
        { type: 'treasure' },
      ],
      cost: 24,
    },
    {
      tokenDefs: [
        { type: 'attack', rank: 'silver' },
        { type: 'defense', rank: 'silver' },
        { type: 'treasure' },
      ],
      cost: 32,
    },
  ],

  // Tier 3: Late game - gold tokens become available
  tier3: [
    {
      tokenDefs: [
        { type: 'attack', rank: 'gold' },
        { type: 'attack', rank: 'silver' },
        { type: 'attack', rank: 'bronze' },
      ],
      cost: 50,
    },
    {
      tokenDefs: [
        { type: 'defense', rank: 'gold' },
        { type: 'defense', rank: 'silver' },
        { type: 'defense', rank: 'bronze' },
      ],
      cost: 50,
    },
    {
      tokenDefs: [
        { type: 'treasure', rank: 'gold' },
        { type: 'treasure', rank: 'silver' },
        { type: 'treasure', rank: 'bronze' },
      ],
      cost: 45,
    },
    {
      tokenDefs: [
        { type: 'attack', rank: 'gold' },
        { type: 'defense', rank: 'gold' },
        { type: 'treasure', rank: 'silver' },
      ],
      cost: 60,
    },
  ],

  // Tier 4: End game - platinum tokens become available
  tier4: [
    {
      tokenDefs: [
        { type: 'attack', rank: 'platinum' },
        { type: 'attack', rank: 'gold' },
        { type: 'attack', rank: 'silver' },
      ],
      cost: 85,
    },
    {
      tokenDefs: [
        { type: 'defense', rank: 'platinum' },
        { type: 'defense', rank: 'gold' },
        { type: 'defense', rank: 'silver' },
      ],
      cost: 85,
    },
    {
      tokenDefs: [
        { type: 'treasure', rank: 'platinum' },
        { type: 'treasure', rank: 'gold' },
        { type: 'treasure', rank: 'silver' },
      ],
      cost: 75,
    },
    {
      tokenDefs: [
        { type: 'attack', rank: 'platinum' },
        { type: 'defense', rank: 'platinum' },
        { type: 'treasure', rank: 'gold' },
      ],
      cost: 100,
    },
  ],

  // Tier 5: Deep runs - diamond tokens become available
  tier5: [
    {
      tokenDefs: [
        { type: 'attack', rank: 'diamond' },
        { type: 'attack', rank: 'platinum' },
        { type: 'attack', rank: 'gold' },
      ],
      cost: 140,
    },
    {
      tokenDefs: [
        { type: 'defense', rank: 'diamond' },
        { type: 'defense', rank: 'platinum' },
        { type: 'defense', rank: 'gold' },
      ],
      cost: 140,
    },
    {
      tokenDefs: [
        { type: 'treasure', rank: 'diamond' },
        { type: 'treasure', rank: 'platinum' },
        { type: 'treasure', rank: 'gold' },
      ],
      cost: 120,
    },
    {
      tokenDefs: [
        { type: 'attack', rank: 'diamond' },
        { type: 'defense', rank: 'diamond' },
        { type: 'treasure', rank: 'platinum' },
      ],
      cost: 160,
    },
  ],
};

// Get available shop pods based on encounter number
export function getAvailableShopPods(encounterNumber) {
  const available = [...SHOP_POD_TEMPLATES.tier1];

  if (encounterNumber >= 5) {
    available.push(...SHOP_POD_TEMPLATES.tier2);
  }
  if (encounterNumber >= 10) {
    available.push(...SHOP_POD_TEMPLATES.tier3);
  }
  if (encounterNumber >= 15) {
    available.push(...SHOP_POD_TEMPLATES.tier4);
  }
  if (encounterNumber >= 20) {
    available.push(...SHOP_POD_TEMPLATES.tier5);
  }

  return available;
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
