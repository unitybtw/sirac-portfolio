import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const NeonClicker = ({ onGameOver }) => {
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
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let curr = 0, rate = 0, cost = 10;
        let parts = [], coreR = 50, scale = 1;

        const clk = (e) => {
            const rect = canvas.getBoundingClientRect();
            const cx = (e.clientX - rect.left) * (canvas.width / rect.width);
            const cy = (e.clientY - rect.top) * (canvas.height / rect.height);

            // Buy auto clicker
            if (cy > canvas.height - 60 && cx > canvas.width / 2 - 100 && cx < canvas.width / 2 + 100) {
                if (curr >= cost) { curr -= cost; rate++; cost = Math.floor(cost * 1.5); setScore(Math.floor(curr)); }
                return;
            }

            let d = Math.hypot(canvas.width / 2 - cx, canvas.height / 2 - cy);
            if (d < coreR) {
                curr += 1; setScore(Math.floor(curr));
                scale = 1.2;
                for (let i = 0; i < 5; i++) parts.push({ x: canvas.width / 2, y: canvas.height / 2, vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10 });
            }
        };
        canvas.addEventListener('mousedown', clk);

        let _lastFrameTime = 0; let anim, frame = 0;
        const draw = () => {
            let _now = Date.now();
            if (_now - _lastFrameTime < 15) {
                anim = window.requestAnimationFrame(draw);
                return;
            }
            _lastFrameTime = _now;

            ctx.fillStyle = '#050508'; ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (frame++ % 60 === 0 && rate > 0) { curr += rate; setScore(Math.floor(curr)); }

            scale += (1 - scale) * 0.1;

            // Particles
            ctx.fillStyle = '#00f0ff';
            for (let i = parts.length - 1; i >= 0; i--) {
                let p = parts[i]; p.x += p.vx; p.y += p.vy;
                ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
                if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) parts.splice(i, 1);
            }

            // Core
            ctx.fillStyle = '#f0f'; ctx.shadowBlur = 50 * scale; ctx.shadowColor = '#f0f';
            ctx.beginPath(); ctx.arc(canvas.width / 2, canvas.height / 2, coreR * scale, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;

            // Auto button
            ctx.fillStyle = curr >= cost ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)';
            ctx.fillRect(canvas.width / 2 - 100, canvas.height - 60, 200, 40);
            ctx.fillStyle = '#fff'; ctx.font = '16px monospace';
            ctx.fillText(`+1 Auto/s (Cost: ${cost})`, canvas.width / 2 - 90, canvas.height - 35);

            anim = requestAnimationFrame(draw);
        }; draw();

        return () => { cancelAnimationFrame(anim); canvas.removeEventListener('mousedown', clk); };
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
        <canvas ref={canvasRef} width={600} height={400} style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: isPlaying ? 'pointer' : 'default' }} />
        {isPlaying ? <div style={{ position: 'absolute', top: 10, left: 10, color: '#fff', fontFamily: 'monospace' }}>Energy: {score}</div> :
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)' }}>
                <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>Neon Clicker</h2>
                <p style={{ color: '#aaa', marginBottom: '1rem', fontFamily: 'monospace' }}>Click the core to generate energy.</p>
                <button className="btn btn-primary" onClick={() => { setScore(0); setIsPlaying(true); }}><Play size={18} /> START</button>
            </div>}
    </div>;
};
export default NeonClicker;
