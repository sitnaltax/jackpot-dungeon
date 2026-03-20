import { mulberry32 } from './rng.js';
import { CLASSES } from './classes.js';
import { generateEncounter, FINAL_ORDEALS } from './encounters.js';
import { generateShopPods } from './pods.js';
import { generateItemSequence } from './items.js';
import { CONFIG } from './constants.js';

const DEPTHS = 25;
const POD_SHOP_SETS = 16; // initial + 15 refreshes
const ITEM_SHOP_COUNT = 10;
const ITEM_SEQUENCE_LENGTH = 120;

export function generateDailyScript(seed) {
  const rng = mulberry32(seed);

  // Pick class — all CLASSES are valid (wizard is a difficulty, not a class)
  const eligibleClasses = Object.values(CLASSES);
  const dailyClass = eligibleClasses[Math.floor(rng() * eligibleClasses.length)].id;

  // Pick ordeal variant
  const ordealVariant = FINAL_ORDEALS[Math.floor(rng() * FINAL_ORDEALS.length)].id;

  // Generate encounter templates for each depth.
  // We store the raw encounter template (without difficulty-scaled mystery/trouble),
  // so that mystery/trouble can be computed at display time based on actual player difficulty.
  // To do this, generate with 'normal' then strip the scaled values — we only need the
  // template properties (id, name, modifiers, etc).
  const encounters = [];
  const usedBasicIds = new Set();
  for (let depth = 1; depth <= DEPTHS; depth++) {
    const basicFull = generateEncounter(depth, 'normal', usedBasicIds, rng);
    usedBasicIds.add(basicFull.id);
    // Hard encounter must not match the basic encounter at this depth
    const hardFull = generateEncounter(depth + 2, 'normal', new Set([basicFull.id]), rng);
    // Strip out the difficulty-scaled mystery/trouble so they're computed fresh at consumption time
    // eslint-disable-next-line no-unused-vars
    const { mystery: _bm, trouble: _bt, ...basicTemplate } = basicFull;
    // eslint-disable-next-line no-unused-vars
    const { mystery: _hm, trouble: _ht, ...hardTemplate } = hardFull;
    encounters.push({
      basic: basicTemplate,
      hard: hardTemplate,
      podReward: generateShopPods(depth, 1, rng)[0] ?? null,
    });
  }

  // Generate pod shop sets for each depth
  const podShops = [];
  for (let depth = 1; depth <= DEPTHS; depth++) {
    const sets = [];
    for (let i = 0; i < POD_SHOP_SETS; i++) {
      sets.push(generateShopPods(depth, CONFIG.shopSize, rng));
    }
    podShops.push(sets);
  }

  // Generate item shop sequences
  const itemShops = [];
  for (let slot = 0; slot < ITEM_SHOP_COUNT; slot++) {
    // Use increasing depth estimates for scaling (depths 4, 8, 12, ...)
    const depth = (slot + 1) * 4;
    const sequence = generateItemSequence(depth, ITEM_SEQUENCE_LENGTH, rng);

    // Pre-pick guarantee candidate lists (shuffled using rng)
    const allItems = generateItemSequence(depth, 60, rng);
    const shuffle = arr => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    itemShops.push({
      sequence,
      guaranteeFood:  shuffle(allItems.filter(it => it.category === 'food')),
      guaranteeLight: shuffle(allItems.filter(it => it.category === 'lightSource')),
      guaranteeDraw2: shuffle(allItems.filter(it => (it.bonuses?.bonusDraw ?? 0) >= 2)),
      guaranteeDraw3: shuffle(allItems.filter(it => (it.bonuses?.bonusDraw ?? 0) >= 3)),
    });
  }

  return { dailyClass, ordealVariant, encounters, podShops, itemShops };
}
