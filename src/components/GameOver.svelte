<script>
  import { encounterNumber, player, restartGame } from '../lib/gameState.js';
</script>

<div class="game-over">
  <h1>🌙 Lost in the Wyld</h1>

  <div class="stats">
    <div class="stat">
      <span class="label">Depth Reached</span>
      <span class="value">{$encounterNumber - 1}</span>
    </div>
    <div class="stat">
      <span class="label">Final Treasure</span>
      <span class="value">$ {$player.treasure}</span>
    </div>
  </div>

  <button class="btn btn-primary" on:click={restartGame}>
    Dive Again
  </button>
</div>

<style>
  .game-over {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 3rem;
    background: linear-gradient(135deg, #2d1b1b 0%, #1a1a2e 100%);
    border: 2px solid #8b0000;
    border-radius: 12px;
    text-align: center;
  }

  h1 {
    margin: 0;
    font-size: 2.5rem;
    color: #e74c3c;
  }

  .stats {
    display: flex;
    gap: 3rem;
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .label {
    font-size: 0.875rem;
    color: #888;
    text-transform: uppercase;
  }

  .value {
    font-size: 2rem;
    font-weight: bold;
  }

  .btn {
    padding: 1rem 2rem;
    border: none;
    border-radius: 6px;
    font-size: 1.25rem;
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
