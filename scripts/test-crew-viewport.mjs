import assert from 'node:assert/strict';
import { observeCrewViewport } from '../src/utils/crewViewport.js';
let size = { width: 1366, height: 768 };
let next = 0;
const timers = new Map();
const rebuilt = [];
const viewport = observeCrewViewport({
  readSize: () => size,
  rebuild: () => rebuilt.push({ ...size }),
  schedule: callback => { timers.set(++next, callback); return next; },
  cancel: id => timers.delete(id),
});
viewport.changed();
assert.equal(timers.size, 0, 'Unchanged resize events must not cancel or restart an intro');
for (size of [{ width: 1902, height: 1080 }, { width: 1920, height: 1080 }]) viewport.changed();
assert.equal(timers.size, 1, 'Fullscreen resize bursts must rebuild only once');
let [id, callback] = timers.entries().next().value;
timers.delete(id); callback();
assert.deepEqual(rebuilt, [{ width: 1920, height: 1080 }]);
size = { width: 2560, height: 1440 }; viewport.changed();
viewport.dispose();
assert.equal(timers.size, 0, 'A skipped or unmounted scene must cancel its queued rebuild');
viewport.changed(); assert.equal(timers.size, 0);
console.log('Crew viewport: unchanged events, 1902/1920 fullscreen transitions, burst coalescing and disposal passed.');
