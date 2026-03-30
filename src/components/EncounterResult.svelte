<script>
  import { encounterResult, proceedFromEncounter, ordealActive, ordealMysteryPool } from '../lib/gameState.js';
  import { getEncounterSummary } from '../lib/encounter.js';

  $: summary = $encounterResult ? getEncounterSummary($encounterResult) : [];
</script>

{#if $encounterResult}
  <div class="encounter-result" class:revealed={$encounterResult.revealed}>
    <h2>Encounter Result</h2>
    <div class="result-details">
      {#each summary as line}
        {@const isOrdealInsightFail = $ordealActive && !$encounterResult.insightSuccess && line.includes('Insight')}
        <p
          class:success={line.startsWith('✓')}
          class:failure={!isOrdealInsightFail && line.startsWith('✗')}
          class:ordeal-continues={isOrdealInsightFail}
        >
          {isOrdealInsightFail ? line.replace('✗', '○').replace('No bonus', 'The ordeal continues') : line}
        </p>
      {/each}
    </div>

    <div class="result-summary">
      {#if $encounterResult.staminaLost > 0}
        <div class="stamina-lost">
          -{$encounterResult.staminaLost} Stamina
        </div>
      {/if}
      {#if $encounterResult.staminaRegen > 0}
        <div class="stamina-regen">
          +{$encounterResult.staminaRegen} Regen
        </div>
      {/if}
      <div class="xp-gained">
        +{$encounterResult.xpGained} XP
      </div>
      {#if $ordealActive}
        <div class="mystery-remaining">
          {$ordealMysteryPool} Mystery remaining
        </div>
      {:else}
        <div class="treasure-gained">
          +${$encounterResult.treasureGained}
        </div>
      {/if}
    </div>

    <button class="btn btn-primary" on:click={proceedFromEncounter}>
      Continue
    </button>
  </div>
{/if}

<style>
  .encounter-result {
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

  .encounter-result.revealed {
    border-color: #2ecc71;
  }

  h2 {
    margin: 0;
    font-size: 1.5rem;
  }

  .result-details {
    text-align: left;
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

  .result-details .ordeal-continues {
    color: #f1c40f;
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

  .stamina-regen {
    color: #2ecc71;
  }

  .xp-gained {
    color: #f1c40f;
  }

  .treasure-gained {
    color: #9b59b6;
  }

  .mystery-remaining {
    color: #e74c3c;
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
