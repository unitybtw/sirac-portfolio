import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const NeonFrogger = ({ onGameOver }) => {
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

        let p = { x: canvas.width / 2, y: canvas.height - 30, size: 20 };
        let cars = [], currLevel = 1;
        let curScore = score;

        const initCars = () => {
            cars = [];
            for (let row = 1; row < 6; row++) {
                let numCars = Math.floor(Math.random() * 2) + 2;
                let speed = (Math.random() * 2 + 1 + currLevel * 0.5) * (Math.random() > 0.5 ? 1 : -1);
                for (let i = 0; i < numCars; i++) {
                    cars.push({ x: i * 150 + Math.random() * 50, y: row * 60, w: 40, h: 30, speed: speed });
                }
            }
        };
        initCars();

        const key = (e) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(e.key)) e.preventDefault();
            const step = 30;
            if (e.key === 'ArrowUp' || e.key === 'w') p.y -= step;
            if (e.key === 'ArrowDown' || e.key === 's') p.y += step;
            if (e.key === 'ArrowLeft' || e.key === 'a') p.x -= step;
            if (e.key === 'ArrowRight' || e.key === 'd') p.x += step;

            if (p.x < 0) p.x = 0;
            if (p.x > canvas.width - p.size) p.x = canvas.width - p.size;
            if (p.y > canvas.height - p.size) p.y = canvas.height - p.size;

            // Win condition
            if (p.y < 30) {
                currLevel++;
                setScore(curScore + currLevel * 10);
                curScore += currLevel * 10;
                p.y = canvas.height - 30;
                initCars();
            }
        };
        window.addEventListener('keydown', key, { passive: false });

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

            // Draw safe zones
            ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, 40); // Top win zone
            ctx.fillRect(0, canvas.height - 40, canvas.width, 40); // Spawn zone

            // Draw cars
            ctx.fillStyle = '#ff003c';
            ctx.shadowBlur = 10; ctx.shadowColor = '#ff003c';
            for (let c of cars) {
                c.x += c.speed;
                if (c.speed > 0 && c.x > canvas.width) c.x = -c.w;
                if (c.speed < 0 && c.x + c.w < 0) c.x = canvas.width;

                ctx.fillRect(c.x, c.y, c.w, c.h);

                // Collision
                if (p.x < c.x + c.w && p.x + p.size > c.x && p.y < c.y + c.h && p.y + p.size > c.y) {
                    if (onGameOver) onGameOver(score); setIsPlaying(false);
                    setScore(0);
                    return;
                }
            }

            // Draw player
            ctx.fillStyle = '#00f0ff';
            ctx.shadowColor = '#00f0ff';
            ctx.fillRect(p.x, p.y, p.size, p.size);
            ctx.shadowBlur = 0;

            anim = requestAnimationFrame(draw);
        }; draw();

        return () => { cancelAnimationFrame(anim); window.removeEventListener('keydown', key); };
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
                <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>Neon Frogger</h2>
                <p style={{ color: '#aaa', marginBottom: '1rem', fontFamily: 'monospace' }}>Cross the road to the top safe zone.</p>
                {score > 0 && <p style={{ color: '#00f0ff', marginBottom: '1rem' }}>Last Score: {score}</p>}
                <button className="btn btn-primary" onClick={() => { setScore(0); setIsPlaying(true); }}><Play size={18} /> PLAY</button>
            </div>}
    </div>;
};
export default NeonFrogger;
