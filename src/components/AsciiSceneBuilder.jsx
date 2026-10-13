import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Play, FastForward } from 'lucide-react';
import contacts from '../data/miniCrewContacts.json';

// Omni 1.1 Flash clips, generated in Google Flow from the live site's portrait.
// Video frames are packed into transparent atlases for consistent Safari/Chrome playback.
const CREW = {
  carryRelease: { file: 'carry-release.webp', width: 112, facesRight: false, cycle: [89, 122], walkStart: 68, stride: 0.26 },
  pushRelease: { file: 'push-release.webp', width: 156, facesRight: false, cycle: [74, 106], walkStart: 58, stride: 0.35 },
  push: { file: 'push.webp', width: 156, hand: [0.92, 0.34], facesRight: true, cycle: [82, 116], stride: 0.39 },
  carry: { file: 'carry.webp', width: 112, hand: [0.57, 0.045], facesRight: true, cycle: [59, 96], stride: 0.24 },
};
const clamp = (n) => Math.min(1, Math.max(0, n));
// Cosine ramps preserve a steady cruising speed instead of accelerating throughout.
const travelProgress = (value) => {
  const t = clamp(value);
  const ramp = 0.15;
  const accelerate = (x) => (x / 2 - ramp / (2 * Math.PI) * Math.sin(Math.PI * x / ramp)) / (1 - ramp);
  return t < ramp ? accelerate(t) : t > 1 - ramp ? 1 - accelerate(1 - t) : (t - ramp / 2) / (1 - ramp);
};
const SCHEDULE = [
  { name: 'navbar', start: 0, speed: 38, side: 'left', pose: 'carry' },
  { name: 'title', start: 0.1, speed: 52, side: 'left', pose: 'push' },
  { name: 'portrait', start: 0.15, speed: 38, side: 'right', pose: 'carry' },
  { name: 'details', start: 0.2, speed: 50, side: 'left', pose: 'push' },
  { name: 'actions', start: 0.25, speed: 38, side: 'left', pose: 'carry' },
];
const COPY = {
  tr: { loading: 'Minik Sıraçlar hazırlanıyor…', nav: 'Menü ekibi iş başında.', title: 'Başlık geliyor!', photo: 'Dikkat, fotoğraf taşınıyor.', finish: 'Son dokunuşlar…', skip: 'Geç', replay: 'Minik Sıraçları tekrar oynat' },
  en: { loading: 'Getting the tiny crew ready…', nav: 'Navigation crew, on the move.', title: 'Here comes the headline!', photo: 'Careful with the portrait.', finish: 'Finishing touches…', skip: 'Skip', replay: 'Replay the tiny Sıraç crew' },
};

// Freeze a visual copy, leaving React's actual elements and event handlers untouched.
function visualCopy(source) {
  const clone = source.cloneNode(true);
  const originals = [source, ...source.querySelectorAll('*')];
  const copies = [clone, ...clone.querySelectorAll('*')];
  originals.forEach((original, index) => {
    const style = getComputedStyle(original);
    const copy = copies[index];
    for (const prop of style) copy.style.setProperty(prop, style.getPropertyValue(prop));
    copy.removeAttribute('id');
    copy.removeAttribute('data-ascii-target');
    copy.style.animation = 'none';
    copy.style.transition = 'none';
    // Framer's entrance state must not fade the carried pieces.
    if (original.className && typeof original.className === 'string' && /hero-(meta|heading|tagline|stack|actions)/.test(original.className)) {
      copy.style.opacity = '1';
      copy.style.transform = 'none';
    }
    if (original instanceof HTMLCanvasElement) {
      copy.width = original.width;
      copy.height = original.height;
      copy.getContext('2d')?.drawImage(original, 0, 0);
    }
  });
  clone.inert = true;
  clone.setAttribute('aria-hidden', 'true');
  Object.assign(clone.style, { position: 'absolute', margin: '0', transform: 'none', opacity: '1', pointerEvents: 'none', willChange: 'transform', zIndex: '1' });
  return clone;
}

