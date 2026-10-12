import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, ArrowUp } from 'lucide-react';

/**
 * PixelMarioRunner
 * Large-format 1-bit dot-matrix Mario runner stuck to the window corner.
 * - Monochromatic Black & White dot-matrix / LCD pixel aesthetic ("siyah beyaz noktalı").
 * - In Light Mode: Solid black square pixel blocks on the background.
 * - In Dark Mode: Solid white square pixel blocks on the background.
 * - Non-resetting continuous game loop (zero restart bugs).
 * - Procedural level generator with guaranteed minimum 190px obstacle spacing (no overlapping objects).
 * - Master Autonomous AI pilot with calibrated jump physics (flawless pipe leaps & Goomba stomps).
 * - Interactive Space / ArrowUp / Click jump with buffered landing.
 * - Pure Web Audio 8-bit sound synthesizer with mute toggle.
 * - 0% CPU consumption off-screen via IntersectionObserver.
 */

// ── 1-Bit Authentic Mario Sprites (16x16) ───────────────────────────────────
const MARIO_STAND = [
  '.....#####......',
  '....#########...',
  '....###...#.#...',
  '...#.###.###.#..',
  '...#.###.#####.#',
  '...##.###.####..',
  '.....#######....',
  '....##.###......',
  '...###.##.###...',
  '..####.###.###..',
  '..##.#..#..#.##.',
  '..###.#####.###.',
  '..###.#####.###.',
  '....#######.....',
  '...###...###....',
  '..####...####...'
];

const MARIO_RUN_1 = [
  '.....#####......',
  '....#########...',
  '....###...#.#...',
  '...#.###.###.#..',
  '...#.###.#####.#',
  '...##.###.####..',
  '.....#######....',
  '....##.###......',
  '...###.##.###...',
  '..####.###.###..',
  '..##.#..#..#.##.',
  '..###.#####.###.',
  '..###.#####.###.',
  '....#########...',
  '.....#####......',
  '....######......'
];

const MARIO_RUN_2 = [
  '.....#####......',
  '....#########...',
  '....###...#.#...',
  '...#.###.###.#..',
  '...#.###.#####.#',
  '...##.###.####..',
  '.....#######....',
  '....##.###......',
  '...###.##.###...',
  '..####.###.###..',
  '..##.#..#..#.##.',
  '..###.#####.###.',
  '..###.#####.###.',
  '....#########...',
  '...###...###....',
  '..####...####...'
];

const MARIO_RUN_3 = [
  '.....#####......',
  '....#########...',
  '....###...#.#...',
  '...#.###.###.#..',
  '...#.###.#####.#',
  '...##.###.####..',
  '.....#######....',
  '....##.###......',
  '...###.##.###...',
  '..####.###.###..',
  '..##.#..#..#.##.',
  '..###.#####.###.',
  '..###.#####.###.',
  '....#########...',
  '......#####.....',
  '.....######.....'
];

const MARIO_JUMP = [
  '..###...........',
  '..###.#####.....',
  '.....#########..',
  '.....###...#.#..',
  '....#.###.###.#.',
  '....#.###.#####.',
  '....##.###.####.',
  '......#######...',
  '...###.###......',
  '..####.##.###...',
  '..###.###.###...',
  '..##..#..#.##...',
  '..###.#####.##..',
  '...##########...',
  '..####...####...',
  '.#####....####..'
];

// ── 1-Bit Enemies, Blocks & Items ───────────────────────────────────────────
const GOOMBA_WALK_1 = [
  '......####......',
  '....########....',
  '...##########...',
  '..############..',
  '.##############.',
  '.##..######..##.',
  '.##..######..##.',
  '###..######..###',
  '################',
  '..############..',
  '..#..######..#..',
  '...#..####..#...',
  '...##########...',
  '..######..####..',
  '.######....####.',
  '..####......##..'
];

const GOOMBA_WALK_2 = [
  '......####......',
  '....########....',
  '...##########...',
  '..############..',
  '.##############.',
  '.##..######..##.',
  '.##..######..##.',
  '###..######..###',
  '################',
  '..############..',
  '..#..######..#..',
  '...#..####..#...',
  '...##########...',
  '..####..######..',
  '.####....######.',
  '..##......####..'
];

const GOOMBA_SQUISHED = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '..############..',
  '.##############.',
  '###..######..###',
  '################',
  '################',
  '.##############.',
  '..############..',
  '....########....'
];

const BLOCK_QUESTION_1 = [
  '################',
  '#..............#',
  '#...########...#',
  '#..##########..#',
  '#..###....###..#',
  '#.........###..#',
  '#........###...#',
  '#.......###....#',
  '#......###.....#',
  '#......###.....#',
  '#..............#',
  '#......###.....#',
  '#......###.....#',
  '#..............#',
  '#..............#',
  '################'
];

