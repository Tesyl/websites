// Tests for `clickToRestart` — the click affordance on the reel-driven
// story tiles. The intention under test is what a reader experiences:
// arriving mid-sequence, a click puts the reel back at its first step and
// the auto-loop carries on; once the tile is torn down, clicks are inert.

import { describe, expect, it, vi } from 'vitest';
import { Reel } from '../lib/effects/Reel';
import { clickToRestart } from './types';

// Three steps, each recording the order it was entered. Durations are long
// enough that nothing auto-advances during a test — every transition
// observed is one the test caused.
const buildReel = (entered: number[]) =>
  new Reel({
    steps: [
      { label: 'a', hint: '', ms: 100_000, enter: () => entered.push(0) },
      { label: 'b', hint: '', ms: 100_000, enter: () => entered.push(1) },
      { label: 'c', hint: '', ms: 100_000, enter: () => entered.push(2) },
    ],
    ctx: undefined,
    loop: true,
    // Mirrors the real tiles: step 0 is set as the initial scene outside
    // the reel, so the reel itself starts at 1.
    startAt: 1,
  });

describe('clickToRestart', () => {
  it('sends a mid-sequence reel back to its first step', () => {
    const entered: number[] = [];
    const reel = buildReel(entered);
    const canvas = document.createElement('canvas');
    clickToRestart(canvas, reel);

    reel.play();
    reel.scrub(2);
    expect(reel.index()).toBe(2);

    canvas.dispatchEvent(new Event('click'));

    expect(reel.index()).toBe(0);
    expect(entered.at(-1)).toBe(0);
    reel.dispose();
  });

  it('re-enters step 0 even when the reel is already there', () => {
    // A reader who clicks twice should see the sequence restart both
    // times rather than the second click being swallowed as a no-op.
    const entered: number[] = [];
    const reel = buildReel(entered);
    const canvas = document.createElement('canvas');
    clickToRestart(canvas, reel);
    reel.play();

    canvas.dispatchEvent(new Event('click'));
    canvas.dispatchEvent(new Event('click'));

    const restarts = entered.filter((i) => i === 0).length;
    expect(restarts).toBe(2);
    reel.dispose();
  });

  it('marks the tile as interactive and restores the cursor on dispose', () => {
    const reel = buildReel([]);
    const canvas = document.createElement('canvas');
    const dispose = clickToRestart(canvas, reel);

    expect(canvas.style.cursor).toBe('pointer');
    dispose();
    expect(canvas.style.cursor).toBe('');
    reel.dispose();
  });

  it('stops responding to clicks once disposed', () => {
    // The page teardown path calls this disposer; a listener left behind
    // would keep a dead reel reachable on every group switch.
    const entered: number[] = [];
    const reel = buildReel(entered);
    const canvas = document.createElement('canvas');
    const dispose = clickToRestart(canvas, reel);
    reel.play();
    entered.length = 0;

    dispose();
    canvas.dispatchEvent(new Event('click'));

    expect(entered).toEqual([]);
    reel.dispose();
  });

  it('leaves a disposed reel untouched', () => {
    // Teardown order is not guaranteed across a group switch — a click
    // landing after reel.dispose() must not re-enter a step.
    const entered: number[] = [];
    const reel = buildReel(entered);
    const canvas = document.createElement('canvas');
    clickToRestart(canvas, reel);
    reel.play();
    reel.dispose();
    entered.length = 0;

    canvas.dispatchEvent(new Event('click'));

    expect(entered).toEqual([]);
  });

  it('clears the pending advance so the restarted step gets its full run', () => {
    // Without the internal clearPending, the timer from the interrupted
    // step would fire on the old schedule and cut step 0 short.
    vi.useFakeTimers();
    try {
      const entered: number[] = [];
      const reel = buildReel(entered);
      const canvas = document.createElement('canvas');
      clickToRestart(canvas, reel);
      reel.play();

      vi.advanceTimersByTime(99_000); // 1s short of step 1 advancing
      canvas.dispatchEvent(new Event('click'));
      entered.length = 0;

      vi.advanceTimersByTime(99_000); // step 0 must still be running
      expect(entered).toEqual([]);

      vi.advanceTimersByTime(2_000); // now it advances
      expect(entered).toEqual([1]);
      reel.dispose();
    } finally {
      vi.useRealTimers();
    }
  });
});
