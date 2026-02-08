<script>
  import { combatResult, proceedToShop } from '../lib/gameState.js';
  import { getCombatSummary } from '../lib/combat.js';

  $: summary = $combatResult ? getCombatSummary($combatResult) : [];
</script>

{#if $combatResult}
  <div class="combat-result" class:revealed={$combatResult.revealed}>
    <div class="result-details">
      {#each summary as line}
        <p class:success={line.startsWith('✓')} class:failure={line.startsWith('✗')}>
          {line}
        </p>
      {/each}
    </div>

    <div class="result-summary">
      {#if $combatResult.staminaLost > 0}
        <div class="stamina-lost">
          -{$combatResult.staminaLost} Stamina
        </div>
      {/if}
      <div class="treasure-gained">
        +{$combatResult.treasureGained} $
        {#if $combatResult.treasureMultiplier && $combatResult.treasureMultiplier !== 1.0}
          <span class="multiplier">(x{$combatResult.treasureMultiplier})</span>
        {/if}
      </div>
      <div class="xp-gained">
        +{$combatResult.xpGained} XP
        {#if $combatResult.xpMultiplier && $combatResult.xpMultiplier !== 1.0}
          <span class="multiplier">(x{$combatResult.xpMultiplier})</span>
        {/if}
      </div>
    </div>

    <button class="btn btn-primary" on:click={proceedToShop}>
      Continue to Shop
    </button>
  </div>
{/if}

<style>
  .combat-result {
    background: #16213e;
    border: 2px solid #333;
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .combat-result.revealed {
    border-color: #2ecc71;
  }

  h2 {
    margin: 0;
    font-size: 1.5rem;
  }

  .result-details {
    text-align: left;
    font-family: monospace;
    font-size: 0.875rem;
    background: #0d1117;
    padding: 1rem;
    border-radius: 6px;
    width: 100%;
  }

  .result-details p {
    margin: 0.25rem 0;
  }

  .result-details .success {
    color: #2ecc71;
  }

  .result-details .failure {
    color: #e74c3c;
  }

  .result-summary {
    display: flex;
    gap: 2rem;
    font-size: 1.25rem;
    font-weight: bold;
  }

  .stamina-lost {
    color: #e74c3c;
  }

  .treasure-gained {
    color: #f1c40f;
  }

  .xp-gained {
    color: #9b59b6;
  }

  .multiplier {
    font-size: 0.75rem;
    opacity: 0.8;
    margin-left: 0.25rem;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
  }

  .btn:hover {
    transform: translateY(-2px);
  }

  .btn-primary {
    background: #2ecc71;
    color: #000;
  }

  .btn-primary:hover {
    background: #27ae60;
  }
</style>
