// Encounter generation and scaling

// Encounter definitions with modifiers
const ENCOUNTERS = [
  // Tier 1 (minLevel 1-5) - Minor Fey
  {
    id: 'pixie_swarm',
    name: 'Pixie Swarm',
    minLevel: 1,
    weight: 1,
    mysteryMod: 0,
    troubleMod: 0,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    xpMultiplier: 1.0,
    treasureMultiplier: 1.0,
    description: null,
  },
  {
    id: 'will_o_wisp',
    name: "Will-o'-Wisp",
    minLevel: 1,
    weight: 1,
    mysteryMod: 2,
    troubleMod: -2,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    xpMultiplier: 1.0,
    treasureMultiplier: 1.0,
    description: 'Elusive but harmless',
  },
  {
    id: 'talking_fox',
    name: 'Talking Fox',
    minLevel: 1,
    weight: 1,
    mysteryMod: -1,
    troubleMod: 1,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    xpMultiplier: 1.0,
    treasureMultiplier: 1.0,
    description: 'Easy to understand, tricky to please',
  },
  {
    id: 'mirror_sprite',
    name: 'Mirror Sprite',
    minLevel: 1,
    weight: 1,
    mysteryMod: 0,
    troubleMod: 0,
    redrawBonus: 1,
    selectiveRedrawBonus: 0,
    xpMultiplier: 0.75,
    treasureMultiplier: 1.0,
    description: '+1 Redraw, -25% XP',
  },
  {
    id: 'mushroom_circle',
    name: 'Mushroom Circle',
    minLevel: 1,
    weight: 1,
    mysteryMod: 1,
    troubleMod: 1,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    xpMultiplier: 1.25,
    treasureMultiplier: 1.0,
    description: 'Slightly harder, +25% XP',
  },

  // Tier 2 (minLevel 3-6) - Lesser Fey
  {
    id: 'riddle_stone',
    name: 'Riddle Stone',
    minLevel: 2,
    weight: 1,
    mysteryMod: 3,
    troubleMod: 0,
    redrawBonus: 1,
    selectiveRedrawBonus: 0,
    xpMultiplier: 1.25,
    treasureMultiplier: 1.5,
    description: '+1 Redraw, +25% XP, +50% Treasure',
  },
  {
    id: 'dryads_riddle',
    name: "Dryad's Riddle",
    minLevel: 3,
    weight: 1,
    mysteryMod: 4,
    troubleMod: -2,
    redrawBonus: 0,
    selectiveRedrawBonus: 1,
    xpMultiplier: 1.0,
    treasureMultiplier: 1.25,
    description: '+1 Selective Redraw, +25% Treasure',
  },
  {
    id: 'selkie_bargain',
    name: 'Selkie Bargain',
    minLevel: 3,
    weight: 1,
    mysteryMod: 0,
    troubleMod: 0,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    xpMultiplier: 1.5,
    treasureMultiplier: 1.0,
    description: '+50% XP',
  },
  {
    id: 'treacherous_bridge',
    name: 'Treacherous Bridge',
    minLevel: 3,
    weight: 1,
    mysteryMod: -2,
    troubleMod: 4,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    xpMultiplier: 1.0,
    treasureMultiplier: 1.0,
    description: 'Easy to see, hard to cross',
  },
  {
    id: 'phookas_game',
    name: "Phooka's Game",
    minLevel: 4,
    weight: 1,
    mysteryMod: 2,
    troubleMod: 2,
    redrawBonus: 1,
    selectiveRedrawBonus: 0,
    xpMultiplier: 1.0,
    treasureMultiplier: 1.0,
    description: 'Trickier all around, +1 Redraw',
  },
  {
    id: 'kelpie_crossing',
    name: 'Kelpie Crossing',
    minLevel: 4,
    weight: 1,
    mysteryMod: -1,
    troubleMod: 5,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    xpMultiplier: 1.0,
    treasureMultiplier: 1.25,
    description: 'Very dangerous, +25% Treasure',
  },
  {
    id: 'changeling_child',
    name: 'Changeling Child',
    minLevel: 5,
    weight: 1,
    mysteryMod: 3,
    troubleMod: 0,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    xpMultiplier: 1.0,
    treasureMultiplier: 1.0,
    description: 'Hard to understand',
  },

  // Tier 3 (minLevel 6-10) - Greater Fey
  {
    id: 'erlkings_hunt',
    name: "Erlking's Hunt",
    minLevel: 6,
    weight: 1,
    mysteryMod: 2,
    troubleMod: 4,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    xpMultiplier: 1.25,
    treasureMultiplier: 1.5,
    description: '+25% XP, +50% Treasure',
  },
  {
    id: 'banshees_lament',
    name: "Banshee's Lament",
    minLevel: 6,
    weight: 1,
    mysteryMod: 0,
    troubleMod: 5,
    redrawBonus: 0,
    selectiveRedrawBonus: 1,
    xpMultiplier: 1.0,
    treasureMultiplier: 1.0,
    description: '+1 Selective Redraw',
  },
  {
    id: 'redcaps_challenge',
    name: "Redcap's Challenge",
    minLevel: 7,
    weight: 1,
    mysteryMod: -2,
    troubleMod: 6,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    xpMultiplier: 1.0,
    treasureMultiplier: 1.5,
    description: 'Brutal encounter, +50% Treasure',
  },
  {
    id: 'clurichauns_wager',
    name: "Clurichaun's Wager",
    minLevel: 7,
    weight: 1,
    mysteryMod: 0,
    troubleMod: 0,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    xpMultiplier: 2.0,
    treasureMultiplier: 0.5,
    description: '+100% XP, -50% Treasure',
  },
  {
    id: 'spriggan_court',
    name: 'Spriggan Court',
    minLevel: 8,
    weight: 1,
    mysteryMod: 4,
    troubleMod: 2,
    redrawBonus: 1,
    selectiveRedrawBonus: 0,
    xpMultiplier: 1.0,
    treasureMultiplier: 1.0,
    description: 'Complex politics, +1 Redraw',
  },

  // Tier 4 (minLevel 9-15) - Noble Fey
  {
    id: 'sidhe_lord',
    name: 'Sidhe Lord',
    minLevel: 9,
    weight: 1,
    mysteryMod: 5,
    troubleMod: 3,
    redrawBonus: 0,
    selectiveRedrawBonus: 1,
    xpMultiplier: 1.5,
    treasureMultiplier: 1.5,
    description: '+1 Selective, +50% XP, +50% Treasure',
  },
  {
    id: 'queens_emissary',
    name: "Queen's Emissary",
    minLevel: 10,
    weight: 1,
    mysteryMod: 6,
    troubleMod: 0,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    xpMultiplier: 1.25,
    treasureMultiplier: 1.75,
    description: 'Very mysterious, +25% XP, +75% Treasure',
  },
  {
    id: 'wild_hunt_scout',
    name: 'Wild Hunt Scout',
    minLevel: 11,
    weight: 1,
    mysteryMod: 0,
    troubleMod: 8,
    redrawBonus: 1,
    selectiveRedrawBonus: 0,
    xpMultiplier: 1.0,
    treasureMultiplier: 1.5,
    description: 'Extremely dangerous, +1 Redraw, +50% Treasure',
  },
  {
    id: 'fomorian_elder',
    name: 'Fomorian Elder',
    minLevel: 12,
    weight: 1,
    mysteryMod: 6,
    troubleMod: 6,
    redrawBonus: 0,
    selectiveRedrawBonus: 1,
    xpMultiplier: 1.75,
    treasureMultiplier: 2.0,
    description: '+1 Selective, +75% XP, +100% Treasure',
  },
  {
    id: 'leanan_sidhe',
    name: 'Leanan Sidhe',
    minLevel: 13,
    weight: 1,
    mysteryMod: 8,
    troubleMod: -2,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    xpMultiplier: 1.5,
    treasureMultiplier: 1.5,
    description: 'Deeply mysterious but gentle',
  },

  // Tier 5 (minLevel 14+) - Archfey
  {
    id: 'the_erlking',
    name: 'The Erlking Himself',
    minLevel: 14,
    weight: 1,
    mysteryMod: 8,
    troubleMod: 8,
    redrawBonus: 1,
    selectiveRedrawBonus: 1,
    xpMultiplier: 2.0,
    treasureMultiplier: 2.5,
    description: '+1 of each Redraw, +100% XP, +150% Treasure',
  },
  {
    id: 'queen_air_darkness',
    name: 'Queen of Air and Darkness',
    minLevel: 15,
    weight: 1,
    mysteryMod: 10,
    troubleMod: 5,
    redrawBonus: 0,
    selectiveRedrawBonus: 2,
    xpMultiplier: 2.0,
    treasureMultiplier: 2.0,
    description: '+2 Selective, +100% XP, +100% Treasure',
  },
  {
    id: 'wild_hunt_lord',
    name: 'Lord of the Wild Hunt',
    minLevel: 16,
    weight: 1,
    mysteryMod: 4,
    troubleMod: 12,
    redrawBonus: 2,
    selectiveRedrawBonus: 0,
    xpMultiplier: 1.5,
    treasureMultiplier: 2.5,
    description: '+2 Redraws, +50% XP, +150% Treasure',
  },
  {
    id: 'the_green_man',
    name: 'The Green Man',
    minLevel: 17,
    weight: 1,
    mysteryMod: 12,
    troubleMod: 0,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    xpMultiplier: 3.0,
    treasureMultiplier: 1.0,
    description: 'Ancient mystery, +200% XP',
  },
  {
    id: 'oberons_shadow',
    name: "Oberon's Shadow",
    minLevel: 18,
    weight: 1,
    mysteryMod: 10,
    troubleMod: 10,
    redrawBonus: 1,
    selectiveRedrawBonus: 1,
    xpMultiplier: 2.5,
    treasureMultiplier: 3.0,
    description: '+1 of each Redraw, +150% XP, +200% Treasure',
  },
];

