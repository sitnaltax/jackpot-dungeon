<script>
  import { rewardPod, selectedPodToReplace, takeRewardPod, takeRewardXp } from '../lib/gameState.js';
  import Pod from './Pod.svelte';
  import PodDisplay from './PodDisplay.svelte';

  $: xpValue = $rewardPod ? Math.floor($rewardPod.cost / 2) : 0;
  $: canTakePod = $selectedPodToReplace !== null;
</script>

<div class="pod-reward">
  <h2>Challenge Complete!</h2>
  <p class="intro">Choose your reward for facing greater peril:</p>

  <div class="choices">
    <div class="choice-card pod-option">
      <div class="choice-header">Free Pod</div>
      <p class="option-desc">Take this pod and replace one of yours</p>

      {#if $rewardPod}
        <div class="pod-preview">
          <Pod
            pod={{
              id: 'reward-pod',
              cost: $rewardPod.cost,
              tokens: $rewardPod.tokenDefs.map((t, i) => ({
                ...t,
                id: `reward-${i}`,
                rank: t.rank || 'bronze'
              }))
            }}
            showCost={false}
          />
        </div>
      {/if}

      <button
        class="btn btn-pod"
        disabled={!canTakePod}
        on:click={takeRewardPod}
      >
        {canTakePod ? 'Take Pod' : 'Select Pod to Replace'}
      </button>
    </div>

    <div class="choice-card xp-option">
      <div class="choice-header">XP</div>
      <p class="option-desc">Take half the pod's value as XP instead</p>

      <div class="xp-preview">
        {xpValue} XP
      </div>

      <button class="btn btn-xp" on:click={takeRewardXp}>
        Take {xpValue} XP
      </button>
    </div>
  </div>

  <div class="your-pods-section">
    <p class="instruction">Select a pod to replace if taking the free pod</p>
    <PodDisplay selectable={true} />
  </div>
</div>

<style>
  .pod-reward {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }

  h2 {
    margin: 0;
    color: #2ecc71;
    font-size: 1.75rem;
  }

  .intro {
    color: #aaa;
    margin: 0;
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
    flex: 1;
    min-width: 140px;
    max-width: 240px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .choice-header {
    font-size: 1.25rem;
    font-weight: bold;
  }

  .pod-option {
    border-color: #3498db;
  }

  .pod-option .choice-header {
    color: #3498db;
  }

  .xp-option {
    border-color: #f1c40f;
  }

  .xp-option .choice-header {
    color: #f1c40f;
  }

  .option-desc {
    color: #aaa;
    font-size: 0.875rem;
    margin: 0;
  }

  .pod-preview {
    padding: 0.5rem;
  }

  .xp-preview {
    font-size: 2.5rem;
    font-weight: bold;
    color: #f1c40f;
    padding: 1rem;
    flex: 1;
    display: flex;
    align-items: center;
  }

  .btn {
    width: 100%;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    margin-top: auto;
    transition: background 0.2s ease, transform 0.2s ease;
  }

  .btn:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-pod {
    background: #3498db;
    color: #fff;
  }

  .btn-pod:hover:not(:disabled) {
    background: #2980b9;
  }

  .btn-xp {
    background: #f1c40f;
    color: #000;
  }

  .btn-xp:hover {
    background: #d4ac0d;
  }

  .your-pods-section {
    background: #0d1117;
    border-radius: 12px;
    padding: 1.5rem;
    text-align: left;
  }

  .instruction {
    color: #666;
    font-size: 0.875rem;
    margin: 0 0 1rem;
    font-style: italic;
  }

  @media (max-width: 400px) {
    .choice-card {
      padding: 1rem;
    }
    .choices {
      gap: 0.75rem;
    }
  }
</style>
