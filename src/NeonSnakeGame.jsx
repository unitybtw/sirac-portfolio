import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const NeonSnakeGame = ({ onGameOver }) => {
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

        let grid = 20;
        let snake = [{ x: 160, y: 160 }, { x: 140, y: 160 }, { x: 120, y: 160 }];
        let dx = grid; let dy = 0;
        let food = { x: 300, y: 200 };
        let currentScore = 0;
        let frame = 0;

        const spawnFood = () => {
            food.x = Math.floor(Math.random() * (canvas.width / grid)) * grid;
            food.y = Math.floor(Math.random() * (canvas.height / grid)) * grid;
        };

        const handleKeyDown = (e) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
            if(["ArrowUp","ArrowDown","Space","w","s"].includes(e.code) || ["ArrowUp","ArrowDown","Space","w","s"].includes(e.key)) e.preventDefault();
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
            if ((e.key === 'ArrowUp' || e.key === 'w') && dy === 0) { dx = 0; dy = -grid; }
            else if ((e.key === 'ArrowDown' || e.key === 's') && dy === 0) { dx = 0; dy = grid; }
            else if ((e.key === 'ArrowLeft' || e.key === 'a') && dx === 0) { dx = -grid; dy = 0; }
            else if ((e.key === 'ArrowRight' || e.key === 'd') && dx === 0) { dx = grid; dy = 0; }
        };
        window.addEventListener('keydown', handleKeyDown, { passive: false });

        
    let _lastFrameTime = 0;
    const draw = () => {
      let _now = Date.now();
      if (_now - _lastFrameTime < 15) {
          animationId = window.requestAnimationFrame(draw);
          return;
      }
      _lastFrameTime = _now;
            animationId = requestAnimationFrame(draw);
            if (++frame < 5) return; // control speed
            frame = 0;

            ctx.fillStyle = 'rgba(5, 5, 8, 0.4)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            let head = { x: snake[0].x + dx, y: snake[0].y + dy };

            // Wall wrap
            if (head.x < 0) head.x = canvas.width - grid;
            else if (head.x >= canvas.width) head.x = 0;
            if (head.y < 0) head.y = canvas.height - grid;
            else if (head.y >= canvas.height) head.y = 0;

            // Self collision
            if (snake.some(s => s.x === head.x && s.y === head.y)) {
                { playSound('boom'); if (onGameOver) onGameOver(currentScore); setIsPlaying(false); return; }
            }

            snake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                currentScore += 10; setScore(currentScore);
                spawnFood();
            } else {
                snake.pop();
            }

            ctx.shadowBlur = 10;

            // Draw Food
            ctx.fillStyle = '#f0f'; ctx.shadowColor = '#f0f';
            ctx.fillRect(food.x + 2, food.y + 2, grid - 4, grid - 4);

            // Draw Snake
            ctx.fillStyle = '#00f0ff'; ctx.shadowColor = '#00f0ff';
            snake.forEach((s, i) => {
                ctx.fillStyle = i === 0 ? '#fff' : '#00f0ff';
                ctx.fillRect(s.x + 1, s.y + 1, grid - 2, grid - 2);
            });

            ctx.shadowBlur = 0;
        };
        draw();
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('keydown', handleKeyDown);
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
                    <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>Neon Snake</h2>
                    {score > 0 && <p style={{ color: 'white', marginBottom: '1rem' }}>Score: {score}</p>}
                    <button className="btn btn-primary" onClick={() => { setScore(0); setIsPlaying(true); }}><Play size={18} /> PLAY</button>
                </div>
            )}
        </div>
    );
};
export default NeonSnakeGame;
