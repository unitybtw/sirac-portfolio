import assert from 'node:assert/strict';
import { createAtlasLoader } from '../src/utils/atlasLoader.js';
function setup() {
  const images = [], timers = new Map(), loaded = [];
  let id = 0;
  const loader = createAtlasLoader({
    files: { sit: 'sit.webp', run: 'run.webp' }, baseURL: '/portfolio/',
    createImage: () => { const image = {}; images.push(image); return image; },
    onLoad: (name, image) => loaded.push([name, image]),
    schedule: callback => { timers.set(++id, callback); return id; },
    cancel: id => timers.delete(id),
  });
  return { loader, images, timers, loaded, retry() { const [id, callback] = timers.entries().next().value; timers.delete(id); callback(); } };
}
let test = setup();
test.loader.load('sit'); test.loader.load('sit');
assert.equal(test.images.length, 1, 'Per-frame preload calls share one request');
assert.equal(test.images[0].src, '/portfolio/assets/mini-sirac/sit.webp');
test.images[0].onerror(); test.retry();
await test.images[1].onload();
assert.equal(test.loaded.length, 1, 'A transient failure recovers');
test.loader.load('sit'); assert.equal(test.images.length, 2, 'A loaded atlas is reused');
test.loader.dispose();

test = setup(); test.loader.load('run');
for (let attempt = 0; attempt < 3; attempt++) {
 test.images.at(-1).onerror();
 if (attempt < 2) test.retry();
}
assert.equal(test.timers.size, 0, 'Permanent errors stop after three attempts');
for (let frame = 0; frame < 100; frame++) test.loader.load('run');
assert.equal(test.images.length, 3, 'Animation frames must not create a retry storm');
test.loader.retryFailed(); assert.equal(test.images.length, 4, 'An explicit replay retries failed assets');
await test.images.at(-1).onload(); assert.equal(test.loaded.length, 1);
test.loader.dispose();

test = setup(); test.loader.load('sit');
test.images[0].decode = () => Promise.reject(Error('decode failed'));
await test.images[0].onload(); assert.equal(test.timers.size, 1, 'Decode failures also recover');
test.loader.dispose(); assert.equal(test.timers.size, 0, 'Unmount cancels pending retries');
test.loader.load('run'); assert.equal(test.images.length, 1);

test = setup(); test.loader.load('sit');
let resolveDecode; test.images[0].decode = () => new Promise(resolve => { resolveDecode = resolve; });
const pending = test.images[0].onload();
test.loader.dispose(); resolveDecode(); await pending;
assert.equal(test.loaded.length, 0, 'A late decode must never update a disposed scene');
console.log('Atlas loading: transient/decode recovery, request deduplication, bounded failures, replay and unmount cleanup passed.');
