// Game configuration - easily adjustable for balancing
export const CONFIG = {
  // Pod/Token settings
  podCount: 6,
  tokensPerPod: 3,
  drawCount: 6,

  // Player settings
  startingHealth: 100,
  startingTreasure: 0,

  // Combat settings
  defenseFailFlat: 5,      // Flat damage for failing defense check
  defenseFailScale: 1.5,   // Additional damage per point of deficiency

  // Redraw settings
  redrawsPerEncounter: 1,           // Number of full redraws allowed
  selectiveRedrawsPerEncounter: 1,  // Number of selective redraws (pick any tokens)

  // Shop settings
  shopSize: 4,             // Number of pods offered in shop
};

// Rank system - value is determined entirely by rank
export const RANKS = {
  basic: { name: 'Basic', value: 2, color: '#888' },
  bronze: { name: 'Bronze', value: 3, color: '#cd7f32' },
  silver: { name: 'Silver', value: 5, color: '#c0c0c0' },
  gold: { name: 'Gold', value: 8, color: '#ffd700' },
  platinum: { name: 'Platinum', value: 12, color: '#e5e4e2' },
  diamond: { name: 'Diamond', value: 18, color: '#b9f2ff' },
};

export const RANK_ORDER = ['basic', 'bronze', 'silver', 'gold', 'platinum', 'diamond'];

// Token types
export const TOKEN_TYPES = {
  attack: { name: 'Attack', icon: '⚔️', color: '#e74c3c' },
  defense: { name: 'Defense', icon: '🛡️', color: '#3498db' },
  treasure: { name: 'Treasure', icon: '💰', color: '#f1c40f' },
};

// Get the value of a token (determined by type + rank)
export function getTokenValue(token) {
  const rankData = RANKS[token.rank] || RANKS.basic;
  return rankData.value;
}

// Alias for backwards compatibility
export const getEffectiveValue = getTokenValue;
