import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { createAtlasLoader } from '../utils/atlasLoader';
import runFloor from '../data/miniCompanionRunFloor.json';
import { seatedFrameAt, departureTimeFor } from '../utils/miniSiracTiming';

const PLATES = {
  sit: { file: 'sit-phone-hd.webp', width: 201, height: 240 },
  run: { file: 'stand-run-hd.webp', width: 201, height: 240 },
  point: { file: 'wave-point.webp', width: 160, height: 160 },
};

// Real Flow footage; the invisible ledge is anchored to the portrait's top edge.
export default function MiniSiracCompanions() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const portrait = document.querySelector('[data-ascii-target="portrait"]');
    const button = document.querySelector('[data-sirac-submit]');
    if (!portrait || !button || !ctx) return;
    const images = {};
    const removed = new Set();
    let hitTargets = [];
    const grabbed = ({ detail }) => { removed.add(detail.id); rectDirty = true; wake(); };
    let disposed = false;
    let raf = 0;
    let lastTime = 0;
    let introPose = null;
    let seatedTime = 0;
    let heroVisible = false;
    let contactVisible = false;
    let heroReady = false;
    let heroDone = false;
    let departureTime = Infinity;
    let contactTime = 0;
    let dpr = 1;
    let lastDrawKey = '';
    let lastTargetsKey = '';
    let dirtyBoxes = [];
    let fullClearNeeded = true;
    let stageOpen = false;
    let curtainOpen = false;
    let rectDirty = true;
    let portraitRect = null;
    let buttonRect = null;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const clearPrevious = () => {
      if (fullClearNeeded) {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        fullClearNeeded = false;
        dirtyBoxes = [];
        return;
      }
      for (const box of dirtyBoxes) ctx.clearRect(box.x, box.y, box.w, box.h);
      dirtyBoxes = [];
    };
    const draw = (name, frame, x, y, height) => {
      if (!images[name]) return;
      const id = name === 'point' ? 'contact-companion' : 'portrait-companion';
      if (removed.has(id)) return;
      if (id === 'portrait-companion') { canvas.dataset.portraitPlate = name; canvas.dataset.portraitFrame = String(frame); }
      const cfg = PLATES[name];
      const width = cfg.width / cfg.height * height;
      dirtyBoxes.push({ x: Math.floor(x) - 2, y: Math.floor(y) - 2, w: Math.ceil(width) + 4, h: Math.ceil(height) + 4 });
      ctx.drawImage(images[name], frame % 16 * cfg.width, Math.floor(frame / 16) * cfg.height, cfg.width, cfg.height, x, y, width, height);
    };
    const computePortraitTarget = (name, x, y, height) => {
      const cfg = PLATES[name];
      const width = cfg.width / cfg.height * height;
      return { id: 'portrait-companion', left: x + width * .2, right: x + width * .8, top: y + height * .06, bottom: y + height * .98, height };
    };
    const computeContactTarget = (x, y, height) => {
      const width = height;
      return { id: 'contact-companion', left: x + width * .2, right: x + width * .8, top: y + height * .06, bottom: y + height * .98, height };
    };
    const wake = () => {
      if (!raf && !disposed && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const loader = createAtlasLoader({
      files: Object.fromEntries(Object.entries(PLATES).map(([name, plate]) => [name, plate.file])),
      baseURL: import.meta.env.BASE_URL,
      onLoad: (name, image) => {
        images[name] = image;
        if (name === 'run' && heroReady) departureTime = departureTimeFor(seatedTime);
        lastDrawKey = '';
        wake();
      },
    });
    const load = name => loader.load(name);
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      rectDirty = true;
      fullClearNeeded = true;
      lastDrawKey = '';
      wake();
    };
    const ready = () => {
      introPose = null;
      rectDirty = true;
      if (!heroReady) { heroReady = true; departureTime = departureTimeFor(seatedTime); }
      lastDrawKey = '';
      wake();
    };
    const reset = () => {
      loader.retryFailed();
      removed.clear();
      introPose = null;
      seatedTime = 0;
      heroReady = false;
      heroDone = false;
      departureTime = Infinity;
      rectDirty = true;
      fullClearNeeded = true;
      lastDrawKey = '';
      wake();
    };
    const followPortrait = ({ detail }) => {
      introPose = detail;
      if (detail.visible) { load('sit'); load('run'); }
      if (detail.settled && !heroReady) {
        heroReady = true;
        departureTime = departureTimeFor(seatedTime);
      }
      wake();
    };
    const checkStage = () => {
      stageOpen = Boolean(document.querySelector('.mini-crew-stage'));
      curtainOpen = Boolean(document.querySelector('.mini-crew-curtain'));
      canvas.style.zIndex = stageOpen ? '99985' : '90';
      if (!stageOpen && !curtainOpen) ready();
    };
    const onScroll = () => { rectDirty = true; wake(); };
    const visibility = () => { lastTime = 0; rectDirty = true; wake(); };
    function tick(now) {
      raf = 0;
      if (disposed || document.hidden) { lastTime = 0; return; }
      const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.12) : 0;
      lastTime = now;
      const onPortrait = !removed.has('portrait-companion') && (introPose ? introPose.visible && introPose.left + introPose.width * 0.68 < innerWidth + 40 : heroVisible);
      if (onPortrait && images.sit && !motion.matches) seatedTime += delta;
      if (contactVisible && images.point && !motion.matches) contactTime += delta;

      if (rectDirty) {
        portraitRect = onPortrait ? portrait.getBoundingClientRect() : null;
        buttonRect = contactVisible ? button.getBoundingClientRect() : null;
        rectDirty = false;
      }

      let pDraw = null;
      if (onPortrait && (heroReady || introPose) && images.sit && !heroDone) {
        const rect = introPose || portraitRect || portrait.getBoundingClientRect();
        const height = innerWidth <= 768 ? 72 : 148;
        const width = 134 / 160 * height;
        const seatX = rect.left + rect.width * 0.68;
        const x = seatX - width * 0.25;
        const y = rect.top - height * (448 / 720);
        if (motion.matches || !heroReady || !images.run || seatedTime < departureTime) {
          pDraw = { name: 'sit', frame: motion.matches ? 40 : seatedFrameAt(seatedTime), x, y, height };
        } else {
          const running = seatedTime - departureTime;
          const frame = running < 8 ? Math.min(127, Math.floor(running * 16)) : 92 + Math.floor((running - 8) * 16 % 28);
          const distance = Math.max(0, running - 67 / 16) * height * 0.62;
          const rise = Math.min(1, Math.max(0, (running - 2) / 2)) * height * 0.35;
          const runY = running >= 67 / 16 ? rect.top - runFloor[frame] * height : y - rise;
          if (x + distance > innerWidth + width) heroDone = true;
          else pDraw = { name: 'run', frame, x: x + distance, y: runY, height };
        }
      }

      let cDraw = null;
      if (contactVisible && images.point && !button.disabled && !curtainOpen && !removed.has('contact-companion')) {
        const rect = buttonRect || button.getBoundingClientRect();
        const height = innerWidth <= 768 ? 60 : 86;
        const frame = motion.matches ? 110 : contactTime < 6 ? Math.min(95, Math.floor(contactTime * 16)) : 96 + Math.floor((contactTime - 6) * 16 % 24);
        cDraw = { frame, rect, x: rect.left - 4, y: rect.top + rect.height * 0.5 - height * 0.82, height };
      }

      const nextTargets = [];
      if (pDraw) nextTargets.push(computePortraitTarget(pDraw.name, pDraw.x, pDraw.y, pDraw.height));
      if (cDraw) nextTargets.push(computeContactTarget(cDraw.x, cDraw.y, cDraw.height));
      const drawKey = `${stageOpen ? 1 : 0}|${pDraw ? `${pDraw.name}:${pDraw.frame}:${Math.round(pDraw.x)}:${Math.round(pDraw.y)}:${pDraw.height}` : ''}|${cDraw ? `${cDraw.frame}:${Math.round(cDraw.x)}:${Math.round(cDraw.y)}:${cDraw.height}` : ''}`;

      if (drawKey !== lastDrawKey || fullClearNeeded) {
        lastDrawKey = drawKey;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        clearPrevious();
        if (pDraw) draw(pDraw.name, pDraw.frame, pDraw.x, pDraw.y, pDraw.height);
        if (cDraw) {
          const { rect } = cDraw;
          dirtyBoxes.push({ x: Math.floor(rect.left) - 4, y: Math.floor(rect.top) - 66, w: Math.ceil(rect.width) + 8, h: Math.ceil(rect.height) + 68 });
          ctx.save();
          ctx.beginPath();
          ctx.rect(rect.left - 2, rect.top - 64, rect.width + 4, rect.height + 64);
          ctx.clip();
          draw('point', cDraw.frame, cDraw.x, cDraw.y, cDraw.height);
          ctx.restore();
        }
      }

      hitTargets = nextTargets;
      const targetsKey = nextTargets.map(t => `${t.id}:${Math.round(t.left)},${Math.round(t.top)}`).join('|');
      if (targetsKey !== lastTargetsKey || !canvas.dataset.siracTargets) {
        lastTargetsKey = targetsKey;
        canvas.dataset.siracTargets = JSON.stringify(hitTargets);
        window.dispatchEvent(new CustomEvent('mini-sirac-targets', { detail: { source: 'companions', targets: hitTargets } }));
      }

      if (!motion.matches && ((onPortrait && (heroReady || introPose) && images.sit && !heroDone) || (contactVisible && images.point && !button.disabled && !removed.has('contact-companion')))) wake();
      else lastTime = 0;
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === portrait) {
          heroVisible = entry.isIntersecting;
          if (heroVisible) { load('sit'); load('run'); }
        } else {
          const wasVisible = contactVisible;
          contactVisible = entry.isIntersecting;
          if (contactVisible) { load('point'); if (!wasVisible) contactTime = 0; }
        }
      }
      rectDirty = true;
      lastTime = 0;
      wake();
    });
    observer.observe(portrait);
    observer.observe(button);
    const mutations = new MutationObserver(() => { rectDirty = true; checkStage(); wake(); });
    mutations.observe(document.body, { childList: true });
    mutations.observe(button, { attributes: true, attributeFilter: ['disabled'] });
    window.addEventListener('mini-sirac-grabbed', grabbed);
    window.addEventListener('mini-sirac-start', reset);
    window.addEventListener('mini-sirac-ready', ready);
    window.addEventListener('mini-sirac-portrait-pose', followPortrait);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', visibility);
    motion.addEventListener('change', wake);
    resize();
    checkStage();
    return () => {
      disposed = true;
      loader.dispose();
      cancelAnimationFrame(raf);
      observer.disconnect();
      mutations.disconnect();
      window.dispatchEvent(new CustomEvent('mini-sirac-targets', { detail: { source: 'companions', targets: [] } }));
      window.removeEventListener('mini-sirac-grabbed', grabbed);
      window.removeEventListener('mini-sirac-start', reset);
      window.removeEventListener('mini-sirac-ready', ready);
      window.removeEventListener('mini-sirac-portrait-pose', followPortrait);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibility);
      motion.removeEventListener('change', wake);
    };
  }, []);
  return createPortal(<canvas ref={canvasRef} className="mini-sirac-companions" aria-hidden="true" />, document.body);
}
