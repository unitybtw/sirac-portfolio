import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * PixelMarioRunner
 * 1-bit monochrome Mario auto-runner seamlessly integrated with the site ("siteyle bir").
 * Background has a subtle dot-matrix grid ("nokta nokta").
 * All sprites & obstacles are rendered as chunky square pixels ("kare kare").
 * In Light Mode: Solid black square pixels on the site background.
 * In Dark Mode: Solid white square pixels on the site background.
 * Autonomous AI pilot with interactive click / space jump.
 * 0% CPU consumption off-screen via IntersectionObserver.
 */

// ── 1-Bit Pixel Matrices (Every '#' is a square pixel block) ──
const MARIO_STAND = [
  '..#####.....',
  '.#########..',
  '.###..#.....',
  '#.###...#...',
  '#.####...#..',
  '##....####..',
  '....#####...',
  '...######...',
  '..########..',
  '.##########.',
  '.##.####.##.',
  '...######...',
  '..###..###..',
  '.####..####.',
];

const MARIO_RUN_1 = [
  '..#####.....',
  '.#########..',
  '.###..#.....',
  '#.###...#...',
  '#.####...#..',
  '##....####..',
  '....#####...',
  '...######...',
  '..########..',
  '.##########.',
  '.##.####.##.',
  '...######...',
  '....####....',
  '..####.###..',
];

const MARIO_RUN_2 = [
  '..#####.....',
  '.#########..',
  '.###..#.....',
  '#.###...#...',
  '#.####...#..',
  '##....####..',
  '....#####...',
  '...######...',
  '..########..',
  '.##########.',
  '.##.####.##.',
  '...######...',
  '...####.....',
  '.####.......',
];

const MARIO_JUMP = [
  '.....#####..',
  '....########',
  '....###..#..',
  '...#.###...#',
  '...#.####...#',
  '...##....###',
  '......#####.',
  '..#######...',
  '.#########..',
  '###########.',
  '...######...',
  '..########..',
  '.###....###.',
  '............',
];

const GOOMBA_WALK_1 = [
  '....####....',
  '..########..',
  '.##########.',
  '.##..##..##.',
  '.##..##..##.',
  '.##########.',
  '..########..',
  '...######...',
  '..###..###..',
  '.####...##..',
];

const GOOMBA_WALK_2 = [
  '....####....',
  '..########..',
  '.##########.',
  '.##..##..##.',
  '.##..##..##.',
  '.##########.',
  '..########..',
  '...######...',
  '..###..###..',
  '..##...####.',
];

const GOOMBA_SQUISHED = [
  '............',
  '............',
  '............',
  '............',
  '..########..',
  '.##########.',
  '.##..##..##.',
  '############',
  '############',
  '..########..',
];

const BLOCK_QUESTION = [
  '##########',
  '#........#',
  '#..####..#',
  '#....##..#',
  '#...##...#',
  '#...##...#',
  '#........#',
  '#...##...#',
  '#........#',
  '##########',
];

const BLOCK_HIT = [
  '##########',
  '#........#',
  '#..#..#..#',
  '#........#',
  '#........#',
  '#........#',
  '#..#..#..#',
  '#........#',
  '#........#',
  '##########',
];

const PIPE_LIP = [
  '############',
  '#..........#',
  '#..######..#',
  '############',
];

const PIPE_BODY = [
  '.##########.',
  '.#........#.',
  '.#..####..#.',
  '.##########.',
];

const COIN_1 = [
  '..####..',
  '.######.',
  '##.##.##',
  '##.##.##',
  '##.##.##',
  '##.##.##',
  '.######.',
  '..####..',
];

const COIN_2 = [
  '...##...',
  '..####..',
  '..####..',
  '..####..',
  '..####..',
  '..####..',
  '..####..',
  '...##...',
];

const CLOUD = [
  '....####....',
  '..########..',
  '.##########.',
  '############',
  '############',
  '.##########.',
];

// Helper to draw square pixels ("kare kare")
function drawPixelMatrix(ctx, matrix, startX, startY, pixelSize, color) {
  ctx.fillStyle = color;
  const rows = matrix.length;
  for (let r = 0; r < rows; r++) {
    const row = matrix[r];
    const cols = row.length;
    for (let c = 0; c < cols; c++) {
      if (row[c] === '#') {
        ctx.fillRect(
          Math.floor(startX + c * pixelSize),
          Math.floor(startY + r * pixelSize),
          pixelSize,
          pixelSize
        );
      }
    }
  }
}

