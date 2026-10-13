import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { RotateCcw, Sparkles, Image as ImageIcon, Terminal, FastForward } from 'lucide-react';
import {
  ASCII_COLS,
  ASCII_ROWS,
  ASCII_CHARS,
  ASCII_LUM,
  ASCII_TINT,
} from '../data/siracAsciiPortrait';

// Pre-parse the 112x86 ASCII portrait into a flat structure for 60fps zero-GC rendering
const PARSED_CELLS = [];
for (let r = 0; r < ASCII_ROWS; r++) {
  const cRow = ASCII_CHARS[r] || '';
  const lRow = ASCII_LUM[r] || '';
  const tRow = ASCII_TINT[r] || '';
  for (let c = 0; c < ASCII_COLS; c++) {
    const ch = cRow[c] || ' ';
    const lumCode = lRow[c] || '0';
    if (ch === ' ' || lumCode === '0') continue;
    const lum = parseInt(lumCode, 36) / 35; // 0..1
    const tint = parseInt(tRow[c] || '2', 10);
    // Spawn offset for vortex materialization
    const angle =
      Math.atan2(r - ASCII_ROWS * 0.45, c - ASCII_COLS * 0.5) +
      ((r * 17 + c * 31) % 100) * 0.04;
    const dist = 160 + ((r * 53 + c * 97) % 280);
    PARSED_CELLS.push({
      c,
      r,
      ch,
      lum,
      tint,
      spawnDx: Math.cos(angle) * dist,
      spawnDy: Math.sin(angle) * dist - 40,
      phaseOffset: ((r * 13 + c * 29) % 100) / 100,
      isEyeRow: r >= 23 && r <= 26 && ((c >= 40 && c <= 51) || (c >= 58 && c <= 69)),
      isHead: r < 47,
    });
  }
}

// Target UI modules that ASCII Sıraç grabs, pulls, and locks into place during the intro
const GRAB_TARGETS = [
  {
    id: 'navbar',
    selector: '[data-ascii-target="navbar"]',
    label: 'SlideNavbar.jsx',
    cmd: 'pull("--top-dock")',
    hand: 'right',
    startX: 0,
    startY: -105,
    startRot: -2.0,
    startScale: 0.92,
    tStart: 0.7,
    tEnd: 1.36,
    leanX: 8,
    leanY: -12,
  },
  {
    id: 'title',
    selector: '[data-ascii-target="title"]',
    label: 'HeroHeading.h1',
    cmd: 'grab("#hero-title")',
    hand: 'left',
    startX: -270,
    startY: -36,
    startRot: -4.2,
    startScale: 0.9,
    tStart: 1.18,
    tEnd: 1.92,
    leanX: 22,
    leanY: -4,
  },
  {
    id: 'details',
    selector: '[data-ascii-target="details"]',
    label: 'TechStack.pills[]',
    cmd: 'align("Unity/C#/TS")',
    hand: 'left',
    startX: -230,
    startY: 52,
    startRot: 3.0,
    startScale: 0.92,
    tStart: 1.74,
    tEnd: 2.42,
    leanX: 18,
    leanY: 6,
  },
  {
    id: 'actions',
    selector: '[data-ascii-target="actions"]',
    label: 'ActionButtons.ui',
    cmd: 'mount("--cta-row")',
    hand: 'left',
    startX: -160,
    startY: 110,
    startRot: -2.6,
    startScale: 0.9,
    tStart: 2.24,
    tEnd: 2.88,
    leanX: 14,
    leanY: 12,
  },
  {
    id: 'mario',
    selector: '[data-ascii-target="mario"]',
    label: 'PixelMario.rom',
    cmd: 'boot("LCD_1BIT")',
    hand: 'right',
    startX: 165,
    startY: 120,
    startRot: 2.4,
    startScale: 0.94,
    tStart: 2.68,
    tEnd: 3.34,
    leanX: -14,
    leanY: 14,
  },
];

const TOTAL_STAGE_DURATION = 4.25; // seconds
const DOCK_START_TIME = 3.36;

function easeOutBack(x) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

