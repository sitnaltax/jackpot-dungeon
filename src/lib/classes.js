// Character class definitions

// Mundane starting items - things brought from the real world
const STARTING_ITEMS = {
  stackOfMaps: {
    id: 'stackOfMaps',
    name: 'Stack of Maps',
    description: 'A stack of old maps, some annotated with scribbles from previous owners.',
    icon: '🗺️',
    category: 'navigation',
    cost: 5,
    bonuses: { redraws: 2 },
  },
  elegantWatch: {
    id: 'elegantWatch',
    name: 'Elegant Watch',
    description: 'A beautiful wristwatch that tracks the time back at home.',
    icon: '⌚',
    category: 'navigation',
    cost: 2,
    bonuses: { redraws: 1 },
  },
  ruinedJournal: {
    id: 'ruinedJournal',
    name: 'Ruined Journal',
    description: 'A damaged journal recovered at great expense from a previous explorer.',
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
  luckyPenny: {
    id: 'luckyPenny',
    name: 'Lucky Penny',
    description: 'Found heads-up on the road here.',
    icon: '🪙',
    category: 'jewelry',
    cost: 3,
    bonuses: { insight: 2 },
  },
  travelersCharm: {
    id: 'travelersCharm',
    name: "Traveler's Charm",
    description: 'A crude ward bought from a roadside stall.',
    icon: '🧿',
    category: 'weapon',
    cost: 3,
    bonuses: { resolve: 2 },
  },
};

export const CLASSES = {
  explorer: {
    id: 'explorer',
    name: 'Explorer',
    description: 'Skilled at deploying their tools effectively; adaptable and less likely to be caught off guard.',
    benefitDescription: '+1 Redraw Selected',
    bonuses: {
      selectiveRedraws: 1,
    },
    startingEquipment: [
      STARTING_ITEMS.stackOfMaps,
      null,
      null,
    ],
    startingXpBonus: 0,
    startingTreasureBonus: 0,
  },
  merchant: {
    id: 'merchant',
    name: 'Merchant',
    description: 'Able to negotiate for better deals in the shop, getting the best pods at the lowest prices.',
    benefitDescription: 'No passive benefit (coming soon: shop discounts)',
    bonuses: {},
    startingEquipment: [
      STARTING_ITEMS.elegantWatch,
      STARTING_ITEMS.ruinedJournal,
      null,
    ],
    startingXpBonus: 10,
    startingTreasureBonus: 0,
  },
  athlete: {
    id: 'athlete',
    name: 'Athlete',
    description: 'Able to push directly through adversity better than the others, reducing the need to focus on resolve.',
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
    startingXpBonus: 0,
    startingTreasureBonus: 1,
  },
  fool: {
    id: 'fool',
    name: 'Fool',
    description: 'Relies on instinct over precision.',
    benefitDescription: '+2 Redraw All, no Redraw Selected items in shop',
    bonuses: {
      redraws: 2,
    },
    startingEquipment: [
      STARTING_ITEMS.luckyPenny,
      STARTING_ITEMS.travelersCharm,
      null,
    ],
    startingXpBonus: 0,
    startingTreasureBonus: 0,
    shopItemFilter: (item) => !item.bonuses?.selectiveRedraws,
  },
};

export const CLASS_LIST = Object.values(CLASSES);
