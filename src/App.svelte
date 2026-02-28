<script>
  import { onMount } from 'svelte';
  import * as gameState from './lib/gameState.js';
  import { loadSavedGame, initAutoSave, clearSave } from './lib/persistence.js';

  const { gamePhase, PHASES } = gameState;

  let crashed = false;

  function handleCrash() {
    try { clearSave(); } catch {}
    crashed = true;
  }

  onMount(() => {
    // ?reset clears the save and reloads cleanly — bookmark it as an escape hatch
    if (new URLSearchParams(window.location.search).has('reset')) {
      clearSave();
      window.history.replaceState({}, '', window.location.pathname);
    }

    try {
      loadSavedGame(gameState);
    } catch {
      clearSave();
    }

    window.addEventListener('error', handleCrash);
    window.addEventListener('unhandledrejection', handleCrash);

    const cleanup = initAutoSave(gameState);
    return () => {
      cleanup();
      window.removeEventListener('error', handleCrash);
      window.removeEventListener('unhandledrejection', handleCrash);
    };
  });

  import StartScreen from './components/StartScreen.svelte';
  import ClassSelect from './components/ClassSelect.svelte';
  import PlayerStatus from './components/PlayerStatus.svelte';
  import Encounter from './components/Encounter.svelte';
  import EncounterChoice from './components/EncounterChoice.svelte';
  import TokenDraw from './components/TokenDraw.svelte';
  import EncounterResult from './components/EncounterResult.svelte';
  import PodDisplay from './components/PodDisplay.svelte';
  import PodShop from './components/PodShop.svelte';
  import PodReward from './components/PodReward.svelte';
  import ItemShop from './components/ItemShop.svelte';
  import GameOver from './components/GameOver.svelte';
  import TokenDetailModal from './components/TokenDetailModal.svelte';
  import EquipmentDetailModal from './components/EquipmentDetailModal.svelte';
  import ClassDetailModal from './components/ClassDetailModal.svelte';
</script>

{#if crashed}
  <div class="crash-screen">
    <h2>Something went wrong</h2>
    <p>The game hit an unexpected error. Please let the developer know.</p>
    <button on:click={() => window.location.reload()}>Reload Game</button>
  </div>
{:else}

<TokenDetailModal />
<EquipmentDetailModal />
<ClassDetailModal />

<main>
  {#if $gamePhase === PHASES.START}
    <StartScreen />
  {:else if $gamePhase === PHASES.CLASS_SELECT}
    <ClassSelect />
  {:else if $gamePhase === PHASES.GAME_OVER}
    <GameOver />
  {:else}
    <div class="game-container">
      <PlayerStatus />

      {#if $gamePhase === PHASES.CHOICE}
        <div class="choice-section">
          <EncounterChoice />
        </div>
      {:else if $gamePhase === PHASES.DRAW}
        <div class="encounter-section">
          <Encounter />
        </div>
        <div class="draw-section">
          <TokenDraw />
        </div>
        <div class="pods-section">
          <PodDisplay />
        </div>
      {:else if $gamePhase === PHASES.ENCOUNTER}
        <div class="encounter-section">
          <Encounter />
        </div>
        <div class="result-section">
          <EncounterResult />
        </div>
      {:else if $gamePhase === PHASES.POD_REWARD}
        <PodReward />
      {:else if $gamePhase === PHASES.ITEM_SHOP}
        <ItemShop />
      {:else if $gamePhase === PHASES.SHOP}
        <PodShop />
      {/if}
    </div>
  {/if}
</main>

{/if}

<style>
  .crash-screen {
    max-width: 480px;
    margin: 6rem auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .crash-screen h2 {
    color: #e74c3c;
    font-size: 1.75rem;
    margin: 0;
  }

  .crash-screen p {
    color: #aaa;
    margin: 0;
  }

  .crash-screen .tip {
    font-size: 0.85rem;
    color: #666;
  }

  .crash-screen code {
    background: #16213e;
    padding: 0.1em 0.4em;
    border-radius: 4px;
    color: #f1c40f;
  }

  .crash-screen button {
    margin-top: 0.5rem;
    padding: 0.75rem 2rem;
    background: #e74c3c;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
  }

  .crash-screen button:hover {
    background: #c0392b;
  }

  :global(body) {
    padding: 1rem;
  }

  main {
    max-width: 1000px;
    margin: 0 auto;
  }

  .game-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .encounter-section {
    display: flex;
    justify-content: center;
  }

  .draw-section {
    background: #16213e;
    border-radius: 12px;
    padding: 1.5rem;
  }

  .result-section {
    display: flex;
    justify-content: center;
  }

  .pods-section {
    background: #0d1117;
    border-radius: 12px;
    padding: 1.5rem;
  }
</style>
