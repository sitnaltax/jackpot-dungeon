<script>
  import {
    player,
    shopItems,
    purchasedShopItems,
    selectedEquipmentSlot,
    purchaseItem,
    selectEquipmentSlot,
    skipItemShop,
    getEffectiveMaxStamina,
  } from '../lib/gameState.js';
  import { ITEM_CATEGORIES } from '../lib/items.js';
  import { EQUIPMENT_SLOTS } from '../lib/constants.js';

  $: equipmentSlots = Array.from({ length: EQUIPMENT_SLOTS }, (_, i) => $player.equipment?.[i] || null);
  $: hasEmptySlot = equipmentSlots.some(e => e === null);
  $: hasLightSource = equipmentSlots.some(e => e?.category === 'lightSource');
  $: effectiveMaxStamina = getEffectiveMaxStamina($player);
  $: playerXp = $player.xp;
  $: selectedSlot = $selectedEquipmentSlot;
  // Create a reactive version of purchased items to trigger re-renders
  $: purchasedSet = $purchasedShopItems;

  function getBonusList(bonuses) {
    const list = [];
    if (bonuses.selectiveRedraws) list.push(`+${bonuses.selectiveRedraws} Redraw Selected`);
    if (bonuses.redraws) list.push(`+${bonuses.redraws} Redraw All`);
    if (bonuses.bonusDraw) list.push(`+${bonuses.bonusDraw} Token Draw`);
    if (bonuses.insight) list.push(`+${bonuses.insight} Insight`);
    if (bonuses.resolve) list.push(`+${bonuses.resolve} Resolve`);
    if (bonuses.maxStamina) list.push(`+${bonuses.maxStamina} Max Stamina`);
    if (bonuses.staminaRegen) list.push(`+${bonuses.staminaRegen} Regen/encounter`);
    return list;
  }

  function canAfford(cost, xp) {
    return xp >= cost;
  }

  function isPurchased(index, purchased) {
    return purchased.has(index);
  }

  function needsSlotSelection(item, hasEmpty, hasLight) {
    // Light sources auto-replace existing light source
    if (item.category === 'lightSource' && hasLight) {
      return false;
    }
    // Auto-equip if empty slot exists
    if (hasEmpty) return false;
    // Otherwise need to select a slot to replace
    return true;
  }

  function canPurchase(item, index, xp, purchased, hasEmpty, hasLight, selected) {
    if (!canAfford(item.cost, xp)) return false;
    if (isPurchased(index, purchased)) return false;
    if (needsSlotSelection(item, hasEmpty, hasLight) && selected === null) return false;
    return true;
  }

  function getPurchaseLabel(item, index, xp, purchased, hasEmpty, hasLight, selected) {
    if (isPurchased(index, purchased)) return 'Sold';
    if (!canAfford(item.cost, xp)) return "Can't Afford";
    if (needsSlotSelection(item, hasEmpty, hasLight) && selected === null) return 'Select Slot';
    if (item.category === 'lightSource' && hasLight) {
      return 'Buy (replaces light)';
    }
    return 'Buy';
  }

  function handlePurchase(item, index) {
    purchaseItem(item, index);
  }
</script>

