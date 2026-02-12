// Item catalog and item shop generation

// Item categories
export const ITEM_CATEGORIES = {
  book: { name: 'Book', color: '#9b59b6' },
  navigation: { name: 'Navigation Tool', color: '#3498db' },
  lightSource: { name: 'Light Source', color: '#f39c12' },
  weapon: { name: 'Weapon', color: '#e74c3c' },
  jewelry: { name: 'Jewelry', color: '#e91e63' },
  food: { name: 'Food', color: '#2ecc71' },
};

// All items in the game
// Pricing formula from spec:
//   Base cost for first level of primary resource
//   Each additional level of same resource: +1 XP cumulative
//   Each secondary resource: its base cost + 1 XP
//
// Base costs: Selective Redraw 3, Redraw All 2, Bonus Draw 5,
//             Resolve 3 (for 2), Insight 3 (for 2),
//             Stamina 3 (for 10 max, 10 heal, +2 regen)

export const ITEMS = {
  // === BOOKS (Redraw Selected) ===
  wornSpellbook: {
    id: 'wornSpellbook',
    name: 'Worn Spellbook',
    description: 'A dog-eared book of minor divinations.',
    icon: '📖',
    category: 'book',
    cost: 3, // 3 (1 selective)
    bonuses: { selectiveRedraws: 1 },
  },
  sagesFolio: {
    id: 'sagesFolio',
    name: "Sage's Folio",
    description: 'Collected wisdom of a dozen seers.',
    icon: '📜',
    category: 'book',
    cost: 7, // 3 + 4 (2 selective)
    bonuses: { selectiveRedraws: 2 },
  },
  enchantedGrimoire: {
    id: 'enchantedGrimoire',
    name: 'Enchanted Grimoire',
    description: 'Its pages glow faintly in the dark.',
    icon: '📕',
    category: 'book',
    cost: 7, // 3 (selective) + 3 (insight) + 1 (secondary)
    bonuses: { selectiveRedraws: 1, insight: 2 },
  },
  battleManual: {
    id: 'battleManual',
    name: 'Battle Manual',
    description: 'Tactical formations of the fey wars.',
    icon: '📗',
    category: 'book',
    cost: 7, // 3 (selective) + 3 (resolve) + 1 (secondary)
    bonuses: { selectiveRedraws: 1, resolve: 2 },
  },

  // === NAVIGATION TOOLS (Redraw All) ===
  brassCompass: {
    id: 'brassCompass',
    name: 'Brass Compass',
    description: 'Points toward something, not always north.',
    icon: '🧭',
    category: 'navigation',
    cost: 2, // 2 (1 redraw all)
    bonuses: { redraws: 1 },
  },
  silverSextant: {
    id: 'silverSextant',
    name: 'Silver Sextant',
    description: 'Navigate by stars and steel.',
    icon: '🔭',
    category: 'navigation',
    cost: 6, // 2 (redraw all) + 3 (resolve) + 1 (secondary)
    bonuses: { redraws: 1, resolve: 2 },
  },
  goldenAstrolabe: {
    id: 'goldenAstrolabe',
    name: 'Golden Astrolabe',
    description: 'Maps the movements of celestial bodies.',
    icon: '⚙️',
    category: 'navigation',
    cost: 5, // 2 + 3 (2 redraw all)
    bonuses: { redraws: 2 },
  },
  diviningRod: {
    id: 'diviningRod',
    name: 'Divining Rod',
    description: 'Twitches toward hidden truths.',
    icon: '🪄',
    category: 'navigation',
    cost: 6, // 2 (redraw all) + 3 (insight) + 1 (secondary)
    bonuses: { redraws: 1, insight: 2 },
  },

  // === LIGHT SOURCES (Bonus Draw) ===
  // Only one light source can be equipped at a time.
  // +2 draw items only appear at depth 14+.
  tallowCandle: {
    id: 'tallowCandle',
    name: 'Tallow Candle',
    description: 'Barely enough to see by.',
    icon: '🕯️',
    category: 'lightSource',
    cost: 5, // 5 (1 draw)
    bonuses: { bonusDraw: 1 },
  },
  ironLantern: {
    id: 'ironLantern',
    name: 'Iron Lantern',
    description: 'Steady light for dark places.',
    icon: '🏮',
    category: 'lightSource',
    cost: 5, // 5 (1 draw)
    bonuses: { bonusDraw: 1 },
  },
  enchantedTorch: {
    id: 'enchantedTorch',
    name: 'Enchanted Torch',
    description: 'Burns with foxfire that never fades.',
    icon: '🔥',
    category: 'lightSource',
    cost: 11, // 5 + 6 (2 draw)
    minDepth: 14,
    bonuses: { bonusDraw: 2 },
  },
  faerieLamp: {
    id: 'faerieLamp',
    name: 'Faerie Lamp',
    description: 'Captured starlight in a glass vial.',
    icon: '✨',
    category: 'lightSource',
    cost: 11, // 5 + 6 (2 draw)
    minDepth: 14,
    bonuses: { bonusDraw: 2 },
  },

  // === WEAPONS (Resolve) ===
  ironDagger: {
    id: 'ironDagger',
    name: 'Iron Dagger',
    description: 'Simple but dependable.',
    icon: '🗡️',
    category: 'weapon',
    cost: 3, // 3 (2 resolve)
    bonuses: { resolve: 2 },
  },
  silverSword: {
    id: 'silverSword',
    name: 'Silver Sword',
    description: 'Forged to fight the fey.',
    icon: '⚔️',
    category: 'weapon',
    cost: 7, // 3 + 4 (4 resolve)
    bonuses: { resolve: 4 },
  },
  rowanShield: {
    id: 'rowanShield',
    name: 'Rowan Shield',
    description: 'Warding wood that turns aside curses.',
    icon: '🛡️',
    category: 'weapon',
    cost: 6, // 3 (resolve) + 2 (redraw all) + 1 (secondary)
    bonuses: { resolve: 2, redraws: 1 },
  },
  thornWhip: {
    id: 'thornWhip',
    name: 'Thorn Whip',
    description: 'Grown from a fey bramble. Reveals as it strikes.',
    icon: '🌿',
    category: 'weapon',
    cost: 7, // 3 (resolve) + 3 (insight) + 1 (secondary)
    bonuses: { resolve: 2, insight: 2 },
  },

  // === JEWELRY (Insight) ===
  crystalPendant: {
    id: 'crystalPendant',
    name: 'Crystal Pendant',
    description: "Focuses the mind's eye.",
    icon: '💎',
    category: 'jewelry',
    cost: 3, // 3 (2 insight)
    bonuses: { insight: 2 },
  },
  moonstoneRing: {
    id: 'moonstoneRing',
    name: 'Moonstone Ring',
    description: 'See by inner light.',
    icon: '💍',
    category: 'jewelry',
    cost: 7, // 3 + 4 (4 insight)
    bonuses: { insight: 4 },
  },
  amethystCirclet: {
    id: 'amethystCirclet',
    name: 'Amethyst Circlet',
    description: 'A crown of foresight.',
    icon: '👑',
    category: 'jewelry',
    cost: 7, // 3 (insight) + 3 (selective) + 1 (secondary)
    bonuses: { insight: 2, selectiveRedraws: 1 },
  },
  opalBrooch: {
    id: 'opalBrooch',
    name: 'Opal Brooch',
    description: 'Beauty and strength intertwined.',
    icon: '📿',
    category: 'jewelry',
    cost: 7, // 3 (insight) + 3 (resolve) + 1 (secondary)
    bonuses: { insight: 2, resolve: 2 },
  },

  // === FOOD (Stamina) ===
  // On purchase: heal staminaHeal, gain maxStamina bonus (persistent), gain staminaRegen (persistent)
  trailRations: {
    id: 'trailRations',
    name: 'Trail Rations',
    description: 'Enough to keep you going.',
    icon: '🍞',
    category: 'food',
    cost: 3, // 3 (stamina base)
    bonuses: { maxStamina: 10, staminaRegen: 2 },
    staminaHeal: 10,
  },
  elvenWaybread: {
    id: 'elvenWaybread',
    name: 'Elven Waybread',
    description: 'One bite restores the weary.',
    icon: '🥐',
    category: 'food',
    cost: 7, // 3 + 4 (double stamina)
    bonuses: { maxStamina: 20, staminaRegen: 4 },
    staminaHeal: 20,
  },
  healingHerbs: {
    id: 'healingHerbs',
    name: 'Healing Herbs',
    description: "Nature's remedy strengthens body and will.",
    icon: '🌿',
    category: 'food',
    cost: 7, // 3 (stamina) + 3 (resolve) + 1 (secondary)
    bonuses: { maxStamina: 10, staminaRegen: 2, resolve: 2 },
    staminaHeal: 10,
  },
  feyFruit: {
    id: 'feyFruit',
    name: 'Fey Fruit',
    description: 'Sweet and strange, it sharpens the senses.',
    icon: '🍇',
    category: 'food',
    cost: 7, // 3 (stamina) + 3 (insight) + 1 (secondary)
    bonuses: { maxStamina: 10, staminaRegen: 2, insight: 2 },
    staminaHeal: 10,
  },

  // === STARTING EQUIPMENT ===
  // These are given at game start and use the same item system
  inheritedDiary: {
    id: 'inheritedDiary',
    name: 'Inherited Diary',
    description: 'A worn journal passed down through generations, filled with cryptic notes.',
    icon: '📔',
    category: 'book',
    cost: 3,
    bonuses: { selectiveRedraws: 1 },
  },
  antiquePendant: {
    id: 'antiquePendant',
    name: 'Antique Pendant',
    description: 'A tarnished silver pendant that hums with faint energy.',
    icon: '📿',
    category: 'navigation',
    cost: 2,
    bonuses: { redraws: 1 },
  },
};

