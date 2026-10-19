import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import contacts from '../data/miniDragContacts.json';
import crewContacts from '../data/miniCrewContacts.json';

const WALK = { first: 36, step: 58, loop: 74, end: 106, width: 156, facesRight: false, stride: .35 };
const contains = (actor, x, y) => {
  if (!actor || actor.done) return false;
  const box = actor.bounds || { left: actor.x - actor.height * .32, right: actor.x + actor.height * .32, top: actor.y - actor.height * .15, bottom: actor.y + actor.height * .85 };
  return x > box.left && x < box.right && y > box.top && y < box.bottom;
};

export default function MiniSiracDrag() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const targets = new Map();
    const images = {};
    let loading = false;
    let disposed = false;
    let active = null;
    const parked = [];
    let raf = 0;
    let last = 0;
    let dpr = 1;
    let suppressClick = false;
    let clickTimer = 0;
    const originalCursor = document.body.style.cursor;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const wake = () => { if (!raf && !disposed && !document.hidden) raf = requestAnimationFrame(paint); };
    const preload = () => {
      if (loading) return;
      loading = true;
      for (const name of ['grab', 'hold', 'release', 'walk']) {
        const image = new Image();
        image.onload = () => { if (!disposed) { images[name] = image; wake(); } };
        image.src = `${import.meta.env.BASE_URL}assets/mini-sirac/${name === 'walk' ? 'push-release' : `drag-${name}`}.webp`;
      }
    };
    const receive = ({ detail }) => { targets.set(detail.source, detail.targets); if (detail.targets.length) preload(); };
    const reset = () => {
      clearTimeout(clickTimer);
      suppressClick = false;
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
      canvas.dataset.phase = 'idle';
      canvas.dataset.actors = '[]';
      active = null;
      parked.length = 0;
      targets.clear();
      document.body.style.cursor = originalCursor;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    const hit = (x, y) => [...targets.values()].flat().reverse().find((t) => x >= t.left && x <= t.right && y >= t.top && y <= t.bottom);
    const move = (event) => {
      if (active?.held && event.pointerId === active.pointer) {
        const x = Math.max(35, Math.min(innerWidth - 35, event.clientX));
        const y = Math.max(30, Math.min(innerHeight - active.height * .78, event.clientY));
        active.tilt = Math.max(-.25, Math.min(.25, (x - active.x) * -.006));
        active.x = x; active.y = y;
        event.preventDefault();
        wake();
      } else if (!active?.held) document.body.style.cursor = images.grab && (hit(event.clientX, event.clientY) || [active, ...parked].some(actor => contains(actor, event.clientX, event.clientY))) ? 'grab' : originalCursor;
    };
    const down = (event) => {
      if (event.button !== 0 || !images.grab || !images.hold || !images.release || !images.walk || active?.held) return;
      if (event.target instanceof Element && event.target.closest('.mini-crew-controls')) return;
      const target = hit(event.clientX, event.clientY);
      const own = [active, ...parked].find(actor => contains(actor, event.clientX, event.clientY));
      if (!target && !own) return;
      event.preventDefault(); event.stopImmediatePropagation();
      suppressClick = true; clearTimeout(clickTimer);
      const height = own ? own.height : Math.max(110, target.height);
      if (active && active !== own) parked.push(active);
      if (own && parked.includes(own)) parked.splice(parked.indexOf(own), 1);
      active = { x: event.clientX, y: event.clientY, height, held: true, pointer: event.pointerId, time: 0, tilt: 0, phase: 'grab' };
      document.body.style.cursor = 'grabbing';
      if (target) window.dispatchEvent(new CustomEvent('mini-sirac-grabbed', { detail: { id: target.id } }));
      last = 0;
      wake();
    };
    const release = (event) => {
      if (!active?.held || (event.pointerId !== undefined && event.pointerId !== active.pointer)) return;
      clickTimer = setTimeout(() => { suppressClick = false; }, 0);
      active.held = false; active.phase = 'release'; active.time = 0;
      document.body.style.cursor = originalCursor;
      wake();
    };
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
      for (const actor of [active, ...parked]) if (actor) { actor.x = Math.min(innerWidth - 35, actor.x); actor.y = Math.min(innerHeight - actor.height * .78, actor.y); }
      wake();
    };
    function paint(now) {
      raf = 0;
      if (document.hidden || disposed) { last = 0; return; }
      const delta = last ? Math.min(.1, (now - last) / 1000) : 0;
      last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, innerWidth, innerHeight);
      canvas.style.zIndex = document.querySelector('.mini-crew-stage') ? '99986' : '95';
      canvas.dataset.phase = active ? active.phase : 'idle';
      if (!active && !parked.length) { last = 0; return; }
      let animating = false;
      for (const actor of [...parked, active].filter(Boolean)) {
        if (!reduced.matches) actor.time += delta;
        if (actor.held && actor.phase === 'grab' && actor.time >= contacts.grab.length / 24) { actor.phase = 'hold'; actor.time = 0; }
        if (!reduced.matches && !actor.held && actor.phase === 'release' && actor.time >= contacts.release.length / 24) {
          const landing = contacts.release.at(-1);
          actor.ground = actor.y + (landing.floor - contacts.release[0].collar) * actor.height;
          actor.bodyHeight = (landing.floor - (landing.collar - .16 * landing.floor) / .84) * actor.height;
          actor.direction = actor.x < innerWidth / 2 ? -1 : 1;
          actor.phase = 'walk'; actor.time = 0;
        }
        if (actor.phase === 'walk') {
          const frame = actor.time < (WALK.loop - WALK.first) / 24 ? WALK.first + Math.floor(actor.time * 24) : WALK.loop + Math.floor((actor.time * 24 - (WALK.loop - WALK.first)) % (WALK.end - WALK.loop));
          const [, , , floor, bodyX, head] = crewContacts.pushRelease[frame];
          const size = actor.bodyHeight / (floor - head);
          const width = WALK.width / 240 * size;
          if (!reduced.matches && actor.time >= (WALK.step - WALK.first) / 24) actor.x += actor.direction * delta * size * WALK.stride * 24 / (WALK.end - WALK.loop);
          actor.y = actor.ground - actor.bodyHeight * .84;
          actor.bounds = { left: actor.x - width * .35, right: actor.x + width * .35, top: actor.ground - actor.bodyHeight, bottom: actor.ground };
          if (actor.x + width < 0 || actor.x - width > innerWidth) { actor.done = true; continue; }
          ctx.save(); ctx.translate(actor.x, actor.ground - floor * size);
          if ((actor.direction > 0) !== WALK.facesRight) ctx.scale(-1, 1);
          ctx.drawImage(images.walk, frame % 12 * WALK.width, Math.floor(frame / 12) * 240, WALK.width, 240, -bodyX * width, 0, width, size);
          ctx.restore();
          if (!reduced.matches) animating = true;
          continue;
        }
        const name = actor.phase;
        const count = contacts[name].length;
        const frame = reduced.matches ? (actor.held && name === 'hold' ? 0 : count - 1) : name === 'hold' ? Math.floor(actor.time * 24) % count : Math.min(count - 1, Math.floor(actor.time * 24));
        actor.tilt *= Math.exp(-delta * 4);
        const width = actor.height * 2 / 3;
        // Hold the collar at the pointer; release uses a fixed anchor so the landing is retained.
        const collar = contacts[name][actor.held ? frame : 0].collar;
        ctx.save(); ctx.translate(actor.x, actor.y); ctx.rotate(actor.held ? actor.tilt : 0);
        ctx.drawImage(images[name], frame % 12 * 160, Math.floor(frame / 12) * 240, 160, 240, -width / 2, -collar * actor.height, width, actor.height);
        ctx.restore();
        actor.bounds = { left: actor.x - width * .4, right: actor.x + width * .4, top: actor.y - collar * actor.height, bottom: actor.y + (contacts[name][frame].floor - collar) * actor.height };
        if (!reduced.matches && (actor.held || actor.time < count / 24)) animating = true;
      }
      for (let i = parked.length - 1; i >= 0; i--) if (parked[i].done) parked.splice(i, 1);
      if (active?.done) active = null;
      canvas.dataset.actors = JSON.stringify([...parked, active].filter(Boolean).map(({ x, y, phase, bounds }) => ({ x, y, phase, bounds })));
      if (animating) wake(); else last = 0;
    }
    const click = (event) => { if (suppressClick) { event.preventDefault(); event.stopImmediatePropagation(); } };
    const key = (event) => { if (event.key === 'Escape') release({}); };
    const motionChanged = () => { last = 0; wake(); };
    reduced.addEventListener('change', motionChanged);
    window.addEventListener('click', click, true);
    window.addEventListener('keydown', key);
    window.addEventListener('mini-sirac-targets', receive);
    window.addEventListener('mini-sirac-start', reset);
    window.addEventListener('pointerdown', down, true);
    window.addEventListener('pointermove', move, { capture: true, passive: false });
    window.addEventListener('pointerup', release, true);
    window.addEventListener('pointercancel', release, true);
    window.addEventListener('blur', release);
    window.addEventListener('resize', resize);
    const visibility = () => { if (document.hidden) release({}); last = 0; wake(); };
    document.addEventListener('visibilitychange', visibility);
    resize();
    return () => {
      disposed = true; clearTimeout(clickTimer); cancelAnimationFrame(raf);
      reduced.removeEventListener('change', motionChanged);
      window.removeEventListener('click', click, true);
      window.removeEventListener('keydown', key); document.body.style.cursor = originalCursor;
      window.removeEventListener('mini-sirac-targets', receive);
      window.removeEventListener('mini-sirac-start', reset);
      window.removeEventListener('pointerdown', down, true);
      window.removeEventListener('pointermove', move, true);
      window.removeEventListener('pointerup', release, true);
      window.removeEventListener('pointercancel', release, true);
      window.removeEventListener('blur', release);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  return createPortal(<canvas ref={ref} className="mini-sirac-companions" aria-hidden="true" />, document.body);
}
