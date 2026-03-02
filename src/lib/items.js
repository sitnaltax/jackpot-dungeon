// Item catalog and item shop generation

// Item categories
export const ITEM_CATEGORIES = {
  book: { name: 'Book', color: '#9b59b6' },
  navigation: { name: 'Navigation Tool', color: '#3498db' },
  lightSource: { name: 'Light Source', color: '#f39c12' },
  weapon: { name: 'Weapon', color: '#e74c3c' },
  jewelry: { name: 'Jewelry', color: '#e91e63' },
  food: { name: 'Food', color: '#2ecc71' },
  instrument: { name: 'Instrument', color: '#f1c40f' },
};

// All items in the game
// Flat additive pricing:
//   Selective Redraw $4, Redraw All $2, Bonus Draw $5,
//   Resolve $3 (for 2), Insight $3 (for 2),
//   Stamina $3 (for 10 max, 10 heal, +2 regen)
// Multi-bonus items: just sum the base costs.

export const ITEMS = {
  // === BOOKS (Redraw Selected) ===
  wornSpellbook: {
    id: 'wornSpellbook',
    name: 'Worn Spellbook',
    description: 'A dog-eared book of minor divinations.',
    icon: '📖',
    category: 'book',
    cost: 4, // 4 (1 selective)
    bonuses: { selectiveRedraws: 1 },
  },
  sagesFolio: {
    id: 'sagesFolio',
    name: "Sage's Folio",
    description: 'Collected wisdom of a dozen seers.',
    icon: '📜',
    category: 'book',
    cost: 8, // 4 + 4 (2 selective)
    bonuses: { selectiveRedraws: 2 },
  },
  enchantedGrimoire: {
    id: 'enchantedGrimoire',
    name: 'Enchanted Grimoire',
    description: 'Its pages glow faintly in the dark.',
    icon: '📕',
    category: 'book',
    cost: 7, // 4 (selective) + 3 (insight)
    bonuses: { selectiveRedraws: 1, insight: 2 },
  },
  battleManual: {
    id: 'battleManual',
    name: 'Battle Manual',
    description: 'Tactical formations of the fey wars.',
    icon: '📗',
    category: 'book',
    cost: 7, // 4 (selective) + 3 (resolve)
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
    cost: 5, // 2 (redraw all) + 3 (resolve)
    bonuses: { redraws: 1, resolve: 2 },
  },
  goldenAstrolabe: {
    id: 'goldenAstrolabe',
    name: 'Golden Astrolabe',
    description: 'Maps the movements of celestial bodies.',
    icon: '⚙️',
    category: 'navigation',
    cost: 4, // 2 + 2 (2 redraw all)
    bonuses: { redraws: 2 },
  },
  diviningRod: {
    id: 'diviningRod',
    name: 'Divining Rod',
    description: 'Twitches toward hidden truths.',
    icon: '🪄',
    category: 'navigation',
    cost: 5, // 2 (redraw all) + 3 (insight)
    bonuses: { redraws: 1, insight: 2 },
  },

  // === LIGHT SOURCES (Bonus Draw) ===
  // Only one light source can be equipped at a time.
  // +1 draw at depth 6+, +2 draw at depth 12+, +3 draw at depth 18+.
  weatherproofCandle: {
    id: 'weatherproofCandle',
    name: 'Weatherproof Candle',
    description: 'This candle burns steadily and brightly in any wind or rain.',
    icon: '🕯️',
    category: 'lightSource',
    cost: 5, // 5 (1 draw)
    minDepth: 6,
    bonuses: { bonusDraw: 1 },
  },
  fireflyLantern: {
    id: 'fireflyLantern',
    name: 'Firefly Lantern',
    description: 'A crystal jar filled with silvery glowing fireflies.',
    icon: '🏮',
    category: 'lightSource',
    cost: 7, // 5 (1 draw) + 2 (redraw all)
    minDepth: 6,
    bonuses: { bonusDraw: 1, redraws: 1 },
  },
  catsEyeDraught: {
    id: 'catsEyeDraught',
    name: 'Cat\'s Eye Draught',
    description: 'An enchanted elixir that lets you see clearly in even the faintest starlight.',
    icon: '🧪',
    category: 'lightSource',
    cost: 8, // 5 (1 draw) + 3 (insight)
    minDepth: 6,
    bonuses: { bonusDraw: 1, insight: 2 },
  },
  enchantedTorch: {
    id: 'enchantedTorch',
    name: 'Enchanted Torch',
    description: 'Burns with foxfire that never fades.',
    icon: '🔥',
    category: 'lightSource',
    cost: 10, // 5 + 5 (2 draw)
    minDepth: 12,
    bonuses: { bonusDraw: 2 },
  },
  faerieLamp: {
    id: 'faerieLamp',
    name: 'Faerie Lamp',
    description: 'Captured starlight in a glass vial.',
    icon: '✨',
    category: 'lightSource',
    cost: 10, // 5 + 5 (2 draw)
    minDepth: 12,
    bonuses: { bonusDraw: 2 },
  },
  blazingSunstone: {
    id: 'blazingSunstone',
    name: 'Blazing Sunstone',
    description: 'A fragment of captured dawn.',
    icon: '☀️',
    category: 'lightSource',
    cost: 15, // 5 + 5 + 5 (3 draw)
    minDepth: 18,
    bonuses: { bonusDraw: 3 },
  },
  etherealLantern: {
    id: 'etherealLantern',
    name: 'Ethereal Lantern',
    description: 'Burns with light from another plane.',
    icon: '💡',
    category: 'lightSource',
    cost: 15, // 5 + 5 + 5 (3 draw)
    minDepth: 18,
    bonuses: { bonusDraw: 3 },
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
    cost: 6, // 3 + 3 (4 resolve)
    bonuses: { resolve: 4 },
  },
  rowanShield: {
    id: 'rowanShield',
    name: 'Rowan Shield',
    description: 'Warding wood that turns aside curses.',
    icon: '🛡️',
    category: 'weapon',
    cost: 5, // 3 (resolve) + 2 (redraw all)
    bonuses: { resolve: 2, redraws: 1 },
  },
  thornWhip: {
    id: 'thornWhip',
    name: 'Thorn Whip',
    description: 'Grown from a fey bramble. Reveals as it strikes.',
    icon: '🌿',
    category: 'weapon',
    cost: 6, // 3 (resolve) + 3 (insight)
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
    cost: 6, // 3 + 3 (4 insight)
    bonuses: { insight: 4 },
  },
  amethystCirclet: {
    id: 'amethystCirclet',
    name: 'Amethyst Circlet',
    description: 'A crown of foresight.',
    icon: '👑',
    category: 'jewelry',
    cost: 7, // 3 (insight) + 4 (selective)
    bonuses: { insight: 2, selectiveRedraws: 1 },
  },
  opalBrooch: {
    id: 'opalBrooch',
    name: 'Opal Brooch',
    description: 'Beauty and strength intertwined.',
    icon: '📿',
    category: 'jewelry',
    cost: 6, // 3 (insight) + 3 (resolve)
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
    cost: 6, // 3 + 3 (double stamina)
    bonuses: { maxStamina: 20, staminaRegen: 4 },
    staminaHeal: 20,
  },
  healingHerbs: {
    id: 'healingHerbs',
    name: 'Healing Herbs',
    description: "Nature's remedy strengthens body and will.",
    icon: '🌿',
    category: 'food',
    cost: 6, // 3 (stamina) + 3 (resolve)
    bonuses: { maxStamina: 10, staminaRegen: 2, resolve: 2 },
    staminaHeal: 10,
  },
  feyFruit: {
    id: 'feyFruit',
    name: 'Fey Fruit',
    description: 'Sweet and strange, it sharpens the senses.',
    icon: '🍇',
    category: 'food',
    cost: 6, // 3 (stamina) + 3 (insight)
    bonuses: { maxStamina: 10, staminaRegen: 2, insight: 2 },
    staminaHeal: 10,
  },

};

