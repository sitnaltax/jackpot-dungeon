// Encounter generation and scaling

// Fey encounter name pools
const FEY_PREFIXES = ['', 'Curious ', 'Mischievous ', 'Ancient ', 'Twilight ', 'Gleaming '];
const FEY_ENCOUNTERS = [
  // Tier 1 (encounters 1-5) - Minor Fey
  ['Pixie Swarm', 'Will-o\'-Wisp', 'Talking Fox', 'Mirror Sprite', 'Mushroom Circle'],
  // Tier 2 (encounters 6-10) - Lesser Fey
  ['Dryad\'s Riddle', 'Selkie Bargain', 'Phooka\'s Game', 'Kelpie Crossing', 'Changeling Child'],
  // Tier 3 (encounters 11-15) - Greater Fey
  ['Erlking\'s Hunt', 'Banshee\'s Lament', 'Redcap\'s Challenge', 'Clurichaun\'s Wager', 'Spriggan Court'],
  // Tier 4 (encounters 16-20) - Noble Fey
  ['Sidhe Lord', 'Queen\'s Emissary', 'Wild Hunt Scout', 'Fomorian Elder', 'Leanan Sidhe'],
  // Tier 5 (encounters 21+) - Archfey
  ['The Erlking Himself', 'Queen of Air and Darkness', 'Lord of the Wild Hunt', 'The Green Man', 'Oberon\'s Shadow'],
];

// Get encounter tier based on encounter number
function getEncounterTier(encounterNumber) {
  if (encounterNumber <= 5) return 0;
  if (encounterNumber <= 10) return 1;
  if (encounterNumber <= 15) return 2;
  if (encounterNumber <= 20) return 3;
  return 4;
}

// Generate a random fey encounter name
function generateEncounterName(encounterNumber) {
  const tier = getEncounterTier(encounterNumber);
  const encounters = FEY_ENCOUNTERS[tier];
  const encounter = encounters[Math.floor(Math.random() * encounters.length)];

  // Higher encounters get prefixes more often
  const prefixChance = Math.min(0.1 + (encounterNumber * 0.03), 0.7);
  if (Math.random() < prefixChance) {
    const prefix = FEY_PREFIXES[Math.floor(Math.random() * FEY_PREFIXES.length)];
    return prefix + encounter;
  }

  return encounter;
}

// Scaling formulas - adjust these for balance
function calculateMystery(encounterNumber) {
  // Mystery level - what insight must reveal
  // Starts at ~8, scales up
  // Encounter 1: 8, 5: 12, 10: 20, 15: 32, 20: 48
  const base = 6;
  const linear = encounterNumber * 1.2;
  const exponential = Math.pow(encounterNumber, 1.3) * 0.3;
  return Math.floor(base + linear + exponential);
}

function calculateTrouble(encounterNumber) {
  // Trouble level - what resolve must withstand
  // Slightly lower than mystery to give players breathing room early
  // Encounter 1: 5, 5: 9, 10: 16, 15: 26, 20: 40
  const base = 4;
  const linear = encounterNumber * 1.0;
  const exponential = Math.pow(encounterNumber, 1.3) * 0.25;
  return Math.floor(base + linear + exponential);
}

function calculateTreasureReward(encounterNumber) {
  // Reward for defeating the encounter
  // Encounter 1: 8, 5: 12, 10: 18, 15: 26, 20: 36
  const base = 6;
  const linear = encounterNumber * 1.5;
  const bonus = Math.floor(encounterNumber / 5) * 2; // Bonus every 5 encounters
  return Math.floor(base + linear + bonus);
}

// Generate an encounter for the given encounter number
export function generateEncounter(encounterNumber) {
  return {
    name: generateEncounterName(encounterNumber),
    mystery: calculateMystery(encounterNumber),
    trouble: calculateTrouble(encounterNumber),
    treasureReward: calculateTreasureReward(encounterNumber),
    level: encounterNumber,
  };
}

// Preview scaling (useful for balance testing)
export function previewScaling(maxEncounter = 25) {
  const preview = [];
  for (let i = 1; i <= maxEncounter; i++) {
    preview.push({
      encounter: i,
      mystery: calculateMystery(i),
      trouble: calculateTrouble(i),
      reward: calculateTreasureReward(i),
    });
  }
  return preview;
}
