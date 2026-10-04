import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * PixelMarioRunner
 * Large-format 1-bit dot-matrix Mario runner stuck to the window corner ("pencerenin köşesine yapışık").
 * Extended cinematic width ("biraz uzun"), no text headers ("şunları kaldır"), chunky 3px square pixels ("kare kare").
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
    width: 740,
    height: 120,
    pixelSize: 3, // Enlarged chunky 3px square pixels
    groundY: 96,
    mario: {
      x: 42,
      y: 54, // groundY - (14 * 3) = 96 - 42 = 54
      vy: 0,
      isGrounded: true,
      frame: 0,
      animTimer: 0,
      isBlinking: 0,
    },
    obstacles: [],
    clouds: [
      { x: 30, y: 12, speed: 0.18 },
      { x: 260, y: 18, speed: 0.25 },
      { x: 480, y: 8, speed: 0.15 },
      { x: 670, y: 16, speed: 0.22 },
    ],
    floatingTexts: [],
    spawnTimer: 45,
    distanceTraveled: 0,
    isTabActive: true,
    isIntersecting: true,
  });

  const triggerJump = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    const m = s.mario;

    if (m.isGrounded) {
      m.vy = -6.0;
      m.isGrounded = false;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId = null;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.floor(rect.width || 740);
      const h = 120;
      const dpr = window.devicePixelRatio || 1;

      stateRef.current.width = w;
      stateRef.current.height = h;
      stateRef.current.groundY = 96;
      if (stateRef.current.mario.isGrounded) {
        stateRef.current.mario.y = stateRef.current.groundY - 42;
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

    // Initial Obstacles spread across the long track
    stateRef.current.obstacles = [
      { id: 1, type: 'pipe', x: 200, y: 96 - 26, height: 26 },
      { id: 2, type: 'block', x: 330, y: 32, hit: false, bumpY: 0 },
      { id: 3, type: 'coin', x: 410, y: 38, collected: false },
      { id: 4, type: 'goomba', x: 530, y: 96 - 24, squished: 0 },
      { id: 5, type: 'pipe', x: 690, y: 96 - 26, height: 26 },
    ];

    let lastTick = performance.now();

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
      const speed = 2.1 * dt;
      s.distanceTraveled += speed;

      // Clouds
      s.clouds.forEach((c) => {
        c.x -= c.speed * dt;
        if (c.x < -60) c.x = s.width + 30;
      });

      // Mario Physics
      const groundStandingY = s.groundY - 42;
      if (!m.isGrounded) {
        m.vy += 0.42 * dt;
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

      if (m.isBlinking > 0) {
        m.isBlinking -= dt;
      }

      // Procedural Spawning along long course
      s.spawnTimer -= dt;
      if (s.spawnTimer <= 0) {
        const lastObs = s.obstacles[s.obstacles.length - 1];
        const lastX = lastObs ? lastObs.x : 0;
        if (lastX < s.width + 40) {
          const spawnX = Math.max(lastX + 130 + Math.random() * 80, s.width + 20);
          const rand = Math.random();

          if (rand < 0.35) {
            // Pipe
            s.obstacles.push({
              id: Date.now() + Math.random(),
              type: 'pipe',
              x: spawnX,
              y: s.groundY - 26,
              height: 26,
            });
          } else if (rand < 0.65) {
            // Goomba
            s.obstacles.push({
              id: Date.now() + Math.random(),
              type: 'goomba',
              x: spawnX,
              y: s.groundY - 24,
              squished: 0,
            });
          } else if (rand < 0.85) {
            // Question block
            s.obstacles.push({
              id: Date.now() + Math.random(),
              type: 'block',
              x: spawnX,
              y: 32,
              hit: false,
              bumpY: 0,
            });
          } else {
            // Floating coin
            s.obstacles.push({
              id: Date.now() + Math.random(),
              type: 'coin',
              x: spawnX,
              y: 38,
              collected: false,
            });
          }
          s.spawnTimer = 45 + Math.random() * 30;
        }
      }

      // Autonomous AI Jump Logic: Find the nearest oncoming threat
      let nextThreat = null;
      let minThreatDist = Infinity;

      for (let i = 0; i < s.obstacles.length; i++) {
        const obs = s.obstacles[i];
        const dist = obs.x - m.x;

        if (dist > 10 && dist < minThreatDist) {
          if (obs.type === 'pipe' || (obs.type === 'goomba' && obs.squished <= 0)) {
            minThreatDist = dist;
            nextThreat = obs;
          } else if (obs.type === 'block' && !obs.hit) {
            if (dist < 40) {
              minThreatDist = dist;
              nextThreat = obs;
            }
          }
        }
      }

      if (nextThreat && m.isGrounded) {
        if (nextThreat.type === 'pipe' || nextThreat.type === 'goomba') {
          if (minThreatDist > 18 && minThreatDist < 62) {
            triggerJump();
          }
        } else if (nextThreat.type === 'block' && !nextThreat.hit) {
          if (minThreatDist > 14 && minThreatDist < 42) {
            triggerJump();
          }
        }
      }

      // Obstacles update & collisions
      for (let i = s.obstacles.length - 1; i >= 0; i--) {
        const obs = s.obstacles[i];
        obs.x -= speed;

        if (obs.type === 'goomba' && obs.squished <= 0) {
          obs.x -= 0.35 * dt;
        }

        if (obs.type === 'block' && obs.bumpY < 0) {
          obs.bumpY += 0.5 * dt;
          if (obs.bumpY > 0) obs.bumpY = 0;
        }

        const dx = Math.abs((obs.x + 12) - (m.x + 18));

        // Coin
        if (obs.type === 'coin' && !obs.collected && dx < 20) {
          const dy = Math.abs(obs.y - (m.y + 14));
          if (dy < 24) {
            obs.collected = true;
            s.floatingTexts.push({
              x: obs.x,
              y: obs.y - 6,
              text: '+100',
              life: 25,
            });
          }
        }
        // Question Block
        else if (obs.type === 'block' && !obs.hit && dx < 20) {
          if (m.vy < 0 && Math.abs(m.y - (obs.y + 28)) < 10) {
            obs.hit = true;
            obs.bumpY = -5;
            s.floatingTexts.push({
              x: obs.x,
              y: obs.y - 12,
              text: '★ +200',
              life: 30,
            });
          }
        }
        // Goomba Stomp
        else if (obs.type === 'goomba' && obs.squished <= 0 && dx < 20) {
          if (m.vy > 0 && m.y < groundStandingY - 6) {
            obs.squished = 24;
            m.vy = -4.5;
            s.floatingTexts.push({
              x: obs.x,
              y: obs.y - 8,
              text: '+200',
              life: 25,
            });
          } else if (m.isBlinking <= 0) {
            m.isBlinking = 35;
            m.vy = -3;
          }
        }
        // Pipe
        else if (obs.type === 'pipe' && dx < 18) {
          if (m.y > s.groundY - (obs.height + 36) && m.isBlinking <= 0) {
            m.isBlinking = 30;
            m.vy = -3;
          }
        }

        if (obs.x < -60) {
          s.obstacles.splice(i, 1);
        }
      }

      for (let i = s.floatingTexts.length - 1; i >= 0; i--) {
        const ft = s.floatingTexts[i];
        ft.y -= 0.6 * dt;
        ft.life -= dt;
        if (ft.life <= 0) s.floatingTexts.splice(i, 1);
      }

      // ── RENDER FRAME: SEAMLESS DOT-MATRIX / CHUNKY SQUARE PIXELS ──
      ctx.clearRect(0, 0, s.width, s.height);

      const px = s.pixelSize; // 3px chunky square blocks
      const pixelColor = isDark ? '#ffffff' : '#090d16';
      const matrixDotColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';
      const cloudColor = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(15, 23, 42, 0.22)';

      // 1. Subtle Dot-Matrix Background ("nokta nokta")
      ctx.fillStyle = matrixDotColor;
      for (let x = 0; x < s.width; x += 8) {
        for (let y = 0; y < s.height; y += 8) {
          ctx.fillRect(x, y, 2, 2);
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
            drawPixelMatrix(ctx, GOOMBA_SQUISHED, obs.x, obs.y + 8, px, pixelColor);
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
        ctx.font = 'bold 11px ui-monospace, monospace';
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
  }, [isDark, triggerJump]);

  const handleCanvasClick = () => {
    triggerJump();
  };

  const handleKeyDown = (e) => {
    if (e.code === 'Space') {
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
      aria-label="Corner 1-Bit Dot-Matrix Mario Runner"
      title="1-bit Mario · Click or press Space to jump!"
    >
      <canvas ref={canvasRef} className="corner-pixel-canvas" />
      {isHovered && (
        <span className="corner-mario-hint">[SPACE / CLICK TO JUMP]</span>
      )}
    </div>
  );
}
