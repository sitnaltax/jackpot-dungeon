// Pod and token definitions

let nextPodId = 1;
let nextTokenId = 1;

// Create a token
export function createToken(type, baseValue, rank = 'basic') {
  return {
    id: `token-${nextTokenId++}`,
    type,
    baseValue,
    rank,
  };
}

// Create a pod from token definitions
export function createPod(name, tokenDefs, cost = 0) {
  return {
    id: `pod-${nextPodId++}`,
    name,
    tokens: tokenDefs.map(def => createToken(def.type, def.baseValue, def.rank || 'basic')),
    cost,
  };
}

// Clone a pod template (creates new IDs)
export function clonePodTemplate(template) {
  return createPod(template.name, template.tokenDefs, template.cost);
}

// ======================
// STARTING POD TEMPLATES
// ======================

// Preset mix: 2 attack-focused, 2 defense-focused, 2 balanced
export const STARTING_POD_TEMPLATES = [
  // Attack-focused pods
  {
    name: 'Rusty Sword',
    tokenDefs: [
      { type: 'attack', baseValue: 3 },
      { type: 'attack', baseValue: 2 },
      { type: 'treasure', baseValue: 1 },
    ],
    cost: 0,
  },
  {
    name: 'Throwing Knives',
    tokenDefs: [
      { type: 'attack', baseValue: 2 },
      { type: 'attack', baseValue: 2 },
      { type: 'attack', baseValue: 2 },
    ],
    cost: 0,
  },
  // Defense-focused pods
  {
    name: 'Wooden Shield',
    tokenDefs: [
      { type: 'defense', baseValue: 3 },
      { type: 'defense', baseValue: 2 },
      { type: 'treasure', baseValue: 1 },
    ],
    cost: 0,
  },
  {
    name: 'Leather Armor',
    tokenDefs: [
      { type: 'defense', baseValue: 2 },
      { type: 'defense', baseValue: 2 },
      { type: 'defense', baseValue: 2 },
    ],
    cost: 0,
  },
  // Balanced pods
  {
    name: 'Adventurer Kit',
    tokenDefs: [
      { type: 'attack', baseValue: 2 },
      { type: 'defense', baseValue: 2 },
      { type: 'treasure', baseValue: 2 },
    ],
    cost: 0,
  },
  {
    name: 'Lucky Pouch',
    tokenDefs: [
      { type: 'treasure', baseValue: 2 },
      { type: 'treasure', baseValue: 2 },
      { type: 'defense', baseValue: 1 },
    ],
    cost: 0,
  },
];

// ======================
// SHOP POD TEMPLATES
// ======================
// Organized by tier for progression

