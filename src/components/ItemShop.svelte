<script>
  import { player, skipItemShop } from '../lib/gameState.js';
</script>

<div class="item-shop">
  <h2>Item Shop</h2>

  <div class="xp-display">
    <span class="xp-label">Your XP:</span>
    <span class="xp-value">{$player.xp}</span>
  </div>

  <div class="placeholder">
    <div class="placeholder-icon">Coming Soon</div>
    <p>The item shop is under construction.</p>
    <p class="hint">Soon you'll be able to spend XP on powerful equipment here!</p>
  </div>

  <button class="btn btn-continue" on:click={skipItemShop}>
    Continue to Pod Shop
  </button>
</div>

<style>
  .item-shop {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    text-align: center;
    padding: 2rem;
  }

  h2 {
    margin: 0;
    color: #9b59b6;
    font-size: 1.75rem;
  }

  .xp-display {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #16213e;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    border: 2px solid #9b59b6;
  }

  .xp-label {
    color: #888;
    font-size: 1rem;
  }

  .xp-value {
    color: #9b59b6;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .placeholder {
    background: #16213e;
    border: 2px dashed #555;
    border-radius: 12px;
    padding: 3rem;
    max-width: 400px;
  }

  .placeholder-icon {
    font-size: 1.5rem;
    color: #f1c40f;
    margin-bottom: 1rem;
    font-weight: bold;
  }

  .placeholder p {
    color: #888;
    margin: 0.5rem 0;
  }

  .hint {
    font-style: italic;
    font-size: 0.875rem;
    color: #666 !important;
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

  .btn-continue {
    background: #9b59b6;
    color: #fff;
  }

  .btn-continue:hover {
    background: #8e44ad;
  }
</style>
