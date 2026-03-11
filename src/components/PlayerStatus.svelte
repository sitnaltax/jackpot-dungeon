<script>
  import { player, encounterNumber, inspectEquipment, inspectClass, getEffectiveMaxStamina, ordealActive, ordealRound } from '../lib/gameState.js';
  import { EQUIPMENT_SLOTS } from '../lib/constants.js';
  import { loadPrefs, savePrefs } from '../lib/persistence.js';
  import GameMenu from './GameMenu.svelte';

  const defaultCollapsed = typeof window !== 'undefined' && window.innerWidth < 768;
  let collapsed = loadPrefs().statusBarCollapsed ?? defaultCollapsed;

  function toggleCollapsed() {
    collapsed = !collapsed;
    savePrefs({ statusBarCollapsed: collapsed });
  }

  $: effectiveMax = getEffectiveMaxStamina($player);
  $: staminaPercent = ($player.stamina / effectiveMax) * 100;
  $: staminaColor = staminaPercent > 50 ? '#2ecc71' : staminaPercent > 25 ? '#f39c12' : '#e74c3c';

  $: playerClass = $player.playerClass;

  // Ensure equipment array has correct number of slots
  $: equipmentSlots = Array.from({ length: EQUIPMENT_SLOTS }, (_, i) => $player.equipment?.[i] || null);

  function handleEquipmentClick(item) {
    if (item) inspectEquipment(item);
  }

  function handleClassClick() {
    if (playerClass) inspectClass(playerClass);
  }
</script>

<div class="player-status" class:collapsed>
  <GameMenu />

  {#if !collapsed}
    <div class="stat">
      <span class="label">Depth</span>
      <span class="value">{$ordealActive ? `F-${$ordealRound}` : $encounterNumber}</span>
    </div>

    {#if playerClass}
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <div
        class="stat class-stat"
        on:click={handleClassClick}
        on:keydown={(e) => e.key === 'Enter' && handleClassClick()}
        role="button"
        tabindex="0"
      >
        <span class="label">Class</span>
        <span class="value class-value">{playerClass.name}</span>
      </div>
    {/if}

    <div class="stat stamina-stat">
      <span class="label">Stamina</span>
      <div class="stamina-bar">
        <div class="stamina-fill" style="width: {staminaPercent}%; background: {staminaColor}"></div>
        <span class="stamina-text">{$player.stamina} / {effectiveMax}</span>
      </div>
    </div>

    <div class="stat">
      <span class="label">XP</span>
      <span class="value xp">{$player.xp}</span>
    </div>

    <div class="stat">
      <span class="label">Treasure</span>
      <span class="value treasure">${$player.treasure}</span>
    </div>

    <div class="stat equipment-stat">
      <span class="label">Equipment</span>
      <div class="equipment-slots">
        {#each equipmentSlots as item}
          <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
          <div
            class="equipment-slot"
            class:empty={!item}
            class:clickable={!!item}
            on:click={() => handleEquipmentClick(item)}
            on:keydown={(e) => e.key === 'Enter' && handleEquipmentClick(item)}
            role={item ? 'button' : 'presentation'}
            tabindex={item ? 0 : -1}
          >
            {item ? item.icon : ''}
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <!-- Collapsed: stamina pill + equipment slots -->
    <div class="stamina-bar collapsed-bar">
      <div class="stamina-fill" style="width: {staminaPercent}%; background: {staminaColor}"></div>
      <span class="stamina-text">{$player.stamina} / {effectiveMax}</span>
    </div>
    <div class="equipment-slots collapsed-equipment">
      {#each equipmentSlots as item}
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <div
          class="equipment-slot"
          class:empty={!item}
          class:clickable={!!item}
          on:click={() => handleEquipmentClick(item)}
          on:keydown={(e) => e.key === 'Enter' && handleEquipmentClick(item)}
          role={item ? 'button' : 'presentation'}
          tabindex={item ? 0 : -1}
        >
          {item ? item.icon : ''}
        </div>
      {/each}
    </div>
  {/if}

  <button
    class="collapse-btn"
    on:click={toggleCollapsed}
    aria-label={collapsed ? 'Expand header' : 'Collapse header'}
  >
    {collapsed ? '▼' : '▲'}
  </button>
</div>

<style>
  .player-status {
    display: flex;
    gap: 2rem;
    padding: 1rem 1.5rem;
    background: #16213e;
    border-radius: 8px;
    align-items: center;
    flex-wrap: wrap;
  }

  .player-status.collapsed {
    gap: 1rem;
    padding: 0.5rem 1rem;
    flex-wrap: nowrap;
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .label {
    font-size: 0.75rem;
    text-transform: uppercase;
    color: #aaa;
    letter-spacing: 0.05em;
  }

  .value {
    font-size: 1.25rem;
    font-weight: bold;
  }

  .xp {
    color: #f1c40f;
  }

  .treasure {
    color: #9b59b6;
  }

  .stamina-stat {
    flex: 1;
    min-width: 200px;
  }

  .stamina-bar {
    position: relative;
    height: 24px;
    background: #333;
    border-radius: 4px;
    overflow: hidden;
  }

  .collapsed-bar {
    flex: 1;
    height: 20px;
  }

  .stamina-fill {
    height: 100%;
    transition: width 0.3s ease, background 0.3s ease;
  }

  .stamina-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.875rem;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
  }

  .equipment-slots {
    display: flex;
    gap: 0.5rem;
  }

  .equipment-slot {
    width: 32px;
    height: 32px;
    background: #2c3e50;
    border: 2px solid #4a6785;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .equipment-slot.clickable {
    cursor: pointer;
  }

  .equipment-slot.clickable:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    border-color: #e5c07b;
  }

  .equipment-slot.empty {
    border-style: dashed;
    border-color: #555;
    cursor: default;
  }

  .collapsed-equipment {
    gap: 0.35rem;
    flex-shrink: 0;
  }

  .collapsed-equipment .equipment-slot {
    width: 26px;
    height: 26px;
    font-size: 1rem;
  }

  .class-stat {
    cursor: pointer;
    transition: opacity 0.2s ease;
  }

  .class-stat:hover {
    opacity: 0.8;
  }

  .class-value {
    color: #f1c40f;
  }

  .collapse-btn {
    background: none;
    border: none;
    color: #888;
    font-size: 0.75rem;
    cursor: pointer;
    padding: 0.25rem 0.4rem;
    border-radius: 4px;
    line-height: 1;
    margin-left: auto;
    transition: color 0.15s ease, background 0.15s ease;
  }

  .collapse-btn:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
  }
</style>
