import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const BrickBreaker = ({ onGameOver }) => {
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

        let paddle = { x: canvas.width / 2 - 40, y: canvas.height - 20, w: 80, h: 10, dx: 0, speed: 8 };
        let ball = { x: canvas.width / 2, y: canvas.height - 30, r: 6, dx: 4, dy: -4 };
        let bricks = [];
        const rows = 5, cols = 8, w = 60, h = 15, padding = 10, offsetTop = 40, offsetLeft = 25;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                bricks.push({ x: offsetLeft + c * (w + padding), y: offsetTop + r * (h + padding), w, h, status: 1, color: `hsl(${200 + r * 30}, 100%, 60%)` });
            }
        }

        const handleKeyDown = (e) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
            if(["ArrowUp","ArrowDown","Space","w","s"].includes(e.code) || ["ArrowUp","ArrowDown","Space","w","s"].includes(e.key)) e.preventDefault();
            if (e.key === 'ArrowLeft' || e.key === 'a') paddle.dx = -paddle.speed;
            if (e.key === 'ArrowRight' || e.key === 'd') paddle.dx = paddle.speed;
        };
        const handleKeyUp = (e) => {
            if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) paddle.dx = 0;
        };
        window.addEventListener('keydown', handleKeyDown);
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
            ctx.fillStyle = 'rgba(5, 5, 8, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            paddle.x += paddle.dx;
            if (paddle.x < 0) paddle.x = 0;
            if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;

            ball.x += ball.dx; ball.y += ball.dy;
            if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width) ball.dx *= -1; playSound('bump');
            if (ball.y - ball.r < 0) ball.dy *= -1; playSound('bump');

            if (ball.y + ball.r > canvas.height) {
                { playSound('boom'); if (onGameOver) onGameOver(currentScore); setIsPlaying(false); return; } // Game Over
            }

            // Paddle hit
            if (ball.y + ball.r > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
                ball.dy = -Math.abs(ball.dy);
                ball.dx = ((ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2)) * 5;
            }

            // Draw Paddle
            ctx.fillStyle = '#00f0ff';
            ctx.shadowBlur = 10; ctx.shadowColor = '#00f0ff';
            ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

            // Draw Ball
            ctx.fillStyle = '#fff';
            ctx.shadowColor = '#fff';
            ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();

            // Bricks
            let activeBricks = 0;
            bricks.forEach(b => {
                if (b.status === 1) {
                    activeBricks++;
                    if (ball.x > b.x && ball.x < b.x + b.w && ball.y - ball.r < b.y + b.h && ball.y + ball.r > b.y) {
                        ball.dy *= -1; playSound('bump'); b.status = 0;
                        currentScore += 10; setScore(currentScore);
                    } else {
                        ctx.fillStyle = b.color;
                        ctx.shadowColor = b.color;
                        ctx.fillRect(b.x, b.y, b.w, b.h);
                    }
                }
            });

            if (activeBricks === 0) { { playSound('boom'); if (onGameOver) onGameOver(currentScore); setIsPlaying(false); return; } } // Win

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
                    <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>Neon Breakout</h2>
                    {score > 0 && <p style={{ color: 'white', marginBottom: '1rem' }}>Score: {score}</p>}
                    <button className="btn btn-primary" onClick={() => { setScore(0); setIsPlaying(true); }}><Play size={18} /> PLAY</button>
                </div>
            )}
        </div>
    );
};
export default BrickBreaker;