// Subtle WebAudio synthesizer for mechanical ASCII grapple/lock feedback (plays on interactive replay)
function playCyberTick(freq = 440, dur = 0.045, type = 'square', vol = 0.025) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!window.__asciiAudioCtx) {
      window.__asciiAudioCtx = new AudioCtx();
    }
    const ctx = window.__asciiAudioCtx;
    if (ctx.state === 'suspended') return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0008, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  } catch {
    // Ignore audio errors
  }
}

export default function AsciiHeroArchitect({
  photoUrl = 'https://files.catbox.moe/y8qlp8.jpg',
  name = 'Sıraç Göktuğ Şimşek',
  role = 'Game Developer & Software Engineer',
  lang = 'tr',
}) {
  // 'ascii' | 'hybrid' | 'photo'
  const [viewMode, setViewMode] = useState('ascii');
  const [stageActive, setStageActive] = useState(false);
  const [stageStepText, setStageStepText] = useState('');

  const cardRef = useRef(null);
  const cardCanvasRef = useRef(null);
  const stageCanvasRef = useRef(null);
  const photoImgRef = useRef(null);
  const mouseRef = useRef({ x: -999, y: -999, active: false });
  const stageStartRef = useRef(0);
  const soundEnabledRef = useRef(false);

  // Clean up any inline styles applied to DOM targets when choreography ends
  const resetDomTargets = useCallback(() => {
    GRAB_TARGETS.forEach((t) => {
      const el = document.querySelector(t.selector);
      if (el) {
        el.style.transform = '';
        el.style.opacity = '';
        el.style.transition = '';
        el.style.willChange = '';
        el.removeAttribute('data-ascii-grabbing');
        el.removeAttribute('data-ascii-locked');
      }
    });
  }, []);

  // Trigger the full-screen ASCII Architect choreography
  const triggerChoreography = useCallback((withSound = false) => {
    soundEnabledRef.current = withSound;
    if (withSound) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          if (!window.__asciiAudioCtx) window.__asciiAudioCtx = new AudioCtx();
          if (window.__asciiAudioCtx.state === 'suspended') {
            window.__asciiAudioCtx.resume();
          }
        }
      } catch {
        // Ignore
      }
    }
    stageStartRef.current = performance.now();
    setStageActive(true);
  }, []);

  const skipChoreography = useCallback(() => {
    resetDomTargets();
    setStageActive(false);
  }, [resetDomTargets]);

  // Auto-run choreography on initial page load (unless prefers-reduced-motion)
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReduced) {
      stageStartRef.current = performance.now();
      setStageActive(true);
    }

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        resetDomTargets();
        setStageActive(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      resetDomTargets();
    };
  }, [resetDomTargets]);

  // Preload portrait image for hybrid lens & photo mode
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photoUrl;
    img.onload = () => {
      photoImgRef.current = img;
    };
  }, [photoUrl]);

  // ── 1. FULL-VIEWPORT OPENING CHOREOGRAPHY LOOP ──────────────────────────
  useEffect(() => {
    if (!stageActive) return;

    const canvas = stageCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let rafId = 0;
    const sparks = [];
    const lockedSet = new Set();
    const grabbedSet = new Set();

    const spawnSparks = (x, y, w, h) => {
      const chars = ['*', '+', '#', ':', '1', '0', '/', '\\', 'S', '>'];
      for (let i = 0; i < 28; i++) {
        const edge = i % 4;
        const px =
          edge === 0
            ? x + Math.random() * w
            : edge === 1
            ? x + w
            : edge === 2
            ? x + Math.random() * w
            : x;
        const py =
          edge === 0
            ? y
            : edge === 1
            ? y + Math.random() * h
            : edge === 2
            ? y + h
            : y + Math.random() * h;
        const ang = Math.random() * Math.PI * 2;
        const spd = 65 + Math.random() * 190;
        sparks.push({
          x: px,
          y: py,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 30,
          ch: chars[i % chars.length],
          life: 1.0,
        });
      }
    };

    // Draw an articulated ASCII Grapple Hand + Tether Cable from shoulder to target
    const drawAsciiGrapple = (
      sx,
      sy,
      hx,
      hy,
      isClamped,
      cmdText,
      side,
      elapsed
    ) => {
      const dx = hx - sx;
      const dy = hy - sy;
      const dist = Math.hypot(dx, dy);
      const steps = Math.max(6, Math.min(36, Math.floor(dist / 17)));

      // Draw dark pill backing along cable for high legibility on both light & dark themes
      ctx.strokeStyle = 'rgba(7, 11, 20, 0.75)';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(hx, hy);
      ctx.stroke();

      // Draw tether cable characters along tension curve
      ctx.font = 'bold 12px "JetBrains Mono", "Menlo", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 1; i < steps; i++) {
        const u = i / steps;
        const sag = isClamped
          ? Math.sin(u * Math.PI) * 5 * Math.sin(elapsed * 45)
          : Math.sin(u * Math.PI * 2 + elapsed * 14) * 12;
        const nx = -dy / (dist || 1);
        const ny = dx / (dist || 1);
        const cx = sx + dx * u + nx * sag;
        const cy = sy + dy * u + ny * sag;

        const ch =
          i % 4 === 0
            ? '[#]'
            : i % 2 === 0
            ? isClamped
              ? '═'
              : '-'
            : isClamped
            ? '◄'
            : '·';
        ctx.fillStyle = isClamped ? '#38bdf8' : '#e2e8f0';
        ctx.fillText(ch, cx, cy);
      }

      // Draw ASCII Hand / Clamp Box at (hx, hy)
      const boxW = 156;
      const boxH = 52;
      ctx.fillStyle = 'rgba(7, 11, 20, 0.95)';
      ctx.strokeStyle = isClamped ? '#38bdf8' : '#94a3b8';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(hx - boxW / 2, hy - boxH / 2, boxW, boxH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 10px "JetBrains Mono", "Menlo", monospace';
      ctx.fillStyle = isClamped ? '#38bdf8' : '#94a3b8';
      ctx.fillText(
        isClamped ? '[ CLAMPED // LOCK ]' : `[ GRAPPLE_${side === 'left' ? 'L' : 'R'} ]`,
        hx,
        hy - 12
      );
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(`> ${cmdText}`, hx, hy + 2);
      ctx.fillStyle = isClamped ? '#10b981' : '#64748b';
      ctx.fillText(isClamped ? '<< PULLING_DOM >>' : '.. SEEKING_NODE ..', hx, hy + 15);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
    };

    let lastTime = performance.now();

    const renderStage = (now) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const elapsed = (now - stageStartRef.current) / 1000;

      if (elapsed >= TOTAL_STAGE_DURATION) {
        resetDomTargets();
        setStageActive(false);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (
        canvas.width !== Math.floor(vw * dpr) ||
        canvas.height !== Math.floor(vh * dpr)
      ) {
        canvas.width = Math.floor(vw * dpr);
        canvas.height = Math.floor(vh * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Clear full viewport so real page elements underneath are 100% visible!
      ctx.clearRect(0, 0, vw, vh);

      const dockProgress = clamp01(
        (elapsed - DOCK_START_TIME) / (TOTAL_STAGE_DURATION - DOCK_START_TIME)
      );
      const dockEase = easeInOutCubic(dockProgress);

      // Compute ASCII Sıraç's current stage bounding box:
      const cardEl = cardRef.current;
      const cardRect = cardEl
        ? cardEl.getBoundingClientRect()
        : { left: vw * 0.62, top: vh * 0.2, width: 360, height: 450 };

      // Draw empty blueprint dock slot at cardRect while ASCII Sıraç is out on stage
      if (dockProgress < 0.92) {
        ctx.save();
        ctx.strokeStyle = `rgba(56, 189, 248, ${(0.4 * (1 - dockEase)).toFixed(2)})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.roundRect(cardRect.left, cardRect.top, cardRect.width, cardRect.height, 12);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.font = 'bold 11px "JetBrains Mono", "Menlo", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgba(100, 116, 139, ${(0.85 * (1 - dockEase)).toFixed(2)})`;
        ctx.fillText(
          '[ PORTRAIT_DOCK // STANDBY ]',
          cardRect.left + cardRect.width * 0.5,
          cardRect.top + cardRect.height * 0.5
        );
        ctx.restore();
      }

      const stageW = Math.min(410, Math.max(290, vw * 0.31));
      const stageH = stageW * 1.22;
      const startLeft =
        vw > 900 ? vw * 0.57 - stageW * 0.5 : vw * 0.5 - stageW * 0.5;
      const startTop = vh * 0.46 - stageH * 0.5;

      let pullLeanX = 0;
      let pullLeanY = 0;
      let activeLeftHand = null;
      let activeRightHand = null;
      let statusLabel =
        elapsed < 0.7
          ? lang === 'tr'
            ? 'ASCII SIRAÇ OLUŞTURULUYOR...'
            : 'MATERIALIZING ASCII SIRAÇ...'
          : dockProgress > 0
          ? lang === 'tr'
            ? 'PORTRE KARTINA YERLEŞİLİYOR // %100'
            : 'DOCKING INTO PORTRAIT FRAME // 100%'
          : '';

      // Update each DOM target's transform and compute grapple hand positions
      GRAB_TARGETS.forEach((target) => {
        const el = document.querySelector(target.selector);
        if (!el) return;

        const totalSpan = target.tEnd - target.tStart;
        const reachEnd = target.tStart + totalSpan * 0.26;

        if (elapsed < reachEnd) {
          el.style.willChange = 'transform, opacity';
          el.style.transition = 'none';
          el.style.transform = `translate3d(${target.startX}px, ${target.startY}px, 0) rotate(${target.startRot}deg) scale(${target.startScale})`;
          el.style.opacity = elapsed < target.tStart ? '0.32' : '0.78';
        } else if (elapsed >= reachEnd && elapsed < target.tEnd) {
          const pullP = clamp01((elapsed - reachEnd) / (target.tEnd - reachEnd));
          const easeP = easeOutBack(pullP);
          const curX = target.startX * (1 - easeP);
          const curY = target.startY * (1 - easeP);
          const curRot = target.startRot * (1 - easeP);
          const curScale = target.startScale + (1 - target.startScale) * easeP;

          el.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) rotate(${curRot.toFixed(2)}deg) scale(${curScale.toFixed(3)})`;
          el.style.opacity = (0.78 + 0.22 * pullP).toFixed(2);
          el.setAttribute('data-ascii-grabbing', 'true');

          const tension = Math.sin(pullP * Math.PI);
          pullLeanX += target.leanX * tension;
          pullLeanY += target.leanY * tension;
          statusLabel = `${target.cmd} ──► [${Math.round(pullP * 100)}%]`;

          if (!grabbedSet.has(target.id)) {
            grabbedSet.add(target.id);
            if (soundEnabledRef.current) playCyberTick(320, 0.05, 'sawtooth', 0.02);
          }
        } else {
          el.style.transform = 'translate3d(0px, 0px, 0) rotate(0deg) scale(1)';
          el.style.opacity = '1';
          el.removeAttribute('data-ascii-grabbing');
          el.setAttribute('data-ascii-locked', 'true');

          if (!lockedSet.has(target.id)) {
            lockedSet.add(target.id);
            const r = el.getBoundingClientRect();
            spawnSparks(r.left, r.top, r.width, r.height);
            if (soundEnabledRef.current) playCyberTick(680, 0.06, 'square', 0.03);
          }
        }

        const rect = el.getBoundingClientRect();
        const isGrabbingNow =
          elapsed >= target.tStart && elapsed <= target.tEnd + 0.12;

        if (isGrabbingNow && dockProgress === 0) {
          const isLocked = elapsed >= target.tEnd;
          ctx.strokeStyle = isLocked
            ? 'rgba(16, 185, 129, 0.9)'
            : 'rgba(56, 189, 248, 0.9)';
          ctx.lineWidth = 2;
          ctx.setLineDash(isLocked ? [] : [7, 5]);
          ctx.strokeRect(
            Math.max(4, rect.left - 8),
            rect.top - 8,
            rect.width + 16,
            rect.height + 16
          );
          ctx.setLineDash([]);

          // High-contrast label pill on top-left of the grabbed DOM element
          const tagText = isLocked
            ? `[LOCKED ✓] ${target.label}`
            : `[GRABBING] ${target.label}`;
          ctx.font = 'bold 11px "JetBrains Mono", "Menlo", monospace';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          const textW = ctx.measureText(tagText).width + 16;
          const tagX = Math.max(10, rect.left - 4);
          const tagY = Math.max(8, rect.top - 30);
          ctx.fillStyle = 'rgba(7, 11, 20, 0.94)';
          ctx.beginPath();
          ctx.roundRect(tagX, tagY, textW, 22, 6);
          ctx.fill();
          ctx.fillStyle = isLocked ? '#10b981' : '#38bdf8';
          ctx.fillText(tagText, tagX + 8, tagY + 11);
          ctx.textBaseline = 'top';

          const attachX =
            target.hand === 'left'
              ? Math.min(rect.right - 16, rect.left + rect.width * 0.76)
              : Math.max(rect.left + 16, rect.left + rect.width * 0.24);
          const attachY = rect.top + rect.height * 0.5;

          const handObj = {
            targetX: attachX,
            targetY: attachY,
            reachP: clamp01(
              (elapsed - target.tStart) / (reachEnd - target.tStart)
            ),
            retractP: clamp01((elapsed - target.tEnd) / 0.12),
            isClamped: elapsed >= reachEnd && elapsed <= target.tEnd,
            cmd: target.cmd,
          };

          if (target.hand === 'left') activeLeftHand = handObj;
          else activeRightHand = handObj;
        }
      });

      if (statusLabel && statusLabel !== stageStepText) {
        setStageStepText(statusLabel);
      }

      // Interpolate ASCII Sıraç's bounding box from Stage Center to Portrait Card
      const curLeft =
        (startLeft + pullLeanX) * (1 - dockEase) + cardRect.left * dockEase;
      const curTop =
        (startTop + pullLeanY) * (1 - dockEase) + cardRect.top * dockEase;
      const curW = stageW * (1 - dockEase) + cardRect.width * dockEase;
      const curH = stageH * (1 - dockEase) + cardRect.height * dockEase;

      // Draw sleek dark cyber-terminal capsule behind ASCII Sıraç so he pops on both Light & Dark themes
      ctx.save();
      ctx.fillStyle = 'rgba(7, 11, 20, 0.94)';
      ctx.strokeStyle = `rgba(56, 189, 248, ${(0.55 * (1 - dockEase * 0.6)).toFixed(2)})`;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = 'rgba(15, 23, 42, 0.35)';
      ctx.shadowBlur = 32;
      ctx.beginPath();
      ctx.roundRect(curLeft - 12, curTop - 28, curW + 24, curH + 40, 14);
      ctx.fill();
      ctx.stroke();

      // Terminal header bar above ASCII Sıraç during stage phase
      if (dockProgress < 0.8) {
        ctx.shadowBlur = 0;
        ctx.font = 'bold 10px "JetBrains Mono", "Menlo", monospace';
        ctx.fillStyle = `rgba(56, 189, 248, ${(1 - dockEase).toFixed(2)})`;
        ctx.fillText(
          '● ASCII_ARCHITECT // SIRAC_SIMSEK.EXE',
          curLeft + 4,
          curTop - 18
        );
      }
      ctx.restore();

      const cellW = curW / ASCII_COLS;
      const cellH = curH / ASCII_ROWS;

      // Render ASCII Sıraç's 112x86 character matrix
      const matProgress = clamp01(elapsed / 0.78);
      const isBlinking =
        (elapsed > 0.75 && elapsed < 0.9) || (elapsed > 2.45 && elapsed < 2.6);

      const fontSize = Math.max(6, Math.min(12, Math.floor(cellH * 1.08)));
      ctx.font = `bold ${fontSize}px "JetBrains Mono", "Menlo", monospace`;
      ctx.textBaseline = 'top';

      for (let i = 0; i < PARSED_CELLS.length; i++) {
        const cell = PARSED_CELLS[i];
        const localMat = clamp01((matProgress - cell.phaseOffset * 0.38) / 0.62);
        if (localMat <= 0) continue;
        const mEase = easeInOutCubic(localMat);

        const breathY =
          !cell.isHead && matProgress >= 1
            ? Math.sin(elapsed * 4.5 + cell.c * 0.05) * 1.8 * (1 - dockEase)
            : 0;

        const px =
          curLeft +
          cell.c * cellW +
          cell.spawnDx * (1 - mEase) * (1 - dockEase);
        const py =
          curTop +
          cell.r * cellH +
          cell.spawnDy * (1 - mEase) * (1 - dockEase) +
          breathY;

        let ch = cell.ch;
        if (localMat < 0.75) {
          ch = (i + Math.floor(elapsed * 30)) % 2 === 0 ? '1' : '0';
        } else if (isBlinking && cell.isEyeRow) {
          ch = '-';
        }

        const alpha = Math.min(1, localMat * 1.25);
        const b = Math.floor(58 + cell.lum * 197);

        if (cell.tint === 1) {
          ctx.fillStyle = `rgba(${Math.min(255, b + 20)}, ${Math.min(255, b + 35)}, 255, ${alpha})`;
        } else if (cell.tint === 2) {
          ctx.fillStyle = `rgba(${b}, ${Math.min(255, Math.floor(b * 1.03))}, ${Math.min(255, Math.floor(b * 1.08))}, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(${Math.floor(b * 0.78)}, ${Math.floor(b * 0.92)}, ${Math.min(255, Math.floor(b * 1.12))}, ${alpha})`;
        }

        ctx.fillText(ch, px, py);
      }

      // Draw ASCII Sıraç's Left and Right Grapple Hands reaching out from his shoulders
      const shoulderLX = curLeft + curW * 0.18;
      const shoulderLY = curTop + curH * 0.62;
      const shoulderRX = curLeft + curW * 0.82;
      const shoulderRY = curTop + curH * 0.62;

      if (activeLeftHand && dockProgress === 0) {
        const u =
          activeLeftHand.retractP > 0
            ? 1 - activeLeftHand.retractP
            : easeInOutCubic(activeLeftHand.reachP);
        const hx = shoulderLX + (activeLeftHand.targetX - shoulderLX) * u;
        const hy = shoulderLY + (activeLeftHand.targetY - shoulderLY) * u;
        drawAsciiGrapple(
          shoulderLX,
          shoulderLY,
          hx,
          hy,
          activeLeftHand.isClamped,
          activeLeftHand.cmd,
          'left',
          elapsed
        );
      }

      if (activeRightHand && dockProgress === 0) {
        const u =
          activeRightHand.retractP > 0
            ? 1 - activeRightHand.retractP
            : easeInOutCubic(activeRightHand.reachP);
        const hx = shoulderRX + (activeRightHand.targetX - shoulderRX) * u;
        const hy = shoulderRY + (activeRightHand.targetY - shoulderRY) * u;
        drawAsciiGrapple(
          shoulderRX,
          shoulderRY,
          hx,
          hy,
          activeRightHand.isClamped,
          activeRightHand.cmd,
          'right',
          elapsed
        );
      }

      // Update & render ASCII lock sparks
      ctx.font = 'bold 13px "JetBrains Mono", "Menlo", monospace';
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        sp.vy += 240 * dt;
        sp.life -= dt * 2.1;
        if (sp.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(56, 189, 248, ${sp.life.toFixed(2)})`;
        ctx.fillText(sp.ch, sp.x, sp.y);
      }

      ctx.restore();
      rafId = requestAnimationFrame(renderStage);
    };

    rafId = requestAnimationFrame(renderStage);
    return () => cancelAnimationFrame(rafId);
  }, [stageActive, lang, resetDomTargets]);

  // ── 2. EMBEDDED INTERACTIVE PORTRAIT CARD LOOP (60FPS) ──────────────────
  useEffect(() => {
    const canvas = cardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let rafId = 0;
    const startTime = performance.now();

    const renderCard = (now) => {
      const elapsed = (now - startTime) / 1000;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      ctx.fillStyle = '#070b14';
      ctx.fillRect(0, 0, w, h);

      const img = photoImgRef.current;
      const mouse = mouseRef.current;

      // Mode 1: Pure Photo Mode (with ASCII X-Ray Lens on hover!)
      if (viewMode === 'photo' && img) {
        const imgAspect = img.width / img.height;
        const cardAspect = w / h;
        let drawW = w;
        let drawH = h;
        let drawX = 0;
        let drawY = 0;
        if (imgAspect > cardAspect) {
          drawW = h * imgAspect;
          drawX = (w - drawW) * 0.5;
        } else {
          drawH = w / imgAspect;
          drawY = (h - drawH) * 0.15;
        }
        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        if (mouse.active) {
          const lensR = 78;
          ctx.save();
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, lensR, 0, Math.PI * 2);
          ctx.clip();

          ctx.fillStyle = 'rgba(6, 10, 18, 0.92)';
          ctx.fillRect(mouse.x - lensR, mouse.y - lensR, lensR * 2, lensR * 2);

          const cellW = w / ASCII_COLS;
          const cellH = h / ASCII_ROWS;
          const fontSize = Math.max(6, Math.floor(cellH * 1.08));
          ctx.font = `bold ${fontSize}px "JetBrains Mono", "Menlo", monospace`;
          ctx.textBaseline = 'top';

          for (let i = 0; i < PARSED_CELLS.length; i++) {
            const cell = PARSED_CELLS[i];
            const cx = cell.c * cellW;
            const cy = cell.r * cellH;
            if (Math.hypot(cx - mouse.x, cy - mouse.y) > lensR + 12) continue;
            const b = Math.floor(75 + cell.lum * 180);
            ctx.fillStyle = `rgb(${Math.floor(b * 0.75)}, ${Math.min(255, b + 20)}, 255)`;
            ctx.fillText(cell.ch, cx, cy);
          }
          ctx.restore();

          ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, lensR, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
        rafId = requestAnimationFrame(renderCard);
        return;
      }

      // Mode 2: Living Interactive ASCII Portrait Mode (Default!)
      if (img) {
        ctx.save();
        ctx.globalAlpha = viewMode === 'hybrid' ? 0.36 : 0.12;
        const imgAspect = img.width / img.height;
        const cardAspect = w / h;
        let drawW = w;
        let drawH = h;
        let drawX = 0;
        let drawY = 0;
        if (imgAspect > cardAspect) {
          drawW = h * imgAspect;
          drawX = (w - drawW) * 0.5;
        } else {
          drawH = w / imgAspect;
          drawY = (h - drawH) * 0.15;
        }
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();
      }

      const cellW = w / ASCII_COLS;
      const cellH = h / ASCII_ROWS;
      const fontSize = Math.max(6, Math.min(11, Math.floor(cellH * 1.1)));
      ctx.font = `bold ${fontSize}px "JetBrains Mono", "Menlo", monospace`;
      ctx.textBaseline = 'top';

      const blinkCycle = elapsed % 3.8;
      const isBlinking = blinkCycle > 3.62 && blinkCycle < 3.76;
      const scanY = ((elapsed * 0.32) % 1.35) * h;

      for (let i = 0; i < PARSED_CELLS.length; i++) {
        const cell = PARSED_CELLS[i];
        let px = cell.c * cellW;
        let py = cell.r * cellH;

        if (cell.isHead) {
          py += Math.sin(elapsed * 1.8) * 1.2;
        } else {
          py += Math.sin(elapsed * 2.2 + cell.c * 0.04) * 1.8;
        }

        let cursorBoost = 0;
        let ch = cell.ch;
        if (isBlinking && cell.isEyeRow) {
          ch = '-';
        }

        if (mouse.active) {
          const dx = px - mouse.x;
          const dy = py - mouse.y;
          const dist = Math.hypot(dx, dy);
          const radius = 68;
          if (dist < radius && dist > 0.1) {
            const force = (1 - dist / radius) * (1 - dist / radius);
            px += (dx / dist) * force * 9;
            py += (dy / dist) * force * 9;
            cursorBoost = force;
            if (force > 0.55 && (i + Math.floor(elapsed * 20)) % 4 === 0) {
              ch = ['0', '1', '#', '@', '/'][(i + Math.floor(elapsed * 12)) % 5];
            }
          }
        }

        const scanDist = Math.abs(py - scanY);
        const scanBoost = scanDist < 22 ? (1 - scanDist / 22) * 0.45 : 0;

        const totalBoost = Math.min(1, cursorBoost * 0.85 + scanBoost);
        const baseB = Math.floor(58 + cell.lum * 197);
        const b = Math.min(255, Math.floor(baseB + totalBoost * 85));

        if (cursorBoost > 0.25) {
          ctx.fillStyle = `rgb(${Math.floor(b * 0.7)}, 235, 255)`;
        } else if (cell.tint === 1) {
          ctx.fillStyle = `rgb(${Math.min(255, b + 15)}, ${Math.min(255, b + 28)}, 255)`;
        } else if (cell.tint === 2) {
          ctx.fillStyle = `rgb(${b}, ${Math.min(255, Math.floor(b * 1.02))}, ${Math.min(255, Math.floor(b * 1.07))})`;
        } else {
          ctx.fillStyle = `rgb(${Math.floor(b * 0.8)}, ${Math.floor(b * 0.93)}, ${Math.min(255, Math.floor(b * 1.1))})`;
        }

        ctx.fillText(ch, px, py);
      }

      if (viewMode === 'hybrid' && img && mouse.active) {
        const lensR = 64;
        ctx.save();
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, lensR, 0, Math.PI * 2);
        ctx.clip();

        const imgAspect = img.width / img.height;
        const cardAspect = w / h;
        let drawW = w;
        let drawH = h;
        let drawX = 0;
        let drawY = 0;
        if (imgAspect > cardAspect) {
          drawW = h * imgAspect;
          drawX = (w - drawW) * 0.5;
        } else {
          drawH = w / imgAspect;
          drawY = (h - drawH) * 0.15;
        }
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, lensR, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
      rafId = requestAnimationFrame(renderCard);
    };

    rafId = requestAnimationFrame(renderCard);
    return () => cancelAnimationFrame(rafId);
  }, [viewMode]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  const stageOverlay =
    stageActive && typeof document !== 'undefined'
      ? createPortal(
          <div className="ascii-stage-overlay" aria-hidden="true">
            <canvas ref={stageCanvasRef} className="ascii-stage-canvas" />
            <div className="ascii-stage-hud">
              <div className="ascii-stage-status">
                <span className="ascii-stage-dot" />
                <span>{stageStepText}</span>
              </div>
              <button
                type="button"
                className="ascii-stage-skip-btn"
                onClick={skipChoreography}
              >
                <FastForward size={13} />
                <span>{lang === 'tr' ? 'Geç (ESC)' : 'Skip (ESC)'}</span>
              </button>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {stageOverlay}

      {/* Hero Portrait Card with Interactive ASCII Matrix + Controls */}
      <div
        ref={cardRef}
        className={`hero-portrait-card ascii-interactive-card ${
          stageActive ? 'is-stage-docking' : ''
        }`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Top Interactive Control Pill Bar */}
        <div className="ascii-card-toolbar">
          <div className="ascii-mode-group" role="group" aria-label="Portrait Mode">
            <button
              type="button"
              className={`ascii-mode-btn ${viewMode === 'ascii' ? 'active' : ''}`}
              onClick={() => setViewMode('ascii')}
              title={lang === 'tr' ? 'Canlı ASCII Portre' : 'Live ASCII Portrait'}
            >
              <Terminal size={12} />
              <span>ASCII</span>
            </button>
            <button
              type="button"
              className={`ascii-mode-btn ${viewMode === 'hybrid' ? 'active' : ''}`}
              onClick={() => setViewMode('hybrid')}
              title={lang === 'tr' ? 'Hibrit X-Ray Mercek' : 'Hybrid X-Ray Lens'}
            >
              <Sparkles size={12} />
              <span>{lang === 'tr' ? 'HİBRİT' : 'HYBRID'}</span>
            </button>
            <button
              type="button"
              className={`ascii-mode-btn ${viewMode === 'photo' ? 'active' : ''}`}
              onClick={() => setViewMode('photo')}
              title={
                lang === 'tr'
                  ? 'Orijinal Fotoğraf (+ASCII Mercek)'
                  : 'Original Photo (+ASCII Lens)'
              }
            >
              <ImageIcon size={12} />
              <span>{lang === 'tr' ? 'FOTO' : 'PHOTO'}</span>
            </button>
          </div>

          <button
            type="button"
            className="ascii-replay-btn"
            onClick={() => triggerChoreography(true)}
            title={
              lang === 'tr'
                ? 'ASCII Sıraç ile ekranı baştan kur!'
                : 'Rebuild screen with ASCII Sıraç!'
            }
          >
            <RotateCcw size={12} />
            <span>{lang === 'tr' ? 'Sahneyi Kur' : 'Replay Intro'}</span>
          </button>
        </div>

        {/* 60FPS Interactive Portrait Canvas */}
        <canvas
          ref={cardCanvasRef}
          className="ascii-portrait-canvas"
          aria-label={name}
        />

        <div className="hero-portrait-scrim" />

        {/* Floating Meta Overlay */}
        <div className="hero-portrait-overlay">
          <div className="hero-portrait-name">{name}</div>
          <div className="hero-portrait-role">
            <span className="hero-portrait-status-dot" />
            <span>{role}</span>
          </div>
        </div>
      </div>
    </>
  );
}
