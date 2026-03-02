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
    description: 'A damaged journal recovered at great expense from a previous investigator.',
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
  bricoleur: {
    id: 'bricoleur',
    name: 'Bricoleur',
    description: 'Flexible and good at making use of the resources available. Adaptable to whatever happens',
    benefitDescription: '+1 Redraw Selected; move expensive shop refreshes',
    bonuses: {
      selectiveRedraws: 1,
    },
    refreshCostFn: (n) => 1 + 2 * n,
    startingEquipment: [
      STARTING_ITEMS.stackOfMaps,
      null,
      null,
    ],
    startingXpBonus: 0,
    startingTreasureBonus: 0,
  },
  polymath: {
    id: 'polymath',
    name: 'Polymath',
    description: 'Learns quickly; gets pods at a discounted rate, and can also refresh more cheaply',
    benefitDescription: 'More XP, and less expensive shop refreshes. Starts with reduced stamina',
    bonuses: {},
    refreshCostFn: (n) => Math.min(2, n + 1),
    startingEquipment: [
      STARTING_ITEMS.elegantWatch,
      STARTING_ITEMS.ruinedJournal,
      null,
    ],
    startingXpBonus: 10,
    startingTreasureBonus: 0,
    startingStaminaOffset: -10,
  },
  agonist: {
    id: 'agonist',
    name: 'Agonist',
    description: 'Able to push directly through adversity. Tough and resilient, driven from within',
    benefitDescription: 'Bonus stamina and regeneration; mediocre starting equipment',
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
  maverick: {
    id: 'maverick',
    name: 'Maverick',
    description: 'Relies on instinct over planning. Bonus treasure, but no Redraw Selected items',
    benefitDescription: '+2 Redraw All, no Redraw Selected items in shop; finds bonus treasure',
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

export const DIFFICULTIES = [
  { id: 'wizard', name: 'Wizard', description: 'Limitless resources, for exploring the game or debugging.' },
  { id: 'normal', name: 'Normal', description: 'For new and casual players. Allows room for experimentation and mistakes.' },
  { id: 'hard', name: 'Hard', description: 'For experienced players or roguelike veterans. Most strategies should be viable, and win if executed well.' },
  { id: 'expert', name: 'Expert', description: 'The premier challenge for experienced players. Most strategies should still be viable if executed well, but victory is uncertain.' },
  { id: 'insane', name: 'Insane', description: 'Overtuned difficulty; use only if you found something you think is brokenly good.' },
];