// Weak fallback items for when the player can't afford anything normal
const WEAK_ITEMS = [
  {
    id: 'weakInsight',
    name: 'Cracked Lens',
    description: 'Chipped but still reveals a little.',
    icon: '🔍',
    category: 'jewelry',
    cost: 1,
    bonuses: { insight: 1 },
  },
  {
    id: 'weakResolve',
    name: 'Rusty Knife',
    description: 'Dull but still pointy.',
    icon: '🔪',
    category: 'weapon',
    cost: 1,
    bonuses: { resolve: 1 },
  },
  {
    id: 'weakStamina',
    name: 'Stale Bread',
    description: 'Hard as a rock but nourishing.',
    icon: '🥖',
    category: 'food',
    cost: 1,
    bonuses: { staminaRegen: 2 },
  },
];

// Get all items available for shops
const SHOP_ITEM_POOL = Object.values(ITEMS);

// Generate item shop offerings
export function generateItemShop(encounterNumber, playerState) {
  const budget = playerState.treasure || 0;

  // Filter by depth
  let pool = SHOP_ITEM_POOL.filter(item => (item.minDepth || 0) <= encounterNumber);

  // Apply class-specific shop filter
  const classFilter = playerState.playerClass?.shopItemFilter;
  if (classFilter) {
    pool = pool.filter(classFilter);
  }

  // Exclude items the player already has equipped
  const equippedIds = new Set(
    (playerState.equipment || []).filter(e => e).map(e => e.id)
  );
  pool = pool.filter(item => !equippedIds.has(item.id));

  // Only offer items the player can afford
  let affordablePool = pool.filter(item => item.cost <= budget);

  // If nothing affordable, use weak fallback items
  let usingWeakItems = false;
  if (affordablePool.length === 0) {
    affordablePool = WEAK_ITEMS.filter(item => item.cost <= budget);
    usingWeakItems = true;
  }

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

  if (!usingWeakItems) {
    // Guarantee: depth 6+ → best affordable light source (unless player already has one at that level)
    if (encounterNumber >= 6) {
      const affordableLights = affordablePool.filter(i => i.category === 'lightSource');
      if (affordableLights.length > 0) {
        // Pick the highest bonusDraw tier the player can afford
        const maxDraw = Math.max(...affordableLights.map(i => i.bonuses.bonusDraw || 0));
        const equippedLight = (playerState.equipment || []).find(e => e?.category === 'lightSource');
        const equippedDraw = equippedLight?.bonuses?.bonusDraw || 0;
        if (equippedDraw < maxDraw) {
          const bestLights = affordableLights.filter(i => (i.bonuses.bonusDraw || 0) === maxDraw);
          pickFrom(bestLights);
        }
      }
    }

    // Guarantee: low HP → at least one affordable Food
    const hpPercent = playerState.stamina / playerState.maxStamina;
    if (hpPercent < 0.75) {
      const foods = affordablePool.filter(i => i.category === 'food' && !usedIds.has(i.id));
      if (foods.length > 0) {
        pickFrom(foods);
      }
    }
  }

  // Fill remaining slots (up to 3 total)
  // Pick 2x free slots randomly, then take the most expensive ones
  const freeSlots = 3 - shopItems.length;
  if (freeSlots > 0) {
    const remaining = affordablePool.filter(i => !usedIds.has(i.id));
    const shuffled = [...remaining].sort(() => Math.random() - 0.5);
    const candidates = shuffled.slice(0, freeSlots * 2);
    // Sort by cost descending, pick the most expensive
    candidates.sort((a, b) => b.cost - a.cost);
    for (const item of candidates) {
      if (shopItems.length >= 3) break;
      shopItems.push(item);
      usedIds.add(item.id);
    }
  }

  return shopItems;
}
