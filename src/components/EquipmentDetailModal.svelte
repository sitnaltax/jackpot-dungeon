<script>
  import { inspectedEquipment, closeEquipmentInspection } from '../lib/gameState.js';

  $: equipment = $inspectedEquipment;

  function getBonusDescription(bonuses) {
    const descriptions = [];
    if (bonuses.selectiveRedraws) descriptions.push(`+${bonuses.selectiveRedraws} Redraw Selected`);
    if (bonuses.redraws) descriptions.push(`+${bonuses.redraws} Redraw All`);
    if (bonuses.bonusDraw) descriptions.push(`+${bonuses.bonusDraw} Token Draw`);
    if (bonuses.insight) descriptions.push(`+${bonuses.insight} Insight`);
    if (bonuses.resolve) descriptions.push(`+${bonuses.resolve} Resolve`);
    if (bonuses.maxStamina) descriptions.push(`+${bonuses.maxStamina} Max Stamina`);
    if (bonuses.staminaRegen) descriptions.push(`+${bonuses.staminaRegen} Regen/encounter`);
    return descriptions;
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      closeEquipmentInspection();
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      closeEquipmentInspection();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if equipment}
  <div class="modal-backdrop" on:click={handleBackdropClick} role="dialog" aria-modal="true">
    <div class="modal-content">
      <button class="close-btn" on:click={closeEquipmentInspection}>&times;</button>

      <div class="equipment-header">
        <span class="equipment-icon">{equipment.icon}</span>
        <div class="equipment-title">
          <h2>{equipment.name}</h2>
          <span class="equipment-type">Equipment</span>
        </div>
      </div>

      <p class="description">{equipment.description}</p>

      <div class="bonuses-section">
        <h3>Bonuses</h3>
        {#each getBonusDescription(equipment.bonuses) as bonus}
          <div class="bonus-row">
            <span class="bonus-value">{bonus}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border: 2px solid #4a6785;
    border-radius: 12px;
    padding: 1.5rem;
    max-width: 350px;
    width: 90%;
    position: relative;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  }

  .close-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: none;
    border: none;
    color: #888;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    line-height: 1;
  }

  .close-btn:hover {
    color: #fff;
  }

  .equipment-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .equipment-icon {
    font-size: 3rem;
  }

  .equipment-title h2 {
    margin: 0;
    color: #e5c07b;
    font-size: 1.5rem;
  }

  .equipment-type {
    display: inline-block;
    background: #4a6785;
    color: #fff;
    padding: 0.125rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: bold;
    margin-top: 0.25rem;
  }

  .description {
    color: #aaa;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    line-height: 1.4;
  }

  .bonuses-section {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    padding: 1rem;
  }

  .bonuses-section h3 {
    margin: 0 0 0.75rem 0;
    font-size: 0.875rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .bonus-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .bonus-row:last-of-type {
    border-bottom: none;
  }

  .bonus-value {
    color: #2ecc71;
    font-weight: bold;
    font-size: 1.125rem;
  }
</style>
