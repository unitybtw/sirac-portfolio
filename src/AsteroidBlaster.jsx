import React, { useRef, useEffect, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const AsteroidBlaster = ({ onGameOver }) => {
    const canvasRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);


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

        let player = { x: canvas.width / 2, y: canvas.height - 30, width: 24, height: 24, speed: 6, dx: 0 };
        let bullets = [];
        let enemies = [];
        let particles = [];
        let frameCount = 0;
        let currentScore = 0;

        const createParticles = (x, y, color) => {
            for (let i = 0; i < 10; i++) {
                particles.push({
                    x, y,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    life: 1,
                    color
                });
            }
        };

        const handleKeyDown = (e) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
            if (["ArrowUp", "ArrowDown", "Space", "w", "s"].includes(e.code) || ["ArrowUp", "ArrowDown", "Space", "w", "s"].includes(e.key)) e.preventDefault();
            // prevent default scrolling for game keys
            if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
                e.preventDefault();
            }
            if (e.key === 'ArrowLeft' || e.key === 'a') player.dx = -player.speed;
            if (e.key === 'ArrowRight' || e.key === 'd') player.dx = player.speed;
            if (e.key === ' ' || e.code === 'Space') {
                bullets.push({ x: player.x, y: player.y - 10, width: 4, height: 12, speed: 8 });
            }
        };

        const handleKeyUp = (e) => {
            if (
                e.key === 'ArrowLeft' || e.key === 'a' ||
                e.key === 'ArrowRight' || e.key === 'd'
            ) player.dx = 0;
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
            // Clear with trail
            ctx.fillStyle = 'rgba(10, 10, 12, 0.4)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Player Ship
            ctx.fillStyle = '#00f0ff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00f0ff';
            ctx.beginPath();
            ctx.moveTo(player.x, player.y - player.height / 2);
            ctx.lineTo(player.x - player.width / 2, player.y + player.height / 2);
            ctx.lineTo(player.x, player.y + player.height / 4); // Inner indent
            ctx.lineTo(player.x + player.width / 2, player.y + player.height / 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Move Player
            player.x += player.dx;
            if (player.x < player.width / 2) player.x = player.width / 2;
            if (player.x > canvas.width - player.width / 2) player.x = canvas.width - player.width / 2;

            // Handle Bullets
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#fff';
            bullets.forEach((b, i) => {
                b.y -= b.speed;
                ctx.fillRect(b.x - b.width / 2, b.y, b.width, b.height);
                if (b.y < 0) bullets.splice(i, 1);
            });
            ctx.shadowBlur = 0;

            // Handle Enemies
            frameCount++;
            if (frameCount % Math.max(20, 60 - Math.floor(currentScore / 5)) === 0) {
                enemies.push({
                    x: Math.random() * (canvas.width - 40) + 20,
                    y: -20,
                    radius: Math.random() * 8 + 12,
                    speed: Math.random() * 2 + 1 + (currentScore / 100)
                });
            }

            ctx.fillStyle = '#8a2be2';
            ctx.strokeStyle = '#f0f';
            ctx.lineWidth = 2;
            for (let i = enemies.length - 1; i >= 0; i--) {
                let e = enemies[i];
                e.y += e.speed;

                ctx.shadowBlur = 10;
                ctx.shadowColor = '#8a2be2';
                ctx.beginPath();
                // Drawing an asteroid-ish polygon
                ctx.moveTo(e.x + e.radius, e.y);
                for (let j = 1; j <= 6; j++) {
                    let angle = j * Math.PI / 3;
                    let offset = (j % 2 === 0) ? e.radius : e.radius * 0.7;
                    ctx.lineTo(e.x + Math.cos(angle) * offset, e.y + Math.sin(angle) * offset);
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.shadowBlur = 0;

                // Collision with player
                let dist = Math.hypot(player.x - e.x, player.y - e.y);
                if (dist - e.radius - 12 < 1) {
                    createParticles(player.x, player.y, '#00f0ff');
                    if (onGameOver) onGameOver(currentScore);
                    setGameOver(true);
                    setIsPlaying(false);
                    return; // stop drawing immediately
                }

                // Collision with bullets
                for (let j = bullets.length - 1; j >= 0; j--) {
                    let b = bullets[j];
                    let bDist = Math.hypot(b.x - e.x, b.y - e.y);
                    if (bDist - e.radius < Math.max(b.width, b.height)) {
                        createParticles(e.x, e.y, '#8a2be2');
                        enemies.splice(i, 1);
                        bullets.splice(j, 1);
                        currentScore += 10;
                        setScore(currentScore);
                        break;
                    }
                }

                if (e && e.y > canvas.height + 20) {
                    enemies.splice(i, 1);
                }
            }

            // Handle Particles
            for (let i = particles.length - 1; i >= 0; i--) {
                let p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.05;
                if (p.life <= 0) {
                    particles.splice(i, 1);
                } else {
                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }
            }

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
        <div className="game-container glass-panel glow-cyan" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
                <h3 className="text-gradient" style={{ fontSize: '1.4rem' }}>Asteroid Blaster</h3>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'monospace' }}>{score} PTS</span>
            </div>

            <div style={{ position: 'relative', width: '400px', height: '300px', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(0,240,255,0.2)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' }}>
                <canvas ref={canvasRef} width={400} height={300} style={{ display: 'block', background: '#050508' }} />

                {(!isPlaying && !gameOver) && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10,10,12,0.7)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontFamily: 'monospace', textAlign: 'center', lineHeight: 1.5 }}>
                            Use <b style={{ color: 'white' }}>A/D</b> or <b style={{ color: 'white' }}>Arrows</b>.<br />
                            Press <b style={{ color: 'var(--accent-cyan)' }}>SPACE</b> to fire.
                        </p>
                        <button className="btn btn-primary" onClick={() => { setIsPlaying(true); setScore(0); setGameOver(false); }} style={{ padding: '0.8rem 2rem', borderRadius: '30px' }}>
                            <Play size={18} style={{ marginRight: '8px' }} /> INIT SEQUENCE
                        </button>
                    </div>
                )}

                {gameOver && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10,10,12,0.8)', backdropFilter: 'blur(6px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <h2 style={{ color: '#f0f', textShadow: '0 0 10px #f0f', marginBottom: '0.5rem', fontFamily: 'monospace', letterSpacing: '2px' }}>SHIP DESTROYED</h2>
                        <p style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Final Score: {score}</p>
                        <button className="btn btn-outline glow-cyan" onClick={() => { setIsPlaying(true); setScore(0); setGameOver(false); }} style={{ padding: '0.8rem 2rem', borderRadius: '30px', borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
                            <RotateCcw size={18} style={{ marginRight: '8px' }} /> RESTART
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AsteroidBlaster;
