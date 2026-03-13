// Encounter generation and scaling

// Encounter definitions with modifiers
const ENCOUNTERS = [
  //1-5: Woods
  {
    id: 'fogShroudedForest',
    name: 'Fog-Shrouded Forest',
    minLevel: 1,
    maxLevel: 5,
    weight: 1,
    mysteryMod: 1,
    troubleMod: -1,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    description: null,
    flavorText: "The understory of this forest is sparse, the trunks of enormous trees crowding out any brush or shrubs. A dense, still fog hangs everywhere. You can't see even the lowest branches of the trees, nor more than a dozen steps ahead. Your goal could be a mere stone's throw away and you'd never know."
  },
  {
    id: 'vengefulAsh',
    name: "Vengeful Ash",
    minLevel: 1,
    maxLevel: 5,
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
    maxLevel: 5,
    weight: 1,
    mysteryMod: -1,
    troubleMod: 1,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    description: null,
    flavorText: "An apparently-endless barrier of fierce, thorny brambles blocks your path. Pushing your hand through, it's as if the vines are writing creatures, thirsting for your blood. Somehow, you need to find a way around, or else grit your teeth, ready your bandages, and charge through."
  },
  {
    id: 'dreamingCatColony',
    name: 'Dreaming Cat-Colony',
    minLevel: 1,
    maxLevel: 5,
    weight: 1,
    mysteryMod: -2,
    troubleMod: 2,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    description: null,
    flavorText: "In their dreams, all cats are panthers, tigers, sabertooths, or even more fearsome predators of nightmare. Nearby, the dreams of a small colony of feral cats have joined to be a fearsome pride of squabbling beasts.",
  },
  {
    id: 'mirrorSprite',
    name: 'Mirror Sprite',
    minLevel: 1,
    maxLevel: 5,
    weight: 1,
    mysteryMod: 0,
    troubleMod: 0,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    description: null,
    flavorText: "It's not a pixie. It's not even a humanoid. It looks like a small, amorphous two-sided mirror. It flits through the air like a dragonfly, hovering and darting. As it dashes around, it shows dizzying reflections, most from your surroundings, the rest from somewhere stranger and darker.",
  },
  {
    id: 'labyrinthOfCrossroads',
    name: 'Labyrinth of Crossroads',
    minLevel: 1,
    maxLevel: 5,
    weight: 1,
    mysteryMod: 1,
    troubleMod: 1,
    redrawBonus: 1,
    selectiveRedrawBonus: 0,
    description: "+1 Redraw All",
    flavorText: "The path here is pleasantly clear and well-marked, almost a proper road. You come to a crossroads where it joins with another such road... and then another. Turning around, you encounter what you'd swear is a different path entirely. Somehow you need to figure out what \"forward\" really means...",
  },
  {
    id: 'demandingBrownie',
    name: "Demanding Brownie",
    minLevel: 1,
    maxLevel: 5,
    weight: 1,
    mysteryMod: 2,
    troubleMod: 2,
    redrawBonus: 0,
    selectiveRedrawBonus: 1,
    description: "+1 Redraw Selected",
    flavorText: "If you give a faerie what they want in a deal, they reliably keep their word. But this tiny brownie is asking for things you can't possibly provide: the color of seven, the first breath of a murderer, the bullet that killed Julius Caesar.",
  },
  {
    id: 'tooCleverFox',
    name: 'Too-Clever Fox',
    minLevel: 1,
    maxLevel: 5,
    weight: 1,
    mysteryMod: 2,
    troubleMod: -2,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    description: null,
    flavorText: "Foxes are, of course, clever. This one asks you \"unsolvable\" riddles that end up being simple algebra problems. When you answer, it seems geniunely amazed and demands you teach it in the ways of faerie mystery.",
  },
  //6: Woods->Sky Transition
  {
    id: 'treacherousHorizon',
    name: 'Treacherous Horizon',
    minLevel: 6,
    maxLevel: 6,
    weight: 1,
    mysteryMod: 0,
    troubleMod: 0,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    description: null,
    flavorText: "To walk from the earth to the sky, or back again, you need to fix your sight on the farthest horizon and walk forward without considering the difference between the two. Looking up and looking down are equally perilous.",
  },
  //7-11: Sky
  {
    id: 'cloudSteps',
    name: "Cloud Steps",
    minLevel: 7,
    maxLevel: 11,
    weight: 1,
    mysteryMod: 0,
    troubleMod: 0,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    description: null,
    flavorText: "From the minds of children dreaming about video games: a series of clouds across the sky, at dizzying height. You find yourself able to take enormous leaps from one to the next; don't fall.",
  },
  {
    id: 'petalHailstorm',
    name: 'Petal Hailstorm',
    minLevel: 7,
    maxLevel: 11,
    weight: 1,
    mysteryMod: -2,
    troubleMod: 2,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    description: null,
    flavorText: "A gust of wind blows, and the air fills with beautiful pink and lavender flower petals. You watch them swirl and drift on the air currents, but when one lands on you, it strikes with the force of a hurled stone. Quickly you seek cover. ",
  },
  {
    id: 'invisibleBridge',
    name: 'Invisible Bridge',
    minLevel: 7,
    maxLevel: 11,
    weight: 1,
    mysteryMod: 2,
    troubleMod: -2,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    description: null,
    flavorText: "To cross from peak to peak, you find youself needing to cross a bridge that is rickety, swaying, and worst of all, invisible. With a combination of resourcefulness and just plain daring, you need to find a way across it.",
  },
  {
    id: 'stormCrowParliament',
    name: "Storm-Crow Parliament",
    minLevel: 7,
    maxLevel: 11,
    weight: 1,
    mysteryMod: 2,
    troubleMod: -2,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    description: null,
    flavorText: "On the trees, on the cliffs, and circling through the sky, hundreds of large crows surround you. They watch you with keen interest and caw--only one at a time, having a discussion amongst themselves that concerns you.",
  },
  {
    id: 'malevolentFalseStars',
    name: "Malevolent False Stars",
    minLevel: 7,
    maxLevel: 11,
    weight: 1,
    mysteryMod: -3,
    troubleMod: 3,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    description: null,
    flavorText: "You look to the sky and see familiar constellations. But there are other stars, moving between them. They give the Bear a sinister scorpion's tail; Orion gleaming red eyes; the Dragon, tightening coils the crush the moon.",
  },
  {
    id: 'thunderhead',
    name: "Thunderhead",
    minLevel: 7,
    maxLevel: 11,
    weight: 1,
    mysteryMod: -2,
    troubleMod: 2,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    description: null,
    flavorText: "In the midst of an otherwise clear sky, a massive cumulonimbus cloud looms. It unleashes the fury of lightning and torrential rain below it; birds, beasts, and sprites all flee from its mindless, inexorable wrath.",
  },
  {
    id: 'auroralChoir',
    name: "Auroral Choir",
    minLevel: 7,
    maxLevel: 11,
    weight: 1,
    mysteryMod: 4,
    troubleMod: 0,
    redrawBonus: 1,
    selectiveRedrawBonus: 0,
    description: "+1 Redraw All",
    flavorText: "Is it the true dawn, or a shimmering curtain of light in the sky? As the light shines and shifts, you also hear a series of chimes or bells that add together to sound like ethereal voices. You strain to gather the meaning of the words of their song.",
  },
  {
    id: 'secondSun',
    name: "Second Sun",
    minLevel: 7,
    maxLevel: 11,
    weight: 1,
    mysteryMod: 3,
    troubleMod: 3,
    redrawBonus: 0,
    selectiveRedrawBonus: 2,
    description: "+2 Redraw Selected",
    flavorText: "In the depths of night, the wrong sun rises. Although its light makes it easier to see, its rays surely mean an ill omen for everything they touch.",
  },  
  // 12: Sky->Underworld Transition
  {
    id: 'cavernInTheRoof',
    name: 'Cavern in the Roof',
    minLevel: 12,
    maxLevel: 12,
    weight: 1,
    mysteryMod: 0,
    troubleMod: 0,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    description: null,
    flavorText: "Your journey takes you up, up, up through the sky, until you encounter an opening. You look inside and it's dark and still--the chilly wind and blinding light give way to a quiet dank stillness. Certainly more dangers lie inside, but your destination is somewhere through this entrance.",
  },
  // 13-17: Underworld
  {
    id: 'bottomlessDescent',
    name: 'Bottomless Descent',
    minLevel: 13,
    maxLevel: 17,
    weight: 1,
    mysteryMod: 2,
    troubleMod: -2,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    description: null,
    flavorText: "An old but sturdy-looking rope ladder is spiked to the floor here. It leads down into a hole--lit for the edge of torchlight, then fading into an unknowable darkness. The climb down is easy and unbothered, but after several minutes of climbing, you still can see no features other than the dim light from far above",
  },
  {
    id: 'arachnidCourt',
    name: "Arachnid Court",
    minLevel: 13,
    maxLevel: 17,
    weight: 1,
    mysteryMod: 5,
    troubleMod: -5,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    description: null,
    flavorText: "A huge chamber of carved stone--elliptical, not rectangular. The walls are covered with orderly webs, silk gleaming in dazzling fractal patterns. An spider the size of a horse and her mate, the size of a dog, stand on a dais, regarding you with their sixteen eyes. Their arachnid faces are reflected in their sparkling jeweled coronets.",
  },
  {
    id: 'glacialChasm',
    name: 'Glacial Chasm',
    minLevel: 13,
    maxLevel: 17,
    weight: 1,
    mysteryMod: -4,
    troubleMod: 4,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    description: null,
    flavorText: "This glacial chasm would be less menacing if it were in a glacier. Instead, the cavern floor gives way to a slick, icy crevasse, with frigid air billowing up from the depths.",
  },
  {
    id: 'lavaRiver',
    name: 'Lava Rver',
    minLevel: 13,
    maxLevel: 17,
    weight: 1,
    mysteryMod: -5,
    troubleMod: 5,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    description: null,
    flavorText: "On the bright side, there is nothing uncanny about this chamber. On the downside, it is lit only by the glow of a river of slowly-flowing lava that crosses it. A stone bridge crosses it; pebbles crumble off precariously as you test it with your weight.",
  },
  {
    id: 'silentShadow',
    name: 'silent shadow', // name and flavortext intentionally lowercase
    minLevel: 13,
    maxLevel: 17,
    weight: 1,
    mysteryMod: 5,
    troubleMod: -5,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    description: null,
    flavorText: "here you scarcely see, for the shadows greedily swallow every ray of light. here you dare not not even whisper, for the sound might shatter the darkness and reveal something worse behind it",
  },  
  {
    id: 'crystalGrotto',
    name: 'Crystal Grotto',
    minLevel: 13,
    maxLevel: 17,
    weight: 1,
    mysteryMod: 4,
    troubleMod: 4,
    redrawBonus: 0,
    selectiveRedrawBonus: 1,
    description: "+1 Redraw Selected",
    flavorText: "The inside of a beautiful geode. The walls, floors, and ceiling are all covered with shimmering crystals in blue and violet; pillars of clear and smoky crystal rise to the ceiling. Although beautiful, the strange optics of the crystals make it impossible to hide, and you're not the only one who finds them lovely.",
  },
  {
    id: 'stygianOracle',
    name: 'Stygian Oracle',
    minLevel: 13,
    maxLevel: 17,
    weight: 1,
    mysteryMod: 6,
    troubleMod: 6,
    redrawBonus: 3,
    selectiveRedrawBonus: 0,
    description: '+3 Redraw All',
    flavorText: "A huge figure looms, humanoid, but cloaked in shadow. It peers into a basin of inky black water, and regards you with complete disinterest. The oracles here do not provide answers; they steal answers, and if they run out of answers, they steal the rest of you.",
  },
  {
    id: 'tooCleverFoxCavern',
    name: 'Too-Clever Fox',
    minLevel: 13,
    maxLevel: 17,
    weight: 1,
    mysteryMod: 6,
    troubleMod: -2,
    redrawBonus: 1,
    selectiveRedrawBonus: 0,
    description: '+1 Redraw All',
    flavorText: "Somehow, the fox made it up through the sky, and down through the perils of the cavern. Here, it seems twisted and possessed. It no longer wishes to learn, but to prove its superiority in riddles and tricks once and for all.",
  },
  // 18: Underworld->End Transition
  {
    id: 'skyVaultedGreathall',
    name: 'Sky-Vaulted Greathall',
    minLevel: 18,
    maxLevel: 18,
    weight: 1,
    mysteryMod: 0,
    troubleMod: 0,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    description: null,
    flavorText: "You look up and can't see what's above. The canopy of a forest? The open sky? A cavern roof? Grand pillars and tapestries soar into the air, illumination coming from gleaming white lanterns, chandeliers, and swirling fireflies. A light haze cloaks not only the sky above, but the far end of this room.",
  },
  {
    id: 'error',
    name: 'Error!',
    minLevel: 19,
    maxLevel: 999,
    weight: 1,
    mysteryMod: 12,
    troubleMod: 0,
    redrawBonus: 0,
    selectiveRedrawBonus: 0,
    description: null,
    flavorText: "This encounter isn't supposed to happen.",
  },

];

