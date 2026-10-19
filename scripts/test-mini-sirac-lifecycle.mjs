import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { transformWithEsbuild } from 'vite';
import { createAtlasLoader } from '../src/utils/atlasLoader.js';
import { seatedFrameAt, departureTimeFor } from '../src/utils/miniSiracTiming.js';

// Run the actual effects with a deterministic DOM/RAF adapter. No page or game is opened.
const data = {};
for (const name of ['miniDragContacts', 'miniCrewContacts', 'miniCompanionRunFloor']) {
  data[name] = JSON.parse(await readFile(`src/data/${name}.json`, 'utf8'));
}
function eventTarget() {
  const listeners = new Map();
  return {
    addEventListener(type, callback) { if (!listeners.has(type)) listeners.set(type, new Set()); listeners.get(type).add(callback); },
    removeEventListener(type, callback) { listeners.get(type)?.delete(callback); },
    dispatchEvent(event) { for (const callback of [...(listeners.get(event.type) || [])]) callback(event); },
  };
}
async function mount(name) {
  const effects = [], cleanups = [], frames = new Map(), timers = new Map(), images = [];
  let sequence = 0;
  const window = eventTarget();
  const motion = Object.assign(eventTarget(), { matches: false });
  window.matchMedia = () => motion;
  const document = Object.assign(eventTarget(), { hidden: false, body: { style: {} }, querySelector: () => null });
  const context2d = new Proxy({}, { get: () => () => {} });
  const canvas = { dataset: {}, style: {}, getContext: () => context2d };
  const observed = [], mutations = [];
  const portrait = { getBoundingClientRect: () => ({ left: 600, top: 200, width: 300 }) };
  const button = { disabled: false, getBoundingClientRect: () => ({ left: 400, top: 800, width: 320, height: 48 }) };
  document.querySelector = selector => selector.includes('data-ascii-target') ? portrait : selector.includes('data-sirac-submit') ? button : null;
  class FakeImage { constructor() { images.push(this); } }
  const runtime = { jsx: () => null, jsxs: () => null };
  const react = { useRef: () => ({ current: canvas }), useEffect: callback => effects.push(callback) };
  const source = (await readFile(`src/components/${name}.jsx`, 'utf8')).replaceAll('import.meta.env.BASE_URL', "'/'");
  const { code } = await transformWithEsbuild(source, `${name}.jsx`, { loader: 'jsx', jsx: 'automatic', format: 'cjs' });
  const module = { exports: {} };
  vm.runInNewContext(code, {
    module, exports: module.exports,
    require(path) {
      if (path === 'react') return react;
      if (path === 'react-dom') return { createPortal: () => null };
      if (path === 'react/jsx-runtime') return runtime;
      if (path.includes('atlasLoader')) return { createAtlasLoader: options => createAtlasLoader({ ...options, createImage: () => new FakeImage(), schedule: callback => { timers.set(++sequence, callback); return sequence; }, cancel: id => timers.delete(id) }) };
      if (path.includes('miniSiracTiming')) return { seatedFrameAt, departureTimeFor };
      const key = Object.keys(data).find(key => path.includes(key));
      if (key) return data[key];
      throw Error(`Unexpected import: ${path}`);
    },
    window, document, matchMedia: () => motion, Image: FakeImage,
    innerWidth: 1920, innerHeight: 1080, devicePixelRatio: 1,
    Element: class {}, CustomEvent: class { constructor(type, options = {}) { this.type = type; this.detail = options.detail; } },
    IntersectionObserver: class { constructor(callback) { observed.push(callback); } observe() {} disconnect() {} },
    MutationObserver: class { constructor(callback) { mutations.push(callback); } observe() {} disconnect() {} },
    requestAnimationFrame: callback => { frames.set(++sequence, callback); return sequence; },
    cancelAnimationFrame: id => frames.delete(id),
    setTimeout: callback => { timers.set(++sequence, callback); return sequence; },
    clearTimeout: id => timers.delete(id),
  });
  module.exports.default();
  for (const effect of effects) cleanups.push(effect());
  const send = (type, details = {}) => {
    const event = { type, preventDefault() { this.prevented = true; }, stopImmediatePropagation() {}, ...details };
    window.dispatchEvent(event); return event;
  };
  return {
    canvas, motion, frames, send, images, button, document,
    loadImages: () => Promise.all(images.map(image => image.onload?.())),
    showContact: () => observed[0]([{ target: button, isIntersecting: true }]),
    changeButton: () => mutations.forEach(callback => callback()),
    showPortrait: () => observed[0]([{ target: portrait, isIntersecting: true }]),
    step(time) { const queued = [...frames.values()]; frames.clear(); queued.forEach(callback => callback(time)); },
    dispose() { cleanups.forEach(callback => callback?.()); },
  };
}
async function grabActor() {
  const app = await mount('MiniSiracDrag');
  app.send('mini-sirac-targets', { detail: { source: 'crew', targets: [{ id: 'title:0', left: 90, right: 150, top: 100, bottom: 250, height: 140 }] } });
  await app.loadImages();
  app.send('pointerdown', { button: 0, pointerId: 1, clientX: 120, clientY: 140 });
  app.step(100);
  return app;
}
let app = await grabActor();
assert(app.send('click').prevented, 'A grab suppresses the synthetic click');
app.send('mini-sirac-start');
assert(!app.send('click').prevented, 'Replay during a grab must restore normal links and buttons');
assert.equal(app.canvas.dataset.actors, '[]');
assert.equal(app.frames.size, 0, 'Reset clears the old animation clock');
app.dispose();

