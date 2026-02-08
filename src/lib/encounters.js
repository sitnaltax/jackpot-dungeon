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

function calculateMystery(encounterNumber) {
  const base = 6;
  const linear = encounterNumber * 2;
  return Math.floor(base + linear);
}

function calculateTrouble(encounterNumber) {
  const base = 6;
  const linear = encounterNumber * 2;
  return Math.floor(base + linear);
}

// Generate an encounter for the given encounter number
export function generateEncounter(encounterNumber) {
  return {
    name: generateEncounterName(encounterNumber),
    mystery: calculateMystery(encounterNumber),
    trouble: calculateTrouble(encounterNumber),
    level: encounterNumber,
  };
}

// Preview scaling (useful for balance testing)
export function previewScaling(maxEncounter = 25) {
  const preview = [];
  for (let i = 1; i <= maxEncounter; i++) {
    const mystery = calculateMystery(i);
    preview.push({
      encounter: i,
      mystery,
      trouble: calculateTrouble(i),
      reward: Math.ceiling(mystery / 2),
    });
  }
  return preview;
}
