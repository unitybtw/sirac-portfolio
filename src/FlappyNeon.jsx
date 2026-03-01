import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const FlappyNeon = ({ onGameOver }) => {
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

        let bird = { x: 100, y: canvas.height / 2, velocity: 0, gravity: 0.5, jump: -8, size: 12 };
        let pipes = [];
        let frame = 0;
        let currentScore = 0;

        const pushPipe = () => {
            let gap = 120;
            let topH = Math.random() * (canvas.height - gap - 40) + 20;
            pipes.push({ x: canvas.width, top: topH, bottom: canvas.height - topH - gap, w: 40, passed: false });
        };
        pushPipe();

        const handleJump = (e) => {
            if ((e.type === 'keydown' && (e.code === 'Space' || e.code === 'ArrowUp')) || e.type === 'mousedown') {
                e.preventDefault();
                bird.velocity = bird.jump;
            }
        };
        window.addEventListener('keydown', handleJump, { passive: false });
        window.addEventListener('mousedown', handleJump);

        
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

            bird.velocity += bird.gravity;
            bird.y += bird.velocity;

            // Draw Bird
            ctx.fillStyle = '#00f0ff';
            ctx.shadowBlur = 15; ctx.shadowColor = '#00f0ff';
            ctx.beginPath();
            ctx.arc(bird.x, bird.y, bird.size, 0, Math.PI * 2);
            ctx.fill();

            // Pipes
            ctx.fillStyle = '#8a2be2';
            ctx.shadowColor = '#8a2be2';
            for (let i = pipes.length - 1; i >= 0; i--) {
                let p = pipes[i];
                p.x -= 3;
                ctx.fillRect(p.x, 0, p.w, p.top);
                ctx.fillRect(p.x, canvas.height - p.bottom, p.w, p.bottom);

                if (p.x + p.w < bird.x - bird.size && !p.passed) {
                    p.passed = true; currentScore++; setScore(currentScore);
                }

                // Collision
                if (bird.x + bird.size > p.x && bird.x - bird.size < p.x + p.w) {
                    if (bird.y - bird.size < p.top || bird.y + bird.size > canvas.height - p.bottom) {
                        { playSound('boom'); if (onGameOver) onGameOver(currentScore); setIsPlaying(false); return; }
                    }
                }
                if (p.x + p.w < 0) pipes.splice(i, 1);
            }

            if (bird.y + bird.size > canvas.height || bird.y - bird.size < 0) {
                { playSound('boom'); if (onGameOver) onGameOver(currentScore); setIsPlaying(false); return; }
            }

            frame++;
            if (frame % 100 === 0) pushPipe();

            ctx.shadowBlur = 0;
            animationId = requestAnimationFrame(draw);
        };
        draw();
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('keydown', handleJump);
            window.removeEventListener('mousedown', handleJump);
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
                <div style={{ position: 'absolute', top: 20, width: '100%', textAlign: 'center', color: '#fff', fontFamily: 'monospace', fontSize: '2rem', fontWeight: 'bold' }}>{score}</div>
            ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)' }}>
                    <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>Flappy Neon</h2>
                    {score > 0 && <p style={{ color: 'white', marginBottom: '1rem' }}>Score: {score}</p>}
                    <button className="btn btn-primary" onClick={() => { setScore(0); setIsPlaying(true); }}><Play size={18} /> PLAY</button>
                </div>
            )}
        </div>
    );
};
export default FlappyNeon;
