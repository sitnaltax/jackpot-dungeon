<script>
  import { currentEncounter } from '../lib/gameState.js';

  const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.';
</script>

{#if $currentEncounter}
  <div class="encounter">
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
    </div>

    <div class="encounter-flavor">
      {$currentEncounter.flavorText || LOREM}
    </div>
  </div>
{/if}

<style>
  .encounter {
    background: linear-gradient(135deg, #2d1b1b 0%, #1a1a2e 100%);
    border: 2px solid #8b0000;
    border-radius: 10px;
    padding: 0.6rem 1rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
    box-sizing: border-box;
  }

  .encounter-left {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    flex-shrink: 0;
  }

  .encounter-name {
    font-size: 1.1rem;
    font-weight: bold;
    color: #e74c3c;
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
    color: #888;
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

  .encounter-flavor {
    flex: 1;
    font-size: 0.8rem;
    color: #777;
    font-style: italic;
    line-height: 1.5;
    border-left: 1px solid #3a2020;
    padding-left: 1.25rem;
  }
</style>
