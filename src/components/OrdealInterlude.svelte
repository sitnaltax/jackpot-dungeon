<script>
  import {
    player,
    ordealMysteryPool, ordealRound,
    beginOrdealRound,
    ordealSpendOnClue, ordealSpendOnStamina,
    ordealOpenPodShop, ordealOpenItemShop,
    getEffectiveMaxStamina,
  } from '../lib/gameState.js';
  import { CONFIG } from '../lib/constants.js';

  let clueXp = 0;
  let homeXp = 0;
  let treasureXp = 0;

  $: difficulty = $player.difficulty;
  $: troublePerRound = CONFIG.ordealTroublePerRound[difficulty] ?? CONFIG.ordealTroublePerRound.normal;
  $: nextTrouble = CONFIG.ordealTroubleBase + $ordealRound * troublePerRound;
  $: startPool = Math.round(CONFIG.ordealBaseMystery * (CONFIG.ordealMysteryScale[difficulty] ?? 1));
  $: poolPercent = ($ordealMysteryPool / startPool) * 100;

  $: clueReduction = Math.min(Math.floor(clueXp / 3), Math.max(0, $ordealMysteryPool - 1));
  $: homeHeal = Math.floor(homeXp / 3);
  $: effectiveMax = getEffectiveMaxStamina($player);
  $: homeHealCapped = Math.min(homeHeal, effectiveMax - $player.stamina);
  $: treasureGain = Math.floor(treasureXp / 10);

  function spendOnClue() {
    if (clueXp <= 0 || $player.xp < clueXp) return;
    ordealSpendOnClue(clueXp);
    clueXp = 0;
  }

  function spendOnStamina() {
    if (homeXp <= 0 || $player.xp < homeXp) return;
    ordealSpendOnStamina(homeXp);
    homeXp = 0;
  }

  function openItemShop() {
    ordealOpenItemShop(treasureXp);
    treasureXp = 0;
  }
</script>

<div class="interlude">
  <div class="header">
    <h2>Between Rounds</h2>
    <div class="pool-bar">
      <div class="pool-fill" style="width: {poolPercent}%"></div>
      <span class="pool-text">Mystery Pool: {$ordealMysteryPool} remaining</span>
    </div>
    <div class="round-info">Round {$ordealRound} complete · Next round Trouble: {nextTrouble}</div>
  </div>

  <div class="resources">
    <div class="resource">
      <span class="resource-label">XP</span>
      <span class="resource-value xp">{$player.xp}</span>
    </div>
    <div class="resource">
      <span class="resource-label">Stamina</span>
      <span class="resource-value stamina">{$player.stamina} / {effectiveMax}</span>
    </div>
    <div class="resource">
      <span class="resource-label">Treasure</span>
      <span class="resource-value treasure">${$player.treasure}</span>
    </div>
  </div>

  <p class="intro">Something stirs in the dark between attempts. You take a moment to gather yourself.</p>

  <div class="options">

    <div class="option-card">
      <div class="option-header clue">Remember a Clue</div>
      <p class="option-desc">Convert XP to Mystery loss at a 3:1 ratio. Cannot reduce the Mystery below 1—the last point must be resolved in the encounter.</p>
      <div class="spend-row">
        <input type="number" min="0" max={$player.xp} step="3" bind:value={clueXp} class="xp-input" />
        <span class="spend-preview">→ −{clueReduction} Mystery</span>
      </div>
      <button class="btn btn-clue" disabled={clueXp <= 0 || $player.xp < clueXp || clueReduction <= 0} on:click={spendOnClue}>
        Spend {clueXp} XP
      </button>
    </div>

    <div class="option-card">
      <div class="option-header home">Remember your Home</div>
      <p class="option-desc">Convert XP to Stamina at a 3:1 ratio.</p>
      <div class="spend-row">
        <input type="number" min="0" max={$player.xp} step="3" bind:value={homeXp} class="xp-input" />
        <span class="spend-preview">→ +{homeHealCapped} Stamina</span>
      </div>
      <button class="btn btn-home" disabled={homeXp <= 0 || $player.xp < homeXp || homeHeal <= 0} on:click={spendOnStamina}>
        Spend {homeXp} XP
      </button>
    </div>

    <div class="option-card">
      <div class="option-header technique">Remember a Technique</div>
      <p class="option-desc">Visit the pod shop to upgrade your draws. You'll return directly to the next round.</p>
      <button class="btn btn-technique" on:click={ordealOpenPodShop}>
        Visit Pod Shop
      </button>
    </div>

    <div class="option-card">
      <div class="option-header treasure">Remember a Treasure</div>
      <p class="option-desc">Convert XP to Treasure at a 10:1 ratio, then visit the item shop. You'll return directly to the next round.</p>
      <div class="spend-row">
        <input type="number" min="0" max={$player.xp} step="10" bind:value={treasureXp} class="xp-input" />
        <span class="spend-preview">→ +${treasureGain} Treasure</span>
      </div>
      <button class="btn btn-treasure" on:click={openItemShop}>
        {treasureXp > 0 ? `Convert & Shop` : 'Visit Item Shop'}
      </button>
    </div>

  </div>

  <button class="btn-continue" on:click={beginOrdealRound}>
    Face the Ordeal
  </button>