export const SHOP_POD_TEMPLATES = {
  // Tier 1: Early game upgrades (encounters 1-5)
  tier1: [
    {
      name: 'Steel Blade',
      tokenDefs: [
        { type: 'attack', baseValue: 4 },
        { type: 'attack', baseValue: 3 },
        { type: 'treasure', baseValue: 1 },
      ],
      cost: 15,
    },
    {
      name: 'Iron Shield',
      tokenDefs: [
        { type: 'defense', baseValue: 4 },
        { type: 'defense', baseValue: 3 },
        { type: 'treasure', baseValue: 1 },
      ],
      cost: 15,
    },
    {
      name: 'Coin Purse',
      tokenDefs: [
        { type: 'treasure', baseValue: 3 },
        { type: 'treasure', baseValue: 3 },
        { type: 'treasure', baseValue: 2 },
      ],
      cost: 12,
    },
    {
      name: 'Warrior\'s Gear',
      tokenDefs: [
        { type: 'attack', baseValue: 3 },
        { type: 'defense', baseValue: 3 },
        { type: 'attack', baseValue: 2 },
      ],
      cost: 18,
    },
    {
      name: 'Scout\'s Pack',
      tokenDefs: [
        { type: 'attack', baseValue: 2 },
        { type: 'defense', baseValue: 2 },
        { type: 'treasure', baseValue: 4 },
      ],
      cost: 14,
    },
  ],

  // Tier 2: Mid game (encounters 6-10)
  tier2: [
    {
      name: 'Bronze Axe',
      tokenDefs: [
        { type: 'attack', baseValue: 4, rank: 'bronze' },
        { type: 'attack', baseValue: 3 },
        { type: 'treasure', baseValue: 2 },
      ],
      cost: 30,
    },
    {
      name: 'Bronze Buckler',
      tokenDefs: [
        { type: 'defense', baseValue: 4, rank: 'bronze' },
        { type: 'defense', baseValue: 3 },
        { type: 'treasure', baseValue: 2 },
      ],
      cost: 30,
    },
    {
      name: 'Merchant\'s Satchel',
      tokenDefs: [
        { type: 'treasure', baseValue: 4, rank: 'bronze' },
        { type: 'treasure', baseValue: 3 },
        { type: 'defense', baseValue: 2 },
      ],
      cost: 25,
    },
    {
      name: 'Veteran\'s Kit',
      tokenDefs: [
        { type: 'attack', baseValue: 3, rank: 'bronze' },
        { type: 'defense', baseValue: 3, rank: 'bronze' },
        { type: 'treasure', baseValue: 2 },
      ],
      cost: 35,
    },
  ],

  // Tier 3: Late game (encounters 11-15)
  tier3: [
    {
      name: 'Silver Longsword',
      tokenDefs: [
        { type: 'attack', baseValue: 5, rank: 'silver' },
        { type: 'attack', baseValue: 4, rank: 'bronze' },
        { type: 'attack', baseValue: 3 },
      ],
      cost: 50,
    },
    {
      name: 'Silver Tower Shield',
      tokenDefs: [
        { type: 'defense', baseValue: 5, rank: 'silver' },
        { type: 'defense', baseValue: 4, rank: 'bronze' },
        { type: 'defense', baseValue: 3 },
      ],
      cost: 50,
    },
    {
      name: 'Treasure Chest',
      tokenDefs: [
        { type: 'treasure', baseValue: 5, rank: 'silver' },
        { type: 'treasure', baseValue: 4, rank: 'bronze' },
        { type: 'treasure', baseValue: 3 },
      ],
      cost: 45,
    },
    {
      name: 'Champion\'s Arsenal',
      tokenDefs: [
        { type: 'attack', baseValue: 4, rank: 'silver' },
        { type: 'defense', baseValue: 4, rank: 'silver' },
        { type: 'treasure', baseValue: 3, rank: 'bronze' },
      ],
      cost: 60,
    },
  ],

  // Tier 4: End game (encounters 16+)
  tier4: [
    {
      name: 'Golden Greatsword',
      tokenDefs: [
        { type: 'attack', baseValue: 6, rank: 'gold' },
        { type: 'attack', baseValue: 5, rank: 'silver' },
        { type: 'attack', baseValue: 4, rank: 'bronze' },
      ],
      cost: 80,
    },
    {
      name: 'Golden Fortress Shield',
      tokenDefs: [
        { type: 'defense', baseValue: 6, rank: 'gold' },
        { type: 'defense', baseValue: 5, rank: 'silver' },
        { type: 'defense', baseValue: 4, rank: 'bronze' },
      ],
      cost: 80,
    },
    {
      name: 'Dragon\'s Hoard',
      tokenDefs: [
        { type: 'treasure', baseValue: 6, rank: 'gold' },
        { type: 'treasure', baseValue: 5, rank: 'silver' },
        { type: 'treasure', baseValue: 4, rank: 'bronze' },
      ],
      cost: 70,
    },
    {
      name: 'Legendary Kit',
      tokenDefs: [
        { type: 'attack', baseValue: 5, rank: 'gold' },
        { type: 'defense', baseValue: 5, rank: 'gold' },
        { type: 'treasure', baseValue: 4, rank: 'silver' },
      ],
      cost: 100,
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
