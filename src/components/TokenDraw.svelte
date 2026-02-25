<script>
  import {
    drawnTokens,
    drawEffects,
    redrawsRemaining,
    selectiveRedrawsRemaining,
    selectedTokensForRedraw,
    currentEncounter,
    player,
    redrawAll,
    toggleTokenSelection,
    redrawSelected,
    confirmDraw,
    getTotalBonuses,
  } from '../lib/gameState.js';
  import { calculateDrawTotals } from '../lib/combat.js';
  import { TOKEN_TYPES, getTokenValue } from '../lib/tokens.js';
  import Token from './Token.svelte';

  const STAT_PRIORITY = { insight: 0, resolve: 1, xp: 2 };

  // Get the primary stat and value a token contributes in context
  function getTokenContribution(token, allTokens) {
    const typeData = TOKEN_TYPES[token.type];

    if (typeData.getValue) {
      const contributions = typeData.getValue(token, allTokens);
      // Get the first (primary) stat contribution
      const [stat, value] = Object.entries(contributions)[0];
      return { stat, value };
    }

    // Default: contributes to its own type
    return { stat: token.type, value: getTokenValue(token) };
  }

  // Sort tokens by stat priority (insight > resolve > xp), then by value descending
  function sortTokens(tokens) {
    return [...tokens].sort((a, b) => {
      const contribA = getTokenContribution(a, tokens);
      const contribB = getTokenContribution(b, tokens);

      // First sort by stat priority
      const priorityDiff = STAT_PRIORITY[contribA.stat] - STAT_PRIORITY[contribB.stat];
      if (priorityDiff !== 0) return priorityDiff;

      // Then by value descending
      return contribB.value - contribA.value;
    });
  }

  $: sortedTokens = sortTokens($drawnTokens);
  $: tokenTotals = calculateDrawTotals($drawnTokens);
  $: totalBonuses = getTotalBonuses($player);
  $: totals = {
    insight: tokenTotals.insight + (totalBonuses.insight || 0) + ($drawEffects.insight || 0),
    resolve: tokenTotals.resolve + (totalBonuses.resolve || 0) + ($drawEffects.resolve || 0),
    xp: tokenTotals.xp + ($drawEffects.xp || 0),
  };
  $: canSelectiveRedraw = $selectiveRedrawsRemaining > 0;
  $: hasSelection = $selectedTokensForRedraw.size > 0;

  // Check if thresholds are met
  $: insightMet = $currentEncounter && totals.insight >= $currentEncounter.mystery;
  $: resolveMet = $currentEncounter && totals.resolve >= $currentEncounter.trouble;
</script>

<div class="token-draw">
  <h3>Drawn Tokens</h3>

  <div class="drawn-tokens">
    {#each sortedTokens as token (token.id)}
      <Token
        {token}
        size="large"
        selectable={canSelectiveRedraw}
        selected={$selectedTokensForRedraw.has(token.id)}
        onSelect={toggleTokenSelection}
        context={$drawnTokens}
      />
    {/each}
  </div>

  <div class="totals">
    <div class="total insight" class:met={insightMet}>
      <span class="total-label">Insight</span>
      <span class="total-value">
        👁️ {totals.insight}
        {#if totalBonuses.insight > 0}
          <span class="equip-bonus">(+{totalBonuses.insight})</span>
        {/if}
        {#if $drawEffects.insight > 0}
          <span class="draw-bonus">(+{$drawEffects.insight})</span>
        {/if}
        <span class="threshold-indicator" class:met={insightMet}>{insightMet ? '✓' : '✗'}</span>
      </span>
    </div>
    <div class="total resolve" class:met={resolveMet}>
      <span class="total-label">Resolve</span>
      <span class="total-value">
        🛡️ {totals.resolve}
        {#if totalBonuses.resolve > 0}
          <span class="equip-bonus">(+{totalBonuses.resolve})</span>
        {/if}
        {#if $drawEffects.resolve > 0}
          <span class="draw-bonus">(+{$drawEffects.resolve})</span>
        {/if}
        <span class="threshold-indicator" class:met={resolveMet}>{resolveMet ? '✓' : '✗'}</span>
      </span>
    </div>
    <div class="total xp">
      <span class="total-label">XP</span>
      <span class="total-value">
        ⭐ {totals.xp}
        {#if $drawEffects.xp > 0}
          <span class="draw-bonus">(+{$drawEffects.xp})</span>
        {/if}
      </span>
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
      Onwards
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

  .total.resolve .total-value {
    color: #3498db;
  }

  .total.xp .total-value {
    color: #f1c40f;
  }

  .equip-bonus {
    font-size: 0.75rem;
    color: #e5c07b;
    margin-left: 0.15rem;
  }

  .draw-bonus {
    font-size: 0.75rem;
    color: #8b7355;
    margin-left: 0.15rem;
  }

  .threshold-indicator {
    font-size: 0.875rem;
    color: #e74c3c;
  }

  .threshold-indicator.met {
    color: #2ecc71;
  }

  .actions {
    display: flex;
    gap: 1rem;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-size: 1.2rem;
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
