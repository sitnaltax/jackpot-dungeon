<script>
  import { currentEncounter, ordealActive } from '../lib/gameState.js';
</script>

{#if $currentEncounter}
  <div class="encounter" class:ordeal={$ordealActive}>
    <div class="encounter-left">
      <div class="encounter-name">{$currentEncounter.name}</div>
      <div class="encounter-stats">
        <div class="stat">
          <span class="stat-icon">⁉️</span>
          <span class="stat-label">Mystery</span>
          <span class="stat-value mystery">{$currentEncounter.mystery}</span>
        </div>
        <div class="stat">
          <span class="stat-icon">🌀</span>
          <span class="stat-label">Trouble</span>
          <span class="stat-value trouble">{$currentEncounter.trouble}</span>
        </div>
      </div>
      {#if $currentEncounter.description}
        <div class="encounter-desc">{$currentEncounter.description}</div>
      {/if}
    </div>

    <div class="encounter-flavor">
      {$currentEncounter.flavorText}
    </div>
  </div>
{/if}

<style>
  .encounter {
    background: linear-gradient(135deg, #26190a 0%, #1a1814 100%);
    border: 2px solid #a07840;
    border-radius: 10px;
    padding: 0.6rem 1rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
    box-sizing: border-box;
  }

  .encounter.ordeal {
    background: linear-gradient(135deg, #0a1a26 0%, #14181a 100%);
    border-color: #4080a0;
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .encounter.ordeal .encounter-left {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }

  .encounter.ordeal .encounter-name {
    font-size: 1.6rem;
    text-align: center;
  }

  .encounter.ordeal .encounter-stats {
    justify-content: center;
  }

  .encounter-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    flex-shrink: 0;
  }

  .encounter-name {
    font-size: 1.1rem;
    font-weight: bold;
    color: #d4aa70;
  }

  .encounter-stats {
    display: flex;
    gap: 1.25rem;
  }

  .stat {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .stat-icon {
    font-size: 1rem;
  }

  .stat-label {
    font-size: 0.7rem;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .stat-value {
    font-size: 1.1rem;
    font-weight: bold;
  }

  .stat-value.mystery {
    color: #e74c3c;
  }

  .stat-value.trouble {
    color: #3498db;
  }

  .encounter-desc {
    font-size: 0.8rem;
    color: #f1c40f;
    font-style: italic;
  }

  .encounter-flavor {
    flex: 1;
    font-size: 0.8rem;
    color: #aaa;
    font-style: italic;
    line-height: 1.5;
    border-left: 1px solid #3d2e18;
    padding-left: 1.25rem;
  }

  @media (max-width: 500px) {
    .encounter-flavor {
      display: none;
    }
    .encounter {
      justify-content: center;
    }
  }
</style>
