<script>
  import { selectClass } from '../lib/gameState.js';
  import { CLASS_LIST, DIFFICULTIES } from '../lib/classes.js';

  let selectedClass = CLASS_LIST[0];
  let selectedDifficulty = 'normal';

  $: selectedDiffData = DIFFICULTIES.find(d => d.id === selectedDifficulty);

  function handleStart() {
    if (selectedClass) {
      selectClass(selectedClass.id, selectedDifficulty);
    }
  }
</script>

<div class="class-select">
  <div class="section">
    <h3>Class</h3>
    <div class="button-stack">
      {#each CLASS_LIST as cls}
        <button
          class="pick-btn"
          class:active={selectedClass?.id === cls.id}
          on:click={() => selectedClass = cls}
        >
          {cls.name}
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
      {#each DIFFICULTIES as diff}
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
      <p>{selectedDiffData.description}</p>
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
  .class-select {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem;
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
  }

  .pick-btn:hover {
    border-color: #4a6785;
  }

  .pick-btn.active {
    border-color: #f1c40f;
    background: rgba(241, 196, 15, 0.1);
    color: #fff;
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
