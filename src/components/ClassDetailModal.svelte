<script>
  import { inspectedClass, closeClassInspection, player } from '../lib/gameState.js';
  import { DIFFICULTIES } from '../lib/classes.js';

  $: cls = $inspectedClass;
  $: difficultyId = $player?.difficulty;
  $: difficulty = DIFFICULTIES.find(d => d.id === difficultyId);

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
</script>

<svelte:window on:keydown={handleKeydown} />

{#if cls}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
  <div class="modal-backdrop" on:click={handleBackdropClick} role="dialog" aria-modal="true">
    <div class="modal-content">
      <button class="close-btn" on:click={closeClassInspection}>&times;</button>

      <div class="class-header">
        <h2>{cls.name}</h2>
      </div>

      <p class="description">{cls.description}</p>

      <div class="benefit-section">
        <h3>Class Benefit</h3>
        <p class="benefit-text">{cls.benefitDescription}</p>
      </div>

      {#if difficulty}
        <div class="difficulty-section">
          <h3>Difficulty</h3>
          <p class="difficulty-name">{difficulty.name}</p>
          <p class="difficulty-desc">{difficulty.description}</p>
        </div>
      {/if}
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
    margin-bottom: 1rem;
  }

  .class-header h2 {
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
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .benefit-text {
    margin: 0;
    color: #2ecc71;
    font-weight: bold;
    font-size: 0.9rem;
  }

  .difficulty-section {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    padding: 1rem;
  }

  .difficulty-section h3 {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .difficulty-name {
    margin: 0 0 0.35rem 0;
    color: #e5c07b;
    font-weight: bold;
    font-size: 0.95rem;
  }

  .difficulty-desc {
    margin: 0;
    color: #aaa;
    font-size: 0.85rem;
    line-height: 1.4;
  }
</style>
