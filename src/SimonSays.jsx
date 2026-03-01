import React, { useRef, useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const SimonSays = ({ onGameOver }) => {
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

        let seq = [], userSeq = [], showing = false, flash = -1, frame = 0;
        const colors = ['#ff00ff', '#00f0ff', '#00ff00', '#ffaa00'];
        const rects = [
            { x: canvas.width / 2 - 110, y: canvas.height / 2 - 110 },
            { x: canvas.width / 2 + 10, y: canvas.height / 2 - 110 },
            { x: canvas.width / 2 - 110, y: canvas.height / 2 + 10 },
            { x: canvas.width / 2 + 10, y: canvas.height / 2 + 10 }
        ];

        const nextLvl = () => {
            seq.push(Math.floor(Math.random() * 4));
            userSeq = []; showing = true; frame = 0; flash = -1;
            setScore(seq.length);
        };
        nextLvl();

        const clk = (e) => {
            if (showing) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left, y = e.clientY - rect.top;

            for (let i = 0; i < 4; i++) {
                if (x > rects[i].x && x < rects[i].x + 100 && y > rects[i].y && y < rects[i].y + 100) {
                    userSeq.push(i); flash = i;
                    setTimeout(() => flash = -1, 250);

                    if (seq[userSeq.length - 1] !== i) { { playSound('boom'); if (onGameOver) onGameOver(score); setIsPlaying(false); return; } }
                    if (userSeq.length === seq.length) setTimeout(nextLvl, 1000);
                    break;
                }
            }
        };
        canvas.addEventListener('mousedown', clk);

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

            if (showing) {
                if (frame % 45 === 0) {
                    let idx = Math.floor(frame / 45) - 1;
                    if (idx >= seq.length) { showing = false; flash = -1; }
                    else { flash = seq[idx]; setTimeout(() => flash = -1, 300); }
                }
                frame++;
            }

            for (let i = 0; i < 4; i++) {
                ctx.globalAlpha = flash === i ? 1 : 0.2;
                ctx.fillStyle = colors[i];
                if (flash === i) { ctx.shadowBlur = 20; ctx.shadowColor = colors[i]; }
                ctx.fillRect(rects[i].x, rects[i].y, 100, 100);
                ctx.shadowBlur = 0;
            }
            ctx.globalAlpha = 1;

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
        <canvas ref={canvasRef} width={600} height={400} style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer' }} />
        {isPlaying ? <div style={{ position: 'absolute', top: 10, left: 10, color: '#fff', fontFamily: 'monospace' }}>Level: {score}</div> :
            <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.8)', flexDirection: 'column' }}>
                <h2 className="text-gradient" style={{ marginBottom: '1rem' }}>Simon Says</h2>
                <p style={{ color: '#aaa', marginBottom: '1rem', fontFamily: 'monospace' }}>Memorize the pattern.</p>
                {score > 1 && <p style={{ color: '#00f0ff', marginBottom: '1rem' }}>Level: {score}</p>}
                <button className="btn btn-primary" onClick={() => { setScore(0); setIsPlaying(true); }}><Play size={18} /> PLAY</button>
            </div>}
    </div>;
};
export default SimonSays;
