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
    description: '+1 Redraw',
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
    description: 'Slightly harder',
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
    description: '+1 Redraw',
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
    description: '+1 Selective Redraw',
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
    description: null,
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
    description: 'Very dangerous',
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
    description: null,
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
    description: 'Brutal encounter',
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
    description: null,
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
    description: '+1 Selective Redraw',
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
    description: 'Very mysterious',
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
    description: 'Extremely dangerous, +1 Redraw',
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
    description: '+1 Selective Redraw',
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
    description: '+1 Redraw, +1 Selective Redraw',
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
    description: '+2 Selective Redraws',
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
    description: '+2 Redraws',
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
    description: 'Ancient mystery',
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
    description: '+1 Redraw, +1 Selective Redraw',
  },
];

// Select an encounter based on encounter number (weighted random from available)
// excluded: Set of encounter IDs already seen this run (will not be selected)
function selectEncounter(encounterNumber, excluded = new Set()) {
  const valid = ENCOUNTERS.filter(e => encounterNumber >= e.minLevel);

  if (valid.length === 0) return ENCOUNTERS[0];

  // Prefer unseen encounters; fall back to all valid if all have been seen
  const pool = valid.filter(e => !excluded.has(e.id));
  const candidates = pool.length > 0 ? pool : valid;

  // Weighted random selection
  const totalWeight = candidates.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const enc of candidates) {
    roll -= enc.weight;
    if (roll <= 0) return enc;
  }

  return candidates[0];
}

// Base mystery/trouble stat per encounter level (index 0 = level 1).
// If encounterNumber exceeds the array, the last value is used.
//            1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19   20
const BASE_STATS = 
           [  7,   8,   9,  10,  12,  13,  14,  16,  17,  19,  20,  22,  24,  26,  28,  30,  32,  34,  36,  38];

// Per-level adjustment to base stats per difficulty (index 0 = level 1).
// If encounterNumber exceeds the array, the last value is used.
//            1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19   20
const DIFFICULTY_ADJUSTMENTS = {
  wizard:  [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  normal:  [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  hard:    [  1,   2,   2,   2,   3,   3,   3,   3,   3,   3,   3,   3,   3,   3,   3,   3,   3,   3,   3,   3],
  expert:  [  1,   2,   3,   3,   3,   5,   5,   5,   5,   5,   5,   5,   5,   5,   5,   5,   5,   5,   5,   5],
  insane:  [  2,   2,   3,   3,   4,   5,   5,   6,   7,   8,   8,   8,   8,   8,   8,   8,   8,   8,   8,   8],
};

function calculateBaseStat(encounterNumber, difficulty = 'normal') {
  const base = BASE_STATS[encounterNumber - 1] ?? BASE_STATS[BASE_STATS.length - 1];
  const adjustments = DIFFICULTY_ADJUSTMENTS[difficulty] ?? DIFFICULTY_ADJUSTMENTS.normal;
  const adjustment = adjustments[encounterNumber - 1] ?? adjustments[adjustments.length - 1];
  return base + adjustment;
}

// Generate an encounter for the given encounter number
// excluded: Set of encounter IDs to avoid (already seen this run)
export function generateEncounter(encounterNumber, difficulty = 'normal', excluded = new Set()) {
  const template = selectEncounter(encounterNumber, excluded);
  const base = calculateBaseStat(encounterNumber, difficulty);

  return {
    ...template,
    mystery: base + (template.mysteryMod || 0),
    trouble: base + (template.troubleMod || 0),
    level: encounterNumber,
  };
}
