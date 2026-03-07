// Encounter generation and scaling

// Encounter definitions with modifiers
const ENCOUNTERS = [
  {
    id: 'fogShroudedForest',
    name: 'Fog-Shrouded Forest',
    minLevel: 1,
    weight: 1,
    mysteryMod: 0,
    troubleMod: 0,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    description: null,
    flavorText: "The understory of this forest is sparse, the trunks of enormous trees crowding out any brush or shrubs. A dense, still fog hangs everywhere. You can't see even the lowest branches of the trees, nor more than a dozen steps ahead. Your goal could be a mere stone's throw away and you'd never know."
  },
  {
    id: 'vengefulAsh',
    name: "Vengeful Ash",
    minLevel: 1,
    weight: 1,
    mysteryMod: -1,
    troubleMod: 1,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    description: null,
    flavorText: "Trees have long memories. Something about you--your smell? your voice?--has awoken a grudge in this ancient, sturdy ash. It musters all of its malice and violence to expel you and defend its secrets."
  },
  {
    id: 'brambleWard',
    name: 'Bramble Ward',
    minLevel: 1,
    weight: 1,
    mysteryMod: -1,
    troubleMod: 1,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    description: null,
    flavorText: "An apparently-endless barrier of fierce, thorny brambles blocks your path. Pushing your hand through, it's as if the vines are writing creatures, thirsting for your blood. Somehow, you need to find a way around, or else grit your teeth, ready your bandages, and charge through."
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
    flavorText: "A fleeting reflection darts between the trees ahead of you, mimicking your posture, your gait, your hesitation. It vanishes the moment you try to look at it directly.",
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
    description: null,
    flavorText: "A perfect ring of pale mushrooms marks the ground ahead. The air inside the circle smells faintly of rain and something older. You're not sure if crossing it is wise.",
  },
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
    flavorText: "A standing stone carved with intertwining symbols blocks the narrowest part of the path. Some of the carvings seem to shift when you look away. The stone does not move, but it is clearly waiting.",
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
    flavorText: "A face peers out from the bark of an oak, patient and unhurried. It poses a question without words. You understand it perfectly, and have no idea what it means.",
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
    flavorText: "Something rises from the black water at the shore's edge. It regards you with large, dark eyes. It has something you might want. You have something it certainly wants. The question is whether the exchange is worth making.",
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
    description: null,
    flavorText: "The bridge spans the gorge without difficulty. The gorge below has no visible bottom. The bridge sways pleasantly in a wind you cannot feel. You need to cross it.",
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
    description: '+1 Redraw',
    flavorText: "A shapeless, shifting thing is crouched in the road ahead, arranging small stones in patterns that make your eyes ache. It looks up and grins with a mouth that has too many teeth. It wants to play a game.",
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
    description: null,
    flavorText: "A beautiful horse stands at the water's edge, perfectly still, watching you approach. Its mane is wet. The river is wide. The horse does not move. You get the feeling the offer is not one you can simply decline.",
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
    description: null,
    flavorText: "A child sits alone on a log, watching you with eyes that have seen far too much. It asks you questions you shouldn't be able to understand. You answer anyway.",
  },
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
    flavorText: "Distant horns echo through the trees. They are getting closer. Whatever the hunt has found tonight, you would prefer not to be it.",
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
    flavorText: "The keening comes from everywhere at once, rising and falling. A pale figure floats at the treeline, facing away. You don't know whose death it mourns. You hope it isn't yours.",
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
    description: null,
    flavorText: "A small figure with a dripping red cap blocks the path, arms crossed, looking at you like a problem to be solved. It has solved many problems this way. The cap was once white.",
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
    flavorText: "A flushed, merry figure sits atop a barrel and waves you over. It has a proposal. It seems very confident in its proposal. It smells strongly of something fermented.",
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
    description: '+1 Redraw',
    flavorText: "Dozens of small, ugly creatures are mid-deliberation when you stumble into their court. They stop. They all turn. They resume deliberating, but now the subject is you.",
  },
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
    flavorText: "A tall, pale figure sits on a throne of living wood and regards you with what might be curiosity, or might be something that simply looks like it. It speaks, and the words rearrange themselves into meaning just before they reach you.",
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
    description: null,
    flavorText: "A figure in grey stands at a crossroads, holding a sealed letter. It extends the letter toward you without speaking. It will stand there as long as it takes. The wax seal depicts something you can't quite make out.",
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
    description: '+1 Redraw',
    flavorText: "A lone rider stops on the ridge above you. It is watching. It has already decided something. The main hunt is somewhere behind it, and you are in between.",
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
    flavorText: "Something ancient and enormous sits among the stones ahead, its mismatched eyes half-closed. It has been here a very long time. It will be here a very long time after you are gone. It knows this, and finds it restful.",
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
    description: null,
    flavorText: "A figure of terrible beauty sits by the roadside, watching the distance. It turns to look at you and you feel immediately that you could accomplish extraordinary things. You also feel that the feeling has a price.",
  },
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
    flavorText: "He is taller than you remembered, and older, and more present. The trees lean away from him slightly. He looks at you the way a storm looks at a barn.",
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
    flavorText: "She is not there, and then she is. Cold attaches to her the way warmth attaches to a fire. She regards you without expression. She has already decided how this ends.",
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
    flavorText: "The sound of the hunt precedes him by a long time. When he arrives, the ground trembles slightly with each step. He does not appear to notice you at first, which is the best outcome you could have hoped for.",
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
    description: null,
    flavorText: "Leaves grow from his face, or his face grows from the leaves. The distinction feels academic. He is the oldest thing you have ever stood next to. He gestures, patiently, for you to explain yourself.",
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
    flavorText: "Oberon is not here. His shadow is. It moves independently of any light source, and it has his bearing, his authority, and apparently his patience. It has been waiting for you specifically.",
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
