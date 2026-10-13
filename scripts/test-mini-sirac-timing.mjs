import assert from 'node:assert/strict';
import { seatedFrameAt, departureTimeFor } from '../src/utils/miniSiracTiming.js';

// A long photo transport keeps moving instead of freezing at source frame 120.
const frames = Array.from({ length: 160 }, (_, i) => seatedFrameAt(8 + i / 16));
assert.equal(new Set(frames).size, 25);
assert.ok(frames.every(frame => frame >= 96 && frame <= 120));
// Settling at any point of the idle loop waits for the matching stand-up pose.
for (const arrival of [0, 2, 7.4, 7.5, 8, 10, 10.5, 15, 32.2]) {
  const departure = departureTimeFor(arrival);
  assert.ok(departure >= arrival);
  assert.ok(departure - Math.max(arrival, 7.5) < 3);
  assert.equal(seatedFrameAt(departure), 120);
  assert.ok(Math.abs(seatedFrameAt(departure - 1 / 16) - 120) <= 1);
}
console.log('Seated idle and arrival/stand-up continuity checks passed.');