</div>

<style>
  .interlude {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  h2 {
    margin: 0;
    font-size: 1.75rem;
    color: #83e8ff;
  }

  .pool-bar {
    position: relative;
    height: 22px;
    background: #1a2a35;
    border-radius: 4px;
    overflow: hidden;
  }

  .pool-fill {
    height: 100%;
    background: linear-gradient(90deg, #e74c3c, #f39c12);
    transition: width 0.4s ease;
  }

  .pool-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.8rem;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
    white-space: nowrap;
  }

  .round-info {
    font-size: 0.8rem;
    color: #888;
  }

  .resources {
    display: flex;
    gap: 2rem;
    justify-content: center;
    background: #16213e;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
  }

  .resource {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
  }

  .resource-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    color: #888;
    letter-spacing: 0.05em;
  }

  .resource-value {
    font-size: 1.25rem;
    font-weight: bold;
  }

  .resource-value.xp      { color: #f1c40f; }
  .resource-value.stamina { color: #2ecc71; }
  .resource-value.treasure { color: #9b59b6; }

  .intro {
    color: #888;
    font-style: italic;
    text-align: center;
    margin: 0;
    font-size: 0.9rem;
  }

  .options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 560px) {
    .options {
      grid-template-columns: 1fr;
    }
  }

  .option-card {
    background: #16213e;
    border: 2px solid #333;
    border-radius: 10px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .option-header {
    font-size: 1rem;
    font-weight: bold;
  }

  .option-header.clue      { color: #e74c3c; }
  .option-header.home      { color: #2ecc71; }
  .option-header.technique { color: #3498db; }
  .option-header.treasure  { color: #9b59b6; }

  .option-card:has(.option-header.clue)      { border-color: #5a1010; }
  .option-card:has(.option-header.home)      { border-color: #0f4020; }
  .option-card:has(.option-header.technique) { border-color: #0f2a45; }
  .option-card:has(.option-header.treasure)  { border-color: #2a1040; }

  .option-desc {
    font-size: 0.8rem;
    color: #888;
    margin: 0;
    line-height: 1.4;
    flex: 1;
  }

  .spend-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .xp-input {
    width: 70px;
    background: #0d1117;
    border: 1px solid #444;
    border-radius: 4px;
    color: #f1c40f;
    font-size: 1rem;
    padding: 0.3rem 0.4rem;
    text-align: center;
  }

  .spend-preview {
    font-size: 0.85rem;
    color: #aaa;
  }

  .btn {
    padding: 0.6rem 1rem;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    margin-top: auto;
  }

  .btn:hover:not(:disabled) { transform: translateY(-1px); }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .btn-clue      { background: #8b1a1a; color: #fff; }
  .btn-clue:hover:not(:disabled) { background: #a52020; }

  .btn-home      { background: #1a6b3a; color: #fff; }
  .btn-home:hover:not(:disabled) { background: #22884a; }

  .btn-technique { background: #1a4a7a; color: #fff; }
  .btn-technique:hover:not(:disabled) { background: #225a96; }

  .btn-treasure  { background: #4a1a7a; color: #fff; }
  .btn-treasure:hover:not(:disabled) { background: #5c2295; }

  .btn-continue {
    align-self: center;
    padding: 0.875rem 3rem;
    background: #83e8ff;
    color: #000;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }

  .btn-continue:hover {
    background: #5fd0ee;
    transform: translateY(-2px);
  }
</style>
