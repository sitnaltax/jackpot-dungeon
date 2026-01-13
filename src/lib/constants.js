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

// Rank system with multipliers
export const RANKS = {
  basic: { name: 'Basic', multiplier: 1, color: '#888' },
  bronze: { name: 'Bronze', multiplier: 1.5, color: '#cd7f32' },
  silver: { name: 'Silver', multiplier: 2, color: '#c0c0c0' },
  gold: { name: 'Gold', multiplier: 3, color: '#ffd700' },
  platinum: { name: 'Platinum', multiplier: 4, color: '#e5e4e2' },
  diamond: { name: 'Diamond', multiplier: 6, color: '#b9f2ff' },
};

export const RANK_ORDER = ['basic', 'bronze', 'silver', 'gold', 'platinum', 'diamond'];

// Token types
export const TOKEN_TYPES = {
  attack: { name: 'Attack', icon: '⚔️', color: '#e74c3c' },
  defense: { name: 'Defense', icon: '🛡️', color: '#3498db' },
  treasure: { name: 'Treasure', icon: '💰', color: '#f1c40f' },
};

// Calculate effective value of a token
export function getEffectiveValue(token) {
  const rankData = RANKS[token.rank] || RANKS.basic;
  return Math.floor(token.baseValue * rankData.multiplier);
}
