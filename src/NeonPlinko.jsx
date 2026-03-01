import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const NeonPlinko = ({ onGameOver }) => {
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

        let pegs = [], balls = [], targets = [], curr = 0, ballsLeft = 10;

        // Gen pegs triangle
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c <= r; c++) {
                pegs.push({ x: canvas.width / 2 - (r * 30) / 2 + c * 30, y: 50 + r * 30, r: 5 });
            }
        }

        // Gen targets
        const w = canvas.width / 8;
        for (let i = 0; i < 8; i++) {
            let vals = [100, 50, 10, 0, 0, 10, 50, 100];
            targets.push({ x: i * w, y: canvas.height - 30, w: w, val: vals[i] });
        }

        const clk = (e) => {
            if (ballsLeft <= 0) return;
            const rect = canvas.getBoundingClientRect();
            const bx = (e.clientX - rect.left) * (canvas.width / rect.width);
            const by = (e.clientY - rect.top) * (canvas.height / rect.height);
            if (by < 50) {
                balls.push({ x: bx, y: by, vx: (Math.random() - 0.5), vy: 0, r: 6 });
                ballsLeft--;
                if (ballsLeft <= 0) setTimeout(() => { if (onGameOver) onGameOver(score); setIsPlaying(false); }, 5000);
            }
        };
        canvas.addEventListener('mousedown', clk);

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

            // Draw pegs
            ctx.fillStyle = '#00f0ff';
            pegs.forEach(p => {
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
            });

            // Draw targets
            targets.forEach(t => {
                ctx.fillStyle = t.val > 0 ? (t.val === 100 ? '#ff003c' : '#ffaa00') : '#333';
                ctx.fillRect(t.x + 2, t.y, t.w - 4, 30);
                ctx.fillStyle = '#fff'; ctx.font = '12px monospace';
                ctx.fillText(t.val, t.x + t.w / 2 - 10, t.y + 20);
            });

            // Phys balls
            for (let i = balls.length - 1; i >= 0; i--) {
                let b = balls[i];
                b.vy += 0.2; // grav
                b.x += b.vx; b.y += b.vy;

                if (b.x < b.r) { b.x = b.r; b.vx *= -0.5; }
                if (b.x > canvas.width - b.r) { b.x = canvas.width - b.r; b.vx *= -0.5; }

                // Peg col
                pegs.forEach(p => {
                    let dx = b.x - p.x; let dy = b.y - p.y;
                    let dist = Math.hypot(dx, dy);
                    if (dist < b.r + p.r) {
                        let angle = Math.atan2(dy, dx);
                        let mag = Math.hypot(b.vx, b.vy) * 0.6;
                        b.vx = Math.cos(angle) * mag;
                        b.vy = Math.sin(angle) * mag;
                        b.x = p.x + Math.cos(angle) * (b.r + p.r + 1);
                        b.y = p.y + Math.sin(angle) * (b.r + p.r + 1);
                    }
                });

                ctx.fillStyle = '#ff00ff'; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();

                if (b.y > canvas.height - 30) {
                    // landed
                    let idx = Math.floor(b.x / w);
                    if (idx >= 0 && idx < 8) { curr += targets[idx].val; setScore(curr); playSound('coin'); }
                    balls.splice(i, 1);
                }
            }

            ctx.fillStyle = '#fff'; ctx.font = '20px monospace';
            ctx.fillText(`Balls Left: ${ballsLeft}`, 20, 30);
            ctx.fillText(`Score: ${curr}`, canvas.width - 150, 30);

            if (ballsLeft > 0) {
                ctx.fillStyle = 'rgba(0,240,255,0.1)'; ctx.fillRect(0, 0, canvas.width, 50);
            }

            anim = requestAnimationFrame(draw);
        }; draw();

        return () => { cancelAnimationFrame(anim); canvas.removeEventListener('mousedown', clk); };
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
        <canvas ref={canvasRef} width={600} height={400} style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: isPlaying ? 'crosshair' : 'default' }} />
        {!isPlaying && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)' }}>
                <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>Neon Plinko</h2>
                <p style={{ color: '#aaa', marginBottom: '1rem', fontFamily: 'monospace' }}>Click the top area to drop a ball.</p>
                {score > 0 && <p style={{ color: '#ffaa00', marginBottom: '1rem' }}>Total Winnings: {score}</p>}
                <button className="btn btn-primary" onClick={() => { setScore(0); setIsPlaying(true); }}><Play size={18} /> PLAY</button>
            </div>
        )}
    </div>;
};
export default NeonPlinko;