export default function AsciiSceneBuilder({ lang = 'tr' }) {
  const words = COPY[lang] || COPY.tr;
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState('loading');
  const [act, setAct] = useState('loading');
  const disposeRef = useRef(() => {});
  const finish = useCallback(() => {
    disposeRef.current();
    setPhase('done');
  }, []);

  useEffect(() => {
    let cancelled = false;
    let raf = 0;
    let layer;
    let inputsUnlocked = false;
    const root = document.getElementById('root');
    const wasInert = root?.inert;
    const previousFocus = document.activeElement;
    const timers = new Set();
    const images = {};
    const grabbedActors = new Set();
    let hitTargets = [];
    const grabbed = ({ detail }) => { grabbedActors.add(detail.id); };
    window.addEventListener('mini-sirac-grabbed', grabbed);
    const pauseScroll = (event) => event.preventDefault();
    const onKey = (event) => {
      if (event.key === 'Escape') finish();
      else if (!inputsUnlocked && ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(event.key)) event.preventDefault();
    };
    const dispose = () => {
      cancelled = true;
      window.removeEventListener('mini-sirac-grabbed', grabbed);
      window.dispatchEvent(new CustomEvent('mini-sirac-targets', { detail: { source: 'crew', targets: [] } }));
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      layer?.remove();
      Object.keys(images).forEach((name) => { delete images[name]; });
      if (root) root.inert = wasInert;
      if (previousFocus instanceof HTMLElement && previousFocus !== document.body && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
      window.removeEventListener('wheel', pauseScroll, true);
      window.removeEventListener('touchmove', pauseScroll, true);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', finish);
      window.removeEventListener('pagehide', finish);
      window.removeEventListener('scroll', finish);
      document.documentElement.classList.remove('mini-crew-playing');
      window.dispatchEvent(new Event('mini-sirac-ready'));
    };
    disposeRef.current = dispose;
    const timeout = (ms) => new Promise((resolve) => {
      const id = setTimeout(() => { timers.delete(id); resolve(); }, ms);
      timers.add(id);
    });
    const load = (name, cfg) => new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => { if (!cancelled) images[name] = image; resolve(); };
      image.onerror = reject;
      image.src = `${import.meta.env.BASE_URL}assets/mini-sirac/${cfg.file}`;
    });
    const start = async () => {
      window.dispatchEvent(new Event('mini-sirac-start'));
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || (run === 0 && (window.scrollY > 80 || (location.hash && !['#home', '#hero'].includes(location.hash))))) {
        if (!cancelled) finish();
        return;
      }
      // Keep the real page usable while assets load; slow networks skip the intro.
      window.addEventListener('keydown', onKey);
      window.addEventListener('resize', finish);
      window.addEventListener('pagehide', finish);
      window.addEventListener('scroll', finish, { passive: true, once: true });
      inputsUnlocked = true;
      try {
        await Promise.race([
          Promise.all([
            ...Object.entries(CREW).map(([name, cfg]) => load(name, cfg)),
          ]),
          timeout(1200).then(() => { throw new Error('Crew preload timeout'); }),
        ]);
        await Promise.race([document.fonts.ready, timeout(150)]);
        const portrait = document.querySelector('[data-ascii-target="portrait"] img');
        if (portrait) await Promise.race([portrait.decode().catch(() => {}), timeout(150)]);
        // Measure after the next layout turn, without an artificial opening delay.
        await timeout(20);
        if (cancelled) return;
        if (window.scrollY > 80) { finish(); return; }
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const mobile = vw <= 768;
        const charH = mobile ? 88 : Math.min(146, vh * 0.18);
        layer = document.createElement('div');
        layer.className = 'mini-crew-stage';
        layer.setAttribute('aria-hidden', 'true');
        const blocks = SCHEDULE.flatMap((entry) => {
          const source = [...document.querySelectorAll(`[data-ascii-target="${entry.name}"]`)].find((element) => element.getBoundingClientRect().width > 0);
          if (!source) return [];
          const rect = source.getBoundingClientRect();
          // On small screens, do not bring off-screen content into the viewport.
          if (rect.top >= vh - 30 || rect.bottom <= 0) return [];
          if (entry.name === 'mario' && rect.top + 180 > vh) return [];
          const clone = visualCopy(source);
          Object.assign(clone.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
          layer.append(clone);
          // A short entrance keeps the crew immediately visible and avoids a blank page.
          const revealOnly = mobile && entry.name !== 'portrait';
          const entranceDistance = Math.min(90, charH * 0.55);
          const dx = revealOnly ? 0 : entry.side === 'left' ? -entranceDistance : entry.side === 'right' ? entranceDistance : 0;
          const dy = entry.side === 'bottom' ? vh - rect.top + charH : 0;
          clone.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
          const pose = mobile && entry.name === 'portrait' ? 'push' : entry.name === 'portrait' && rect.bottom + charH > vh ? 'push' : entry.pose;
          const height = entry.name === 'navbar' ? charH * 0.85 : charH;
          const distance = Math.hypot(dx, dy);
          const speed = Math.min(entry.speed, height * CREW[pose].stride * 0.9);
          const duration = revealOnly ? 0.55 : Math.max(3.5, distance / (speed * 0.85));
          const cycles = Math.max(1, Math.round(distance / (height * CREW[pose].stride)));
          const start = mobile ? ({ navbar: 0, title: 0.05, portrait: 0.15, details: 0.1, actions: 0.15 }[entry.name]) : entry.start;
          if (revealOnly) clone.style.opacity = '0';
          return [{ ...entry, start, revealOnly, pose, height, cycles, duration, rect, clone, dx, dy }];
        });
        const canvas = document.createElement('canvas');
        canvas.className = 'mini-crew-canvas';
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = vw * dpr;
        canvas.height = vh * dpr;
        layer.append(canvas);
        document.body.append(layer);
        inputsUnlocked = false;
        window.removeEventListener('scroll', finish);
        if (root) root.inert = true;
        document.querySelector('.mini-crew-controls button')?.focus({ preventScroll: true });
        document.documentElement.classList.add('mini-crew-playing');
        window.addEventListener('wheel', pauseScroll, { passive: false, capture: true });
        window.addEventListener('touchmove', pauseScroll, { passive: false, capture: true });
        window.addEventListener('keydown', onKey);
        window.addEventListener('resize', finish);
        window.addEventListener('pagehide', finish);
        setPhase('building');
        const ctx = canvas.getContext('2d');
        const frameAt = (pose, progress, cycles) => {
          const [first, last] = CREW[pose].cycle;
          return first + Math.floor((progress * cycles % 1) * (last - first));
        };
        const draw = (pose, handX, restingHandY, height, facingRight, frame, alpha, id) => {
          const cfg = CREW[pose];
          const width = cfg.width / 240 * height;
          const flip = facingRight !== cfg.facesRight;
          const [hx, hy, fx, floor] = contacts[pose][frame];
          const neutral = contacts[pose][cfg.cycle[0]];
          // The floor plane is constant. Per-frame shoe tracking removes vertical float.
          const ground = restingHandY + (neutral[3] - neutral[1]) * height;
          const x = handX - (flip ? 1 - hx : hx) * width;
          const y = ground - floor * height;
          const shoeX = x + (flip ? 1 - fx : fx) * width;
          if (x + width > 0 && x < vw) visibleWorkers += 1;
          hitTargets.push({ id, left: x + width * .15, right: x + width * .85, top: y, bottom: ground, height });
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = 'rgba(20,20,24,0.19)';
          ctx.beginPath();
          ctx.ellipse(shoeX, ground + 1, height * 0.105, 2.2, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.translate(flip ? x + width : x, y);
          if (flip) ctx.scale(-1, 1);
          ctx.drawImage(images[pose], frame % 12 * cfg.width, Math.floor(frame / 12) * 240, cfg.width, 240, 0, 0, width, height);
          ctx.restore();
          return hy;
        };
        let t0;
        let lastAct;
        let unlocked = false;
        let visibleWorkers = 0;
        const placementEnd = Math.max(...blocks.map((block) => block.start + block.duration));
        const exitSpeed = charH * 0.85 * CREW.carryRelease.stride * 0.9;
        const total = Math.max(...blocks.map((block) => block.start + block.duration)) + 4.2 + (vw + charH) / exitSpeed;
        const tick = (now) => {
          if (cancelled) return;
          t0 ??= now;
          const elapsed = (now - t0) / 1000;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.clearRect(0, 0, vw, vh);
          visibleWorkers = 0;
          hitTargets = [];
          if (!unlocked && elapsed >= placementEnd) {
            unlocked = true;
            inputsUnlocked = true;
            blocks.forEach((block) => block.clone.remove());
            layer.style.background = 'transparent';
            layer.style.pointerEvents = 'none';
            if (root) root.inert = wasInert;
            window.removeEventListener('wheel', pauseScroll, true);
            window.removeEventListener('touchmove', pauseScroll, true);
            window.addEventListener('scroll', finish, { passive: true, once: true });
            setPhase('leaving');
          }
          const nextAct = unlocked ? 'finish' : elapsed < 1.2 ? 'nav' : elapsed < 2.8 ? 'title' : elapsed < total - 3 ? 'photo' : 'finish';
          if (nextAct !== lastAct) { lastAct = nextAct; setAct(nextAct); }
          blocks.forEach((block) => {
            const { rect, clone, pose, side, start, duration, height, cycles, revealOnly } = block;
            const progress = clamp((elapsed - start) / duration);
            const movement = travelProgress(progress);
            const travel = 1 - movement;
            // Keep gait cadence independent from the eased panel motion.
            // Easing near placement must not slow the video down to a held frame.
            const frame = frameAt(pose, progress, cycles);
            if (block.name === 'navbar') canvas.dataset.navbarMotion = JSON.stringify({ progress, frame, phase: 'carry' });
            const neutral = contacts[pose][CREW[pose].cycle[0]];
            const contact = contacts[pose][frame];
            const lift = pose === 'carry' ? height * ((contact[1] - contact[3]) - (neutral[1] - neutral[3])) : 0;
            const tx = block.dx * travel;
            const ty = block.dy * travel + lift;
            clone.style.visibility = elapsed < start ? 'hidden' : 'visible';
            clone.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
            if (block.name === 'portrait') {
              window.dispatchEvent(new CustomEvent('mini-sirac-portrait-pose', { detail: {
                left: rect.left + tx, top: rect.top + ty, width: rect.width, right: rect.right + tx,
                visible: elapsed >= start, settled: progress === 1,
              } }));
            }
            if (revealOnly) {
              clone.style.opacity = String(movement);
              clone.style.transform = `translate3d(0, ${(1 - movement) * 12}px, 0)`;
              return;
            }
            if (elapsed < start) return;
            const leaving = Math.max(0, elapsed - start - duration);
            const worker = (workerPose, handX, handY, size, facing, workerFrame, workerIndex = 0) => {
              const id = `${block.name}:${workerIndex}`;
              if (grabbedActors.has(id)) return;
              if (!leaving) { draw(workerPose, handX, handY, size, facing, workerFrame, 1, id); return; }
              const cfg = CREW[workerPose];
              const held = contacts[workerPose][cfg.cycle[0]];
              const width = cfg.width / 240 * size;
              const flip = facing !== cfg.facesRight;
              const body = held[4];
              const center = handX + ((flip ? 1 - body : body) - (flip ? 1 - held[0] : held[0])) * width;
              const ground = handY + (held[3] - held[1]) * size;
              const direction = side === 'right' ? 1 : -1;
              const releasePose = workerPose === 'carry' ? 'carryRelease' : 'pushRelease';
              const release = CREW[releasePose];
              const releaseFlip = (direction > 0) !== release.facesRight;
              const loopStart = release.cycle[0] / 24;
              const walkingStart = release.walkStart / 24;
              const period = release.cycle[1] - release.cycle[0];
              const speed = size * release.stride * 24 / period;
              // Walking begins before the repeatable cycle; the body moves from that first step.
              const distance = Math.max(0, leaving - walkingStart) * speed;
              const cx = center + direction * distance;
              const releaseFrame = leaving < loopStart ? Math.floor(leaving * 24) : release.cycle[0] + Math.floor((leaving - loopStart) * 24 % period);
              if (block.name === 'navbar') canvas.dataset.navbarMotion = JSON.stringify({ progress, frame: releaseFrame, phase: 'release' });
              const [, , shoe, floor, bodyX, head] = contacts[releasePose][releaseFrame];
              const releaseSize = size * (held[3] - held[5]) / (floor - head);
              const releaseWidth = release.width / 240 * releaseSize;
              if (cx + releaseWidth < 0 || cx - releaseWidth > vw) return;
              visibleWorkers += 1;
              hitTargets.push({ id, left: cx - releaseWidth * .35, right: cx + releaseWidth * .35, top: ground - releaseSize, bottom: ground, height: releaseSize });
              ctx.save();
              ctx.fillStyle = 'rgba(20,20,24,0.19)';
              ctx.beginPath(); ctx.ellipse(cx + (releaseFlip ? bodyX - shoe : shoe - bodyX) * releaseWidth, ground + 1, size * 0.105, 2.2, 0, 0, Math.PI * 2); ctx.fill();
              ctx.translate(cx, ground - floor * releaseSize);
              if (releaseFlip) ctx.scale(-1, 1);
              ctx.drawImage(images[releasePose], releaseFrame % 12 * release.width, Math.floor(releaseFrame / 12) * 240, release.width, 240, -bodyX * releaseWidth, 0, releaseWidth, releaseSize);
              ctx.restore();
            };
            const left = rect.left + tx;
            const facingRight = side !== 'right';
            if (pose === 'carry') {
              // Both people face the travel direction and share one stable floor plane.
              const restingBottom = rect.bottom + block.dy * travel;
              const team = ['navbar', 'portrait'].includes(block.name) && rect.width > height * 2.4 ? [0.25, 0.75] : [0.5];
              team.forEach((offset, index) => worker('carry', left + rect.width * offset, restingBottom, height, facingRight, frame, index));
            } else if (pose === 'push') {
              worker('push', side === 'right' ? left + rect.width : left, rect.top + Math.min(rect.height * 0.55, 65), height, facingRight, frame);

            }
          });
          canvas.dataset.siracTargets = JSON.stringify(hitTargets);
          window.dispatchEvent(new CustomEvent('mini-sirac-targets', { detail: { source: 'crew', targets: hitTargets } }));
          // The stage is removed only after the last worker has walked beyond its edge.
          if (elapsed < total && !(elapsed > placementEnd + 4 && visibleWorkers === 0)) raf = requestAnimationFrame(tick);
          else finish();
        };
        raf = requestAnimationFrame(tick);
      } catch {
        if (!cancelled) finish();
      }
    };
    start();
    return dispose;
  }, [run, finish]);

  if (typeof document === 'undefined') return null;
  return createPortal(
    phase === 'done' ? (
      <button type="button" className="mini-crew-replay" aria-label={words.replay} onClick={() => { setPhase('loading'); setAct('loading'); window.scrollTo({ top: 0, behavior: 'instant' }); setRun((n) => n + 1); }}>
        <Play size={13} /><span>{words.replay}</span>
      </button>
    ) : phase === 'loading' ? (
      <div className="mini-crew-controls">
        <span role="status"><span className="mini-crew-dot" />{words.loading}</span>
        <button type="button" onClick={finish}><FastForward size={14} /> {words.skip}<kbd>Esc</kbd></button>
      </div>
    ) : (
      <div className="mini-crew-controls" style={{ visibility: act === 'loading' ? 'hidden' : 'visible' }}>
        <span role="status"><span className="mini-crew-dot" />{words[act]}</span>
        <button type="button" onClick={finish}><FastForward size={14} /> {words.skip}<kbd>Esc</kbd></button>
      </div>
    ), document.body,
  );
}
