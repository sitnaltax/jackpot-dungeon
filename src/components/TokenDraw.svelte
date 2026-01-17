<script>
  import {
    drawnTokens,
    redrawsRemaining,
    selectiveRedrawsRemaining,
    selectedTokensForRedraw,
    redrawAll,
    toggleTokenSelection,
    redrawSelected,
    confirmDraw
  } from '../lib/gameState.js';
  import { calculateDrawTotals } from '../lib/combat.js';
  import Token from './Token.svelte';

  $: totals = calculateDrawTotals($drawnTokens);
  $: canSelectiveRedraw = $selectiveRedrawsRemaining > 0;
  $: hasSelection = $selectedTokensForRedraw.size > 0;
</script>

<div class="token-draw">
  <h3>Drawn Tokens</h3>
  {#if canSelectiveRedraw}
    <p class="hint">Click tokens to select them for redraw</p>
  {/if}

  <div class="drawn-tokens">
    {#each $drawnTokens as token (token.id)}
      <Token
        {token}
        size="large"
        selectable={canSelectiveRedraw}
        selected={$selectedTokensForRedraw.has(token.id)}
        onSelect={toggleTokenSelection}
      />
    {/each}
  </div>

  <div class="totals">
    <div class="total insight">
      <span class="total-label">Insight</span>
      <span class="total-value">👁️ {totals.insight}</span>
    </div>
    <div class="total composure">
      <span class="total-label">Composure</span>
      <span class="total-value">💭 {totals.composure}</span>
    </div>
    <div class="total treasure">
      <span class="total-label">Treasure</span>
      <span class="total-value">💰 {totals.treasure}</span>
    </div>
  </div>

  <div class="actions">
    <button
      class="btn btn-secondary"
      on:click={redrawAll}
      disabled={$redrawsRemaining <= 0}
    >
      Redraw All ({$redrawsRemaining} left)
    </button>
    <button
      class="btn btn-selective"
      on:click={redrawSelected}
      disabled={!canSelectiveRedraw || !hasSelection}
    >
      Redraw Selected ({$selectiveRedrawsRemaining} left)
    </button>
    <button class="btn btn-primary" on:click={confirmDraw}>
      Face the Fey
    </button>
  </div>
</div>

<style>
  .token-draw {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  h3 {
    margin: 0;
    font-size: 1rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .hint {
    margin: 0;
    font-size: 0.875rem;
    color: #666;
    font-style: italic;
  }

  .drawn-tokens {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .totals {
    display: flex;
    gap: 2rem;
    padding: 1rem;
    background: #16213e;
    border-radius: 8px;
  }

  .total {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .total-label {
    font-size: 0.75rem;
    color: #888;
    text-transform: uppercase;
  }

  .total-value {
    font-size: 1.25rem;
    font-weight: bold;
  }

  .total.insight .total-value {
    color: #e74c3c;
  }

  .total.composure .total-value {
    color: #3498db;
  }

  .total.treasure .total-value {
    color: #f1c40f;
  }

  .actions {
    display: flex;
    gap: 1rem;
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

  .btn:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background: #2ecc71;
    color: #000;
  }

  .btn-primary:hover:not(:disabled) {
    background: #27ae60;
  }

  .btn-secondary {
    background: #34495e;
    color: #fff;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #2c3e50;
  }

  .btn-selective {
    background: #9b59b6;
    color: #fff;
  }

  .btn-selective:hover:not(:disabled) {
    background: #8e44ad;
  }
</style>
