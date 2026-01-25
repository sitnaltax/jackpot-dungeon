<script>
  import { currentEncounter } from '../lib/gameState.js';
</script>

{#if $currentEncounter}
  <div class="encounter">
    <div class="encounter-name">{$currentEncounter.name}</div>
    <div class="encounter-stats">
      <div class="stat">
        <span class="stat-icon">👁️</span>
        <span class="stat-label">Mystery</span>
        <span class="stat-value mystery">{$currentEncounter.mystery}</span>
      </div>
      <div class="stat">
        <span class="stat-icon">🌀</span>
        <span class="stat-label">Trouble</span>
        <span class="stat-value trouble">{$currentEncounter.trouble}</span>
      </div>
      <div class="stat">
        <span class="stat-icon">💰</span>
        <span class="stat-label">Reward</span>
        <span class="stat-value treasure">{$currentEncounter.treasureReward}</span>
      </div>
    </div>
  </div>
{/if}

<style>
  .encounter {
    background: linear-gradient(135deg, #2d1b1b 0%, #1a1a2e 100%);
    border: 2px solid #8b0000;
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
  }

  .encounter-name {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #e74c3c;
  }

  .encounter-stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .stat-icon {
    font-size: 1.25rem;
  }

  .stat-label {
    font-size: 0.75rem;
    color: #888;
    text-transform: uppercase;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .stat-value.mystery {
    color: #e74c3c;
  }

  .stat-value.trouble {
    color: #3498db;
  }

  .stat-value.treasure {
    color: #f1c40f;
  }
</style>
