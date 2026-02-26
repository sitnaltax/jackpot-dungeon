// Game configuration - easily adjustable for balancing
export const CONFIG = {
  // Pod/Token settings
  podCount: 6,
  tokensPerPod: 3,
  drawCount: 6,

  // Player settings
  startingStamina: 25,
  startingXp: 10,

  // Combat settings
  resolveFailFlat: 5,      // Flat stamina loss for failing resolve check
  resolveFailScale: 1.5,   // Additional stamina loss per point of deficiency

  // Redraw settings (base values - equipment adds to these)
  redrawsPerEncounter: 0,           // Number of full redraws allowed
  selectiveRedrawsPerEncounter: 0,  // Number of selective redraws (pick any tokens)

  // Pod expansion - extra pods added per bonus draw gained
  podsPerBonusDraw: 2,

  // Shop settings
  shopSize: 4,             // Number of pods offered in shop
};

// Rank system - multipliers applied to base token values
export const RANKS = {
  iron: { name: 'Iron', multiplier: 0.8, cost: 0, color: '#555' },
  ordinary: { name: 'Ordinary', multiplier: 1,   cost: 0, color: '#c8f0c0' },
  bronze:   { name: 'Bronze',   multiplier: 1.25, cost: 2, color: '#cd7f32' },
  silver:   { name: 'Silver',   multiplier: 1.5,  cost: 4, color: '#c0c0c0' },
  gold:     { name: 'Gold',     multiplier: 1.75, cost: 6, color: '#ffd700' },
  platinum: { name: 'Platinum', multiplier: 2,   cost: 8, color: '#e2d2df' },
  diamond:  { name: 'Diamond',  multiplier: 2.5, cost: 10, color: '#83e8ff' },
};

// Note: iron is excluded - it only appears in starting pods
export const RANK_ORDER = ['ordinary', 'bronze', 'silver', 'gold', 'platinum', 'diamond'];

export const TOKEN_BASE_COST = 2;

// Equipment system
export const EQUIPMENT_SLOTS = 3;
