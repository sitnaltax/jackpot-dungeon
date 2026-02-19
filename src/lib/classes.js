// Character class definitions

// Mundane starting items - things brought from the real world
const STARTING_ITEMS = {
  roadMap: {
    id: 'roadMap',
    name: 'Road Map',
    description: 'A well-worn map from the tourist bureau.',
    icon: '🗺️',
    category: 'navigation',
    cost: 5,
    bonuses: { redraws: 2 },
  },
  pocketWatch: {
    id: 'pocketWatch',
    name: 'Pocket Watch',
    description: 'Keeps perfect time, even underground.',
    icon: '⌚',
    category: 'navigation',
    cost: 2,
    bonuses: { redraws: 1 },
  },
  notebook: {
    id: 'notebook',
    name: 'Notebook',
    description: 'Full of calculations and margin notes.',
    icon: '📓',
    category: 'book',
    cost: 3,
    bonuses: { selectiveRedraws: 1 },
  },
  runningShoes: {
    id: 'runningShoes',
    name: 'Running Shoes',
    description: 'Worn but reliable.',
    icon: '👟',
    category: 'navigation',
    cost: 2,
    bonuses: { redraws: 1 },
  },
  sweatband: {
    id: 'sweatband',
    name: 'Sweatband',
    description: "It's seen better days.",
    icon: '🎽',
    category: 'book',
    cost: 3,
    bonuses: { selectiveRedraws: 1 },
  },
};

export const CLASSES = {
  explorer: {
    id: 'explorer',
    name: 'Explorer',
    icon: '🧭',
    description: 'A seasoned traveler with sharp eyes and quick instincts.',
    benefitDescription: '+1 Redraw Selected',
    bonuses: {
      selectiveRedraws: 1,
    },
    startingEquipment: [
      STARTING_ITEMS.roadMap,
      null,
      null,
    ],
    startingTreasureBonus: 0,
    startingXpBonus: 0,
  },
  merchant: {
    id: 'merchant',
    name: 'Merchant',
    icon: '💰',
    description: 'A shrewd dealer who always comes prepared.',
    benefitDescription: 'No passive benefit (coming soon: shop discounts)',
    bonuses: {},
    startingEquipment: [
      STARTING_ITEMS.pocketWatch,
      STARTING_ITEMS.notebook,
      null,
    ],
    startingTreasureBonus: 10,
    startingXpBonus: 0,
  },
  athlete: {
    id: 'athlete',
    name: 'Athlete',
    icon: '🏃',
    description: 'Tough and resilient, built to endure.',
    benefitDescription: '+10 Max Stamina, +2 Stamina Regen per encounter',
    bonuses: {
      maxStamina: 10,
      staminaRegen: 2,
    },
    startingEquipment: [
      STARTING_ITEMS.runningShoes,
      STARTING_ITEMS.sweatband,
      null,
    ],
    startingTreasureBonus: 0,
    startingXpBonus: 1,
  },
};

export const CLASS_LIST = Object.values(CLASSES);
