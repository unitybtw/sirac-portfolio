import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const NeonSurvive = ({ onGameOver }) => {
    const canvasRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);

  
// --- Audio Helper ---
const playSound = (type) => {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        switch(type) {
            case 'pew': // High pitch short ping (shooting, selecting)
                osc.type = 'square';
                osc.frequency.setValueAtTime(800, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
                osc.start(); osc.stop(audioCtx.currentTime + 0.1);
                break;
            case 'bump': // Low pitch thud (hitting wall, bouncing)
                osc.type = 'sine';
                osc.frequency.setValueAtTime(150, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
                osc.start(); osc.stop(audioCtx.currentTime + 0.1);
                break;
            case 'coin': // classic arcade coin/point sound
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
                osc.frequency.setValueAtTime(1600, audioCtx.currentTime + 0.05);
                gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
                osc.start(); osc.stop(audioCtx.currentTime + 0.2);
                break;
            case 'boom': // explosion or fail
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.3);
                gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                osc.start(); osc.stop(audioCtx.currentTime + 0.3);
                break;
            case 'jump': // ascending slide
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.15);
                gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.15);
                osc.start(); osc.stop(audioCtx.currentTime + 0.15);
                break;
            case 'click': // simple UI click
                osc.type = 'square';
                osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
                gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
                osc.start(); osc.stop(audioCtx.currentTime + 0.05);
                break;
        }
    } catch(e) {}
};

  useEffect(() => {
        if (!isPlaying) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let p = { x: canvas.width / 2, y: canvas.height / 2, r: 15, speed: 4 };
        let keys = {};
        let enemies = [], bullets = [], frame = 0, curr = 0;

        const handleKey = (e) => {
            if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "w", "a", "s", "d"].includes(e.key)) e.preventDefault();
            keys[e.key.toLowerCase()] = e.type === 'keydown';
            // handle arrow keys mapping
            if (e.code === 'ArrowUp') keys['w'] = e.type === 'keydown';
            if (e.code === 'ArrowDown') keys['s'] = e.type === 'keydown';
            if (e.code === 'ArrowLeft') keys['a'] = e.type === 'keydown';
            if (e.code === 'ArrowRight') keys['d'] = e.type === 'keydown';
        };
        window.addEventListener('keydown', handleKey, { passive: false });
        window.addEventListener('keyup', handleKey, { passive: false });

        let anim;
        
    let _lastFrameTime = 0;
    const draw = () => {
      let _now = Date.now();
      if (_now - _lastFrameTime < 15) {
          anim = window.requestAnimationFrame(draw);
          return;
      }
      _lastFrameTime = _now;
            ctx.fillStyle = '#050508'; ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (keys['a']) p.x -= p.speed;
            if (keys['d']) p.x += p.speed;
            if (keys['w']) p.y -= p.speed;
            if (keys['s']) p.y += p.speed;

            // keep in bounds
            p.x = Math.max(p.r, Math.min(canvas.width - p.r, p.x));
            p.y = Math.max(p.r, Math.min(canvas.height - p.r, p.y));

            // Auto shoot nearest
            if (frame % 15 === 0 && enemies.length > 0) {
                let nearest = null, minDist = Infinity;
                for (let e of enemies) {
                    let d = Math.hypot(e.x - p.x, e.y - p.y);
                    if (d < minDist) { minDist = d; nearest = e; }
                }
                if (nearest) {
                    let angle = Math.atan2(nearest.y - p.y, nearest.x - p.x);
                    bullets.push({ x: p.x, y: p.y, vx: Math.cos(angle) * 10, vy: Math.sin(angle) * 10 });
                }
            }

            // Spawns
            if (frame++ % Math.max(10, 60 - Math.floor(curr / 100)) === 0) {
                let side = Math.floor(Math.random() * 4);
                let ex = 0, ey = 0;
                if (side === 0) { ex = Math.random() * canvas.width; ey = -20; }
                if (side === 1) { ex = Math.random() * canvas.width; ey = canvas.height + 20; }
                if (side === 2) { ex = -20; ey = Math.random() * canvas.height; }
                if (side === 3) { ex = canvas.width + 20; ey = Math.random() * canvas.height; }
                enemies.push({ x: ex, y: ey, r: 10, hp: 1 });
            }

            // Draw bullets
            ctx.fillStyle = '#ffff00';
            for (let i = bullets.length - 1; i >= 0; i--) {
                let b = bullets[i];
                b.x += b.vx; b.y += b.vy;
                ctx.beginPath(); ctx.arc(b.x, b.y, 4, 0, Math.PI * 2); ctx.fill();
                if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) { bullets.splice(i, 1); }
            }

            // Draw enemies & collision
            ctx.fillStyle = '#ff003c'; ctx.shadowBlur = 10; ctx.shadowColor = '#ff003c';
            for (let i = enemies.length - 1; i >= 0; i--) {
                let e = enemies[i];
                let angle = Math.atan2(p.y - e.y, p.x - e.x);
                e.x += Math.cos(angle) * (1 + curr / 500);
                e.y += Math.sin(angle) * (1 + curr / 500);

                ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.fill();

                // Player hit
                if (Math.hypot(e.x - p.x, e.y - p.y) < e.r + p.r) {
                    { playSound('boom'); if (onGameOver) onGameOver(score); setIsPlaying(false); return; }
                }

                // Bullet hit
                let dead = false;
                for (let j = bullets.length - 1; j >= 0; j--) {
                    if (Math.hypot(e.x - bullets[j].x, e.y - bullets[j].y) < e.r + 4) {
                        bullets.splice(j, 1);
                        enemies.splice(i, 1);
                        curr += 10; setScore(curr); playSound('coin');
                        dead = true;
                        break;
                    }
                }
            }

            ctx.shadowBlur = 0;
            // Draw player
            ctx.fillStyle = '#00f0ff'; ctx.shadowColor = '#00f0ff'; ctx.shadowBlur = 20;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;

            anim = requestAnimationFrame(draw);
        }; draw();

        return () => { cancelAnimationFrame(anim); window.removeEventListener('keydown', handleKey); window.removeEventListener('keyup', handleKey); };
    }, [isPlaying]);

    
    // --- Score Persistence ---
    const scoreRef = useRef(0);
    useEffect(() => { scoreRef.current = score; }, [score]);
    useEffect(() => {
        return () => {
            if (onGameOver) onGameOver(scoreRef.current);
        };
    }, [onGameOver]);

    return <div style={{ position: 'relative', width: '100%', height: '100%', background: '#050508' }}>
        <canvas ref={canvasRef} width={600} height={400} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        {isPlaying ? <div style={{ position: 'absolute', top: 10, left: 10, color: '#fff', fontFamily: 'monospace' }}>Score: {score}</div> :
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)' }}>
                <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>Neon Survive 2.0</h2>
                <p style={{ color: '#aaa', marginBottom: '1rem', fontFamily: 'monospace' }}>WASD to move. Auto-shooting enabled.</p>
                {score > 0 && <p style={{ color: '#ff003c', marginBottom: '1rem' }}>Score: {score}</p>}
                <button className="btn btn-primary" onClick={() => { setScore(0); setIsPlaying(true); }}><Play size={18} /> SURVIVE</button>
            </div>}
    </div>;
};
export default NeonSurvive;
