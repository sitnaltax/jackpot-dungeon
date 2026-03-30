// Item catalog and item shop generation

// Item categories
export const ITEM_CATEGORIES = {
  book: { name: 'Book', color: '#9b59b6' },
  navigation: { name: 'Navigation Tool', color: '#3498db' },
  lightSource: { name: 'Light Source', color: '#f39c12' },
  weapon: { name: 'Weapon', color: '#e74c3c' },
  jewelry: { name: 'Jewelry', color: '#e91e63' },
  food: { name: 'Food', color: '#28af61' },
  instrument: { name: 'Instrument', color: '#caa512' },
};

// All items in the game
export const ITEMS = {
  // === BOOKS (Redraw Selected) ===
  bookOfTales: {
    id: 'bookOfTales',
    name: 'Book of Tales',
    description: 'A leatherbound book containing fifty useful stories about the nature of this land. Exactly ten of them are true; unfortunately, those aren\'t marked.',
    icon: '📖',
    category: 'book',
    cost: 4,
    bonuses: { selectiveRedraws: 1 },
  },
  librettoOfLies: {
    id: 'librettoOfLies',
    name: "Libretto of Lies",
    description: 'A thin volume written in watery gray ink. If you turn your mind inside-out, you can get useful information from it.',
    icon: '📜',
    category: 'book',
    cost: 10,
    bonuses: { selectiveRedraws: 2 },
  },
  jacqsDiary: {
    id: 'jacqsDiary',
    name: 'Jacq\'s Diary',
    description: 'An diary with modern binding, made in a factory. You have no memory of writing in it, and yet the handwriting is unmistakably yours.',
    icon: '📕',
    category: 'book',
    cost: 14,
    bonuses: { selectiveRedraws: 2, insight: 4 },
  },
  vitreousBible: {
    id: 'vitreousBible',
    name: 'Vitreous Bible',
    description: 'It\'s the Old Testament, describing a bizarre alternate world where everything was made of glass. The back cover is cracked.',
    icon: '📗',
    category: 'book',
    cost: 14,
    bonuses: { selectiveRedraws: 2, resolve: 4 },
  },
  revelatoryBrand: {
    id: 'revelatoryBrand',
    name: 'Revelatory Brand',
    description: 'A porcelain jar that holds an everburning flame. Put your hand in and hold it. Bring it out, and answers are scarred into your skin.',
    icon: '🔥',
    category: 'book',
    cost: 18,
    minDepth: 16,
    bonuses: { selectiveRedraws: 3, resolve: 4 },
  },

  // === NAVIGATION TOOLS (Redraw All) ===
  brassCompass: {
    id: 'brassCompass',
    name: 'Brass Compass',
    description: 'A toy for faerie children. When they first touch it, it forevermore points toward an object they will never reach.',
    icon: '🧭',
    category: 'navigation',
    cost: 2,
    bonuses: { redraws: 1 },
  },
  filigreedSextant: {
    id: 'filigreedSextant',
    name: 'Filigreed Sextant',
    description: 'The stars here are completely foreign, but the designs etched into the metal show the traces of somehow-familiar lands.',
    icon: '🔭',
    category: 'navigation',
    cost: 6,
    bonuses: { redraws: 2 },
  },
  goldenAtlas: {
    id: 'goldenAtlas',
    name: 'Golden Atlas',
    description: 'A sheaf of gold-foiled pewter plates. A map is embossed in each, with features labeled in a mysterious spidery alphabet.',
    icon: '🗺️',
    category: 'navigation',
    cost: 10,
    bonuses: { redraws: 2, insight: 4 },
  },
  diviningRod: {
    id: 'diviningRod',
    name: 'Divining Rod',
    description: 'A thin willow bough that tugs inexorably to your greatest desire. Less useful if you need to find your second greatest desire.',
    icon: '🪄',
    category: 'navigation',
    cost: 16,
    minDepth: 16,
    bonuses: { redraws: 2, selectiveRedraws: 1 },
  },

  // === LIGHT SOURCES (Bonus Draw) ===
  // Only one light source can be equipped at a time.
  weatherproofCandle: {
    id: 'weatherproofCandle',
    name: 'Weatherproof Candle',
    description: 'This candle burns steadily and brightly in any wind or rain.',
    icon: '🕯️',
    category: 'lightSource',
    cost: 5,
    minDepth: 6,
    bonuses: { bonusDraw: 1 },
  },
  fireflyLantern: {
    id: 'fireflyLantern',
    name: 'Firefly Lantern',
    description: 'A crystal jar filled with silvery glowing fireflies.',
    icon: '🏮',
    category: 'lightSource',
    cost: 8,
    minDepth: 6,
    bonuses: { bonusDraw: 1, redraws: 1 },
  },
  catsEyeDraught: {
    id: 'catsEyeDraught',
    name: 'Cat\'s Eye Draught',
    description: 'An enchanted drink that lets you see clearly in even the faintest starlight.',
    icon: '🧪',
    category: 'lightSource',
    cost: 7,
    minDepth: 6,
    bonuses: { bonusDraw: 1, insight: 2 },
  },
  meteoriteTorch: {
    id: 'meteoriteTorch',
    name: 'Meteorite Torch',
    description: 'A luminescent shard of fallen star, lashed to a carved oaken handle.',
    icon: '🌠',
    category: 'lightSource',
    cost: 10,
    minDepth: 12,
    bonuses: { bonusDraw: 2 },
  },
  frozenThunderbolt: {
    id: 'frozenThunderbolt',
    name: 'Frozen Thunderbolt',
    description: 'A miniature thunderbolt, somehow frozen. It feels dangerous to touch, frostbitingly cold and full of ominous potential.',
    icon: '⚡',
    category: 'lightSource',
    cost: 12,
    minDepth: 12,
    bonuses: { bonusDraw: 2, insight: 4 },
  },
  moonConsortsBlessing: {
    id: 'moonConsortsBlessing',
    name: 'Moon Consort\'s Blessing',
    description: 'An eldritch blessing from the moon\'s mercurial love. Light or dark, see the world as if bathed in cool, pale moonlight.',
    icon: '🌙',
    category: 'lightSource',
    cost: 14,
    minDepth: 12,
    bonuses: { bonusDraw: 2, redraws: 1 },
  },
  ancientSunshard: {
    id: 'ancientSunshard',
    name: 'Ancient Sunshard',
    description: 'A fragment of the dawn from before memory, lost for a thousand years and shining bright in your grasp.',
    icon: '☀️',
    category: 'lightSource',
    cost: 15,
    minDepth: 18,
    bonuses: { bonusDraw: 3 },
  },
  prismaticDiamond: {
    id: 'prismaticDiamond',
    name: 'Prismatic Diamond',
    description: 'Illuminated from within, this enormous diamond casts glimmering rainbow fire in every direction.',
    icon: '💎',
    category: 'lightSource',
    cost: 18,
    minDepth: 18,
    bonuses: { bonusDraw: 3, resolve: 6, insight: 2 },
  },
  perfectCrystalSphere: {
    id: 'perfectCrystalSphere',
    name: 'Perfect Crystal Sphere',
    description: 'A flawless sphere of some unknown crystal. Gaze into it and you can see everything. Everything.',
    icon: '🔮',
    category: 'lightSource',
    cost: 20,
    minDepth: 18,
    bonuses: { bonusDraw: 3, redraws: 1 },
  },

  // === WEAPONS (Resolve) ===
  ironDagger: {
    id: 'ironDagger',
    name: 'Iron Dagger',
    description: 'A weapon made of iron marks you as a pariah or rebel. Still, it can absorb dangerous magic in a pinch.',
    icon: '🗡️',
    category: 'weapon',
    cost: 2,
    bonuses: { resolve: 2 },
  },
  silverSword: {
    id: 'silverSword',
    name: 'Silver Sword',
    description: 'It\'s not like you would have any chance to win a sword fight. Still, this beautiful weapon makes you feel heroic just holding it.',
    icon: '⚔️',
    category: 'weapon',
    cost: 4,
    bonuses: { resolve: 6 },
  },
  turnspellShield: {
    id: 'turnspellShield',
    name: 'Turnspell Shield',
    description: 'The planks are oak and rowan, bound with steel and decorated with silver. Weapons and magic alike simply glide off.',
    icon: '🛡️',
    category: 'weapon',
    cost: 6,
    bonuses: { resolve: 6, insight: 2 },
  },
  adamantDrill: {
    id: 'adamantDrill',
    name: 'Adamant Drill',
    description: "A mechanical hand drill. Not just the bit, but the entire device, is made of a brilliant crystal. With enough time it can penetrate any obstacle or mystery.",
    icon: '⛏️',
    category: 'weapon',
    cost: 18,
    minDepth: 16,
    bonuses: { resolve: 12, redraws: 2 },
  },

  // === JEWELRY (Insight) ===
  crystalPendant: {
    id: 'crystalPendant',
    name: 'Crystal Pendant',
    description: "Looking through it is like looking through a broken kaleidoscope. It's a dizzying but effective way to get a new perspective.",
    icon: '💎',
    category: 'jewelry',
    cost: 2,
    bonuses: { insight: 2 },
  },
  hammeredPewterRing: {
    id: 'hammeredPewterRing',
    name: 'Hammered Pewter Ring',
    description: 'A hammered pewter ring set with a roughly carved sapphire. It vibrates silently to call your attention to something you\'ve missed. It\'s usually vibrating.',
    icon: '💍',
    category: 'jewelry',
    cost: 4,
    bonuses: { insight: 6 },
  },
  ivyCrown: {
    id: 'ivyCrown',
    name: 'Ivy Crown',
    description: 'This circlet is made of still-living ivy, with no seams in the vines and no signs of them ever having been cut. ',
    icon: '👑',
    category: 'jewelry',
    cost: 6,
    bonuses: { insight: 6, resolve: 2 },
  },
  opalBrooch: {
    id: 'opalBrooch',
    name: 'Opal Brooch',
    description: 'An enchanted brooch that opens others\' minds--but the communication runs both ways. Advantageous, because they are used to bewildered mortals, but their thoughts are usefully new to you.',
    icon: '📿',
    category: 'jewelry',
    cost: 8,
    bonuses: { insight: 6, redraws: 1 },
  },

  // === INSTRUMENTS (Musical synergy) ===
  reedFlute: {
    id: 'reedFlute',
    name: 'Reed Flute',
    description: 'Made from a hollow reed, dried and lacquered. Despite seeming simple and primitive, it plays clear, haunting tunes.',
    icon: '🪈',
    category: 'instrument',
    cost: 6,
    tags: ['Musical'],
    bonuses: { insight: 2 },
  },
  galeDrum: {
    id: 'galeDrum',
    name: 'Gale Drum',
    description: 'A snare drum that vibrates and sounds under even the smallest force. You can play rhythms on it faster than the syllables of your thoughts.',
    icon: '🥁',
    category: 'instrument',
    cost: 10,
    tags: ['Musical'],
    bonuses: { redraws: 1 },
  },
  spidersilkLute: {
    id: 'spidersilkLute',
    name: 'Spidersilk Lute',
    description: 'A finely carved and polished wooden instrument, strung with spider silk and surprisingly easy to play--more of a ukelele than a lute, really.',
    icon: '🎸',
    category: 'instrument',
    cost: 16,
    minDepth: 12,
    tags: ['Musical'],
    bonuses: { selectiveRedraws: 2 },
  },

  // === FOOD (Stamina) ===
  // On purchase: heal staminaHeal, gain maxStamina bonus (persistent), gain staminaRegen (persistent)
  trailMix: {
    id: 'trailMix',
    name: 'Trail Mix',
    description: 'Contains roasted nuts, dried fruit, and incredibly sweet crystallized berries. You\'ll have to restrain yourself not to eat it all at once.',
    icon: '🍞',
    category: 'food',
    cost: 3,
    bonuses: { maxStamina: 10, staminaRegen: 2 },
    staminaHeal: 10,
  },
  waybread: {
    id: 'waybread',
    name: 'Waybread',
    description: 'The local word for this is an insult, or perhaps a swear. It tastes like thinly-spiced dust. But it\'s nourishing and surprisingly energizing once you choke it down.',
    icon: '🥐',
    category: 'food',
    cost: 5,
    bonuses: { maxStamina: 15, staminaRegen: 3 },
    staminaHeal: 15,
  },
  medicinalHerbs: {
    id: 'medicinalHerbs',
    name: 'Forager\'s Herbs',
    description: "Wolfsbane, bearsbane, lionsbane, and sharksbane. If you don't see any sharks, it's because the bane is working.",
    icon: '🌿',
    category: 'food',
    cost: 12,
    bonuses: { maxStamina: 15, staminaRegen: 3, redraws: 2 },
    staminaHeal: 15,
  },
  feywine: {
    id: 'feywine',
    name: 'Feywine',
    description: 'They say if you drink it, you\'ll never be able to return home. That\'s because it helps you see all the advantages of where you are.',
    icon: '🍷',
    category: 'food',
    cost: 12,
    bonuses: { maxStamina: 10, staminaRegen: 2, selectiveRedraws: 2 },
    staminaHeal: 10,
  },

};

