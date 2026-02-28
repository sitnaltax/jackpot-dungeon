<script>
  import { encounterNumber, player, restartGame, currentEncounter, encounterResult } from '../lib/gameState.js';
  import { EQUIPMENT_SLOTS } from '../lib/constants.js';
  import { ITEM_CATEGORIES } from '../lib/items.js';
  import Pod from './Pod.svelte';

  $: encounter = $currentEncounter;
  $: result = $encounterResult;
  $: equipmentSlots = Array.from({ length: EQUIPMENT_SLOTS }, (_, i) => $player.equipment?.[i] || null);
</script>

<div class="game-over">
  <div class="header">
    <h1>Defeated!</h1>
    <div class="depth">Depth {$encounterNumber}</div>
  </div>

  {#if encounter}
    <section class="section">
      <h2 class="section-title">Last Stand</h2>
      <div class="encounter-block">
        <div class="encounter-name">{encounter.name}</div>
        {#if encounter.flavorText}
          <div class="encounter-flavor">{encounter.flavorText}</div>
        {/if}
        <div class="encounter-stats">
          <div class="enc-row">
            <span class="enc-label">Mystery</span>
            <span class="enc-val">{encounter.mystery}</span>
            {#if result}
              <span class="enc-result" class:success={result.insightSuccess} class:fail={!result.insightSuccess}>
                {result.totals.insight} Insight {result.insightSuccess ? '✓' : '✗'}
              </span>
            {/if}
          </div>
          <div class="enc-row">
            <span class="enc-label">Trouble</span>
            <span class="enc-val">{encounter.trouble}</span>
            {#if result}
              <span class="enc-result" class:success={result.resolveSuccess} class:fail={!result.resolveSuccess}>
                {result.totals.resolve} Resolve {result.resolveSuccess ? '✓' : '✗'}
              </span>
            {/if}
          </div>
        </div>
        {#if result?.staminaLost > 0}
          <div class="stamina-lost">
            −{result.staminaLost} Stamina
            {#if result.resolveDeficiency > 0}
              <span class="stamina-detail">({result.resolveDeficiency} short of {encounter.trouble} Trouble)</span>
            {/if}
          </div>
        {/if}
      </div>
    </section>
  {/if}

  <section class="section">
    <h2 class="section-title">Character</h2>
    <div class="char-stats">
      {#if $player.playerClass}
        <div class="char-stat">
          <span class="label">Class</span>
          <span class="value class-val">{$player.playerClass.name}</span>
        </div>
      {/if}
      <div class="char-stat">
        <span class="label">Total XP</span>
        <span class="value xp">{$player.totalXpEarned}</span>
      </div>
      <div class="char-stat">
        <span class="label">Total Treasure</span>
        <span class="value treasure">${$player.totalTreasureEarned}</span>
      </div>
    </div>
  </section>

  <section class="section">
    <h2 class="section-title">Equipment</h2>
    <div class="equipment-row">
      {#each equipmentSlots as item}
        {#if item}
          {@const catColor = ITEM_CATEGORIES[item.category]?.color || '#aaa'}
          <div class="item-card" style="--item-color: {catColor}">
            <span class="item-icon">{item.icon}</span>
            <div class="item-text">
              <span class="item-name">{item.name}</span>
              <span class="item-desc">{item.description}</span>
            </div>
          </div>
        {:else}
          <div class="item-card empty">
            <span class="empty-label">Empty</span>
          </div>
        {/if}
      {/each}
    </div>
  </section>

  <section class="section">
    <h2 class="section-title">Pods</h2>
    <div class="pods-grid">
      {#each $player.pods as pod (pod.id)}
        <Pod {pod} />
      {/each}
    </div>
  </section>

  <button class="btn-primary" on:click={restartGame}>
    Try Again
  </button>
</div>

<style>
  .game-over {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem;
    background: linear-gradient(135deg, #2d1b1b 0%, #1a1a2e 100%);
    border: 2px solid #8b0000;
    border-radius: 12px;
    max-width: 800px;
    margin: 0 auto;
  }

  .header {
    text-align: center;
  }

  h1 {
    margin: 0 0 0.25rem 0;
    font-size: 2.5rem;
    color: #e74c3c;
  }

  .depth {
    font-size: 1.1rem;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .section-title {
    margin: 0;
    font-size: 0.8rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-bottom: 1px solid #2a2a3e;
    padding-bottom: 0.4rem;
  }

  /* Last stand */
  .encounter-block {
    background: rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .encounter-name {
    font-size: 1.2rem;
    font-weight: bold;
    color: #e74c3c;
  }

  .encounter-flavor {
    font-size: 0.85rem;
    color: #777;
    font-style: italic;
    line-height: 1.4;
  }

  .encounter-stats {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .enc-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.95rem;
  }

  .enc-label {
    color: #888;
    width: 5rem;
    flex-shrink: 0;
  }

  .enc-val {
    font-weight: bold;
    color: #ccc;
    width: 2rem;
    flex-shrink: 0;
  }

  .enc-result {
    font-size: 0.875rem;
  }

  .enc-result.success { color: #2ecc71; }
  .enc-result.fail    { color: #e74c3c; }

  .stamina-lost {
    font-size: 1.1rem;
    font-weight: bold;
    color: #e74c3c;
  }

  .stamina-detail {
    font-size: 0.85rem;
    font-weight: normal;
    color: #a05050;
    margin-left: 0.25rem;
  }

  /* Character stats */
  .char-stats {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .char-stat {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .label {
    font-size: 0.75rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .value {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .class-val { color: #f1c40f; }
  .xp        { color: #f1c40f; }
  .treasure  { color: #9b59b6; }

  /* Equipment */
  .equipment-row {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .item-card {
    flex: 1;
    min-width: 160px;
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid var(--item-color, #444);
    border-radius: 8px;
    padding: 0.75rem;
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
  }

  .item-card.empty {
    border-style: dashed;
    border-color: #333;
    justify-content: center;
    align-items: center;
  }

  .item-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .item-text {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .item-name {
    font-size: 0.9rem;
    font-weight: bold;
    color: var(--item-color, #ccc);
  }

  .item-desc {
    font-size: 0.75rem;
    color: #777;
    line-height: 1.3;
  }

  .empty-label {
    font-size: 0.8rem;
    color: #444;
  }

  /* Pods */
  .pods-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 0.75rem;
  }

  /* Button */
  .btn-primary {
    align-self: center;
    padding: 0.875rem 2.5rem;
    background: #2ecc71;
    color: #000;
    border: none;
    border-radius: 6px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
  }

  .btn-primary:hover {
    background: #27ae60;
    transform: translateY(-2px);
  }
</style>
