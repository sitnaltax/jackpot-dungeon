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

// Rank system - value is determined entirely by rank
export const RANKS = {
  basic: { name: 'Basic', value: 5, color: '#888' },
  bronze: { name: 'Bronze', value: 7, color: '#cd7f32' },
  silver: { name: 'Silver', value: 10, color: '#c0c0c0' },
  gold: { name: 'Gold', value: 13, color: '#ffd700' },
  platinum: { name: 'Platinum', value: 15, color: '#e5e4e2' },
  diamond: { name: 'Diamond', value: 20, color: '#b9f2ff' },
};

export const RANK_ORDER = ['basic', 'bronze', 'silver', 'gold', 'platinum', 'diamond'];

// Token types
export const TOKEN_TYPES = {
  insight: { name: 'Insight', icon: '👁️', color: '#e74c3c' },
  composure: { name: 'Composure', icon: '💭', color: '#3498db' },
  treasure: { name: 'Treasure', icon: '💰', color: '#f1c40f' },
};

// Get the value of a token (determined by type + rank)
export function getTokenValue(token) {
  const rankData = RANKS[token.rank] || RANKS.basic;
  return rankData.value;
}

// Alias for backwards compatibility
export const getEffectiveValue = getTokenValue;
