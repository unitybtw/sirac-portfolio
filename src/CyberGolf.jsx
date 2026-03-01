import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const CyberGolf = ({ onGameOver }) => {
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

            switch (type) {
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
        } catch (e) { }
    };

    useEffect(() => {
        if (!isPlaying) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let anim, _lastFrameTime = 0;


        let ball = { x: 100, y: 300, vx: 0, vy: 0, r: 8 };
        let hole = { x: 500, y: 100, r: 15 };
        let walls = [
            { x: 300, y: 0, w: 20, h: 250 },
            { x: 300, y: 320, w: 20, h: 100 }
        ];
        let isDragging = false, dragStart = { x: 0, y: 0 }, mouse = { x: 0, y: 0 };

        const md = (e) => {
            if (Math.hypot(ball.vx, ball.vy) < 0.5) {
                let rect = canvas.getBoundingClientRect();
                dragStart.x = (e.clientX - rect.left) * (canvas.width / rect.width);
                dragStart.y = (e.clientY - rect.top) * (canvas.height / rect.height);
                if (Math.hypot(dragStart.x - ball.x, dragStart.y - ball.y) < 20) isDragging = true;
            }
        };
        const mm = (e) => {
            let rect = canvas.getBoundingClientRect();
            mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
            mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
        };
        const mu = () => {
            if (isDragging) {
                let dx = ball.x - mouse.x, dy = ball.y - mouse.y;
                ball.vx = dx * 0.1; ball.vy = dy * 0.1;
                isDragging = false; { setScore(s => s + 1); playSound('coin'); }; // Strokes
            }
        };

        canvas.addEventListener('mousedown', md); window.addEventListener('mousemove', mm); window.addEventListener('mouseup', mu);

        const draw = () => {
            let _now = Date.now(); if (_now - _lastFrameTime < 15) { anim = window.requestAnimationFrame(draw); return; } _lastFrameTime = _now;
            ctx.fillStyle = '#050508'; ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff00'; ctx.beginPath(); ctx.arc(hole.x, hole.y, hole.r, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#ffaa00'; walls.forEach(w => ctx.fillRect(w.x, w.y, w.w, w.h));

            ball.x += ball.vx; ball.y += ball.vy;
            ball.vx *= 0.98; ball.vy *= 0.98;

            // Bounds
            if (ball.x < ball.r || ball.x > canvas.width - ball.r) ball.vx *= -1; playSound('bump');
            if (ball.y < ball.r || ball.y > canvas.height - ball.r) ball.vy *= -1; playSound('bump');

            // Walls collision
            walls.forEach(w => {
                if (ball.x + ball.r > w.x && ball.x - ball.r < w.x + w.w && ball.y + ball.r > w.y && ball.y - ball.r < w.y + w.h) {
                    if (ball.x < w.x || ball.x > w.x + w.w) { ball.vx *= -1; playSound('bump'); } else { ball.vy *= -1; playSound('bump'); }
                    ball.x += ball.vx * 2; ball.y += ball.vy * 2;
                }
            });

            // Hole Check
            if (Math.hypot(ball.x - hole.x, ball.y - hole.y) < hole.r) {
                { playSound('boom'); if (onGameOver) onGameOver(score); setIsPlaying(false); return; } // Win
            }

            ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.fill();

            if (isDragging) {
                ctx.strokeStyle = '#fff'; ctx.beginPath();
                ctx.moveTo(ball.x, ball.y); ctx.lineTo(ball.x - (mouse.x - ball.x), ball.y - (mouse.y - ball.y));
                ctx.stroke();
            }

            anim = window.requestAnimationFrame(draw);
        }; draw();
        return () => { cancelAnimationFrame(anim); canvas.removeEventListener('mousedown', md); window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', mu); };


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
        {isPlaying ? <div style={{ position: 'absolute', top: 10, left: 10, color: '#fff', fontFamily: 'monospace' }}>Score/Stat: {score}</div> :
            <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.8)', flexDirection: 'column' }}>
                <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>Cyber Golf</h2>
                <button className="btn btn-primary" onClick={() => { playSound('click'); setScore(0); setIsPlaying(true); }}><Play size={18} /> PLAY</button>
            </div>}
    </div>;
};
export default CyberGolf;
