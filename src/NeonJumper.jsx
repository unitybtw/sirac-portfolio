import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const NeonJumper = ({ onGameOver }) => {
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
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let p = { x: canvas.width / 2, y: canvas.height / 2, dx: 0, dy: 0 };
        let plats = [{ x: canvas.width / 2 - 30, y: canvas.height - 50 }], curr = 0;

        // Initial platforms
        for (let i = 1; i < 6; i++) {
            plats.push({ x: Math.random() * (canvas.width - 60), y: canvas.height - i * 80 });
        }

        const keyd = (e) => {
            if (["ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
            if (["ArrowUp", "ArrowDown", "Space", "w", "s"].includes(e.code) || ["ArrowUp", "ArrowDown", "Space", "w", "s"].includes(e.key)) e.preventDefault();
            if (e.key === 'ArrowLeft' || e.key === 'a') p.dx = -6;
            if (e.key === 'ArrowRight' || e.key === 'd') p.dx = 6;
        };
        const keyu = (e) => {
            if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) p.dx = 0;
        };
        window.addEventListener('keydown', keyd, { passive: false });
        window.addEventListener('keyup', keyu);

        let _lastFrameTime = 0; let anim;
        const draw = () => {
            let _now = Date.now();
            if (_now - _lastFrameTime < 15) {
                anim = window.requestAnimationFrame(draw);
                return;
            }
            _lastFrameTime = _now;

            ctx.fillStyle = '#050508'; ctx.fillRect(0, 0, canvas.width, canvas.height);

            p.dy += 0.4; p.x += p.dx; p.y += p.dy;

            // Screen wrap
            if (p.x < -10) p.x = canvas.width;
            else if (p.x > canvas.width) p.x = -10;

            // Game over condition (fall)
            if (p.y > canvas.height) { { playSound('boom'); if (onGameOver) onGameOver(score); setIsPlaying(false); return; } }

            // Camera pan / scrolling
            if (p.y < 200) {
                p.y = 200;
                curr++; setScore(curr); playSound('coin');
                plats.forEach(pl => {
                    pl.y += Math.abs(p.dy);
                    if (pl.y > canvas.height) {
                        pl.y = 0; pl.x = Math.random() * (canvas.width - 60);
                    }
                });
            }

            // Draw platforms
            ctx.fillStyle = '#00f0ff';
            ctx.shadowBlur = 15; ctx.shadowColor = '#00f0ff';
            plats.forEach(pl => {
                ctx.fillRect(pl.x, pl.y, 60, 10);
                // Collision logic (only when falling)
                if (p.dy > 0 && p.x + 10 > pl.x && p.x - 10 < pl.x + 60 && p.y + 10 > pl.y && p.y + 10 < pl.y + 15) {
                    p.dy = -12;
                }
            });

            // Draw player
            ctx.fillStyle = '#ffaa00';
            ctx.shadowColor = '#ffaa00';
            ctx.beginPath(); ctx.arc(p.x, p.y, 10, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;

            anim = requestAnimationFrame(draw);
        }; draw();

        return () => { cancelAnimationFrame(anim); window.removeEventListener('keydown', keyd); window.removeEventListener('keyup', keyu); };
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
        {isPlaying ? <div style={{ position: 'absolute', top: 10, left: 10, color: '#fff', fontFamily: 'monospace' }}>Height: {score}</div> :
            <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.8)', flexDirection: 'column' }}>
                <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>Neon Jumper</h2>
                {score > 0 && <p style={{ color: '#ffaa00', marginBottom: '1rem' }}>Score: {score}</p>}
                <button className="btn btn-primary" onClick={() => { setScore(0); setIsPlaying(true); }}><Play size={18} /> PLAY</button>
            </div>}
    </div>;
};
export default NeonJumper;
