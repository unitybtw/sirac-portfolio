import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const NeonRacer = ({ onGameOver }) => {
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

        let p = { x: canvas.width / 2 - 15, y: canvas.height - 60, w: 30, h: 50, dx: 0, speed: 5 };
        let cars = [];
        let frame = 0;
        let currentScore = 0;
        let speedMult = 1;
        let lines = [0, 100, 200, 300, 400, 500];

        const spawnCar = () => {
            let lanes = [50, 150, 250];
            let lane = lanes[Math.floor(Math.random() * lanes.length)];
            cars.push({ x: lane - 15, y: -60, w: 30, h: 50, speed: (Math.random() * 2 + 3) * speedMult });
        };

        const handleKeyDown = (e) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
            if(["ArrowUp","ArrowDown","Space","w","s"].includes(e.code) || ["ArrowUp","ArrowDown","Space","w","s"].includes(e.key)) e.preventDefault();
            if (["ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
            if (e.key === 'ArrowLeft' || e.key === 'a') p.dx = -p.speed;
            if (e.key === 'ArrowRight' || e.key === 'd') p.dx = p.speed;
        };
        const handleKeyUp = (e) => {
            if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) p.dx = 0;
        };
        window.addEventListener('keydown', handleKeyDown, { passive: false });
        window.addEventListener('keyup', handleKeyUp);

        
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

            // Lines
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            for (let i = 0; i < lines.length; i++) {
                lines[i] += 5 * speedMult;
                if (lines[i] > canvas.height) lines[i] = -50;
                ctx.fillRect(100, lines[i], 4, 30);
                ctx.fillRect(200, lines[i], 4, 30);
            }

            p.x += p.dx;
            if (p.x < 0) p.x = 0;
            if (p.x + p.w > canvas.width) p.x = canvas.width - p.w;

            ctx.fillStyle = '#00f0ff';
            ctx.shadowBlur = 15; ctx.shadowColor = '#00f0ff';
            ctx.fillRect(p.x, p.y, p.w, p.h);

            frame++;
            if (frame % Math.max(30, 80 - Math.floor(currentScore / 50)) === 0) spawnCar();
            speedMult += 0.001;
            currentScore += speedMult; setScore(Math.floor(currentScore));

            ctx.fillStyle = '#ff003c'; ctx.shadowColor = '#ff003c';
            for (let i = cars.length - 1; i >= 0; i--) {
                let c = cars[i];
                c.y += c.speed;
                ctx.fillRect(c.x, c.y, c.w, c.h);

                if (p.x < c.x + c.w && p.x + p.w > c.x && p.y < c.y + c.h && p.y + p.h > c.y) {
                    { playSound('boom'); if (onGameOver) onGameOver(currentScore); setIsPlaying(false); return; } // Game Over
                }
                if (c.y > canvas.height) cars.splice(i, 1);
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
            <canvas ref={canvasRef} width={300} height={500} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            {isPlaying ? (
                <div style={{ position: 'absolute', top: 10, left: 10, color: '#fff', fontFamily: 'monospace' }}>Score: {score}</div>
            ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)' }}>
                    <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>Speed Racer</h2>
                    {score > 0 && <p style={{ color: 'white', marginBottom: '1rem' }}>Score: {score}</p>}
                    <button className="btn btn-primary" onClick={() => { setScore(0); setIsPlaying(true); }}><Play size={18} /> PLAY</button>
                </div>
            )}
        </div>
    );
};
export default NeonRacer;