// Weak fallback items for when the player can't afford anything normal
export const WEAK_ITEMS = [
  {
    id: 'magifyingGlass',
    name: 'Magnifying Glass',
    description: 'You could use it to look really hard for clues, or maybe to start a fire.',
    icon: '🔍',
    category: 'jewelry',
    cost: 1,
    bonuses: { insight: 1 },
  },
  {
    id: 'viciousBranch',
    name: 'Vicious Branch',
    description: 'You can pick up a sharp stick and do your best to fight off animals with it. Good luck.',
    icon: '🌿',
    category: 'weapon',
    cost: 1,
    bonuses: { resolve: 1 },
  },
  {
    id: 'hardtack',
    name: 'Hardtack',
    description: 'This used to be some kind of enchanted bread, but the magic has long since spoiled, leaving it barely edible.',
    icon: '🥖',
    category: 'food',
    cost: 1,
    bonuses: { staminaRegen: 2 },
  },
];

// Get all items available for shops
const SHOP_ITEM_POOL = Object.values(ITEMS);

// Generate an ordered sequence of items for script pre-generation.
// Items are picked by weighted random (weight = cost), with replacement allowed.
// rng: optional random function (defaults to Math.random for normal play)
export function generateItemSequence(encounterNumber, count, rng = Math.random) {
  // Filter by depth
  const pool = SHOP_ITEM_POOL.filter(item => (item.minDepth || 0) <= encounterNumber);
  const sequence = [];
  for (let i = 0; i < count; i++) {
    if (pool.length === 0) break;
    const totalWeight = pool.reduce((sum, item) => sum + item.cost, 0);
    let roll = rng() * totalWeight;
    let picked = pool[pool.length - 1];
    for (const item of pool) {
      roll -= item.cost;
      if (roll <= 0) { picked = item; break; }
    }
    sequence.push(picked);
  }
  return sequence;
}

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

  // Exclude items with a worse bonusDraw than the best currently equipped
  const equippedMaxDraw = Math.max(0, ...(playerState.equipment || []).map(e => e?.bonuses?.bonusDraw || 0));
  if (equippedMaxDraw > 0) {
    pool = pool.filter(item => (item.bonuses.bonusDraw || 0) === 0 || (item.bonuses.bonusDraw || 0) >= equippedMaxDraw);
  }

  // Only offer items the player can afford
  const affordablePool = pool.filter(item => item.cost <= budget);

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

  if (affordablePool.length > 0) {
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

    // Fill remaining slots from normal pool, weighted by cost
    const freeSlots = 3 - shopItems.length;
    if (freeSlots > 0) {
      const remaining = affordablePool.filter(i => !usedIds.has(i.id));
      for (let s = 0; s < freeSlots && remaining.length > 0; s++) {
        const totalWeight = remaining.reduce((sum, i) => sum + i.cost, 0);
        let roll = Math.random() * totalWeight;
        let picked = remaining[remaining.length - 1];
        for (const item of remaining) {
          roll -= item.cost;
          if (roll <= 0) { picked = item; break; }
        }
        shopItems.push(picked);
        usedIds.add(picked.id);
        remaining.splice(remaining.indexOf(picked), 1);
      }
    }
  }

  // Pad with weak items if fewer than 3 slots were filled by normal items
  if (shopItems.length < 3) {
    const weakAvailable = WEAK_ITEMS.filter(i => i.cost <= budget && !usedIds.has(i.id));
    for (const item of weakAvailable) {
      if (shopItems.length >= 3) break;
      shopItems.push(item);
      usedIds.add(item.id);
    }
  }

  return shopItems;
}
