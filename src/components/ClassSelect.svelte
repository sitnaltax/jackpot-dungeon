<script>
  import { selectClass, startDailyChallenge, dailyPending, dailyClassId } from '../lib/gameState.js';
  import { CLASS_LIST, DIFFICULTIES } from '../lib/classes.js';
  import { loadPrefs, savePrefs } from '../lib/persistence.js';
  import { todayUTC } from '../lib/rng.js';

  const prefs = loadPrefs();
  const isDaily = $dailyPending;
  const lockedClassId = $dailyClassId;

  // In daily mode, pre-select the locked class; otherwise restore last used
  let selectedClass = isDaily
    ? CLASS_LIST.find(c => c.id === lockedClassId) ?? CLASS_LIST[0]
    : (CLASS_LIST.find(c => c.id === prefs.lastClass) ?? CLASS_LIST[0]);
  let selectedDifficulty = prefs.lastDifficulty ?? 'normal';

  // In daily mode, exclude Observer (wizard) difficulty
  $: availableDifficulties = isDaily ? DIFFICULTIES.filter(d => d.id !== 'wizard') : DIFFICULTIES;
  // Ensure selected difficulty is valid in daily mode
  $: if (isDaily && selectedDifficulty === 'wizard') { selectedDifficulty = 'normal'; }

  $: selectedDiffData = availableDifficulties.find(d => d.id === selectedDifficulty) ?? availableDifficulties[0];

  const today = todayUTC();

  function handleStart() {
    if (!selectedClass) return;
    savePrefs({ lastClass: selectedClass.id, lastDifficulty: selectedDifficulty });
    if (isDaily) {
      dailyPending.set(false);
      startDailyChallenge(selectedDifficulty);
    } else {
      selectClass(selectedClass.id, selectedDifficulty);
    }
  }
</script>

{#if isDaily}
  <div class="daily-banner">
    Daily Challenge — {today}
  </div>
{/if}

<div class="class-select">
  <div class="section">
    <h3>Class</h3>
    <div class="button-stack">
      {#each CLASS_LIST as cls}
        <button
          class="pick-btn"
          class:active={selectedClass?.id === cls.id}
          class:dimmed={isDaily && cls.id !== lockedClassId}
          disabled={isDaily && cls.id !== lockedClassId}
          on:click={() => { if (!isDaily || cls.id === lockedClassId) selectedClass = cls; }}
        >
          {cls.name}
          {#if isDaily && cls.id === lockedClassId}
            <span class="daily-class-label">Today's Class</span>
          {/if}
        </button>
      {/each}
    </div>
    <div class="desc-box">
      {#if selectedClass}
        <p>{selectedClass.description}</p>
      {:else}
        <p class="placeholder">Select a class</p>
      {/if}
    </div>
  </div>

  <div class="section">
    <h3>Difficulty</h3>
    <div class="button-stack">
      {#each availableDifficulties as diff}
        <button
          class="pick-btn"
          class:active={selectedDifficulty === diff.id}
          on:click={() => selectedDifficulty = diff.id}
        >
          {diff.name}
        </button>
      {/each}
    </div>
    <div class="desc-box">
      {#if selectedDiffData}
        <p>{selectedDiffData.description}</p>
      {/if}
    </div>
  </div>

  <button
    class="btn-start"
    disabled={!selectedClass}
    on:click={handleStart}
  >
    Begin
  </button>
</div>

<style>
  .daily-banner {
    text-align: center;
    color: #b39ddb;
    font-size: 0.9rem;
    font-weight: bold;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 0.5rem 1rem;
    margin: 0 auto 0.5rem auto;
    background: rgba(126, 87, 194, 0.15);
    border: 1px solid #7e57c2;
    border-radius: 6px;
    max-width: 400px;
  }

  .class-select {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 0.5rem;
    text-align: center;
    max-width: 400px;
    margin: 0 auto;
  }

  .section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .section h3 {
    margin: 0;
    font-size: 0.75rem;
    text-transform: uppercase;
    color: #aaa;
    letter-spacing: 0.05em;
  }

  .button-stack {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .pick-btn {
    padding: 0.6rem 1rem;
    background: #16213e;
    border: 2px solid #2c3e50;
    border-radius: 6px;
    color: #ccc;
    font-family: inherit;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: border-color 0.15s ease, background 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .pick-btn:hover:not(:disabled) {
    border-color: #4a6785;
  }

  .pick-btn.active {
    border-color: #f1c40f;
    background: rgba(241, 196, 15, 0.1);
    color: #fff;
  }

  .pick-btn.dimmed {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .pick-btn:disabled {
    cursor: not-allowed;
  }

  .daily-class-label {
    font-size: 0.65rem;
    font-weight: normal;
    background: rgba(126, 87, 194, 0.35);
    border: 1px solid #7e57c2;
    border-radius: 3px;
    padding: 0.1rem 0.35rem;
    color: #ce93d8;
  }

  .desc-box {
    background: #16213e;
    border-radius: 6px;
    padding: 0.75rem 1rem;
    min-height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .desc-box p {
    margin: 0;
    font-size: 0.875rem;
    color: #aaa;
    line-height: 1.4;
  }

  .desc-box .placeholder {
    color: #555;
    font-style: italic;
  }

  .btn-start {
    padding: 0.75rem 3rem;
    border: none;
    border-radius: 8px;
    font-size: 1.25rem;
    font-weight: bold;
    cursor: pointer;
    background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
    color: #000;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    margin-top: 0.5rem;
  }

  .btn-start:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(46, 204, 113, 0.4);
  }

  .btn-start:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