// Select an encounter based on encounter number (weighted random from available)
// excluded: Set of encounter IDs already seen this run (will not be selected)
function selectEncounter(encounterNumber, excluded = new Set()) {
  const valid = ENCOUNTERS.filter(e => encounterNumber >= e.minLevel && encounterNumber <= e.maxLevel);

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
           [  7,   8,   9,  10,  12,  13,  14,  16,  17,  19,  20,  24,  28,  32,  36,  40,  45,  50,  50,  50];

// Per-level adjustment to base stats per difficulty (index 0 = level 1).
// If encounterNumber exceeds the array, the last value is used.
//            1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17   18   19   20
const DIFFICULTY_ADJUSTMENTS = {
  wizard:  [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  normal:  [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],
  hard:    [  1,   1,   2,   2,   2,   2,   2,   2,   3,   3,   3,   4,   4,   4,   5,   5,   6,   6,   6,   6],
  expert:  [  1,   2,   2,   2,   3,   3,   4,   4,   4,   4,   4,   5,   6,   6,   6,   7,   7,   8,   8,   8],
  insane:  [  2,   3,   4,   4,   4,   6,   8,   8,   8,   8,  10,  10,  10,  12,  12,  14,  16,  18,  20,  20],
};

export function calculateBaseStat(encounterNumber, difficulty = 'normal') {
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
