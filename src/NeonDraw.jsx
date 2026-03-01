import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const NeonDraw = ({ onGameOver }) => {
    const canvasRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [colorIdx, setColorIdx] = useState(0);

    const colors = ['#00f0ff', '#ff003c', '#00ff00', '#ffaa00', '#f0f'];

  
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

        let drawing = false, lines = [], currLine = [];

        const md = (e) => {
            drawing = true;
            let rect = canvas.getBoundingClientRect();
            currLine = [{ x: e.clientX - rect.left, y: e.clientY - rect.top }];
        };
        const mm = (e) => {
            if (!drawing) return;
            let rect = canvas.getBoundingClientRect();
            currLine.push({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        };
        const mu = (e) => {
            if (!drawing) return;
            drawing = false;
            lines.push({ path: currLine, color: colors[colorIdx] });
            currLine = [];
        };

        canvas.addEventListener('mousedown', md); canvas.addEventListener('mousemove', mm); canvas.addEventListener('mouseup', mu);

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

            const drawPath = (p, c) => {
                if (p.length < 2) return;
                ctx.strokeStyle = c; ctx.lineWidth = 4;
                ctx.shadowBlur = 10; ctx.shadowColor = c;
                ctx.beginPath(); ctx.moveTo(p[0].x, p[0].y);
                for (let i = 1; i < p.length; i++) ctx.lineTo(p[i].x, p[i].y);
                ctx.stroke(); ctx.shadowBlur = 0;
            };

            lines.forEach(l => Math.random() > 0.1 && drawPath(l.path, l.color)); // subtle flicker
            if (currLine.length > 0) drawPath(currLine, colors[colorIdx]);

            anim = requestAnimationFrame(draw);
        }; draw();

        return () => { cancelAnimationFrame(anim); canvas.removeEventListener('mousedown', md); canvas.removeEventListener('mousemove', mm); canvas.removeEventListener('mouseup', mu); };
    }, [isPlaying, colorIdx]);

    return <div style={{ position: 'relative', width: '100%', height: '100%', background: '#050508' }}>
        <canvas ref={canvasRef} width={600} height={400} style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: isPlaying ? 'crosshair' : 'default' }} />
        {isPlaying ? (
            <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: '10px' }}>
                {colors.map((c, i) => (
                    <button key={c} onClick={() => setColorIdx(i)} style={{ background: c, width: 30, height: 30, borderRadius: '50%', border: colorIdx === i ? '3px solid white' : 'none', cursor: 'pointer' }} />
                ))}
                <button onClick={() => setIsPlaying(false)} className="btn btn-outline" style={{ padding: '5px', fontSize: '12px' }}>EXIT</button>
            </div>
        ) :
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)' }}>
                <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>Neon Draw</h2>
                <p style={{ color: '#aaa', marginBottom: '1rem', fontFamily: 'monospace' }}>Unleash your cyber creativity.</p>
                <button className="btn btn-primary" onClick={() => { setIsPlaying(true); }}><Play size={18} /> START DRAWING</button>
            </div>}
    </div>;
};
export default NeonDraw;
