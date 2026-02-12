<script>
  import { player, encounterNumber, inspectEquipment, getEffectiveMaxStamina } from '../lib/gameState.js';
  import { EQUIPMENT_SLOTS } from '../lib/constants.js';

  $: effectiveMax = getEffectiveMaxStamina($player);
  $: staminaPercent = ($player.stamina / effectiveMax) * 100;
  $: staminaColor = staminaPercent > 50 ? '#2ecc71' : staminaPercent > 25 ? '#f39c12' : '#e74c3c';

  // Ensure equipment array has correct number of slots
  $: equipmentSlots = Array.from({ length: EQUIPMENT_SLOTS }, (_, i) => $player.equipment?.[i] || null);

  function handleEquipmentClick(item) {
    if (item) {
      inspectEquipment(item);
    }
  }
</script>

<div class="player-status">
  <div class="stat">
    <span class="label">Depth</span>
    <span class="value">{$encounterNumber}</span>
  </div>

  <div class="stat stamina-stat">
    <span class="label">Stamina</span>
    <div class="stamina-bar">
      <div class="stamina-fill" style="width: {staminaPercent}%; background: {staminaColor}"></div>
      <span class="stamina-text">{$player.stamina} / {effectiveMax}</span>
    </div>
  </div>

  <div class="stat">
    <span class="label">Treasure</span>
    <span class="value treasure">${$player.treasure}</span>
  </div>

  <div class="stat">
    <span class="label">XP</span>
    <span class="value xp">{$player.xp}</span>
  </div>

  <div class="stat equipment-stat">
    <span class="label">Equipment</span>
    <div class="equipment-slots">
      {#each equipmentSlots as item}
        <div
          class="equipment-slot"
          class:empty={!item}
          class:clickable={!!item}
          title={item ? item.name : 'Empty slot'}
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

  .stat {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .label {
    font-size: 0.75rem;
    text-transform: uppercase;
    color: #888;
    letter-spacing: 0.05em;
  }

  .value {
    font-size: 1.25rem;
    font-weight: bold;
  }

  .treasure {
    color: #f1c40f;
  }

  .xp {
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
</style>