// Select an encounter based on encounter number (weighted random from available)
function selectEncounter(encounterNumber) {
  // Filter by minLevel
  const available = ENCOUNTERS.filter(e => encounterNumber >= e.minLevel);

  if (available.length === 0) {
    return ENCOUNTERS[0]; // Fallback to first encounter
  }

  // Weighted random selection
  const totalWeight = available.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const enc of available) {
    roll -= enc.weight;
    if (roll <= 0) return enc;
  }

  return available[0];
}

// Base mystery/trouble stat per encounter level (index 0 = level 1).
// If encounterNumber exceeds the array, the last value is used.
const BASE_STATS = [
   7, //  1
   8, //  2
   9, //  3
  10, //  4
  11, //  5
  12, //  6
  13, //  7
  14, //  8
  15, //  9
  16, // 10
  17, // 11
  18, // 12
  19, // 13
  20, // 14
  21, // 15
  22, // 16
  23, // 17
  24, // 18
  25, // 19
  26, // 20
];

// Flat adjustment to base stats per difficulty
const DIFFICULTY_ADJUSTMENTS = {
  wizard:  -4,
  normal:   0,
  hard:     3,
  expert:   5,
  insane:   8,
};

function calculateBaseStat(encounterNumber, difficulty = 'normal') {
  const base = BASE_STATS[encounterNumber - 1] ?? BASE_STATS[BASE_STATS.length - 1];
  const adjustment = DIFFICULTY_ADJUSTMENTS[difficulty] ?? 0;
  return base + adjustment;
}

// Generate an encounter for the given encounter number
export function generateEncounter(encounterNumber, difficulty = 'normal') {
  const template = selectEncounter(encounterNumber);
  const base = calculateBaseStat(encounterNumber, difficulty);

  return {
    ...template,
    mystery: base + (template.mysteryMod || 0),
    trouble: base + (template.troubleMod || 0),
    level: encounterNumber,
  };
}
