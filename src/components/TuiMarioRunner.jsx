import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * TuiMarioRunner
 * Minimal autonomous Mario-style runner with a retro Terminal User Interface (TUI) / ASCII aesthetic.
 * Runs 100% self-playing (autonomous AI loop), with optional interactive click/space override.
 * Automatically pauses off-screen via IntersectionObserver for 0% CPU consumption.
 */
export default function TuiMarioRunner() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isAutopilot, setIsAutopilot] = useState(true);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [aiStatus, setAiStatus] = useState('AUTORUN');
  const [isHovered, setIsHovered] = useState(false);

  // Mutable game state held in ref to avoid re-renders on 60fps game ticks
  const stateRef = useRef({
    score: 0,
    coins: 0,
    width: 370,
    height: 88,
    groundY: 68,
    mario: {
      x: 42,
      y: 68,
      vy: 0,
      isGrounded: true,
      frame: 0,
      animTimer: 0,
      isBlinking: 0,
      jumpOverrideTimer: 0,
    },
    obstacles: [],
    clouds: [
      { x: 30, y: 12, speed: 0.22, text: '(  ..  )' },
      { x: 180, y: 18, speed: 0.32, text: '(   .   )' },
      { x: 310, y: 10, speed: 0.18, text: '( ... )' },
    ],
    floatingTexts: [],
    spawnTimer: 35,
    distanceTraveled: 0,
    isRunning: true,
    isTabActive: true,
    isIntersecting: true,
  });

  // Jump trigger (works for both AI and user manual click/space)
  const triggerJump = useCallback((isManual = false) => {
    const s = stateRef.current;
    if (!s) return;
    const m = s.mario;

    if (m.isGrounded) {
      m.vy = -5.4;
      m.isGrounded = false;
      if (isManual) {
        m.jumpOverrideTimer = 70; // temporary override notification
        setAiStatus('OVERRIDE');
      }
    }
  }, []);

  // Toggle between pure Autopilot AI and full Manual mode
  const toggleAutopilot = (e) => {
    e.stopPropagation();
    setIsAutopilot((prev) => {
      const next = !prev;
      setAiStatus(next ? 'AUTORUN' : 'MANUAL');
      return next;
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId = null;

    // Handle high-DPR crisp rendering
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.floor(rect.width || 370);
      const h = 88;
      const dpr = window.devicePixelRatio || 1;

      stateRef.current.width = w;
      stateRef.current.height = h;
      stateRef.current.groundY = h - 20;
      if (stateRef.current.mario.isGrounded) {
        stateRef.current.mario.y = stateRef.current.groundY;
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

    // Pause when hero section is scrolled out of view (0% CPU impact)
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        stateRef.current.isIntersecting = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Pause when browser tab is inactive
    const handleVisibilityChange = () => {
      stateRef.current.isTabActive = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Seed initial obstacles so game starts smoothly populated
    stateRef.current.obstacles = [
      { id: 1, type: 'block', x: 150, y: 28, hit: false, bumpY: 0 },
      { id: 2, type: 'coin', x: 210, y: 32, collected: false },
      { id: 3, type: 'goomba', x: 280, y: stateRef.current.groundY, squished: 0 },
      { id: 4, type: 'pipe', x: 380, y: stateRef.current.groundY, height: 20 },
    ];

    let lastTick = performance.now();
    let scoreSyncTimer = 0;

    // Main Game Loop
    const gameLoop = (timestamp) => {
      animationFrameId = requestAnimationFrame(gameLoop);

      const s = stateRef.current;
      if (!s.isIntersecting || !s.isTabActive) {
        lastTick = timestamp;
        return;
      }

      // Delta time normalization
      const dt = Math.min((timestamp - lastTick) / 16.667, 2.2);
      lastTick = timestamp;

      const m = s.mario;
      const speed = 1.85 * dt;
      s.distanceTraveled += speed;

      // ── 1. UPDATE CLOUDS ──
      s.clouds.forEach((c) => {
        c.x -= c.speed * dt;
        if (c.x < -60) c.x = s.width + 30;
      });

      // ── 2. MARIO PHYSICS ──
      if (!m.isGrounded) {
        m.vy += 0.40 * dt; // gravity
        m.y += m.vy * dt;

        if (m.y >= s.groundY) {
          m.y = s.groundY;
          m.vy = 0;
          m.isGrounded = true;
        }
      }

      // Running animation timer
      m.animTimer += dt;
      if (m.animTimer > 7) {
        m.frame = (m.frame + 1) % 2;
        m.animTimer = 0;
      }

      // Override timer tick down
      if (m.jumpOverrideTimer > 0) {
        m.jumpOverrideTimer -= dt;
        if (m.jumpOverrideTimer <= 0 && isAutopilot) {
          setAiStatus('AUTORUN');
        }
      }

      // Blinking timer for hit recovery
      if (m.isBlinking > 0) {
        m.isBlinking -= dt;
      }

      // ── 3. PROCEDURAL OBSTACLE SPAWNING ──
      s.spawnTimer -= dt;
      if (s.spawnTimer <= 0) {
        const lastObs = s.obstacles[s.obstacles.length - 1];
        const lastX = lastObs ? lastObs.x : 0;
        if (lastX < s.width + 30) {
          const spawnX = Math.max(lastX + 115 + Math.random() * 70, s.width + 15);
          const rand = Math.random();

          if (rand < 0.32) {
            // Spawn pipe
            s.obstacles.push({
              id: Date.now() + Math.random(),
              type: 'pipe',
              x: spawnX,
              y: s.groundY,
              height: Math.random() > 0.5 ? 20 : 26,
            });
          } else if (rand < 0.62) {
            // Spawn goomba
            s.obstacles.push({
              id: Date.now() + Math.random(),
              type: 'goomba',
              x: spawnX,
              y: s.groundY,
              squished: 0,
            });
          } else if (rand < 0.82) {
            // Spawn question block
            s.obstacles.push({
              id: Date.now() + Math.random(),
              type: 'block',
              x: spawnX,
              y: 28,
              hit: false,
              bumpY: 0,
            });
          } else {
            // Spawn floating coin
            s.obstacles.push({
              id: Date.now() + Math.random(),
              type: 'coin',
              x: spawnX,
              y: 32,
              collected: false,
            });
          }
          s.spawnTimer = 45 + Math.random() * 30;
        }
      }

      // ── 4. AUTONOMOUS AI PILOT LOGIC ──
      if (isAutopilot && m.jumpOverrideTimer <= 0) {
        for (let i = 0; i < s.obstacles.length; i++) {
          const obs = s.obstacles[i];
          const dist = obs.x - m.x;

          if (obs.type === 'pipe' || (obs.type === 'goomba' && obs.squished <= 0)) {
            // Jump if obstacle is in strike zone
            if (dist > 18 && dist < 48 && m.isGrounded) {
              triggerJump(false);
              break;
            }
          } else if (obs.type === 'block' && !obs.hit) {
            // Jump to hit block if within sweet spot
            if (dist > 16 && dist < 36 && m.isGrounded) {
              triggerJump(false);
              break;
            }
          }
        }
      }

      // ── 5. UPDATE OBSTACLES & DETECT COLLISIONS ──
      for (let i = s.obstacles.length - 1; i >= 0; i--) {
        const obs = s.obstacles[i];
        obs.x -= speed;

        // Goombas walk left slightly faster
        if (obs.type === 'goomba' && obs.squished <= 0) {
          obs.x -= 0.35 * dt;
        }

        // Question block bump animation
        if (obs.type === 'block' && obs.bumpY < 0) {
          obs.bumpY += 0.45 * dt;
          if (obs.bumpY > 0) obs.bumpY = 0;
        }

        const dx = Math.abs((obs.x + 6) - (m.x + 8));

        // Floating Coin Collision
        if (obs.type === 'coin' && !obs.collected && dx < 14) {
          const dy = Math.abs(obs.y - (m.y - 10));
          if (dy < 16) {
            obs.collected = true;
            s.coins += 1;
            s.score += 100;
            s.floatingTexts.push({
              x: obs.x,
              y: obs.y - 6,
              text: '+100',
              color: '#facc15',
              life: 25,
            });
          }
        }
        // Question Block Hit
        else if (obs.type === 'block' && !obs.hit && dx < 14) {
          if (m.vy < 0 && Math.abs((m.y - 20) - (obs.y + 10)) < 8) {
            obs.hit = true;
            obs.bumpY = -4;
            s.coins += 1;
            s.score += 200;
            s.floatingTexts.push({
              x: obs.x - 2,
              y: obs.y - 10,
              text: '★ +200',
              color: '#fbbf24',
              life: 30,
            });
          }
        }
        // Goomba Stomp / Collision
        else if (obs.type === 'goomba' && obs.squished <= 0 && dx < 14) {
          if (m.vy > 0 && m.y < s.groundY - 4) {
            obs.squished = 20;
            m.vy = -3.8; // little bounce
            s.score += 200;
            s.floatingTexts.push({
              x: obs.x,
              y: obs.y - 8,
              text: '+200',
              color: '#4ade80',
              life: 25,
            });
          } else if (m.isBlinking <= 0) {
            m.isBlinking = 40;
            m.vy = -2.8;
            s.floatingTexts.push({
              x: m.x,
              y: m.y - 12,
              text: '!OUCH',
              color: '#f87171',
              life: 20,
            });
          }
        }
        // Pipe Collision
        else if (obs.type === 'pipe' && dx < 12) {
          if (m.y > s.groundY - (obs.height - 4) && m.isBlinking <= 0) {
            m.isBlinking = 35;
            m.vy = -3;
          }
        }

        // Cleanup offscreen obstacles
        if (obs.x < -50) {
          s.obstacles.splice(i, 1);
        }
      }

      // Passive score increment as Mario runs
      s.score += Math.floor(0.12 * dt * 10);

      // Sync score & coins to React UI state
      scoreSyncTimer += dt;
      if (scoreSyncTimer > 15) {
        setScore(s.score);
        setCoins(s.coins);
        scoreSyncTimer = 0;
      }

      // ── 6. UPDATE FLOATING TEXTS ──
      for (let i = s.floatingTexts.length - 1; i >= 0; i--) {
        const ft = s.floatingTexts[i];
        ft.y -= 0.5 * dt;
        ft.life -= dt;
        if (ft.life <= 0) {
          s.floatingTexts.splice(i, 1);
        }
      }

      // ── 7. RENDER FRAME (TUI ASCII / RETRO CANVAS) ──
      ctx.clearRect(0, 0, s.width, s.height);

      ctx.font = 'bold 11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
      ctx.textBaseline = 'middle';

      // Floating clouds
      ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
      s.clouds.forEach((c) => {
        ctx.fillText(c.text, c.x, c.y);
      });

      // Ground (TUI block border & hatch)
      ctx.fillStyle = '#475569';
      const groundPattern = '════════════════════════════════════════════════════════════════════════════════';
      ctx.fillText(groundPattern, 0, s.groundY + 2);

      ctx.fillStyle = '#334155';
      const undergroundPattern = '▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░';
      ctx.fillText(undergroundPattern, -(s.distanceTraveled % 16), s.groundY + 11);

      // Obstacles
      s.obstacles.forEach((obs) => {
        if (obs.type === 'pipe') {
          // Retro green pipe
          ctx.fillStyle = '#22c55e';
          const pipeTop = obs.y - obs.height;
          ctx.fillText('┌───┐', obs.x - 2, pipeTop);
          for (let y = pipeTop + 8; y <= obs.y; y += 8) {
            ctx.fillText('│   │', obs.x - 2, y);
          }
        } else if (obs.type === 'block') {
          // Question block
          const blockY = obs.y + obs.bumpY;
          if (obs.hit) {
            ctx.fillStyle = '#64748b';
            ctx.fillText('[0]', obs.x, blockY);
          } else {
            ctx.fillStyle = '#f59e0b';
            ctx.fillText('[?]', obs.x, blockY);
          }
        } else if (obs.type === 'coin' && !obs.collected) {
          // Spinning gold coin
          ctx.fillStyle = '#eab308';
          const spinFrames = ['●', '⛃', '★', '◆'];
          const spin = spinFrames[Math.floor(s.distanceTraveled / 6) % spinFrames.length];
          ctx.fillText(spin, obs.x + 2, obs.y);
        } else if (obs.type === 'goomba') {
          // Goomba critter
          ctx.fillStyle = '#f97316';
          if (obs.squished > 0) {
            obs.squished -= dt;
            ctx.fillText('[__]', obs.x, obs.y);
          } else {
            const feet = Math.floor(s.distanceTraveled / 4) % 2 === 0 ? '/\\' : '\\/';
            ctx.fillText(' ▲ ', obs.x, obs.y - 8);
            ctx.fillText(`[oo]`, obs.x, obs.y);
            ctx.fillText(` ${feet} `, obs.x, obs.y + 6);
          }
        }
      });

      // Mario
      if (m.isBlinking <= 0 || Math.floor(m.isBlinking / 4) % 2 === 0) {
        const mx = m.x;
        const my = m.y;

        // Cap (Red)
        ctx.fillStyle = '#ef4444';
        ctx.fillText('▄██▄', mx + 1, my - 16);

        // Face
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('(o_o)', mx, my - 8);

        // Body [M]
        ctx.fillStyle = '#ef4444';
        ctx.fillText('[M]', mx + 3, my);

        // Running / Jumping legs
        ctx.fillStyle = '#38bdf8'; // Blue denim
        if (!m.isGrounded) {
          ctx.fillText(' / >', mx + 1, my + 6);
        } else if (m.frame === 0) {
          ctx.fillText(' / \\', mx + 1, my + 6);
        } else {
          ctx.fillText('  |\\', mx + 1, my + 6);
        }
      }

      // Floating Feedback Texts (e.g. +100, +200, OUCH)
      s.floatingTexts.forEach((ft) => {
        ctx.fillStyle = ft.color;
        ctx.font = 'bold 9px ui-monospace, SFMono-Regular, monospace';
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
  }, [isAutopilot, triggerJump]);

  // Click on canvas = jump!
  const handleCanvasClick = () => {
    triggerJump(true);
  };

  // Keyboard Space listener when focused or hovering
  const handleKeyDown = (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      triggerJump(true);
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="tui-mario-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="TUI Mario Autoplay Terminal"
      title="Click or press Space to jump! Autopilot AI active."
    >
      {/* ── TUI Window Chrome / Header ── */}
      <div className="tui-mario-header">
        <div className="tui-mario-header-left">
          <span className="tui-window-dot red" />
          <span className="tui-window-dot yellow" />
          <span className="tui-window-dot green" />
          <span className="tui-window-title">mario_autoplay.tui</span>
        </div>

        <div className="tui-mario-header-right">
          <button
            type="button"
            className={`tui-status-badge ${isAutopilot ? 'active' : 'manual'}`}
            onClick={toggleAutopilot}
            title={isAutopilot ? 'Click to toggle Manual Control' : 'Click to resume Autopilot'}
          >
            <span className="tui-status-dot" />
            <span className="tui-status-label">{aiStatus}</span>
          </button>
        </div>
      </div>

      {/* ── Retro Canvas Screen ── */}
      <div className="tui-mario-viewport" onClick={handleCanvasClick}>
        <canvas ref={canvasRef} className="tui-mario-canvas" />
        <div className="tui-scanlines" />
        
        {/* Subtle hover prompt */}
        {isHovered && (
          <div className="tui-hover-hint">
            <span>[CLICK / SPACE TO JUMP]</span>
          </div>
        )}
      </div>

      {/* ── TUI Telemetry Footer ── */}
      <div className="tui-mario-footer">
        <div className="tui-telemetry-item">
          <span className="telemetry-label">WORLD</span>
          <span className="telemetry-value">1-1</span>
        </div>
        <div className="tui-telemetry-item">
          <span className="telemetry-label">COINS</span>
          <span className="telemetry-value">×{String(coins).padStart(2, '0')}</span>
        </div>
        <div className="tui-telemetry-item">
          <span className="telemetry-label">SCORE</span>
          <span className="telemetry-value">{String(score).padStart(5, '0')}</span>
        </div>
      </div>
    </motion.div>
  );
}