app = await grabActor();
app.send('pointerup', { pointerId: 1 });
for (let i = 1; i < 130; i++) app.step(100 + i * 100);
let actor = JSON.parse(app.canvas.dataset.actors)[0];
assert.equal(actor.phase, 'walk', 'Dropped actors complete release and walk away');
app.motion.matches = true; app.motion.dispatchEvent({ type: 'change' }); app.step(13200);
const pausedX = JSON.parse(app.canvas.dataset.actors)[0].x;
assert.equal(app.frames.size, 0, 'Reduced motion stops the walking RAF loop');
app.motion.matches = false; app.motion.dispatchEvent({ type: 'change' });
assert.equal(app.frames.size, 1, 'Turning motion back on must wake the paused actor');
app.step(20000); app.step(20100);
actor = JSON.parse(app.canvas.dataset.actors)[0];
assert(actor.x < pausedX, 'The actor resumes toward the same exit without a time jump');
app.dispose();
assert.equal(app.frames.size, 0);

app = await mount('MiniSiracCompanions');
app.showPortrait(); await app.loadImages(); app.step(100);
assert(app.frames.size > 0, 'The seated portrait companion animates while visible');
app.send('mini-sirac-grabbed', { detail: { id: 'portrait-companion' } }); app.step(200);
assert.equal(app.canvas.dataset.siracTargets, '[]');
assert.equal(app.frames.size, 0, 'A grabbed portrait companion must not keep rendering invisibly');
app.dispose();
console.log('Mini Siraç lifecycle: drag/replay click recovery, release walking, live reduced-motion pause/resume and grabbed companion disposal passed.');

app = await mount('MiniSiracCompanions');
app.showPortrait(); await app.images[0].onload(); app.step(100);
assert(JSON.parse(app.canvas.dataset.siracTargets).some(target => target.id === 'portrait-companion'), 'The seated character remains visible when only the running atlas fails');
app.dispose();

app = await mount('MiniSiracCompanions');
app.showContact(); await app.loadImages(); app.step(100);
assert(app.frames.size > 0);
app.button.disabled = true; app.changeButton(); app.step(200);
assert.equal(app.frames.size, 0, 'Submitting a message pauses the hidden contact character');
assert.equal(app.canvas.dataset.siracTargets, '[]');
app.button.disabled = false; app.changeButton(); app.step(300);
assert(app.frames.size > 0, 'Finishing submission wakes the character');
assert(JSON.parse(app.canvas.dataset.siracTargets).some(target => target.id === 'contact-companion'));
app.dispose();
console.log('Companion recovery: missing running atlas and contact submission pause/resume passed.');

app = await mount('MiniSiracDrag');
app.send('mini-sirac-targets', { detail: { source: 'crew', targets: [{ id: 'title:0', left: 90, right: 150, top: 100, bottom: 250, height: 140 }] } });
await app.images[0].onload();
app.send('pointermove', { clientX: 120, clientY: 140 });
assert.notEqual(app.document.body.style.cursor, 'grab', 'Do not advertise grabbing until all required clips are ready');
await app.loadImages(); app.send('pointermove', { clientX: 120, clientY: 140 });
assert.equal(app.document.body.style.cursor, 'grab');
app.dispose();