<div class="item-shop">
  <div class="shop-header">
    <h2>Item Shop</h2>
    <div class="xp-display">
      <span class="xp-label">XP:</span>
      <span class="xp-value">{$player.xp}</span>
    </div>
  </div>

  <div class="items-section">
    {#each $shopItems as item, index}
      <div class="item-card" class:sold={isPurchased(index, purchasedSet)} class:cant-afford={!canAfford(item.cost, playerXp) && !isPurchased(index, purchasedSet)}>
        <div class="item-header">
          <span class="item-icon">{item.icon}</span>
          <div class="item-title">
            <span class="item-name">{item.name}</span>
            <span class="item-category" style="background: {ITEM_CATEGORIES[item.category]?.color || '#555'}">
              {ITEM_CATEGORIES[item.category]?.name || item.category}
            </span>
          </div>
          <span class="item-cost" class:affordable={canAfford(item.cost, playerXp)}>{item.cost} XP</span>
        </div>

        <p class="item-description">{item.description}</p>

        <div class="item-bonuses">
          {#each getBonusList(item.bonuses) as bonus}
            <span class="bonus-tag">{bonus}</span>
          {/each}
          {#if item.staminaHeal}
            <span class="bonus-tag heal-tag">+{item.staminaHeal} Stamina on pickup</span>
          {/if}
        </div>

        <button
          class="btn btn-purchase"
          disabled={!canPurchase(item, index, playerXp, purchasedSet, hasEmptySlot, hasLightSource, selectedSlot)}
          on:click={() => handlePurchase(item, index)}
        >
          {getPurchaseLabel(item, index, playerXp, purchasedSet, hasEmptySlot, hasLightSource, selectedSlot)}
        </button>
      </div>
    {/each}
  </div>

  <div class="equipment-section">
    <h3>Your Equipment</h3>
    <p class="hint">
      {#if hasEmptySlot}
        Items will auto-equip to empty slots.
      {:else}
        Select a slot to replace, then purchase an item.
      {/if}
    </p>
    <div class="equipment-grid">
      {#each equipmentSlots as equip, i}
        <div
          class="equip-slot"
          class:empty={!equip}
          class:selected={$selectedEquipmentSlot === i}
          class:selectable={equip !== null}
          on:click={() => equip !== null && selectEquipmentSlot(i)}
          on:keydown={(e) => e.key === 'Enter' && equip !== null && selectEquipmentSlot(i)}
          role="button"
          tabindex="0"
        >
          {#if equip}
            <span class="equip-icon">{equip.icon}</span>
            <span class="equip-name">{equip.name}</span>
            <div class="equip-bonuses">
              {#each getBonusList(equip.bonuses) as bonus}
                <span class="equip-bonus">{bonus}</span>
              {/each}
            </div>
          {:else}
            <span class="equip-empty">Empty</span>
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <button class="btn btn-continue" on:click={skipItemShop}>
    Continue to Pod Shop
  </button>
</div>

<style>
  .item-shop {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem 0;
  }

  .shop-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .shop-header h2 {
    margin: 0;
    color: #9b59b6;
    font-size: 1.75rem;
  }

  .xp-display {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #16213e;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: 2px solid #9b59b6;
  }

  .xp-label {
    color: #888;
    font-size: 1rem;
  }

  .xp-value {
    color: #9b59b6;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .items-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .item-card {
    background: #16213e;
    border: 2px solid #4a6785;
    border-radius: 10px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    transition: border-color 0.2s ease;
  }

  .item-card.sold {
    opacity: 0.4;
  }

  .item-card.cant-afford {
    opacity: 0.7;
  }

  .item-header {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .item-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .item-title {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
    min-width: 0;
  }

  .item-name {
    font-weight: bold;
    font-size: 1.1rem;
    color: #e5c07b;
  }

  .item-category {
    display: inline-block;
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: bold;
    color: #fff;
    width: fit-content;
  }

  .item-cost {
    font-weight: bold;
    font-size: 1.1rem;
    color: #e74c3c;
    flex-shrink: 0;
  }

  .item-cost.affordable {
    color: #9b59b6;
  }

  .item-description {
    margin: 0;
    color: #999;
    font-size: 0.85rem;
    font-style: italic;
    line-height: 1.3;
  }

  .item-bonuses {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .bonus-tag {
    background: rgba(46, 204, 113, 0.15);
    color: #2ecc71;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
  }

  .heal-tag {
    background: rgba(241, 196, 0, 0.15);
    color: #f1c40f;
  }

  .equipment-section {
    background: #0d1117;
    border-radius: 10px;
    padding: 1rem;
  }

  .equipment-section h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .hint {
    margin: 0 0 0.75rem 0;
    color: #666;
    font-size: 0.85rem;
    font-style: italic;
  }

  .equipment-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.75rem;
  }

  .equip-slot {
    background: #16213e;
    border: 2px solid #333;
    border-radius: 8px;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    transition: border-color 0.2s ease, transform 0.2s ease;
  }

  .equip-slot.selectable {
    cursor: pointer;
  }

  .equip-slot.selectable:hover {
    border-color: #e5c07b;
    transform: translateY(-2px);
  }

  .equip-slot.selected {
    border-color: #e74c3c;
    box-shadow: 0 0 8px rgba(231, 76, 60, 0.3);
  }

  .equip-slot.empty {
    border-style: dashed;
    border-color: #444;
    align-items: center;
    justify-content: center;
    min-height: 60px;
  }

  .equip-icon {
    font-size: 1.5rem;
  }

  .equip-name {
    font-weight: bold;
    font-size: 0.9rem;
    color: #e5c07b;
  }

  .equip-bonuses {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .equip-bonus {
    font-size: 0.75rem;
    color: #2ecc71;
  }

  .equip-empty {
    color: #555;
    font-style: italic;
  }

  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
  }

  .btn:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-purchase {
    background: #9b59b6;
    color: #fff;
    align-self: stretch;
  }

  .btn-purchase:hover:not(:disabled) {
    background: #8e44ad;
  }

  .btn-continue {
    background: #34495e;
    color: #fff;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    align-self: center;
  }

  .btn-continue:hover {
    background: #2c3e50;
  }
</style>
