<script>
  import { player, encounterNumber } from '../lib/gameState.js';

  $: healthPercent = ($player.health / $player.maxHealth) * 100;
  $: healthColor = healthPercent > 50 ? '#2ecc71' : healthPercent > 25 ? '#f39c12' : '#e74c3c';
</script>

<div class="player-status">
  <div class="stat">
    <span class="label">Encounter</span>
    <span class="value">#{$encounterNumber}</span>
  </div>

  <div class="stat health-stat">
    <span class="label">Health</span>
    <div class="health-bar">
      <div class="health-fill" style="width: {healthPercent}%; background: {healthColor}"></div>
      <span class="health-text">{$player.health} / {$player.maxHealth}</span>
    </div>
  </div>

  <div class="stat">
    <span class="label">Treasure</span>
    <span class="value treasure">💰 {$player.treasure}</span>
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

  .health-stat {
    flex: 1;
    min-width: 200px;
  }

  .health-bar {
    position: relative;
    height: 24px;
    background: #333;
    border-radius: 4px;
    overflow: hidden;
  }

  .health-fill {
    height: 100%;
    transition: width 0.3s ease, background 0.3s ease;
  }

  .health-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.875rem;
    font-weight: bold;
    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
  }
</style>