export default function PixelMarioRunner({ theme }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isAutopilot, setIsAutopilot] = useState(true);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [aiStatus, setAiStatus] = useState('AUTO');
  const [isHovered, setIsHovered] = useState(false);

  // Reliable Dark/Light detection based on props and DOM class
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

  const stateRef = useRef({
    width: 340,
    height: 76,
    pixelSize: 2,
    groundY: 60,
    mario: {
      x: 36,
      y: 32, // groundY - 28
      vy: 0,
      isGrounded: true,
      frame: 0,
      animTimer: 0,
      isBlinking: 0,
      jumpOverrideTimer: 0,
    },
    obstacles: [],
    clouds: [
      { x: 25, y: 8, speed: 0.18 },
      { x: 160, y: 12, speed: 0.25 },
      { x: 290, y: 6, speed: 0.15 },
    ],
    floatingTexts: [],
    spawnTimer: 40,
    distanceTraveled: 0,
    isTabActive: true,
    isIntersecting: true,
    score: 0,
    coins: 0,
  });

  const triggerJump = useCallback((isManual = false) => {
    const s = stateRef.current;
    if (!s) return;
    const m = s.mario;

    if (m.isGrounded) {
      m.vy = -4.7;
      m.isGrounded = false;
      if (isManual) {
        m.jumpOverrideTimer = 65;
        setAiStatus('JUMP');
      }
    }
  }, []);

  const toggleAutopilot = (e) => {
    e.stopPropagation();
    setIsAutopilot((prev) => {
      const next = !prev;
      setAiStatus(next ? 'AUTO' : 'MANUAL');
      return next;
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId = null;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.floor(rect.width || 340);
      const h = 76;
      const dpr = window.devicePixelRatio || 1;

      stateRef.current.width = w;
      stateRef.current.height = h;
      stateRef.current.groundY = 58;
      if (stateRef.current.mario.isGrounded) {
        stateRef.current.mario.y = stateRef.current.groundY - 28;
      }

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        stateRef.current.isIntersecting = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    const handleVisibilityChange = () => {
      stateRef.current.isTabActive = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial Obstacles
    stateRef.current.obstacles = [
      { id: 1, type: 'block', x: 130, y: 18, hit: false, bumpY: 0 },
      { id: 2, type: 'coin', x: 190, y: 22, collected: false },
      { id: 3, type: 'goomba', x: 260, y: 58 - 16, squished: 0 },
      { id: 4, type: 'pipe', x: 360, y: 58 - 16, height: 16 },
    ];

    let lastTick = performance.now();
    let syncTimer = 0;

    const gameLoop = (timestamp) => {
      animationFrameId = requestAnimationFrame(gameLoop);

      const s = stateRef.current;
      if (!s.isIntersecting || !s.isTabActive) {
        lastTick = timestamp;
        return;
      }

      const dt = Math.min((timestamp - lastTick) / 16.667, 2.2);
      lastTick = timestamp;

      const m = s.mario;
      const speed = 1.75 * dt;
      s.distanceTraveled += speed;

      // Clouds
      s.clouds.forEach((c) => {
        c.x -= c.speed * dt;
        if (c.x < -36) c.x = s.width + 20;
      });

      // Mario Physics
      const groundStandingY = s.groundY - 28;
      if (!m.isGrounded) {
        m.vy += 0.38 * dt;
        m.y += m.vy * dt;

        if (m.y >= groundStandingY) {
          m.y = groundStandingY;
          m.vy = 0;
          m.isGrounded = true;
        }
      }

      // Animation cycle
      m.animTimer += dt;
      if (m.animTimer > 7) {
        m.frame = (m.frame + 1) % 2;
        m.animTimer = 0;
      }

      if (m.jumpOverrideTimer > 0) {
        m.jumpOverrideTimer -= dt;
        if (m.jumpOverrideTimer <= 0 && isAutopilot) {
          setAiStatus('AUTO');
        }
      }

      if (m.isBlinking > 0) {
        m.isBlinking -= dt;
      }

      // Procedural Spawning
      s.spawnTimer -= dt;
      if (s.spawnTimer <= 0) {
        const lastObs = s.obstacles[s.obstacles.length - 1];
        const lastX = lastObs ? lastObs.x : 0;
        if (lastX < s.width + 30) {
          const spawnX = Math.max(lastX + 95 + Math.random() * 65, s.width + 10);
          const rand = Math.random();

          if (rand < 0.35) {
            // Pipe
            s.obstacles.push({
              id: Date.now() + Math.random(),
              type: 'pipe',
              x: spawnX,
              y: s.groundY - 16,
              height: 16,
            });
          } else if (rand < 0.65) {
            // Goomba
            s.obstacles.push({
              id: Date.now() + Math.random(),
              type: 'goomba',
              x: spawnX,
              y: s.groundY - 16,
              squished: 0,
            });
          } else if (rand < 0.85) {
            // Question block
            s.obstacles.push({
              id: Date.now() + Math.random(),
              type: 'block',
              x: spawnX,
              y: 20,
              hit: false,
              bumpY: 0,
            });
          } else {
            // Floating coin
            s.obstacles.push({
              id: Date.now() + Math.random(),
              type: 'coin',
              x: spawnX,
              y: 26,
              collected: false,
            });
          }
          s.spawnTimer = 40 + Math.random() * 25;
        }
      }

      // Autonomous AI Jump Logic
      if (isAutopilot && m.jumpOverrideTimer <= 0) {
        for (let i = 0; i < s.obstacles.length; i++) {
          const obs = s.obstacles[i];
          const dist = obs.x - m.x;

          if (obs.type === 'pipe' || (obs.type === 'goomba' && obs.squished <= 0)) {
            if (dist > 14 && dist < 42 && m.isGrounded) {
              triggerJump(false);
              break;
            }
          } else if (obs.type === 'block' && !obs.hit) {
            if (dist > 10 && dist < 30 && m.isGrounded) {
              triggerJump(false);
              break;
            }
          }
        }
      }

      // Obstacles update & collisions
      for (let i = s.obstacles.length - 1; i >= 0; i--) {
        const obs = s.obstacles[i];
        obs.x -= speed;

        if (obs.type === 'goomba' && obs.squished <= 0) {
          obs.x -= 0.3 * dt;
        }

        if (obs.type === 'block' && obs.bumpY < 0) {
          obs.bumpY += 0.4 * dt;
          if (obs.bumpY > 0) obs.bumpY = 0;
        }

        const dx = Math.abs((obs.x + 8) - (m.x + 12));

        // Coin
        if (obs.type === 'coin' && !obs.collected && dx < 14) {
          const dy = Math.abs(obs.y - (m.y + 10));
          if (dy < 16) {
            obs.collected = true;
            s.coins += 1;
            s.score += 100;
            s.floatingTexts.push({
              x: obs.x,
              y: obs.y - 4,
              text: '+100',
              life: 25,
            });
          }
        }
        // Question Block
        else if (obs.type === 'block' && !obs.hit && dx < 14) {
          if (m.vy < 0 && Math.abs(m.y - (obs.y + 20)) < 6) {
            obs.hit = true;
            obs.bumpY = -4;
            s.coins += 1;
            s.score += 200;
            s.floatingTexts.push({
              x: obs.x,
              y: obs.y - 8,
              text: '+200',
              life: 30,
            });
          }
        }
        // Goomba
        else if (obs.type === 'goomba' && obs.squished <= 0 && dx < 14) {
          if (m.vy > 0 && m.y < groundStandingY - 4) {
            obs.squished = 20;
            m.vy = -3.5;
            s.score += 200;
            s.floatingTexts.push({
              x: obs.x,
              y: obs.y - 6,
              text: '+200',
              life: 25,
            });
          } else if (m.isBlinking <= 0) {
            m.isBlinking = 35;
            m.vy = -2.5;
            s.floatingTexts.push({
              x: m.x,
              y: m.y - 8,
              text: '!HIT',
              life: 20,
            });
          }
        }
        // Pipe
        else if (obs.type === 'pipe' && dx < 12) {
          if (m.y > s.groundY - (obs.height + 24) && m.isBlinking <= 0) {
            m.isBlinking = 30;
            m.vy = -2.5;
          }
        }

        if (obs.x < -40) {
          s.obstacles.splice(i, 1);
        }
      }

      s.score += Math.floor(0.12 * dt * 10);

      syncTimer += dt;
      if (syncTimer > 15) {
        setScore(s.score);
        setCoins(s.coins);
        syncTimer = 0;
      }

      for (let i = s.floatingTexts.length - 1; i >= 0; i--) {
        const ft = s.floatingTexts[i];
        ft.y -= 0.45 * dt;
        ft.life -= dt;
        if (ft.life <= 0) s.floatingTexts.splice(i, 1);
      }

      // ── RENDER FRAME: SEAMLESS DOT-MATRIX / SQUARE-PIXEL ENGINE ──
      ctx.clearRect(0, 0, s.width, s.height);

      const px = s.pixelSize; // 2px square blocks
      // Determine contrast colors: Black in Light Mode, White in Dark Mode
      const pixelColor = isDark ? '#ffffff' : '#090d16';
      const matrixDotColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';
      const cloudColor = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(15, 23, 42, 0.22)';

      // 1. Subtle Dot-Matrix Background ("nokta nokta")
      ctx.fillStyle = matrixDotColor;
      for (let x = 0; x < s.width; x += 6) {
        for (let y = 0; y < s.height; y += 6) {
          ctx.fillRect(x, y, 1.5, 1.5);
        }
      }

      // 2. Clouds (1-bit pixel blocks)
      s.clouds.forEach((c) => {
        drawPixelMatrix(ctx, CLOUD, c.x, c.y, px, cloudColor);
      });

      // 3. Ground (Line of square blocks + 1-bit dithered squares underneath)
      ctx.fillStyle = pixelColor;
      ctx.fillRect(0, s.groundY, s.width, px);

      const ditherOffset = Math.floor(s.distanceTraveled) % (px * 4);
      for (let x = -px * 4; x < s.width + px * 4; x += px * 2) {
        for (let y = s.groundY + px * 2; y < s.height; y += px * 2) {
          if (((x + y + ditherOffset) / (px * 2)) % 2 === 0) {
            ctx.fillRect(x, y, px, px);
          }
        }
      }

      // 4. Obstacles (Square pixel art)
      s.obstacles.forEach((obs) => {
        if (obs.type === 'pipe') {
          drawPixelMatrix(ctx, PIPE_LIP, obs.x, obs.y, px, pixelColor);
          for (let y = obs.y + 4 * px; y < s.groundY; y += 4 * px) {
            drawPixelMatrix(ctx, PIPE_BODY, obs.x, y, px, pixelColor);
          }
        } else if (obs.type === 'block') {
          const matrix = obs.hit ? BLOCK_HIT : BLOCK_QUESTION;
          drawPixelMatrix(ctx, matrix, obs.x, obs.y + obs.bumpY, px, pixelColor);
        } else if (obs.type === 'coin' && !obs.collected) {
          const frame = Math.floor(s.distanceTraveled / 6) % 2 === 0 ? COIN_1 : COIN_2;
          drawPixelMatrix(ctx, frame, obs.x, obs.y, px, pixelColor);
        } else if (obs.type === 'goomba') {
          if (obs.squished > 0) {
            obs.squished -= dt;
            drawPixelMatrix(ctx, GOOMBA_SQUISHED, obs.x, obs.y + 6, px, pixelColor);
          } else {
            const frame = Math.floor(s.distanceTraveled / 4) % 2 === 0 ? GOOMBA_WALK_1 : GOOMBA_WALK_2;
            drawPixelMatrix(ctx, frame, obs.x, obs.y, px, pixelColor);
          }
        }
      });

      // 5. Mario (Square pixel runner animation)
      if (m.isBlinking <= 0 || Math.floor(m.isBlinking / 4) % 2 === 0) {
        let marioMatrix = MARIO_STAND;
        if (!m.isGrounded) {
          marioMatrix = MARIO_JUMP;
        } else if (m.frame === 0) {
          marioMatrix = MARIO_RUN_1;
        } else {
          marioMatrix = MARIO_RUN_2;
        }
        drawPixelMatrix(ctx, marioMatrix, m.x, m.y, px, pixelColor);
      }

      // 6. Floating pixel scores
      s.floatingTexts.forEach((ft) => {
        ctx.fillStyle = pixelColor;
        ctx.font = 'bold 9px ui-monospace, monospace';
        ctx.fillText(ft.text, ft.x, ft.y);
      });
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAutopilot, isDark, triggerJump]);

  const handleCanvasClick = () => {
    triggerJump(true);
  };

  const handleKeyDown = (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      triggerJump(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className="seamless-pixel-mario-runner"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label="Seamless 1-Bit Dot-Matrix Mario Runner"
      title="1-bit Mario · Click or press Space to jump!"
    >
      {/* ── Frameless Minimalist HUD ── */}
      <div className="seamless-pixel-mario-hud">
        <div className="seamless-hud-left">
          <span className="seamless-pixel-square">■</span>
          <span className="seamless-hud-title">MARIO.RUN</span>
        </div>

        <div className="seamless-hud-center">
          <span className="seamless-hud-stat">★ {String(score).padStart(5, '0')}</span>
          <span className="seamless-hud-stat">⛃ ×{String(coins).padStart(2, '0')}</span>
        </div>

        <div className="seamless-hud-right">
          <button
            type="button"
            className={`seamless-hud-badge ${isAutopilot ? 'auto' : 'manual'}`}
            onClick={toggleAutopilot}
            title={isAutopilot ? 'Toggle to Manual Jump' : 'Resume Autopilot'}
          >
            <span className="seamless-badge-square">■</span>
            <span>{aiStatus}</span>
          </button>
        </div>
      </div>

      {/* ── Seamless Dot-Matrix Viewport & Canvas ── */}
      <div className="seamless-pixel-viewport" onClick={handleCanvasClick}>
        <canvas ref={canvasRef} className="seamless-pixel-canvas" />
        {isHovered && (
          <span className="seamless-hover-hint">[CLICK / SPACE TO JUMP]</span>
        )}
      </div>
    </div>
  );
}