// Starting equipment for new games
export const STARTING_EQUIPMENT = [
  ITEMS.inheritedDiary,
  ITEMS.antiquePendant,
  null, // Empty slot
];

// Get all items available for shops (excludes starting-only items)
const SHOP_ITEM_POOL = Object.values(ITEMS).filter(
  item => item.id !== 'inheritedDiary' && item.id !== 'antiquePendant'
);

// Generate item shop offerings
export function generateItemShop(encounterNumber, playerState) {
  // Filter by depth
  let pool = SHOP_ITEM_POOL.filter(item => (item.minDepth || 0) <= encounterNumber);

  // Exclude items the player already has equipped
  const equippedIds = new Set(
    (playerState.equipment || []).filter(e => e).map(e => e.id)
  );
  pool = pool.filter(item => !equippedIds.has(item.id));

  const shopItems = [];
  const usedIds = new Set();

  function pickFrom(candidates) {
    const available = candidates.filter(i => !usedIds.has(i.id));
    if (available.length === 0) return null;
    const pick = available[Math.floor(Math.random() * available.length)];
    usedIds.add(pick.id);
    shopItems.push(pick);
    return pick;
  }

  // Guarantee: depth 14+ → at least one +2 draw Light Source
  const hasLightSource = (playerState.equipment || []).some(
    e => e?.category === 'lightSource'
  );
  const hasGoodLight = (playerState.equipment || []).some(
    e => e?.category === 'lightSource' && (e.bonuses?.bonusDraw || 0) >= 2
  );

  if (encounterNumber >= 14 && !hasGoodLight) {
    const bigLights = pool.filter(
      i => i.category === 'lightSource' && (i.bonuses.bonusDraw || 0) >= 2
    );
    pickFrom(bigLights);
  } else if (encounterNumber >= 8 && !hasLightSource) {
    // Guarantee: depth 8+ → at least one Light Source
    const lights = pool.filter(i => i.category === 'lightSource');
    pickFrom(lights);
  }

  // Guarantee: low HP → at least one Food
  const hpPercent = playerState.stamina / playerState.maxStamina;
  if (hpPercent < 0.75) {
    const foods = pool.filter(i => i.category === 'food' && !usedIds.has(i.id));
    pickFrom(foods);
  }

  // Fill remaining slots (up to 3 total)
  const remaining = pool.filter(i => !usedIds.has(i.id));
  const shuffled = [...remaining].sort(() => Math.random() - 0.5);

  for (const item of shuffled) {
    if (shopItems.length >= 3) break;
    shopItems.push(item);
    usedIds.add(item.id);
  }

  return shopItems;
}
