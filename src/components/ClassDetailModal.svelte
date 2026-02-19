<script>
  import { inspectedClass, closeClassInspection, inspectEquipment } from '../lib/gameState.js';

  $: cls = $inspectedClass;

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      closeClassInspection();
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      closeClassInspection();
    }
  }

  function handleItemClick(item) {
    if (item) {
      closeClassInspection();
      inspectEquipment(item);
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if cls}
  <div class="modal-backdrop" on:click={handleBackdropClick} role="dialog" aria-modal="true">
    <div class="modal-content">
      <button class="close-btn" on:click={closeClassInspection}>&times;</button>

      <div class="class-header">
        <span class="class-icon">{cls.icon}</span>
        <div class="class-title">
          <h2>{cls.name}</h2>
        </div>
      </div>

      <p class="description">{cls.description}</p>

      <div class="benefit-section">
        <h3>Class Benefit</h3>
        <p class="benefit-text">{cls.benefitDescription}</p>
      </div>

      <div class="equipment-section">
        <h3>Starting Gear</h3>
        <div class="item-list">
          {#each cls.startingEquipment as item}
            {#if item}
              <button class="item-row" on:click={() => handleItemClick(item)}>
                <span class="item-icon">{item.icon}</span>
                <div class="item-info">
                  <span class="item-name">{item.name}</span>
                  <span class="item-desc">{item.description}</span>
                </div>
              </button>
            {/if}
          {/each}
        </div>
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
    border: 2px solid #f1c40f;
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

  .class-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .class-icon {
    font-size: 3rem;
  }

  .class-title h2 {
    margin: 0;
    color: #f1c40f;
    font-size: 1.5rem;
  }

  .description {
    color: #aaa;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    line-height: 1.4;
  }

  .benefit-section {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .benefit-section h3 {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .benefit-text {
    margin: 0;
    color: #2ecc71;
    font-weight: bold;
    font-size: 0.9rem;
  }

  .equipment-section {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    padding: 1rem;
  }

  .equipment-section h3 {
    margin: 0 0 0.75rem 0;
    font-size: 0.875rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .item-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .item-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s ease;
    color: inherit;
    font-family: inherit;
    text-align: left;
  }

  .item-row:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .item-icon {
    font-size: 1.5rem;
  }

  .item-info {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .item-name {
    color: #e5c07b;
    font-weight: bold;
    font-size: 0.85rem;
  }

  .item-desc {
    color: #888;
    font-size: 0.75rem;
  }
</style>