const BLOCK_QUESTION_2 = [
  '################',
  '#..............#',
  '#...########...#',
  '#..##########..#',
  '#..###....###..#',
  '#..###....###..#',
  '#........###...#',
  '#.......###....#',
  '#......###.....#',
  '#......###.....#',
  '#..............#',
  '#......###.....#',
  '#......###.....#',
  '#..............#',
  '#..............#',
  '################'
];

const BLOCK_SPENT = [
  '################',
  '#..............#',
  '#..##......##..#',
  '#..##......##..#',
  '#..............#',
  '#..............#',
  '#..............#',
  '#..............#',
  '#..............#',
  '#..............#',
  '#..............#',
  '#..............#',
  '#..##......##..#',
  '#..##......##..#',
  '#..............#',
  '################'
];

const BRICK_BLOCK = [
  '################',
  '#......#.......#',
  '#......#.......#',
  '################',
  '#.......#......#',
  '#.......#......#',
  '################',
  '#......#.......#',
  '#......#.......#',
  '################',
  '#.......#......#',
  '#.......#......#',
  '################',
  '#......#.......#',
  '#......#.......#',
  '################'
];

const SUPER_MUSHROOM = [
  '.....######.....',
  '...##########...',
  '..###..##..###..',
  '.###....####.##.',
  '.##....######.##',
  '.##....######.##',
  '####..##..######',
  '################',
  '################',
  '..############..',
  '..###.####.###..',
  '..###.####.###..',
  '..############..',
  '..############..',
  '...##########...',
  '.....######.....'
];

const COIN_FRAMES = [
  // Frame 0: Wide Face (10x12)
  [
    '..######..',
    '.########.',
    '##..##..##',
    '##..##..##',
    '##..##..##',
    '##..##..##',
    '##..##..##',
    '##..##..##',
    '##..##..##',
    '##..##..##',
    '.########.',
    '..######..'
  ],
  // Frame 1: Three-quarter turn (10x12)
  [
    '...####...',
    '..######..',
    '.##.##.##.',
    '.##.##.##.',
    '.##.##.##.',
    '.##.##.##.',
    '.##.##.##.',
    '.##.##.##.',
    '.##.##.##.',
    '.##.##.##.',
    '..######..',
    '...####...'
  ],
  // Frame 2: Side profile (10x12)
  [
    '....##....',
    '...####...',
    '...####...',
    '...####...',
    '...####...',
    '...####...',
    '...####...',
    '...####...',
    '...####...',
    '...####...',
    '...####...',
    '....##....'
  ],
  // Frame 3: Three-quarter turn opposite (10x12)
  [
    '...####...',
    '..######..',
    '.##.##.##.',
    '.##.##.##.',
    '.##.##.##.',
    '.##.##.##.',
    '.##.##.##.',
    '.##.##.##.',
    '.##.##.##.',
    '.##.##.##.',
    '..######..',
    '...####...'
  ]
];

const PIPE_LIP = [
  '##################',
  '#................#',
  '#.##############.#',
  '#.#............#.#',
  '#.#............#.#',
  '#.##############.#',
  '#................#',
  '##################'
];

const PIPE_BODY = [
  '################',
  '#..............#',
  '#.############.#',
  '#.#..........#.#',
  '#.#..........#.#',
  '#.#..........#.#',
  '#.#..........#.#',
  '#.############.#',
  '#..............#',
  '################'
];

const CLOUD_1BIT = [
  '.......##########.......',
  '....################....',
  '..####################..',
  '.######################.',
  '.#....................#.',
  '#..##################..#',
  '#..#................#..#',
  '.######################.',
  '..####################..'
];

const BUSH_1BIT = [
  '.......##########.......',
  '....################....',
  '..####################..',
  '.######################.',
  '.#..##..########..##..#.',
  '#..####..######..####..#',
  '#..####..######..####..#',
  '.######################.',
  '..####################..'
];

// Helper to batch-draw pixel runs
function drawPixelMatrix(ctx, matrix, startX, startY, pixelSize, color) {
  ctx.fillStyle = color;
  const rows = matrix.length;
  const sx = Math.floor(startX);
  const sy = Math.floor(startY);
  for (let r = 0; r < rows; r++) {
    const row = matrix[r];
    const cols = row.length;
    let c = 0;
    while (c < cols) {
      if (row[c] === '#') {
        let span = 1;
        while (c + span < cols && row[c + span] === '#') {
          span++;
        }
        ctx.fillRect(sx + c * pixelSize, sy + r * pixelSize, span * pixelSize, pixelSize);
        c += span;
      } else {
        c++;
      }
    }
  }
}

