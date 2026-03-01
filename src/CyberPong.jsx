import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const CyberPong = ({ onGameOver }) => {
    const canvasRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [scores, setScores] = useState({ player: 0, ai: 0 });


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
        const ctx = canvas.getContext('2d');
        let animationId;

        let p = { x: 20, y: canvas.height / 2 - 30, w: 10, h: 60, dy: 0, speed: 6 };
        let ai = { x: canvas.width - 30, y: canvas.height / 2 - 30, w: 10, h: 60, speed: 4 };
        let ball = { x: canvas.width / 2, y: canvas.height / 2, r: 6, dx: 5, dy: 3, speed: 6 };

        const handleKeyDown = (e) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
            if (["ArrowUp", "ArrowDown", "Space", "w", "s"].includes(e.code) || ["ArrowUp", "ArrowDown", "Space", "w", "s"].includes(e.key)) e.preventDefault();
            if (["ArrowUp", "ArrowDown"].includes(e.code)) e.preventDefault();
            if (e.key === 'ArrowUp' || e.key === 'w') p.dy = -p.speed;
            if (e.key === 'ArrowDown' || e.key === 's') p.dy = p.speed;
        };
        const handleKeyUp = (e) => {
            if (['ArrowUp', 'ArrowDown', 'w', 's'].includes(e.key)) p.dy = 0;
        };
        window.addEventListener('keydown', handleKeyDown, { passive: false });
        window.addEventListener('keyup', handleKeyUp);

        const resetBall = () => {
            ball.x = canvas.width / 2; ball.y = canvas.height / 2;
            ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
            ball.dy = (Math.random() * 2 - 1) * ball.speed;
        };


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

            // Midline
            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 0);
            ctx.lineTo(canvas.width / 2, canvas.height);
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
            ctx.stroke();
            ctx.setLineDash([]);

            // Player move
            p.y += p.dy;
            if (p.y < 0) p.y = 0;
            if (p.y + p.h > canvas.height) p.y = canvas.height - p.h;

            // AI move
            if (ai.y + ai.h / 2 < ball.y - 10) ai.y += ai.speed;
            else if (ai.y + ai.h / 2 > ball.y + 10) ai.y -= ai.speed;
            if (ai.y < 0) ai.y = 0;
            if (ai.y + ai.h > canvas.height) ai.y = canvas.height - ai.h;

            // Ball move
            ball.x += ball.dx; ball.y += ball.dy;

            // Wall collision
            if (ball.y - ball.r < 0 || ball.y + ball.r > canvas.height) ball.dy *= -1; playSound('bump');

            // Paddle collision
            if (ball.dx < 0 && ball.x - ball.r < p.x + p.w && ball.y > p.y && ball.y < p.y + p.h) {
                ball.dx *= -1; playSound('bump');
                ball.dy = ((ball.y - (p.y + p.h / 2)) / (p.h / 2)) * ball.speed;
            }
            if (ball.dx > 0 && ball.x + ball.r > ai.x && ball.y > ai.y && ball.y < ai.y + ai.h) {
                ball.dx *= -1; playSound('bump');
                ball.dy = ((ball.y - (ai.y + ai.h / 2)) / (ai.h / 2)) * ball.speed;
            }

            // Score
            if (ball.x < 0) { setScores(s => ({ ...s, ai: s.ai + 1 })); resetBall(); }
            if (ball.x > canvas.width) { setScores(s => ({ ...s, player: s.player + 1 })); resetBall(); }

            ctx.fillStyle = '#00f0ff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00f0ff';
            ctx.fillRect(p.x, p.y, p.w, p.h);

            ctx.fillStyle = '#8a2be2';
            ctx.shadowColor = '#8a2be2';
            ctx.fillRect(ai.x, ai.y, ai.w, ai.h);

            ctx.fillStyle = '#fff';
            ctx.shadowColor = '#fff';
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
            ctx.fill();
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
    useEffect(() => { scoreRef.current = scores.player; }, [scores]);
    useEffect(() => {
        return () => {
            if (onGameOver) onGameOver(scoreRef.current);
        };
    }, [onGameOver]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#050508' }}>
            <canvas ref={canvasRef} width={600} height={400} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            {isPlaying ? (
                <div style={{ position: 'absolute', top: 20, left: 0, width: '100%', display: 'flex', justifyContent: 'center', gap: '4rem', pointerEvents: 'none', fontFamily: 'monospace', fontSize: '2rem', color: 'rgba(255,255,255,0.5)' }}>
                    <span style={{ color: '#00f0ff' }}>{scores.player}</span>
                    <span style={{ color: '#8a2be2' }}>{scores.ai}</span>
                </div>
            ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)' }}>
                    <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>Cyber Pong</h2>
                    <button className="btn btn-primary" onClick={() => setIsPlaying(true)}><Play size={18} /> PLAY</button>
                </div>
            )}
        </div>
    );
};
export default CyberPong;
