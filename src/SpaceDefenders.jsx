import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const SpaceDefenders = ({ onGameOver }) => {
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
        let animationId;

        let p = { x: canvas.width / 2 - 15, y: canvas.height - 40, w: 30, h: 20, dx: 0, speed: 5 };
        let bullets = [];
        let enemies = [];
        const rows = 4, cols = 8;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                enemies.push({ x: 50 + c * 40, y: 30 + r * 30, w: 20, h: 20, alive: true });
            }
        }
        let eDir = 1, eSpeed = 0.5, eDrop = 20;

        const handleKeyDown = (e) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
            if(["ArrowUp","ArrowDown","Space","w","s"].includes(e.code) || ["ArrowUp","ArrowDown","Space","w","s"].includes(e.key)) e.preventDefault();
            if (["ArrowLeft", "ArrowRight", "Space"].includes(e.code)) e.preventDefault();
            if (e.key === 'ArrowLeft' || e.key === 'a') p.dx = -p.speed;
            if (e.key === 'ArrowRight' || e.key === 'd') p.dx = p.speed;
            if (e.key === ' ' || e.code === 'Space') {
                bullets.push({ x: p.x + p.w / 2 - 2, y: p.y, w: 4, h: 10, speed: 7 });
            }
        };
        const handleKeyUp = (e) => {
            if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) p.dx = 0;
        };
        window.addEventListener('keydown', handleKeyDown, { passive: false });
        window.addEventListener('keyup', handleKeyUp);

        let currentScore = 0;

        
    let _lastFrameTime = 0;
    const draw = () => {
      let _now = Date.now();
      if (_now - _lastFrameTime < 15) {
          animationId = window.requestAnimationFrame(draw);
          return;
      }
      _lastFrameTime = _now;
            ctx.fillStyle = '#050508';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            p.x += p.dx;
            if (p.x < 0) p.x = 0;
            if (p.x + p.w > canvas.width) p.x = canvas.width - p.w;

            // Draw Player
            ctx.fillStyle = '#00f0ff';
            ctx.shadowBlur = 10; ctx.shadowColor = '#00f0ff';
            ctx.beginPath(); ctx.moveTo(p.x + p.w / 2, p.y); ctx.lineTo(p.x + p.w, p.y + p.h); ctx.lineTo(p.x, p.y + p.h); ctx.fill();

            // Bullets
            ctx.fillStyle = '#fff'; ctx.shadowColor = '#fff';
            for (let i = bullets.length - 1; i >= 0; i--) {
                let b = bullets[i];
                b.y -= b.speed;
                ctx.fillRect(b.x, b.y, b.w, b.h);
                if (b.y < 0) { bullets.splice(i, 1); continue; }

                let hit = false;
                for (let e of enemies) {
                    if (e.alive && b.x > e.x && b.x < e.x + e.w && b.y > e.y && b.y < e.y + e.h) {
                        e.alive = false; hit = true; currentScore += 10; setScore(currentScore); break;
                    }
                }
                if (hit) bullets.splice(i, 1);
            }

            // Enemies
            ctx.fillStyle = '#f0f'; ctx.shadowColor = '#f0f';
            let edgeHit = false; let allDead = true;
            for (let e of enemies) {
                if (!e.alive) continue;
                allDead = false;
                e.x += eSpeed * eDir;
                if (e.x < 10 || e.x + e.w > canvas.width - 10) edgeHit = true;
                if (e.y + e.h > p.y) { { playSound('boom'); if (onGameOver) onGameOver(currentScore); setIsPlaying(false); return; } } // Game Over Check inside
            }
            if (allDead) { { playSound('boom'); if (onGameOver) onGameOver(currentScore); setIsPlaying(false); return; } } // Win

            if (edgeHit) {
                eDir *= -1;
                for (let e of enemies) { if (e.alive) e.y += eDrop; }
            }

            for (let e of enemies) {
                if (e.alive) ctx.fillRect(e.x, e.y, e.w, e.h);
            }

            ctx.shadowBlur = 0;
            animationId = requestAnimationFrame(draw);
        };
        draw();
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isPlaying]);

    
    // --- Score Persistence ---
    const scoreRef = useRef(0);
    useEffect(() => { scoreRef.current = score; }, [score]);
    useEffect(() => {
        return () => {
            if (onGameOver) onGameOver(scoreRef.current);
        };
    }, [onGameOver]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#050508' }}>
            <canvas ref={canvasRef} width={600} height={400} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            {isPlaying ? (
                <div style={{ position: 'absolute', top: 10, left: 10, color: '#fff', fontFamily: 'monospace' }}>Score: {score}</div>
            ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)' }}>
                    <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>Space Defenders</h2>
                    {score > 0 && <p style={{ color: 'white', marginBottom: '1rem' }}>Score: {score}</p>}
                    <button className="btn btn-primary" onClick={() => { setScore(0); setIsPlaying(true); }}><Play size={18} /> PLAY</button>
                </div>
            )}
        </div>
    );
};
export default SpaceDefenders;