// ── Pure Web Audio 8-Bit NES Synthesizer ─────────────────────────────────────
class RetroNesAudio {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  jump() {
    if (!this.enabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(560, t + 0.15);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.15);
    } catch {}
  }

  coin() {
    if (!this.enabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, t); // B5
      osc.frequency.setValueAtTime(1318.51, t + 0.07); // E6
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.32);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.32);
    } catch {}
  }

  stomp() {
    if (!this.enabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(50, t + 0.08);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.08);
    } catch {}
  }

  bump() {
    if (!this.enabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.linearRampToValueAtTime(45, t + 0.07);
      gain.gain.setValueAtTime(0.16, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.07);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.07);
    } catch {}
  }

  powerup() {
    if (!this.enabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const notes = [330, 392, 659, 523, 587, 784];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, t + idx * 0.05);
        gain.gain.setValueAtTime(0.1, t + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0, t + idx * 0.05 + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + idx * 0.05);
        osc.stop(t + idx * 0.05 + 0.05);
      });
    } catch {}
  }
}

export default function PixelMarioRunner({ theme }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const audioRef = useRef(new RetroNesAudio());
  const [isHovered, setIsHovered] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  const getIsDark = () => {
    if (theme) return theme === 'dark';
    if (typeof document !== 'undefined') {
      return (
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark'
      );
    }
    return false;
  };

  const [isDark, setIsDark] = useState(getIsDark);

  useEffect(() => {
    setIsDark(getIsDark());
  }, [theme]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(getIsDark());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });
    return () => observer.disconnect();
  }, [theme]);

  const jumpBufferRef = useRef(0);
  const dotPatternRef = useRef(null);
  const ditherPatternRef = useRef(null);
  const patternThemeRef = useRef(null);

  const stateRef = useRef({
    width: 740,
    height: 120,
    pixelSize: 2, // 2px scaling = 32px height 16x16 sprites
    groundY: 94,
    score: 1200,
    coins: 6,
    mario: {
      x: 44,
      y: 62, // 94 - 32
      vy: 0,
      isGrounded: true,
      frame: 0,
      animTimer: 0,
      isBlinking: 0,
    },
    obstacles: [],
    mushrooms: [],
    clouds: [
      { x: 40, y: 12, speed: 0.16 },
      { x: 280, y: 18, speed: 0.22 },
      { x: 520, y: 8, speed: 0.14 },
      { x: 700, y: 16, speed: 0.2 },
    ],
    bushes: [
      { x: 120, y: 76 },
      { x: 380, y: 76 },
      { x: 620, y: 76 },
    ],
    particles: [],
    poppedCoins: [],
    floatingTexts: [],
    spawnTimer: 45,
    distanceTraveled: 0,
    isTabActive: true,
    isIntersecting: true,
  });

  const toggleSound = useCallback((e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    audio.init();
    audio.enabled = !audio.enabled;
    setIsAudioEnabled(audio.enabled);
  }, []);

  const triggerJump = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    const m = s.mario;

    if (m.isGrounded) {
      m.vy = -6.4;
      m.isGrounded = false;
      jumpBufferRef.current = 0;
      audioRef.current.jump();

      // Launch little jump dust puff
      s.particles.push(
        { x: m.x + 4, y: s.groundY - 4, vx: -1.0, vy: -0.6, life: 10 },
        { x: m.x + 12, y: s.groundY - 4, vx: 0.8, vy: -0.6, life: 10 }
      );
    } else {
      jumpBufferRef.current = 8;
    }
  }, []);

  // Global Space / ArrowUp listener on hover
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if (isHovered && (e.code === 'Space' || e.code === 'ArrowUp' || e.key === ' ')) {
        e.preventDefault();
        triggerJump();
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [isHovered, triggerJump]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');

    const applyTransform = () => {
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.floor(rect.width || 740);
      const h = 120;
      const dpr = window.devicePixelRatio || 1;

      const targetW = Math.floor(w * dpr);
      const targetH = Math.floor(h * dpr);

      if (canvas.width === targetW && canvas.height === targetH) {
        applyTransform();
        return;
      }

      stateRef.current.width = w;
      stateRef.current.height = h;
      stateRef.current.groundY = 94;
      if (stateRef.current.mario.isGrounded) {
        stateRef.current.mario.y = stateRef.current.groundY - 32;
      }

      canvas.width = targetW;
      canvas.height = targetH;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      applyTransform();
    };

    handleResize();
    applyTransform();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let isLoopRunning = false;
    let animationFrameId = null;

    const startLoop = () => {
      if (isLoopRunning) return;
      isLoopRunning = true;
      lastTick = performance.now();
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    const stopLoop = () => {
      if (!isLoopRunning) return;
      isLoopRunning = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0].isIntersecting;
        stateRef.current.isIntersecting = isVisible;
        if (isVisible && stateRef.current.isTabActive) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    const handleVisibilityChange = () => {
      const isTabActive = !document.hidden;
      stateRef.current.isTabActive = isTabActive;
      if (isTabActive && stateRef.current.isIntersecting) {
        startLoop();
      } else {
        stopLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial course obstacles: spaced 200px+ apart to guarantee zero overlap
    stateRef.current.obstacles = [
      { id: 1, type: 'block', x: 220, y: 26, width: 32, hit: false, bumpY: 0, hasItem: 'coin' },
      { id: 2, type: 'goomba', x: 440, y: 94 - 32, width: 32, squished: 0, dead: false },
      { id: 3, type: 'pipe', x: 660, y: 94 - 32, width: 36, height: 32 },
    ];
    stateRef.current.mushrooms = [];

    let lastTick = performance.now();

    const gameLoop = (timestamp) => {
      const s = stateRef.current;
      if (!isLoopRunning || !s.isIntersecting || !s.isTabActive) {
        stopLoop();
        return;
      }

      animationFrameId = requestAnimationFrame(gameLoop);

      const dt = Math.min((timestamp - lastTick) / 16.667, 2.2);
      lastTick = timestamp;

      const m = s.mario;
      const speed = 2.15 * dt;
      s.distanceTraveled += speed;

      // Clouds & Bushes parallax
      s.clouds.forEach((c) => {
        c.x -= c.speed * dt;
        if (c.x < -80) c.x = s.width + 40;
      });

      s.bushes.forEach((b) => {
        b.x -= speed;
        if (b.x < -80) b.x = s.width + 60 + Math.random() * 80;
      });

      // Mario Physics
      const groundStandingY = s.groundY - 32;
      if (!m.isGrounded) {
        m.vy += 0.44 * dt;
        m.y += m.vy * dt;

        if (m.y >= groundStandingY) {
          m.y = groundStandingY;
          m.vy = 0;
          m.isGrounded = true;

          // Landing dust puff
          s.particles.push(
            { x: m.x + 4, y: s.groundY - 4, vx: -0.8, vy: -0.4, life: 8 },
            { x: m.x + 12, y: s.groundY - 4, vx: 0.8, vy: -0.4, life: 8 }
          );

          if (jumpBufferRef.current > 0) {
            jumpBufferRef.current = 0;
            m.vy = -6.4;
            m.isGrounded = false;
            audioRef.current.jump();
          }
        }
      }

      if (jumpBufferRef.current > 0) {
        jumpBufferRef.current -= dt;
      }

      // Animation cycle: 3 authentic running frames
      m.animTimer += dt;
      if (m.animTimer > 6.5) {
        m.frame = (m.frame + 1) % 3;
        m.animTimer = 0;
      }

      if (m.isBlinking > 0) {
        m.isBlinking -= dt;
      }

      // ── Procedural Level Spawner (Guaranteed Minimum 200px Spacing - Zero Overlap) ──
      s.spawnTimer -= dt;
      if (s.spawnTimer <= 0) {
        let rightmostEdge = 0;
        for (const obs of s.obstacles) {
          const w = obs.width || 36;
          const edge = obs.x + w;
          if (edge > rightmostEdge) rightmostEdge = edge;
        }

        if (rightmostEdge < s.width + 60) {
          const spawnX = Math.max(rightmostEdge + 200 + Math.random() * 60, s.width + 40);
          const pattern = Math.random();

          if (pattern < 0.3) {
            // Pattern 1: Single Goomba
            s.obstacles.push({
              id: Date.now() + Math.random(),
              type: 'goomba',
              x: spawnX,
              y: s.groundY - 32,
              width: 32,
              squished: 0,
              dead: false,
            });
          } else if (pattern < 0.58) {
            // Pattern 2: Warp Pipe (Uniform 32px height, 36px width)
            s.obstacles.push({
              id: Date.now() + Math.random(),
              type: 'pipe',
              x: spawnX,
              y: s.groundY - 32,
              width: 36,
              height: 32,
            });
          } else if (pattern < 0.82) {
            // Pattern 3: Block Arrangement
            const hasTrio = Math.random() < 0.4;
            if (hasTrio) {
              s.obstacles.push(
                { id: Date.now() + 1, type: 'brick', x: spawnX, y: 26, width: 32, bumpY: 0 },
                { id: Date.now() + 2, type: 'block', x: spawnX + 32, y: 26, width: 32, hit: false, bumpY: 0, hasItem: Math.random() < 0.3 ? 'mushroom' : 'coin' },
                { id: Date.now() + 3, type: 'brick', x: spawnX + 64, y: 26, width: 32, bumpY: 0 }
              );
            } else {
              s.obstacles.push({
                id: Date.now() + Math.random(),
                type: 'block',
                x: spawnX,
                y: 26,
                width: 32,
                hit: false,
                bumpY: 0,
                hasItem: Math.random() < 0.35 ? 'mushroom' : 'coin',
              });
            }
          } else {
            // Pattern 4: Coin Arc
            s.obstacles.push(
              { id: Date.now() + 1, type: 'coin', x: spawnX, y: 46, width: 20, collected: false },
              { id: Date.now() + 2, type: 'coin', x: spawnX + 28, y: 24, width: 20, collected: false },
              { id: Date.now() + 3, type: 'coin', x: spawnX + 56, y: 46, width: 20, collected: false }
            );
          }

          s.spawnTimer = 42 + Math.random() * 24;
        }
      }

      // ── Master Autonomous AI Pilot (100% Reliable Threat Analysis) ──
      if (m.isGrounded) {
        let shouldJump = false;

        // 1. Find the nearest upcoming ground threat in front of Mario
        let nearestThreat = null;
        let minThreatDist = Infinity;

        for (let i = 0; i < s.obstacles.length; i++) {
          const obs = s.obstacles[i];
          const isThreat =
            obs.type === 'pipe' ||
            (obs.type === 'goomba' && !obs.dead && obs.squished <= 0);

          if (isThreat) {
            const dist = obs.x - m.x;
            if (dist > 0 && dist < minThreatDist) {
              minThreatDist = dist;
              nearestThreat = obs;
            }
          }
        }

        if (nearestThreat) {
          if (nearestThreat.type === 'pipe') {
            // Pipe takeoff window: Mario takes off 14-34px before pipe
            if (minThreatDist <= 34 && minThreatDist >= 14) {
              shouldJump = true;
            } else if (minThreatDist < 14 && minThreatDist > 0) {
              // Emergency jump if slipped too close
              shouldJump = true;
            }
          } else if (nearestThreat.type === 'goomba') {
            // Goomba stomping window: Goomba approaches at ~2.57px/frame
            // Jumping at 40-65px causes Mario to land directly on top of its head
            if (minThreatDist <= 65 && minThreatDist >= 40) {
              shouldJump = true;
            } else if (minThreatDist < 40 && minThreatDist > 0) {
              // Emergency jump if slipped too close
              shouldJump = true;
            }
          }
        }

        // 2. Bonus Opportunity (? Block / Coin) ONLY when track is 100% clear of ground threats
        if (!shouldJump && minThreatDist > 160) {
          for (let i = 0; i < s.obstacles.length; i++) {
            const obs = s.obstacles[i];
            const dist = obs.x - m.x;

            if (dist >= 20 && dist <= 32) {
              if (
                (obs.type === 'block' && !obs.hit) ||
                (obs.type === 'coin' && !obs.collected && obs.y < 50)
              ) {
                shouldJump = true;
                break;
              }
            }
          }
        }

        if (shouldJump) {
          triggerJump();
        }
      }

      // ── Update Obstacles & Collisions ──
      for (let i = s.obstacles.length - 1; i >= 0; i--) {
        const obs = s.obstacles[i];
        obs.x -= speed;

        if (obs.type === 'goomba' && !obs.dead && obs.squished <= 0) {
          obs.x -= 0.42 * dt; // Walk left
        }

        if (obs.bumpY < 0) {
          obs.bumpY += 0.65 * dt;
          if (obs.bumpY > 0) obs.bumpY = 0;
        }

        // Coin Collision
        if (obs.type === 'coin' && !obs.collected) {
          const coinCenterX = obs.x + 10;
          const coinCenterY = obs.y + 12;
          const marioCenterX = m.x + 16;
          const marioCenterY = m.y + 16;

          if (
            Math.abs(coinCenterX - marioCenterX) < 18 &&
            Math.abs(coinCenterY - marioCenterY) < 22
          ) {
            obs.collected = true;
            audioRef.current.coin();
            s.score += 100;
            s.coins += 1;

            s.particles.push(
              { x: coinCenterX - 4, y: coinCenterY - 4, vx: -1.2, vy: -1.2, life: 10 },
              { x: coinCenterX + 4, y: coinCenterY - 4, vx: 1.2, vy: -1.2, life: 10 },
              { x: coinCenterX - 4, y: coinCenterY + 4, vx: -1.2, vy: 1.2, life: 10 },
              { x: coinCenterX + 4, y: coinCenterY + 4, vx: 1.2, vy: 1.2, life: 10 }
            );
            s.floatingTexts.push({
              x: obs.x,
              y: obs.y - 6,
              text: '+100',
              life: 25,
            });
          }
        }
        // Question Block / Brick Bump
        else if ((obs.type === 'block' && !obs.hit) || obs.type === 'brick') {
          const blockCenterX = obs.x + 16;
          const marioCenterX = m.x + 16;
          const blockBottom = obs.y + 32 + (obs.bumpY || 0);

          if (
            Math.abs(marioCenterX - blockCenterX) < 18 &&
            m.y <= blockBottom + 4 &&
            m.y >= obs.y + 8 &&
            m.vy < 0
          ) {
            obs.bumpY = -8;
            m.vy = 2.0;

            if (obs.type === 'block') {
              obs.hit = true;
              if (obs.hasItem === 'mushroom') {
                audioRef.current.powerup();
                s.mushrooms.push({
                  id: Date.now(),
                  x: obs.x,
                  y: obs.y - 18,
                  vy: -2.2,
                });
              } else {
                audioRef.current.coin();
                s.score += 200;
                s.coins += 1;
                s.poppedCoins.push({
                  x: obs.x + 6,
                  y: obs.y - 14,
                  vy: -5.0,
                  life: 22,
                });
                s.floatingTexts.push({
                  x: obs.x,
                  y: obs.y - 16,
                  text: '+200',
                  life: 30,
                });
              }
            } else {
              audioRef.current.bump();
            }
          }
        }
        // Goomba Stomp / Collision
        else if (obs.type === 'goomba' && !obs.dead && obs.squished <= 0) {
          const goombaCenterX = obs.x + 16;
          const marioCenterX = m.x + 16;
          const marioFeet = m.y + 32;
          const goombaTop = obs.y;

          if (Math.abs(marioCenterX - goombaCenterX) < 22) {
            // 100% Reliable Stomp: falling downwards and at or near Goomba head
            if (m.vy > 0 && marioFeet >= goombaTop - 6) {
              obs.squished = 24;
              obs.dead = true;
              m.vy = -5.4; // Authentic high stomp bounce!
              audioRef.current.stomp();
              s.score += 200;

              s.particles.push(
                { x: goombaCenterX - 6, y: goombaTop + 12, vx: -1.4, vy: -0.8, life: 8 },
                { x: goombaCenterX + 6, y: goombaTop + 12, vx: 1.4, vy: -0.8, life: 8 }
              );
              s.floatingTexts.push({
                x: obs.x,
                y: obs.y - 8,
                text: '+200',
                life: 25,
              });
            } else if (m.isBlinking <= 0 && marioFeet > goombaTop + 12 && m.vy <= 0) {
              // Side collision while walking
              m.isBlinking = 35;
              m.vy = -3.0;
              m.isGrounded = false;
              audioRef.current.bump();
            }
          }
        } else if (obs.type === 'goomba' && obs.squished > 0) {
          obs.squished -= dt;
          if (obs.squished <= 0) {
            s.obstacles.splice(i, 1);
            continue;
          }
        } else if (obs.type === 'pipe') {
          const pipeLeft = obs.x;
          const pipeRight = obs.x + 36;
          const marioLeft = m.x + 4;
          const marioRight = m.x + 28;
          const marioFeet = m.y + 32;
          const pipeTop = obs.y;

          if (marioRight > pipeLeft && marioLeft < pipeRight) {
            if (marioFeet > pipeTop + 4 && m.isBlinking <= 0) {
              m.isBlinking = 35;
              m.vy = -2.8;
              m.isGrounded = false;
              audioRef.current.bump();
            }
          }
        }

        if (obs.x < -80) {
          s.obstacles.splice(i, 1);
        }
      }

      // ── Update Mushrooms (Realistic Arc, Ground Slide & Collection) ──
      for (let i = s.mushrooms.length - 1; i >= 0; i--) {
        const mush = s.mushrooms[i];
        mush.vy = (mush.vy || 0) + 0.3 * dt;
        mush.y += mush.vy * dt;
        if (mush.y >= s.groundY - 32) {
          mush.y = s.groundY - 32;
          mush.vy = 0;
        }
        mush.x += 0.8 * dt; // Slides forward

        const mushCenterX = mush.x + 16;
        const marioCenterX = m.x + 16;
        const mushCenterY = mush.y + 16;
        const marioCenterY = m.y + 16;

        if (
          Math.abs(mushCenterX - marioCenterX) < 22 &&
          Math.abs(mushCenterY - marioCenterY) < 26
        ) {
          s.mushrooms.splice(i, 1);
          audioRef.current.powerup();
          s.score += 1000;

          s.floatingTexts.push({
            x: m.x,
            y: m.y - 12,
            text: '+1000',
            life: 35,
          });
          continue;
        }

        if (mush.x < -80 || mush.x > s.width + 120) {
          s.mushrooms.splice(i, 1);
        }
      }

      // Update Particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x -= speed;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        if (p.life <= 0) s.particles.splice(i, 1);
      }

      // Update Popped Coins
      for (let i = s.poppedCoins.length - 1; i >= 0; i--) {
        const pc = s.poppedCoins[i];
        pc.x -= speed;
        pc.y += pc.vy * dt;
        pc.vy += 0.38 * dt;
        pc.life -= dt;
        if (pc.life <= 0) s.poppedCoins.splice(i, 1);
      }

      // Update Floating Texts
      for (let i = s.floatingTexts.length - 1; i >= 0; i--) {
        const ft = s.floatingTexts[i];
        ft.x -= speed;
        ft.y -= 0.6 * dt;
        ft.life -= dt;
        if (ft.life <= 0 || ft.x < -60) s.floatingTexts.splice(i, 1);
      }

      // ── RENDER 1-BIT MONOCHROME DOT-MATRIX SCREEN ───────────────────────────
      ctx.clearRect(0, 0, s.width, s.height);

      const px = s.pixelSize; // 2px square pixel blocks
      const pixelColor = isDark ? '#ffffff' : '#090d16';
      const matrixDotColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';
      const cloudColor = isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(15, 23, 42, 0.3)';

      // 1. Solid LCD Background (Eliminates transparent HTML bleed and ghosting)
      const screenBgColor = isDark ? '#060913' : '#f8fafc';
      ctx.fillStyle = screenBgColor;
      ctx.fillRect(0, 0, s.width, s.height);

      // 2. Subtle Dot-Matrix Background Pattern
      if (!dotPatternRef.current || patternThemeRef.current !== isDark) {
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 8;
        pCanvas.height = 8;
        const pCtx = pCanvas.getContext('2d');
        pCtx.fillStyle = matrixDotColor;
        pCtx.fillRect(0, 0, px, px);
        dotPatternRef.current = ctx.createPattern(pCanvas, 'repeat');

        // 1-Bit Dither Pattern for Ground Tiling
        const dCanvas = document.createElement('canvas');
        dCanvas.width = 12;
        dCanvas.height = 12;
        const dCtx = dCanvas.getContext('2d');
        dCtx.fillStyle = pixelColor;
        dCtx.fillRect(0, 0, px, px);
        dCtx.fillRect(6, 6, px, px);
        ditherPatternRef.current = ctx.createPattern(dCanvas, 'repeat');

        patternThemeRef.current = isDark;
      }

      ctx.fillStyle = dotPatternRef.current;
      ctx.fillRect(0, 0, s.width, s.height);

      // 3. 1-Bit Clouds
      s.clouds.forEach((c) => {
        drawPixelMatrix(ctx, CLOUD_1BIT, c.x, c.y, px, cloudColor);
      });

      // 4. 1-Bit Bushes on Ground
      s.bushes.forEach((b) => {
        drawPixelMatrix(ctx, BUSH_1BIT, b.x, s.groundY - 18, px, pixelColor);
      });

      // 5. Ground: Solid Rail + Scrolling Dither Pattern
      ctx.fillStyle = pixelColor;
      ctx.fillRect(0, s.groundY, s.width, px);

      const ditherOffset = Math.floor(s.distanceTraveled) % 12;
      ctx.save();
      ctx.translate(-ditherOffset, 0);
      ctx.fillStyle = ditherPatternRef.current;
      ctx.fillRect(ditherOffset, s.groundY + px, s.width + 24, s.height - (s.groundY + px));
      ctx.restore();

      // 6. Obstacles
      s.obstacles.forEach((obs) => {
        if (obs.type === 'pipe') {
          drawPixelMatrix(ctx, PIPE_LIP, obs.x, obs.y, px, pixelColor);
          drawPixelMatrix(ctx, PIPE_BODY, obs.x + 1 * px, obs.y + 8 * px, px, pixelColor);
        } else if (obs.type === 'block') {
          const matrix = obs.hit
            ? BLOCK_SPENT
            : Math.floor(s.distanceTraveled / 8) % 2 === 0
            ? BLOCK_QUESTION_1
            : BLOCK_QUESTION_2;
          drawPixelMatrix(ctx, matrix, obs.x, obs.y + (obs.bumpY || 0), px, pixelColor);
        } else if (obs.type === 'brick') {
          drawPixelMatrix(ctx, BRICK_BLOCK, obs.x, obs.y + (obs.bumpY || 0), px, pixelColor);
        } else if (obs.type === 'coin' && !obs.collected) {
          const cFrame = COIN_FRAMES[Math.floor(s.distanceTraveled / 5) % COIN_FRAMES.length];
          drawPixelMatrix(ctx, cFrame, obs.x, obs.y, px, pixelColor);
        } else if (obs.type === 'goomba') {
          if (obs.squished > 0) {
            drawPixelMatrix(ctx, GOOMBA_SQUISHED, obs.x, obs.y, px, pixelColor);
          } else if (!obs.dead) {
            const gFrame = Math.floor(s.distanceTraveled / 5) % 2 === 0 ? GOOMBA_WALK_1 : GOOMBA_WALK_2;
            drawPixelMatrix(ctx, gFrame, obs.x, obs.y, px, pixelColor);
          }
        }
      });

      // 7. Mushrooms
      s.mushrooms.forEach((mush) => {
        drawPixelMatrix(ctx, SUPER_MUSHROOM, mush.x, mush.y, px, pixelColor);
      });

      // 8. Popped Coins from ? Blocks
      s.poppedCoins.forEach((pc) => {
        const cFrame = COIN_FRAMES[Math.floor(s.distanceTraveled / 4) % COIN_FRAMES.length];
        drawPixelMatrix(ctx, cFrame, pc.x, pc.y, px, pixelColor);
      });

      // 9. Dust & Sparkle Particles (Grid-aligned 2x2 pixels)
      ctx.fillStyle = pixelColor;
      s.particles.forEach((p) => {
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), px, px);
      });

      // 10. Mario (1-Bit Running & Jumping Animation)
      if (m.isBlinking <= 0 || Math.floor(m.isBlinking / 4) % 2 === 0) {
        let marioSprite = MARIO_STAND;
        if (!m.isGrounded) {
          marioSprite = MARIO_JUMP;
        } else if (m.frame === 0) {
          marioSprite = MARIO_RUN_1;
        } else if (m.frame === 1) {
          marioSprite = MARIO_RUN_2;
        } else {
          marioSprite = MARIO_RUN_3;
        }
        drawPixelMatrix(ctx, marioSprite, m.x, m.y, px, pixelColor);
      }

      // 11. Floating 1-Bit Scores
      ctx.fillStyle = pixelColor;
      ctx.font = 'bold 10px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textBaseline = 'bottom';
      s.floatingTexts.forEach((ft) => {
        ctx.fillText(ft.text, Math.floor(ft.x), Math.floor(ft.y));
      });

      // 12. Retro LCD HUD
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.82)' : 'rgba(15, 23, 42, 0.85)';
      ctx.font = 'bold 10px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textBaseline = 'top';
      ctx.letterSpacing = '0.05em';
      const scoreStr = String(s.score).padStart(6, '0');
      const hudText = `MARIO ${scoreStr}   COIN x${String(s.coins).padStart(2, '0')}   WORLD 1-1`;
      ctx.fillText(hudText, 14, 10);
    };

    startLoop();

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isDark, triggerJump]);

  const handleCanvasClick = () => {
    triggerJump();
  };

  const handleKeyDown = (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === ' ') {
      e.preventDefault();
      triggerJump();
    }
  };

  return (
    <div
      ref={containerRef}
      className="corner-pixel-mario-runner"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCanvasClick}
      role="region"
      aria-label="1-Bit Dot-Matrix Super Mario Bros Runner"
      title="1-Bit Mario · Click or press Space to jump!"
    >
      <canvas ref={canvasRef} className="corner-pixel-canvas" />

      {/* Floating Retro Controls: Sound Toggle & Jump Button */}
      <div className="corner-mario-controls">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleSound();
          }}
          className="mario-sound-btn"
          title={isAudioEnabled ? 'Mute 8-Bit NES Audio' : 'Unmute 8-Bit NES Audio'}
          aria-label="Toggle retro audio"
        >
          {isAudioEnabled ? (
            <Volume2 size={12} strokeWidth={2.4} aria-hidden="true" />
          ) : (
            <VolumeX size={12} strokeWidth={2.4} aria-hidden="true" />
          )}
          <span>{isAudioEnabled ? '8-BIT' : 'MUTE'}</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerJump();
          }}
          className="mario-ctrl-btn"
          title="Jump (Space / Click)"
          aria-label="Jump Mario"
        >
          <ArrowUp size={12} strokeWidth={2.5} aria-hidden="true" />
          <span>JUMP</span>
        </button>

        {isHovered && (
          <span className="corner-mario-hint">[SPACE / CLICK]</span>
        )}
      </div>
    </div>
  );
}
