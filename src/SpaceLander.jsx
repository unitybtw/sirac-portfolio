import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const SpaceLander = ({ onGameOver }) => {
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

        let p = { x: canvas.width / 2, y: 50, vx: 0, vy: 0, angle: 0, thrust: 0 };
        let keys = {};
        let landingPad = { x: canvas.width / 2 - 40, y: canvas.height - 30, w: 80, h: 10 };
        let currScore = score; // persist score across landings

        // terrain points
        let terrain = [
            { x: 0, y: canvas.height - 50 },
            { x: landingPad.x, y: canvas.height - Math.random() * 100 - 50 },
            { x: landingPad.x, y: landingPad.y },
            { x: landingPad.x + landingPad.w, y: landingPad.y },
            { x: canvas.width, y: canvas.height - Math.random() * 100 - 50 }
        ];

        const handleKey = (e) => {
            if (["ArrowLeft", "ArrowRight", "ArrowUp"].includes(e.code)) e.preventDefault();
            keys[e.code] = e.type === 'keydown';
        };
        window.addEventListener('keydown', handleKey, { passive: false });
        window.addEventListener('keyup', handleKey, { passive: false });

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

            // Controls
            if (keys['ArrowLeft']) p.angle -= 0.05;
            if (keys['ArrowRight']) p.angle += 0.05;
            if (keys['ArrowUp']) {
                p.thrust = 0.1;
                p.vx += Math.sin(p.angle) * p.thrust;
                p.vy -= Math.cos(p.angle) * p.thrust;
            } else {
                p.thrust = 0;
            }

            // Physics
            p.vy += 0.03; // gravity
            p.x += p.vx;
            p.y += p.vy;

            // Wrap horizontal
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;

            // Draw Pad
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(landingPad.x, landingPad.y, landingPad.w, landingPad.h);

            // Draw Ship
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);

            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, -10);
            ctx.lineTo(10, 10);
            ctx.lineTo(-10, 10);
            ctx.closePath();
            ctx.stroke();

            // Thrust flame
            if (p.thrust > 0) {
                ctx.strokeStyle = '#ffaa00';
                ctx.beginPath();
                ctx.moveTo(-5, 10);
                ctx.lineTo(0, 20 + Math.random() * 10);
                ctx.lineTo(5, 10);
                ctx.stroke();
            }
            ctx.restore();

            // Collision roughly
            if (p.y + 10 > landingPad.y) {
                if (p.x > landingPad.x && p.x < landingPad.x + landingPad.w) {
                    if (Math.abs(p.vy) < 1.5 && Math.abs(p.angle) < 0.3) {
                        // Safe landing
                        setScore(currScore + 100);
                        if (onGameOver) onGameOver(points); setIsPlaying(false);
                        return;
                    } else {
                        // Crash
                        if (onGameOver) onGameOver(points); setIsPlaying(false);
                        setScore(0);
                        return;
                    }
                } else {
                    // Missed pad
                    if (onGameOver) onGameOver(points); setIsPlaying(false);
                    setScore(0);
                    return;
                }
            }

            ctx.fillStyle = '#fff'; ctx.font = '14px monospace';
            ctx.fillText(`Speed: ${Math.abs(p.vy).toFixed(1)} (Need < 1.5)`, 10, 20);

            anim = requestAnimationFrame(draw);
        };
        draw();

        return () => { cancelAnimationFrame(anim); window.removeEventListener('keydown', handleKey); window.removeEventListener('keyup', handleKey); };
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
        {isPlaying ? <div style={{ position: 'absolute', top: 10, right: 10, color: '#fff', fontFamily: 'monospace' }}>Score: {score}</div> :
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)' }}>
                <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>Space Lander</h2>
                <p style={{ color: '#aaa', marginBottom: '1rem', fontFamily: 'monospace' }}>Land softly on the green pad. Use Arrow Keys.</p>
                {score > 0 && <p style={{ color: '#00ff00', marginBottom: '1rem' }}>Total Score: {score}</p>}
                <button className="btn btn-primary" onClick={() => { setIsPlaying(true); }}><Play size={18} /> {score > 0 ? 'NEXT LEVEL' : 'PLAY'}</button>
            </div>}
    </div>;
};
export default SpaceLander;
