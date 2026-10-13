import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import runFloor from '../data/miniCompanionRunFloor.json';

const PLATES = {
  sit: { file: 'sit-phone-hd.webp', width: 268, height: 320 },
  run: { file: 'stand-run-hd.webp', width: 268, height: 320 },
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
    const requested = new Set();
    let disposed = false;
    let raf = 0;
    let lastTime = 0;
    let introPose = null;
    let seatedTime = 0;
    let heroVisible = false;
    let contactVisible = false;
    let heroReady = false;
    let heroDone = false;
    let heroTime = 0;
    let contactTime = 0;
    let dpr = 1;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const draw = (name, frame, x, y, height) => {
      if (!images[name]) return;
      const cfg = PLATES[name];
      const width = cfg.width / cfg.height * height;
      ctx.drawImage(images[name], frame % 16 * cfg.width, Math.floor(frame / 16) * cfg.height, cfg.width, cfg.height, x, y, width, height);
    };
    const wake = () => {
      if (!raf && !disposed && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const load = (name) => {
      if (requested.has(name)) return;
      requested.add(name);
      const img = new Image();
      img.onload = () => { if (!disposed) { images[name] = img; wake(); } };
      img.src = `${import.meta.env.BASE_URL}assets/mini-sirac/${PLATES[name].file}`;
    };
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      wake();
    };
    const ready = () => {
      introPose = null;
      if (!heroReady) { heroReady = true; heroTime = 0; }
      wake();
    };
    const reset = () => {
      introPose = null;
      seatedTime = 0;
      heroReady = false;
      heroDone = false;
      heroTime = 0;
      wake();
    };
    const followPortrait = ({ detail }) => {
      introPose = detail;
      if (detail.visible) { load('sit'); load('run'); }
      if (detail.settled && !heroReady) {
        heroReady = true;
        heroTime = Math.min(7.5, seatedTime);
      }
      wake();
    };
    const checkStage = () => {
      if (!document.querySelector('.mini-crew-stage, .mini-crew-curtain')) ready();
    };
    const visibility = () => { lastTime = 0; wake(); };
    function tick(now) {
      raf = 0;
      if (disposed || document.hidden) { lastTime = 0; return; }
      const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.12) : 0;
      lastTime = now;
      const onPortrait = introPose ? introPose.visible && introPose.left + introPose.width * 0.68 < innerWidth + 40 : heroVisible;
      if (onPortrait && images.sit && images.run && !motion.matches) {
        if (heroReady) heroTime += delta;
        else seatedTime += delta;
      }
      if (contactVisible && images.point && !motion.matches) contactTime += delta;
      {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        canvas.style.zIndex = document.querySelector('.mini-crew-stage') ? '99985' : '90';
        if (onPortrait && (heroReady || introPose) && images.sit && images.run && !heroDone) {
          const rect = introPose || portrait.getBoundingClientRect();
          const height = innerWidth <= 768 ? 96 : 150;
          const width = 134 / 160 * height;
          const seatX = rect.left + rect.width * 0.68;
          const x = seatX - width * 0.25;
          const y = rect.top - height * (448 / 720);
          if (motion.matches || !heroReady || heroTime < 8) {
            draw('sit', motion.matches ? 40 : Math.min(120, Math.floor((heroReady ? heroTime : seatedTime) * 16)), x, y, height);
          } else {
            const running = heroTime - 8;
            const frame = running < 8 ? Math.min(127, Math.floor(running * 16)) : 92 + Math.floor((running - 8) * 16 % 28);
            // Frame 67 is the first running stride: move immediately, never jog on the spot.
            const distance = Math.max(0, running - 67 / 16) * height * 0.62;
            const rise = Math.min(1, Math.max(0, (running - 2) / 2)) * height * 0.35;
            // Once standing, keep every stride on the portrait's top plane.
            // Per-frame shoe tracking cancels the generated clip's vertical drift.
            const runY = running >= 67 / 16 ? rect.top - runFloor[frame] * height : y - rise;
            if (x + distance > innerWidth + width) heroDone = true;
            else draw('run', frame, x + distance, runY, height);
          }
        }
        if (contactVisible && images.point && !button.disabled && !document.querySelector('.mini-crew-curtain')) {
          const rect = button.getBoundingClientRect();
          const height = innerWidth <= 768 ? 74 : 88;
          const frame = motion.matches ? 110 : contactTime < 6 ? Math.min(95, Math.floor(contactTime * 16)) : 96 + Math.floor((contactTime - 6) * 16 % 24);
          // Place the right-pointing actor at the left corner, aimed at the button label.
          ctx.save();
          ctx.beginPath();
          ctx.rect(rect.left - 2, rect.top - 64, rect.width + 4, rect.height + 64);
          ctx.clip();
          draw('point', frame, rect.left - 4, rect.top + rect.height * 0.5 - height * 0.82, height);
          ctx.restore();
        }
      }
      if (!motion.matches && ((onPortrait && (heroReady || introPose) && images.sit && images.run && !heroDone) || (contactVisible && images.point))) wake();
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
      lastTime = 0;
      wake();
    });
    observer.observe(portrait);
    observer.observe(button);
    const mutations = new MutationObserver(checkStage);
    mutations.observe(document.body, { childList: true });
    window.addEventListener('mini-sirac-start', reset);
    window.addEventListener('mini-sirac-ready', ready);
    window.addEventListener('mini-sirac-portrait-pose', followPortrait);
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', visibility);
    motion.addEventListener('change', wake);
    resize();
    checkStage();
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      mutations.disconnect();
      window.removeEventListener('mini-sirac-start', reset);
      window.removeEventListener('mini-sirac-ready', ready);
      window.removeEventListener('mini-sirac-portrait-pose', followPortrait);
      window.removeEventListener('scroll', wake);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibility);
      motion.removeEventListener('change', wake);
    };
  }, []);
  return createPortal(<canvas ref={canvasRef} className="mini-sirac-companions" aria-hidden="true" />, document.body);
}
