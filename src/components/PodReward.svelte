<script>
  import { rewardPod, selectedPodToReplace, takeRewardPod, takeRewardXp } from '../lib/gameState.js';
  import Pod from './Pod.svelte';
  import PodDisplay from './PodDisplay.svelte';

  $: xpValue = $rewardPod ? Math.floor($rewardPod.cost / 2) : 0;
  $: canTakePod = $selectedPodToReplace !== null;
</script>

<div class="pod-reward">
  <h2>Challenge Complete!</h2>
  <p class="intro">Choose your reward for conquering the hard path:</p>

  <div class="reward-options">
    <div class="option pod-option">
      <h3>Free Pod</h3>
      <p class="option-desc">Take this pod (replaces one of yours)</p>

      {#if $rewardPod}
        <div class="pod-preview">
          <Pod
            pod={{
              id: 'reward-pod',
              cost: $rewardPod.cost,
              tokens: $rewardPod.tokenDefs.map((t, i) => ({
                ...t,
                id: `reward-${i}`,
                rank: t.rank || 'ordinary'
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
        {#if canTakePod}
          Take Pod
        {:else}
          Select Pod to Replace
        {/if}
      </button>
    </div>

    <div class="or-divider">OR</div>

    <div class="option xp-option">
      <h3>XP</h3>
      <p class="option-desc">Take half the pod's value as XP</p>

      <div class="xp-preview">
        <span class="xp-amount">{xpValue} XP</span>
      </div>

      <button class="btn btn-xp" on:click={takeRewardXp}>
        Take {xpValue} XP
      </button>
    </div>
  </div>

  <div class="your-pods-section">
    <h3>Your Pods</h3>
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
    color: #888;
    margin: 0;
  }

  .reward-options {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .option {
    background: #16213e;
    border: 2px solid #333;
    border-radius: 12px;
    padding: 1.5rem;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .option h3 {
    margin: 0;
    font-size: 1.25rem;
  }

  .pod-option {
    border-color: #3498db;
  }

  .pod-option h3 {
    color: #3498db;
  }

  .xp-option {
    border-color: #f1c40f;
  }

  .xp-option h3 {
    color: #f1c40f;
  }

  .option-desc {
    color: #888;
    font-size: 0.875rem;
    margin: 0;
  }

  .or-divider {
    font-size: 1.25rem;
    font-weight: bold;
    color: #555;
  }

  .pod-preview {
    padding: 0.5rem;
  }

  .xp-preview {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 2.5rem;
    font-weight: bold;
    color: #f1c40f;
    padding: 1rem;
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

  .your-pods-section h3 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    color: #888;
    text-transform: uppercase;
  }

  .instruction {
    color: #666;
    font-size: 0.875rem;
    margin: 0 0 1rem;
    font-style: italic;
  }
</style>
