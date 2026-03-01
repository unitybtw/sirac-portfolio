import React, { useRef, useEffect, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const NeonRunner = ({ onGameOver }) => {
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

        let player = {
            x: 50, y: canvas.height - 40, width: 24, height: 24,
            velocityY: 0, gravity: 0.8, jumpPower: -12, grounded: false
        };
        let obstacles = [];
        let frameCount = 0;
        let currentScore = 0;
        let speed = 5;

        const handleKeyDown = (e) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
            if(["ArrowUp","ArrowDown","Space","w","s"].includes(e.code) || ["ArrowUp","ArrowDown","Space","w","s"].includes(e.key)) e.preventDefault();
            if (["Space", "ArrowUp"].includes(e.code)) {
                e.preventDefault();
                if (player.grounded) {
                    player.velocityY = player.jumpPower;
                    player.grounded = false;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown, { passive: false });

        // Procedural grid background
        let bgOffset = 0;

        
    let _lastFrameTime = 0;
    const draw = () => {
      let _now = Date.now();
      if (_now - _lastFrameTime < 15) {
          animationId = window.requestAnimationFrame(draw);
          return;
      }
      _lastFrameTime = _now;
            // Clear
            ctx.fillStyle = '#050508';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw scrolling grid
            ctx.strokeStyle = 'rgba(138, 43, 226, 0.15)';
            ctx.lineWidth = 1;
            bgOffset = (bgOffset + speed * 0.5) % 40;

            ctx.beginPath();
            // Vertical lines
            for (let x = -bgOffset; x < canvas.width; x += 40) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
            }
            // Horizontal lines
            for (let y = 0; y < canvas.height; y += 40) {
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
            }
            ctx.stroke();

            // Floor
            ctx.strokeStyle = 'var(--accent-violet)';
            ctx.lineWidth = 4;
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'var(--accent-violet)';
            ctx.beginPath();
            ctx.moveTo(0, canvas.height - 16);
            ctx.lineTo(canvas.width, canvas.height - 16);
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Gravity and Player physics
            player.velocityY += player.gravity;
            player.y += player.velocityY;

            if (player.y + player.height > canvas.height - 18) {
                player.y = canvas.height - 18 - player.height;
                player.velocityY = 0;
                player.grounded = true;
            }

            // Draw Player
            ctx.fillStyle = '#00f0ff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00f0ff';
            ctx.beginPath();
            ctx.roundRect(player.x, player.y, player.width, player.height, 6);
            ctx.fill();

            // Little glowing eye for the runner
            ctx.fillStyle = 'white';
            ctx.fillRect(player.x + 14, player.y + 6, 4, 4);
            ctx.shadowBlur = 0;

            // Handle Obstacles
            frameCount++;

            const spawnRate = Math.max(40, 90 - Math.floor(currentScore / 20));
            if (frameCount % spawnRate === 0 && Math.random() > 0.2) {
                let obsType = Math.random();
                if (obsType > 0.6) {
                    // Flying obstacle
                    obstacles.push({
                        x: canvas.width,
                        y: canvas.height - 60 - Math.random() * 40,
                        width: 16, height: 16, flying: true
                    });
                } else {
                    // Ground obstacle
                    obstacles.push({
                        x: canvas.width,
                        y: canvas.height - 18 - (Math.random() * 15 + 20),
                        width: 20, height: Math.random() * 15 + 20
                    });
                }
            }

            speed += 0.002; // Increase speed slowly!
            currentScore += 0.1;
            setScore(Math.floor(currentScore));

            ctx.fillStyle = '#f0f';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#f0f';
            for (let i = obstacles.length - 1; i >= 0; i--) {
                let obs = obstacles[i];
                obs.x -= speed;

                ctx.beginPath();
                if (obs.flying) {
                    ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                }

                // AABB Collision Detect
                let px = player.x + 2; let py = player.y + 2; let pw = player.width - 4; let ph = player.height - 4;

                if (
                    px < obs.x + obs.width &&
                    px + pw > obs.x &&
                    py < obs.y + obs.height &&
                    py + ph > obs.y
                ) {
                    setGameOver(true);
                    if (onGameOver) onGameOver(currentScore); setIsPlaying(false);
                    return;
                }

                if (obs.x + obs.width < 0) {
                    obstacles.splice(i, 1);
                }
            }
            ctx.shadowBlur = 0;

            animationId = requestAnimationFrame(draw);
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
        <div className="game-container glass-panel glow-violet" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
                <h3 className="text-gradient" style={{ fontSize: '1.4rem' }}>Cyber Jumper</h3>
                <span style={{ color: 'var(--accent-violet)', fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'monospace' }}>{score} M</span>
            </div>

            <div style={{ position: 'relative', width: '400px', height: '300px', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(138,43,226,0.2)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' }}>
                <canvas ref={canvasRef} width={400} height={300} style={{ display: 'block', background: '#050508' }} />

                {(!isPlaying && !gameOver) && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10,10,12,0.7)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontFamily: 'monospace' }}>Press <b style={{ color: 'var(--accent-violet)' }}>SPACE</b> or <b style={{ color: 'var(--accent-violet)' }}>UP</b> to JUMP.</p>
                        <button className="btn btn-primary" onClick={() => { setIsPlaying(true); setScore(0); setGameOver(false); }} style={{ padding: '0.8rem 2rem', borderRadius: '30px' }}>
                            <Play size={18} style={{ marginRight: '8px' }} /> RUN
                        </button>
                    </div>
                )}

                {gameOver && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10,10,12,0.8)', backdropFilter: 'blur(6px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <h2 style={{ color: '#00f0ff', textShadow: '0 0 10px #00f0ff', marginBottom: '0.5rem', fontFamily: 'monospace', letterSpacing: '2px' }}>SYSTEM FAILURE</h2>
                        <p style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Distance: {score} M</p>
                        <button className="btn btn-outline glow-violet" onClick={() => { setIsPlaying(true); setScore(0); setGameOver(false); }} style={{ padding: '0.8rem 2rem', borderRadius: '30px', borderColor: 'var(--accent-violet)', color: 'var(--accent-violet)' }}>
                            <RotateCcw size={18} style={{ marginRight: '8px' }} /> REBOOT
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NeonRunner;
