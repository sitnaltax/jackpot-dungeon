// Encounter generation and scaling

// Enemy name pools for variety
const ENEMY_PREFIXES = ['', 'Wild ', 'Fierce ', 'Ancient ', 'Corrupted ', 'Elite '];
const ENEMY_TYPES = [
  // Tier 1 (encounters 1-5)
  ['Goblin', 'Rat', 'Slime', 'Bat', 'Spider'],
  // Tier 2 (encounters 6-10)
  ['Orc', 'Skeleton', 'Wolf', 'Bandit', 'Zombie'],
  // Tier 3 (encounters 11-15)
  ['Troll', 'Ogre', 'Wraith', 'Golem', 'Harpy'],
  // Tier 4 (encounters 16-20)
  ['Dragon', 'Demon', 'Lich', 'Giant', 'Hydra'],
  // Tier 5 (encounters 21+)
  ['Elder Dragon', 'Demon Lord', 'Death Knight', 'Titan', 'Behemoth'],
];

// Get enemy tier based on encounter number
function getEnemyTier(encounterNumber) {
  if (encounterNumber <= 5) return 0;
  if (encounterNumber <= 10) return 1;
  if (encounterNumber <= 15) return 2;
  if (encounterNumber <= 20) return 3;
  return 4;
}

// Generate a random enemy name
function generateEnemyName(encounterNumber) {
  const tier = getEnemyTier(encounterNumber);
  const types = ENEMY_TYPES[tier];
  const type = types[Math.floor(Math.random() * types.length)];

  // Higher encounters get prefixes more often
  const prefixChance = Math.min(0.1 + (encounterNumber * 0.03), 0.7);
  if (Math.random() < prefixChance) {
    const prefix = ENEMY_PREFIXES[Math.floor(Math.random() * ENEMY_PREFIXES.length)];
    return prefix + type;
  }

  return type;
}

// Scaling formulas - adjust these for balance
function calculateHealth(encounterNumber) {
  // Starts at ~8, scales up
  // Encounter 1: 8, 5: 12, 10: 20, 15: 32, 20: 48
  const base = 6;
  const linear = encounterNumber * 1.2;
  const exponential = Math.pow(encounterNumber, 1.3) * 0.3;
  return Math.floor(base + linear + exponential);
}

function calculateDanger(encounterNumber) {
  // Slightly lower than health to give players breathing room early
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
    name: generateEnemyName(encounterNumber),
    health: calculateHealth(encounterNumber),
    danger: calculateDanger(encounterNumber),
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
      health: calculateHealth(i),
      danger: calculateDanger(i),
      reward: calculateTreasureReward(i),
    });
  }
  return preview;
}
