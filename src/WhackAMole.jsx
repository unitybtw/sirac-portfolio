import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const WhackAMole = ({ onGameOver }) => {
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

        let moles = [], curr = 0, frame = 0, misses = 0;

        const click = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left, y = e.clientY - rect.top;

            for (let i = 0; i < moles.length; i++) {
                let m = moles[i];
                if (Math.hypot(x - m.x, y - m.y) < m.r) {
                    moles.splice(i, 1); curr += 10; setScore(curr); playSound('coin'); return;
                }
            }
            misses++;
            if (misses >= 3) if (onGameOver) onGameOver(score); setIsPlaying(false);
        };
        canvas.addEventListener('mousedown', click);

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

            if (frame++ % Math.max(30, 60 - Math.floor(curr / 50)) === 0) {
                moles.push({ x: Math.random() * (canvas.width - 100) + 50, y: Math.random() * (canvas.height - 100) + 50, r: 0, maxR: 30, grow: true });
            }

            for (let i = moles.length - 1; i >= 0; i--) {
                let m = moles[i];
                m.r += m.grow ? 1 : -1;
                if (m.r > m.maxR) m.grow = false;

                if (m.r < 0) {
                    moles.splice(i, 1); misses++;
                    if (misses >= 3) { { playSound('boom'); if (onGameOver) onGameOver(score); setIsPlaying(false); return; } }
                    continue;
                }

                ctx.fillStyle = '#ffaa00';
                ctx.shadowBlur = 15; ctx.shadowColor = '#ffaa00';
                ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;
            }

            ctx.fillStyle = '#ff003c'; ctx.font = '20px monospace';
            ctx.fillText(`Misses: ${misses}/3`, canvas.width - 150, 30);

            anim = requestAnimationFrame(draw);
        }; draw();

        return () => { cancelAnimationFrame(anim); canvas.removeEventListener('mousedown', click); };
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
        <canvas ref={canvasRef} width={600} height={400} style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'crosshair' }} />
        {isPlaying ? <div style={{ position: 'absolute', top: 10, left: 10, color: '#fff', fontFamily: 'monospace' }}>Score: {score}</div> :
            <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.8)', flexDirection: 'column' }}>
                <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>Cyber Whack</h2>
                {score > 0 && <p style={{ color: '#ffaa00', marginBottom: '1rem' }}>Score: {score}</p>}
                <button className="btn btn-primary" onClick={() => { setScore(0); setIsPlaying(true); }}><Play size={18} /> PLAY</button>
            </div>}
    </div>;
};
export default WhackAMole;
