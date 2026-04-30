<script>
  import {
    drawnTokens,
    discardEffects,
    redrawsRemaining,
    selectiveRedrawsRemaining,
    selectedTokensForRedraw,
    currentEncounter,
    player,
    ordealActive,
    redrawAll,
    toggleTokenSelection,
    redrawSelected,
    confirmDraw,
    getTotalBonuses,
  } from '../lib/gameState.js';
  import { get } from 'svelte/store';
  import { tick } from 'svelte';
  import { calculateDrawTotals, calculateStaminaLost } from '../lib/encounter.js';
  import { TOKEN_TYPES, getTokenValue } from '../lib/tokens.js';
  import Token from './Token.svelte';

  const STAT_PRIORITY = { insight: 0, resolve: 1, xp: 2, glory: 3 };
  const ANIM_MS = 300;

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  // Get the primary stat and value a token contributes in context
  function getTokenContribution(token, allTokens) {
    const typeData = TOKEN_TYPES[token.type];

    if (typeData.getValue) {
      const contributions = typeData.getValue(token, allTokens, equipment);
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

      const priorityDiff = STAT_PRIORITY[contribA.stat] - STAT_PRIORITY[contribB.stat];
      if (priorityDiff !== 0) return priorityDiff;

      return contribB.value - contribA.value;
    });
  }

  // displayTokens: stable-ordered array of { ...token, leaving?, entering? }
  // Sorted on initial draw, then positions held stable across redraws.
  let displayTokens = [];
  let animating = false;

  $: {
    if ($drawnTokens.length === 0) {
      displayTokens = [];
      animating = false;
    } else if (displayTokens.length === 0 && !animating) {
      displayTokens = sortTokens($drawnTokens);
    }
  }

  async function handleRedrawAll() {
    if (animating || $redrawsRemaining <= 0) return;
    animating = true;

    displayTokens = displayTokens.map(t => ({ ...t, leaving: true }));
    await sleep(ANIM_MS);

    redrawAll();
    await tick();

    displayTokens = get(drawnTokens).map(t => ({ ...t, entering: true }));
    await sleep(ANIM_MS);
    displayTokens = displayTokens.map(({ entering: _, ...t }) => t);
    animating = false;
  }

  async function handleRedrawSelected() {
    if (animating || $selectiveRedrawsRemaining <= 0) return;
    const $selected = get(selectedTokensForRedraw);
    if ($selected.size === 0) return;
    animating = true;

    displayTokens = displayTokens.map(t =>
      $selected.has(t.id) ? { ...t, leaving: true } : t
    );
    await sleep(ANIM_MS);

    const keptIds = new Set(get(drawnTokens).filter(t => !$selected.has(t.id)).map(t => t.id));
    redrawSelected();
    await tick();

    const newTokens = get(drawnTokens).filter(t => !keptIds.has(t.id));
    let newIdx = 0;
    displayTokens = displayTokens
      .map(t => {
        if (!t.leaving) return t;
        const nt = newTokens[newIdx++];
        return nt ? { ...nt, entering: true } : null;
      })
      .filter(Boolean);

    await sleep(ANIM_MS);
    displayTokens = displayTokens.map(({ entering: _, ...t }) => t);
    animating = false;
  }

  $: equipment = $player.equipment || [];
  $: tokenTotals = calculateDrawTotals($drawnTokens, equipment);
  $: totalBonuses = getTotalBonuses($player);
  $: totals = {
    insight: tokenTotals.insight + (totalBonuses.insight || 0) + ($discardEffects.insight || 0),
    resolve: tokenTotals.resolve + (totalBonuses.resolve || 0) + ($discardEffects.resolve || 0),
    xp: tokenTotals.xp + ($discardEffects.xp || 0),
  };
  $: canSelectiveRedraw = $selectiveRedrawsRemaining > 0;
  $: hasSelection = $selectedTokensForRedraw.size > 0;

  // Check if thresholds are met
  $: insightMet = $currentEncounter && totals.insight >= $currentEncounter.mystery;
  $: resolveMet = $currentEncounter && totals.resolve >= $currentEncounter.trouble;

  // Predict stamina loss
  $: predictedStaminaLost = (!$currentEncounter || resolveMet)
    ? 0
    : calculateStaminaLost($currentEncounter.trouble - totals.resolve, $currentEncounter);
</script>

<div class="token-draw">
  <h3>Drawn Tokens</h3>

  <div class="drawn-tokens">
    {#each displayTokens as token (token.id)}
      <div
        class="token-wrapper"
        class:leaving={token.leaving}
        class:entering={token.entering}
      >
        <Token
          {token}
          size="large"
          selectable={canSelectiveRedraw && !animating}
          selected={$selectedTokensForRedraw.has(token.id)}
          onSelect={toggleTokenSelection}
          context={$drawnTokens}
          {equipment}
        />
      </div>
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
        {#if $discardEffects.insight > 0}
          <span class="draw-bonus">(+{$discardEffects.insight})</span>
        {/if}
        <span class="threshold-indicator" class:met={insightMet} class:ordeal-continues={!insightMet && $ordealActive}>{insightMet ? '✓' : $ordealActive ? '○' : '✗'}</span>
      </span>
    </div>
    <div class="total resolve" class:met={resolveMet}>
      <span class="total-label">Resolve</span>
      <span class="total-value">
        🛡️ {totals.resolve}
        {#if totalBonuses.resolve > 0}
          <span class="equip-bonus">(+{totalBonuses.resolve})</span>
        {/if}
        {#if $discardEffects.resolve > 0}
          <span class="draw-bonus">(+{$discardEffects.resolve})</span>
        {/if}
        <span class="threshold-indicator" class:met={resolveMet}>{resolveMet ? '✓' : '✗'}</span>
      </span>
    </div>
    <div class="total xp">
      <span class="total-label">XP</span>
      <span class="total-value">
        ⭐ {totals.xp}
        {#if $discardEffects.xp > 0}
          <span class="draw-bonus">(+{$discardEffects.xp})</span>
        {/if}
      </span>
    </div>
  </div>

  <div class="actions">
    <button
      class="btn btn-secondary"
      on:click={handleRedrawAll}
      disabled={$redrawsRemaining <= 0 || animating}
    >
      Redraw All <span class="btn-aside">({$redrawsRemaining} left)</span>
    </button>
    <button
      class="btn btn-selective"
      on:click={handleRedrawSelected}
      disabled={!canSelectiveRedraw || !hasSelection || animating}
    >
      Redraw Selected <span class="btn-aside">({$selectiveRedrawsRemaining} left)</span>
    </button>
    <button class="btn btn-primary" on:click={confirmDraw}>
      Onwards {#if predictedStaminaLost > 0} <span class="btn-aside">(-{predictedStaminaLost} stam)</span>{/if}
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
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .drawn-tokens {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .token-wrapper {
    transition: transform 300ms ease, opacity 300ms ease;
  }

  .token-wrapper.leaving {
    transform: scale(0);
    opacity: 0;
    pointer-events: none;
  }

  @keyframes token-enter {
    from { transform: scale(0); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }

  .token-wrapper.entering {
    animation: token-enter 300ms ease forwards;
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
    color: #aaa;
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

  .threshold-indicator.ordeal-continues {
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

  .btn-aside {
    font-size: 0.75em;
    opacity: 0.85;
  }
</style>
