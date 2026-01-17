// Game configuration - easily adjustable for balancing
export const CONFIG = {
  // Pod/Token settings
  podCount: 6,
  tokensPerPod: 3,
  drawCount: 6,

  // Player settings
  startingStamina: 20,
  startingTreasure: 10,

  // Combat settings
  composureFailFlat: 5,      // Flat stamina loss for failing composure check
  composureFailScale: 1.5,   // Additional stamina loss per point of deficiency

  // Redraw settings
  redrawsPerEncounter: 1,           // Number of full redraws allowed
  selectiveRedrawsPerEncounter: 1,  // Number of selective redraws (pick any tokens)

  // Shop settings
  shopSize: 4,             // Number of pods offered in shop
};

// Rank system - multipliers applied to base token values
export const RANKS = {
  inferior: { name: 'Inferior', multiplier: 0.8, color: '#555' },
  basic: { name: 'Basic', multiplier: 1, color: '#888' },
  bronze: { name: 'Bronze', multiplier: 1.25, color: '#cd7f32' },
  silver: { name: 'Silver', multiplier: 1.5, color: '#c0c0c0' },
  gold: { name: 'Gold', multiplier: 1.75, color: '#ffd700' },
  platinum: { name: 'Platinum', multiplier: 2, color: '#e5e4e2' },
  diamond: { name: 'Diamond', multiplier: 2.5, color: '#b9f2ff' },
};

// Note: inferior is excluded - it only appears in starting pods
export const RANK_ORDER = ['basic', 'bronze', 'silver', 'gold', 'platinum', 'diamond'];

// Token types with base values
export const TOKEN_TYPES = {
  insight: { name: 'Insight', icon: '👁️', color: '#e74c3c', baseValue: 5 },
  composure: { name: 'Composure', icon: '💭', color: '#3498db', baseValue: 5 },
  treasure: { name: 'Treasure', icon: '💰', color: '#f1c40f', baseValue: 5 },
};

// Get the value of a token (base value * rank multiplier)
export function getTokenValue(token) {
  const typeData = TOKEN_TYPES[token.type];
  const rankData = RANKS[token.rank] || RANKS.basic;
  return Math.floor(typeData.baseValue * rankData.multiplier);
}

// Alias for backwards compatibility
export const getEffectiveValue = getTokenValue;
