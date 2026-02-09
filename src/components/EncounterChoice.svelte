<script>
  import { choiceEncounters, chooseHardPath, chooseBasicPath } from '../lib/gameState.js';
</script>

<div class="choice-container">
  <h2>Choose Your Path</h2>
  <p class="choice-intro">A crossroads lies before you. Which path will you take?</p>

  <div class="choices">
    <div class="choice-card hard">
      <div class="choice-header">
        <span class="choice-icon">Hard Path</span>
      </div>

      {#if $choiceEncounters.hard}
        <div class="encounter-preview">
          <div class="encounter-name">{$choiceEncounters.hard.name}</div>
          {#if $choiceEncounters.hard.description}
            <div class="encounter-desc">{$choiceEncounters.hard.description}</div>
          {/if}
          <div class="encounter-stats">
            <div class="stat">
              <span class="label">Mystery</span>
              <span class="value mystery">{$choiceEncounters.hard.mystery}</span>
            </div>
            <div class="stat">
              <span class="label">Trouble</span>
              <span class="value trouble">{$choiceEncounters.hard.trouble}</span>
            </div>
          </div>
        </div>
      {/if}

      <div class="choice-reward">
        <span class="reward-label">Reward:</span>
        Free pod or treasure
      </div>

      <button class="btn btn-hard" on:click={chooseHardPath}>
        Face the Challenge
      </button>
    </div>

    <div class="choice-card basic">
      <div class="choice-header">
        <span class="choice-icon">Safe Path</span>
      </div>

      {#if $choiceEncounters.basic}
        <div class="encounter-preview">
          <div class="encounter-name">{$choiceEncounters.basic.name}</div>
          {#if $choiceEncounters.basic.description}
            <div class="encounter-desc">{$choiceEncounters.basic.description}</div>
          {/if}
          <div class="encounter-stats">
            <div class="stat">
              <span class="label">Mystery</span>
              <span class="value mystery">{$choiceEncounters.basic.mystery}</span>
            </div>
            <div class="stat">
              <span class="label">Trouble</span>
              <span class="value trouble">{$choiceEncounters.basic.trouble}</span>
            </div>
          </div>
        </div>
      {/if}

      <div class="choice-reward">
        <span class="reward-label">Reward:</span>
        Access to Item Shop
      </div>

      <button class="btn btn-basic" on:click={chooseBasicPath}>
        Take the Safe Route
      </button>
    </div>
  </div>
</div>

<style>
  .choice-container {
    text-align: center;
  }

  h2 {
    margin: 0 0 0.5rem;
    color: #f1c40f;
    font-size: 1.75rem;
  }

  .choice-intro {
    color: #888;
    margin-bottom: 1.5rem;
  }

  .choices {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .choice-card {
    background: #16213e;
    border: 2px solid #333;
    border-radius: 12px;
    padding: 1.5rem;
    width: 280px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .choice-card.hard {
    border-color: #e74c3c;
  }

  .choice-card.basic {
    border-color: #2ecc71;
  }

  .choice-header {
    font-size: 1.25rem;
    font-weight: bold;
  }

  .choice-card.hard .choice-header {
    color: #e74c3c;
  }

  .choice-card.basic .choice-header {
    color: #2ecc71;
  }

  .encounter-preview {
    background: #0d1117;
    border-radius: 8px;
    padding: 1rem;
  }

  .encounter-name {
    font-size: 1.1rem;
    font-weight: bold;
    color: #fff;
    margin-bottom: 0.5rem;
  }

  .encounter-desc {
    font-size: 0.8rem;
    color: #f1c40f;
    font-style: italic;
    margin-bottom: 0.75rem;
  }

  .encounter-stats {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .stat .label {
    font-size: 0.7rem;
    color: #888;
    text-transform: uppercase;
  }

  .stat .value {
    font-size: 1.25rem;
    font-weight: bold;
  }

  .stat .value.mystery {
    color: #e74c3c;
  }

  .stat .value.trouble {
    color: #3498db;
  }

  .choice-reward {
    font-size: 0.9rem;
    color: #ccc;
  }

  .reward-label {
    color: #f1c40f;
    font-weight: bold;
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

  .btn-hard {
    background: #e74c3c;
    color: #fff;
  }

  .btn-hard:hover {
    background: #c0392b;
  }

  .btn-basic {
    background: #2ecc71;
    color: #000;
  }

  .btn-basic:hover {
    background: #27ae60;
  }
</style>
