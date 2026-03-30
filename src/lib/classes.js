// Character class definitions

import { gamePhase } from "./gameState";

// Mundane starting items - things brought from the real world
const STARTING_ITEMS = {
  stackOfMaps: {
    id: 'stackOfMaps',
    name: 'Stack of Maps',
    description: 'A stack of old maps, some annotated with scribbles from previous owners. You don\'t recognize any of the locations.',
    icon: '🗺️',
    category: 'navigation',
    cost: 5,
    bonuses: { redraws: 2 },
  },
  elegantWatch: {
    id: 'elegantWatch',
    name: 'Elegant Watch',
    description: 'An elegant, sturdy mechanical wristwatch. It keeps perfect time at home.',
    icon: '⌚',
    category: 'navigation',
    cost: 2,
    bonuses: { redraws: 1 },
  },
  ruinedJournal: {
    id: 'ruinedJournal',
    name: 'Ruined Journal',
    description: 'A journal recovered at great expense from a previous investigator. It\'s damaged, but you can glean a few clues from the surviving scraps.',
    icon: '📓',
    category: 'book',
    cost: 3,
    bonuses: { selectiveRedraws: 1 },
  },
  gps: {
    id: 'gps',
    name: 'GPS',
    description: 'A portable GPS device. There\'s no way it gets a satellite signal here, but the voice navigation still gives directions.',
    icon: '🧭',
    category: 'navigation',
    cost: 2,
    bonuses: { redraws: 1 },
  },
  rhymingDictionary: {
    id: 'rhymingDictionary',
    name: 'Rhyming Dictionary',
    description: 'A battered rhyming dictionary... you never know when you might need to compose a poem, after all.',
    icon: '📚',
    category: 'book',
    cost: 3,
    bonuses: { selectiveRedraws: 1 },
  },
  silverDollar: {
    id: 'silverDollar',
    name: 'Silver Dollar',
    description: 'A polished one-ounce silver coin, face value $10 but worth much more for its metal. Here, who knows its value?',
    icon: '💵',
    category: 'jewelry',
    cost: 3,
    bonuses: { insight: 2 },
  },
  handgun: {
    id: 'handgun',
    name: 'Handgun',
    description: 'An optimistic inscription reads: "To defeat the Unseelie King, shoot at him until he dies."',
    icon: '🔫',
    category: 'weapon',
    cost: 3,
    bonuses: { resolve: 2 },
  },
  foolsPipe: {
    id: 'foolsPipe',
    name: "Fool's Pipe",
    description: 'An old keepsake. For some reason, it\'s very easy to play it here.',
    icon: '🪈',
    category: 'instrument',
    cost: 4,
    bonuses: {},
    tags: ['Musical'],
  },
};

export const CLASSES = {
  agonist: {
    id: 'agonist',
    name: 'Agonist',
    description: 'Able to push directly through adversity. Tough and resilient, driven from within.',
    benefitDescription: 'Bonus stamina and regeneration; mediocre starting equipment.',
    bonuses: {
      maxStamina: 10,
      staminaRegen: 2,
    },
    startingEquipment: [
      STARTING_ITEMS.gps,
      STARTING_ITEMS.rhymingDictionary,
      null,
    ],
    startingXpBonus: 0,
    startingTreasureBonus: 1,
  },
  maverick: {
    id: 'maverick',
    name: 'Maverick',
    description: 'Relies on instinct over planning. Bonus treasure, but no Redraw Selected items.',
    benefitDescription: '+2 Redraw All, no Redraw Selected items in shop; finds bonus treasure when failing Insight checks.',
    bonuses: {
      redraws: 2,
    },
    startingEquipment: [
      STARTING_ITEMS.handgun,
      STARTING_ITEMS.silverDollar,
      STARTING_ITEMS.foolsPipe,
    ],
    startingXpBonus: 0,
    startingTreasureBonus: 0,
    shopItemFilter: (item) => !item.bonuses?.selectiveRedraws,
    onInsightFailure: () => ({ treasure: 1 }),
  },
  polymath: {
    id: 'polymath',
    name: 'Polymath',
    description: 'Able to make the best use out of everything: pods are better, and shop refreshes are cheap.',
    benefitDescription: 'One random token in every pod is upgraded; less expensive shop refreshes. One pod purchase per shop.',
    bonuses: {},
    upgradesTokens: true,
    maxPodsPerShop: 1,
    refreshCostFn: (n) => Math.min(3, n),
    startingEquipment: [
      STARTING_ITEMS.elegantWatch,
      STARTING_ITEMS.ruinedJournal,
      null,
    ],
    startingXpBonus: 10,
    startingTreasureBonus: 0,
  },
  bricoleur: {
    id: 'bricoleur',
    name: 'Bricoleur',
    description: 'Flexible and good at making use of the resources available. Adaptable to whatever happens.',
    benefitDescription: '+1 Redraw Selected; more expensive shop refreshes.',
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
};

export const CLASS_LIST = Object.values(CLASSES);

export const DIFFICULTIES = [
  { id: 'wizard', name: 'Observer', description: 'Limitless resources, for exploring the game or debugging.', staminaBonus: 0 },
  { id: 'normal', name: 'Normal', description: 'For new and progressing players. Provides some room for experimentation and mistakes.', staminaBonus: 15 },
  { id: 'hard', name: 'Hard', description: 'Intended as a challenge for experienced players. You will need to make good use of your resources and opportunities.', staminaBonus: 5 },
  { id: 'expert', name: 'Expert', description: 'The premier challenge for experienced players. You will need to rely on both luck and skill; victory is uncertain.', staminaBonus: 0 },
  { id: 'insane', name: 'Insane', description: 'Overtuned difficulty; use only if you found something you think is brokenly good.', staminaBonus: 0 },
];
